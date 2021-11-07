import { io, Socket } from 'socket.io-client';
import { IServerMessage, SubscriberCallback } from './websocket-service.types';

export class WebsocketService {
	private onMessageReceipt: SubscriberCallback;
	private socket: Socket;
	private rooms: string[] = [];

	constructor(url: string, callback: SubscriberCallback) {
		this.socket = io(url, {
			autoConnect: false,
		});

		this.onMessageReceipt = callback;
	}

	private connect() {
		this.socket.on('connect', () => {
			this.socket.on('message', (message: IServerMessage) => {
				this.onMessageReceipt(message.data);
			});
		});

		this.socket.connect();
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

	private leaveRoom(roomName?: string) {
		if (!roomName) {
			this.rooms = [];
			this.disconnect();
			return;
		}

		const subscribedRooms = this.rooms.filter((room) => room != roomName);
		this.rooms = subscribedRooms;

		if (!subscribedRooms.length) {
			this.disconnect();
		}
	}

	isConnected() {
		return this.socket?.connected;
	}

	subscribe(roomName: string, callback?: Function) {
		this.addRoom(roomName);
		this.socket.emit('subscribe', roomName, callback);
	}

	unsubscribe(roomName: string, callback?: Function) {
		this.leaveRoom(roomName);
		this.socket.emit('unsubscribe', roomName, callback);
	}

	unsubscribeAll() {
		this.leaveRoom();
	}

	sendMessage(
		room: string,
		name: string,
		message: string,
		callback?: Function
	) {
		this.socket?.emit(
			'message',
			{ room, data: { name, message } },
			callback
		);
	}
}
