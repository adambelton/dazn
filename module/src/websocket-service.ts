import { io, Socket } from 'socket.io-client';
import { IServerMessage, SubscriberCallback } from './websocket-service.types';

export class WebsocketService {
	private callback: SubscriberCallback;
	private socket: Socket;
	private rooms: string[] = [];

	constructor(url: string, cb: SubscriberCallback) {
		this.socket = io(url, {
			autoConnect: false,
		});

		this.callback = cb;
	}

	private connect() {
		this.socket.connect();

		this.socket.on('message', (message: IServerMessage) => {
			this.callback(message.data);
		});
	}

	private disconnect() {
		this.socket.disconnect();
	}

	private addRoom(roomName: string) {
		if (!this.rooms.includes(roomName)) {
			this.rooms.push(roomName);
		}

		if (!this.isConnected()) {
			this.connect();
		}
	}

	private leaveRoom(roomName: string) {
		const subscribedRooms = this.rooms.filter((room) => room != roomName);
		this.rooms = subscribedRooms;

		if (!subscribedRooms.length) {
			this.disconnect();
		}
	}

	isConnected() {
		return this.socket?.connected;
	}

	subscribe(roomName: string) {
		this.addRoom(roomName);
		this.socket.emit('subscribe', roomName);
	}

	unsubscribe(roomName: string) {
		this.leaveRoom(roomName);
		this.socket.emit('unsubscribe', roomName);
	}

	sendMessage(room: string, name: string, message: string) {
		this.socket?.emit('message', { room, data: { name, message } });
	}
}
