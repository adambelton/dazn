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

export type SubscriberCallback = (message: IClientMessage) => any;
