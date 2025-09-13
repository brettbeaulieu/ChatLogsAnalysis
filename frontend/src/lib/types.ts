export type Channel = {
	id: number;
	name: string;
	name_lower: string;
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
