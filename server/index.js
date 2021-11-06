const io = require('socket.io')(3000, {
	cors: {
		origin: ['http://localhost:8000'],
	},
});

io.on('connection', (socket) => {
	socket.on('subscribe', (room) => {
		socket.join(room);
	});

	socket.on('unsubscribe', (room) => {
		socket.leave(room);
	});

	socket.on('message', (message) => {
		console.log({ message });
		socket.to(message.room).emit('message', message);
	});
});
