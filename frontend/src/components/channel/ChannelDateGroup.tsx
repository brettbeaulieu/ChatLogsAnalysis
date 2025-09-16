import { Paper, Select } from "@mantine/core";
import type { DateValue } from "@mantine/dates";
import { DateMenu } from "@/components";
import type { Channel } from "@/lib/types";

type SetStateAction<T> = React.Dispatch<React.SetStateAction<T>>;

interface ChannelDateGroupProps {
	channel: Channel | undefined;
	setChannel: SetStateAction<Channel | undefined>;

	channelList: Channel[];

	dateRange: [Date | null, Date | null];
	setDateRange: SetStateAction<[DateValue, DateValue]>;
}

export function ChannelDateGroup({
	channel,
	setChannel,
	channelList,
	dateRange,
	setDateRange,
}: Readonly<ChannelDateGroupProps>) {
	const handleChannelOnChange = (newName: string | null): void => {
		if (newName) {
			const obj = channelList.find((x) => x.name === newName);
			setChannel(obj);
		}
	};
	return (
		<Paper p="md" withBorder>
			<Select
				style={{ textAlign: "center" }}
				data={channelList.map((elem: Channel) => elem.name)}
				value={channel ? channel.name : ""}
				placeholder="Select a channel"
				onChange={handleChannelOnChange}
				searchable
			/>
			<DateMenu dateRange={dateRange} dateChange={setDateRange} />
		</Paper>
	);
}
