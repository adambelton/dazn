import { createServer } from 'http';
import { Server } from 'socket.io';
import { WebsocketService } from '../dist';

const Client = require('socket.io-client');

describe('Websocket Module', () => {
	let io, serverSocket, wss, messageCallback, port;

	beforeAll((done) => {
		const httpServer = createServer();
		io = new Server(httpServer);
		httpServer.listen(() => {
			port = httpServer.address().port;
			io.on('connection', (socket) => {
				serverSocket = socket;
				serverSocket.once('subscribe', (room, callback) => {
					serverSocket.join(room);
					callback(room);
				});
			});
			messageCallback = jest.fn();
			wss = new WebsocketService(
				`http://localhost:${port}`,
				messageCallback
			);
			wss.subscribe('room1', () => {
				done();
			});
		});
	});

	afterAll(() => {
		io.disconnectSockets();
		io.close();
	});

	it(`should only have a single connection to the service`, (done) => {
		serverSocket.on('subscribe', (room, callback) => {
			callback(room);
		});

		wss.subscribe('room2', (roomFromServer) => {
			expect(roomFromServer).toBe('room2');
			const connections = io.engine.clientsCount;
			expect(connections).toEqual(1);
			done();
		});
	});

	it(`should allow the client to subscribe to a room`, (done) => {
		serverSocket.on('subscribe', (room, callback) => {
			callback(room);
		});

		wss.subscribe('room3', (roomFromServer) => {
			expect(roomFromServer).toBe('room3');
			done();
		});
	});

	it(`should allow the client to unsubscribe from a room`, (done) => {
		serverSocket.on('unsubscribe', (room, callback) => {
			callback(room);
		});

		wss.unsubscribe('room4', (roomFromServer) => {
			expect(roomFromServer).toBe('room4');
			done();
		});
	});

	it(`should emit messages to the client as they're received`, (done) => {
		const anotherClientSocket = new Client(`http://localhost:${port}`);
		anotherClientSocket.on('connect', () => {
			anotherClientSocket.on('message', (message) => {
				expect(message).toBe('message for everybody');
				expect(messageCallback).toHaveBeenCalled();
				done();
			});

			io.to('room1').emit('message', 'message for room1');
			serverSocket.emit('message', 'message for everybody');
		});
	});

	it(`should only be connected to the service when there are open subscriptions`, () => {
		expect(wss.isConnected()).toBe(true);
		wss.unsubscribeAll();
		expect(wss.isConnected()).toBe(false);
	});
});
