import { Group, Loader, Paper, Select, Stack, Text } from "@mantine/core";
import type React from "react";
import { type ReactElement, useEffect, useState } from "react";
import { CHANNELS_URL, EMOTESETS_URL } from "@/api";
import { getData } from "@/api/apiHelpers";
import { DateMenu } from "@/components";
import type { Channel, Emote, EmoteSet } from "@/lib/types";
import styles from "./ParametersGroup.module.css";

type SetStateAction<T> = React.Dispatch<React.SetStateAction<T>>;

interface ParametersGroupProps {
	channel: Channel | undefined;
	setChannel: SetStateAction<Channel | undefined>;

	dateRange: [Date | null, Date | null];
	setDateRange: SetStateAction<[Date | null, Date | null]>;

	emotes: Emote[];
	setEmotes: SetStateAction<Emote[]>;
}

export function ParametersGroup({
	channel,
	setChannel,
	dateRange,
	setDateRange,
	setEmotes,
}: Readonly<ParametersGroupProps>) {
	const [channelList, setChannelList] = useState<Channel[]>([]);
	const [comboBoxLoading, setComboBoxLoading] = useState(false);
	const [emoteSets, setEmoteSets] = useState<EmoteSet[]>([]);
	const [emoteSet, setEmoteSet] = useState<EmoteSet | null>(null);

	// Fetch channel list when component mounts
	useEffect(() => {
		async function fetchChannelList() {
			try {
				const response = await getData(CHANNELS_URL);
				const data: Channel[] = await response.json();
				setChannelList(data);
			} catch (error) {
				console.error("Failed to fetch channel list", error);
			}
		}

		fetchChannelList();
	}, []);

	// Handle emote set selection
	useEffect(() => {
		if (emoteSet) {
			const selectedSet = emoteSets.find((set) => set === emoteSet);
			if (selectedSet) {
				const fetchEmotesForSet = async () => {
					try {
						const response = await getData(`${EMOTESETS_URL}${selectedSet.id}`);
						const data: EmoteSet = await response.json();
						setEmotes(data.emotes);
					} catch (error) {
						console.error("Failed to fetch emotes for set", error);
					}
				};
				fetchEmotesForSet();
			}
		}
	}, [emoteSet, emoteSets, setEmotes]);

	// Fetch emote sets
	useEffect(() => {
		const fetchEmoteSets = async () => {
			setComboBoxLoading(true);
			try {
				const response = await getData("chat/emotesets");
				const data = await response.json();
				setEmoteSets(data);
			} catch (error) {
				console.error("Failed to fetch emote sets", error);
			} finally {
				setComboBoxLoading(false);
			}
		};
		fetchEmoteSets();
	}, []);

	const buildOption = (text: string, element: ReactElement): ReactElement => {
		return (
			<Paper withBorder className={styles.innerPaper}>
				<Stack>
					<Text ta="center" className={styles.textLabel}>
						{text}
					</Text>
					{element}
				</Stack>
			</Paper>
		);
	};

	const handleSetEmoteSet = (newSetName: string | null): void => {
		if (newSetName) {
			setEmoteSet(emoteSets.find((x) => x.name === newSetName) || null);
		}
	};

	const handleChannelOnChange = (newName: string | null): void => {
		if (newName) {
			const obj = channelList.find((x) => x.name === newName);
			setChannel(obj);
		}
	};

	return (
		<Paper className={styles.paramsPaper}>
			<Group className={styles.paramsGroup}>
				{buildOption(
					"Emote Set",
					<Select
						data={emoteSets.map((set) => ({
							value: set.name,
							label: set.name,
						}))}
						value={emoteSet ? emoteSet.name : ""}
						onChange={handleSetEmoteSet}
						placeholder="Pick value"
						rightSection={comboBoxLoading ? <Loader size={18} /> : null}
					/>,
				)}
				{buildOption(
					"Channel",
					<Select
						classNames={{ label: styles.innerTextLabel }}
						data={channelList.map((channelArg) => ({
							value: channelArg.name,
							label: channelArg.name,
						}))}
						value={channel?.name || ""}
						placeholder="Pick channel"
						onChange={handleChannelOnChange}
						searchable
					/>,
				)}
				{buildOption(
					"Date Range",
					<DateMenu dateRange={dateRange} dateChange={setDateRange} />,
				)}
			</Group>
		</Paper>
	);
}
