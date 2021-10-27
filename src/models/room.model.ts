import { Socket } from 'socket.io';
import { io } from '../app';
import { GameController } from '../controllers/game.controller';
import { User } from './user.model';

export class Room {
	private USERS: User[] = [];

	public game = new GameController(this.USERS, this);

	constructor(public name: string) {}

	addUser(name: string, socket: Socket) {
		if (this.USERS.length >= 2) throw 'Room is already full.';

		if (this.USERS.find((user) => user.name == name)) {
			throw 'Name is already taken in that room.';
		}

		const user = new User(name, this, socket);
		if (this.USERS.length == 0) user.admin = true;
		this.USERS.push(user);
		socket.join(this.name);

		return user;
	}

	removeUser(user: User) {
		this.USERS = this.USERS.filter((_user) => _user != user);
		if (user.admin && this.USERS.length > 0) {
			this.USERS[0].admin = true;
		}
	}

	get userNames() {
		return this.USERS.map((user) => user.name);
	}

	get users() {
		return this.USERS.map(
			(user) =>
				new Object({
					name: user.name,
					admin: user.admin,
				}),
		);
	}
}
