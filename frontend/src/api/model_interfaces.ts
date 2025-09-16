// Model Interfaces

import type { Channel } from "@/lib/types";

interface BaseRow {
	id: number;
}

export interface Emote extends BaseRow {
	name: string;
	emote_id: string;
}

export interface EmoteSet extends BaseRow {
	name: string;
	set_id: string;
	channels: Channel[];
	emotes: Emote[];
}

export interface Logfile extends BaseRow {
	file: File;
	filename: string;
	channel: Channel;
	is_preprocessed: boolean;
	uploaded_at: string;
	metadata: JSON;
}

export interface Message extends BaseRow {
	parent_log: Logfile;
	timestamp: Date;
	username: string;
	message: string;
	emotes: Emote[];
	sentiment_score?: number;
}
