import { io, Socket } from 'socket.io-client';

export type SubscriberCallback = (message: IClientMessage) => any;

let connection: Socket;

export interface IServerMessage {
	room: string;
	data: {
		name: string;
		message: string;
	};
}

export interface IClientMessage {
	name: string;
	message: string;
}

export function connect(receive: SubscriberCallback) {
	connection = io('http://localhost:3000');

	connection.on('message', (message: IServerMessage) => {
		receive(message.data);
	});
}

export function disconnect() {
	connection?.disconnect();
}

export function isConnected() {
	return connection?.connected;
}

export function subscribeRoom(room: string) {
	connection?.emit('subscribe', room);
}

export function emitMessage(room: string, name: string, message: string) {
	connection.emit('message', { room, data: { name, message } });
}
