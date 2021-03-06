import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { environment } from './config/environment';
import { roomController } from './controllers';
import { GameController } from './controllers/game.controller';
import { Room } from './models/room.model';
import { User } from './models/user.model';

console.log(`Server is running on port ${environment.PORT}.`);

export const httpServer = createServer();
export const io = new Server(httpServer, {
	cors: {
		origin: '*',
		credentials: true,
	},
});

io.on('connection', (socket: Socket) => {
	let user: User | undefined = undefined;
	let room: Room | undefined = undefined;

	console.log(`[${socket.id}] Socket connected`);

	socket.on('disconnect', (reason: any) => {
		console.log(`[${socket.id}] Socket disconnected`);

		if (user && room) {
			roomController.removeUserFromRoom(user, room);
			io.to(room.name).emit('room-users', room.users);
		}
	});

	socket.on('join', (userName: string, roomName: string) => {
		console.log(`[${socket.id}] ${userName} wants to join room "${roomName}"`);
		try {
			const res = roomController.addUserToRoom(userName, roomName, socket);
			user = res.user;
			room = res.room;

			io.to(room.name).emit('room-users', room.users);
		} catch (error) {
			console.error(error);
			socket.emit('join-error', { error });
		}
	});

	socket.on('start', async () => {
		console.log(`[${socket.id}] ${user?.name} requested to start game.`);

		try {
			if (!user) throw 'Socket is not associated with a user.';
			if (!room) throw 'Socket is not associated with a room.';

			io.to(room.name).emit('start');
			await room.game.loadAssets();
			room.game.nextState();
		} catch (error) {
			socket.emit('start-error', { error });
		}
	});

	socket.on('ready-finished', async () => {
		console.log(`[${socket.id}] ${user?.name} is ready. Now answering questions.`);

		try {
			if (!user) throw 'Socket is not associated with a user.';
			if (!room) throw 'Socket is not associated with a room.';

			room.game.nextState();
		} catch (error) {
			socket.emit('ready-finished-error', { error });
		}
	});

	socket.on('review-question', async () => {
		console.log(`[${socket.id}] ${user?.name} requested to review a question.`);

		room?.game.markQuestionForReview();
	});

	socket.on('switch', async () => {
		console.log(`[${socket.id}] ${user?.name} requested to switch state.`);

		try {
			if (!user) throw 'Socket is not associated with a user.';
			if (!room) throw 'Socket is not associated with a room.';

			room.game.nextState();
		} catch (error) {
			socket.emit('switch-error', { error });
		}
	});

	socket.on('review', async () => {
		console.log(`[${socket.id}] ${user?.name} finished the round. Reviewing questions now.`);

		try {
			if (!user) throw 'Socket is not associated with a user.';
			if (!room) throw 'Socket is not associated with a room.';

			room.game.nextState();
		} catch (error) {
			socket.emit('review-error', { error });
		}
	});

	socket.on('question', async (questionIndex: number) => {
		if (room?.game)
			console.log(
				`[${socket.id}] ${user?.name} answered question. Now on question ${
					room.game.questionIndex + 1
				}`,
			);

		room?.game.nextQuestion();
	});

	socket.on('freeze', (_) => room?.game.useFreeze());
	socket.on('fiftyFifty', (_) => room?.game.useFiftyFifty());

	socket.on('leave', (_) => {
		try {
			if (!user) throw 'Socket is not associated with a user.';
			if (!room) throw 'Socket is not associated with a room.';

			roomController.removeUserFromRoom(user, room);
			socket.leave(room.name);
			io.to(room.name).emit('room-users', room.users);
			socket.emit('room-users', []);

			user = undefined;
			room = undefined;
		} catch (error) {
			socket.emit('leave-error', { error });
		}
	});

	socket.on('play-again', () => {
		try {
			if (!user) throw 'Socket is not associated with a user.';
			if (!room) throw 'Socket is not associated with a room.';

			room.game.reset();
			room.game.nextState();
		} catch (error) {
			socket.emit('play-again-error', { error });
		}
	});
});
