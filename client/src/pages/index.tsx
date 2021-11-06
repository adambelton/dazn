import React from 'react';

import { IClientMessage, WebsocketService } from 'websocket-module';

function roomsReducer(
	rooms: string[],
	action: { type: 'join' | 'leave'; room: string }
) {
	switch (action.type) {
		case 'join':
			return [...rooms, action.room];
		case 'leave':
			return rooms.filter((room) => room !== action.room);
		default:
			return rooms;
	}
}

function messagesReducer(messages: IClientMessage[], message: IClientMessage) {
	return [...messages, message];
}

export default function App() {
	const [myName, setMyName] = React.useState('');
	const [roomName, setRoomName] = React.useState('');
	const [joinedRooms, dispatchRooms] = React.useReducer(roomsReducer, []);
	const [messageInput, setMessageInput] = React.useState('');
	const [messages, dispatchMessage] = React.useReducer(messagesReducer, []);
	const [wss] = React.useState(
		() => new WebsocketService('http://localhost:3000', dispatchMessage)
	);

	const joinRoom = () => {
		wss.subscribe(roomName);
		dispatchRooms({ type: 'join', room: roomName });
		setRoomName('');
	};

	const leaveRoom = (room: string) => {
		wss.unsubscribe(room);
		dispatchRooms({ type: 'leave', room });
	};

	const sendMessage = () => {
		if (myName.length && messageInput.length) {
			wss.sendMessage(joinedRooms[0], myName, messageInput);
			dispatchMessage({ name: myName, message: messageInput });
			setMessageInput('');
		}
	};

	return (
		<>
			<div>
				<button onClick={() => console.log(wss.isConnected())}>
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
					justifyContent: 'space-between',
				}}
			>
				<div>
					Joined rooms: {joinedRooms}
					<button onClick={() => leaveRoom(joinedRooms[0])}>
						Leave
					</button>
				</div>
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
				style={
					!joinedRooms.length
						? { opacity: 0.5, pointerEvents: 'none' }
						: {}
				}
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
