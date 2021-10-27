import { Socket } from 'socket.io';
import { Room } from './room.model';

export class User {
	public admin: boolean = false;

	constructor(public name: string, public room: Room, public socket: Socket) {}
}
