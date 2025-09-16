export type Channel = {
	id: number;
	name: string;
};

export type Emote = {
	id: number;
	name: string;
	emote_id: string;
};

export type EmoteSet = {
	id: number;
	name: string;
	set_id: string;
	channels: Channel[];
	emotes: Emote[];
};

export type Logfile = {
	id: number;
	file: File;
	filename: string;
	channel: Channel;
	is_preprocessed: boolean;
	uploaded_at: string;
	metadata: JSON;
};

export type Message = {
	id: number;
	parent_log: Logfile;
	timestamp: Date;
	username: string;
	message: string;
	emotes: Emote[];
	sentiment_score?: number;
};
