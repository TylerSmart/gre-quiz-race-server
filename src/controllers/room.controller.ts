import { Socket } from 'socket.io';
import { Room } from '../models/room.model';
import { User } from '../models/user.model';

export class RoomController {
	public static rooms: Room[] = [];

	public addUserToRoom(
		userName: string,
		roomName: string,
		socket: Socket,
	): { user: User; room: Room } {
		let room = this.getRoomByName(roomName);

		if (!room) room = this.createRoom(roomName);

		const user = room.addUser(userName, socket);

		return { user, room };
	}

	private createRoom(name: string): Room {
		const room = new Room(name);
		RoomController.rooms.push(room);
		return room;
	}

	private getRoomByName(name: string): Room | undefined {
		return RoomController.rooms.find((room) => room.name == name);
	}

	public removeUserFromRoom(user: User, room: Room) {
		room.removeUser(user);
		if (room.users.length == 0)
			RoomController.rooms = RoomController.rooms.filter((_room) => _room != room);
	}
}
