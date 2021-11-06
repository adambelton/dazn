import React from 'react';
import { io, Socket } from 'socket.io-client';

type SubscriberCallback = (message: IClientMessage) => any;

let connection: Socket;

interface IServerMessage {
	room: string;
	data: {
		name: string;
		message: string;
	};
}

interface IClientMessage {
	name: string;
	message: string;
}

function connect(receive: SubscriberCallback) {
	connection = io('http://localhost:3000');

	connection.on('message', (message: IServerMessage) => {
		receive(message.data);
	});
}

function disconnect() {
	connection?.disconnect();
}

function isConnected() {
	return connection?.connected;
}

function subscribeRoom(room: string) {
	connection?.emit('subscribe', room);
}

function emitMessage(room: string, name: string, message: string) {
	connection.emit('message', { room, data: { name, message } });
}

function messagesReducer(messages: IClientMessage[], message: IClientMessage) {
	return [...messages, message];
}

export default function App() {
	const [myName, setMyName] = React.useState('');
	const [roomName, setRoomName] = React.useState('');
	const [isJoined, setIsJoined] = React.useState(false);
	const [messageInput, setMessageInput] = React.useState('');
	const [messages, dispatch] = React.useReducer(messagesReducer, []);

	const joinRoom = () => {
		subscribeRoom(roomName);
		setIsJoined(true);
	};

	const sendMessage = () => {
		if (myName.length && messageInput.length) {
			emitMessage(roomName, myName, messageInput);
			dispatch({ name: myName, message: messageInput });
			setMessageInput('');
		}
	};

	const receiveMessage = (message: IClientMessage) => {
		dispatch(message);
	};

	React.useEffect(() => {
		if (roomName.length && !isConnected()) {
			connect(receiveMessage);
		}

		if (!roomName.length && isConnected()) {
			disconnect();
		}
	}, [roomName]);

	return (
		<>
			<div>
				<button onClick={() => console.log(isConnected())}>
					Check connection
				</button>
			</div>
			<div>
				<input
					placeholder="My name goes here"
					value={myName}
					onChange={(e) => setMyName(e.currentTarget.value)}
				/>
			</div>
			<div
				style={
					myName.length ? {} : { opacity: 0.5, pointerEvents: 'none' }
				}
			>
				<input
					placeholder="Room name goes here"
					value={roomName}
					onChange={(e) => setRoomName(e.currentTarget.value)}
				/>
				<button
					style={
						roomName.length
							? {}
							: { opacity: 0.5, pointerEvents: 'none' }
					}
					onClick={joinRoom}
				>
					Join
				</button>
			</div>
			<div
				style={{
					height: '500px',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'flex-end',
				}}
			>
				<div
					style={{
						border: '1px solid black',
						padding: '2px',
						flex: 1,
					}}
				>
					{messages.map(({ name, message }, i) => {
						return (
							<div
								key={i}
								style={{
									textAlign:
										name === myName ? 'right' : 'left',
								}}
							>
								{name}: {message}
							</div>
						);
					})}
				</div>
			</div>
			<div
				style={isJoined ? {} : { opacity: 0.5, pointerEvents: 'none' }}
			>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						sendMessage();
					}}
				>
					<label htmlFor="message">Message</label>
					<input
						id="message"
						value={messageInput}
						onChange={(e) => setMessageInput(e.currentTarget.value)}
					></input>
				</form>
			</div>
		</>
	);
}
