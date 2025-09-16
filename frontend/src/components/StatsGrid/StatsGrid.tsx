import {
	Group,
	NumberFormatter,
	Paper,
	Skeleton,
	Stack,
	Text,
} from "@mantine/core";
import { IconMessage, IconUser } from "@tabler/icons-react";
import { type ReactElement, useCallback, useEffect, useState } from "react";
import { MESSAGES_URL } from "@/api";
import { getData, toIsoDateString } from "@/api/apiHelpers";
import type { Channel } from "@/lib/types";
import styles from "./StatsGrid.module.css";

export interface DataStruct {
	title: string;
	value: number;
}

export interface StatsGridProps {
	channel: Channel | undefined;
	dateRange: [Date | null, Date | null];
}

const iconMapping: Record<string, ReactElement> = {
	"Unique Users": (
		<IconUser className={styles.icon} size="1.4rem" stroke={1.5} />
	),
	"Message Count": (
		<IconMessage className={styles.icon} size="1.4rem" stroke={1.5} />
	),
};

const UNIQUE_USERS = "Unique Users";
const MESSAGE_COUNT = "Message Count";

export function StatsGrid({ channel, dateRange }: Readonly<StatsGridProps>) {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [msgData, setMsgData] = useState<DataStruct>({
		title: MESSAGE_COUNT,
		value: 0,
	});
	const [userData, setUserData] = useState<DataStruct>({
		title: UNIQUE_USERS,
		value: 0,
	});

	const buildGridItem = useCallback((data: DataStruct | null) => {
		const displayData = data || {
			title: "Loading...",
			value: 0,
		};

		const icon = iconMapping[displayData.title] || (
			<IconMessage size="1.4rem" stroke={1.5} />
		);

		return (
			<Paper withBorder className={styles.paper} shadow="md">
				<Stack className={styles.stack}>
					<Group justify="space-between">
						<Text size="sm" className={styles.title}>
							{displayData.title}
						</Text>
						{icon}
					</Group>
					<Text className={styles.value}>
						{<NumberFormatter thousandSeparator value={displayData.value} />}
					</Text>
				</Stack>
			</Paper>
		);
	}, []);

	const fetchUserData = useCallback(
		async (channelArg: Channel, startDate: string, endDate: string) => {
			try {
				const response = await getData(`${MESSAGES_URL}unique_users`, {
					channel: channelArg.id,
					start_date: startDate,
					end_date: endDate,
				});
				const data = await response.json();
				return {
					title: UNIQUE_USERS,
					value: data.value || 0,
				};
			} catch (error) {
				console.error("Error fetching user data:", error);
				return {
					title: UNIQUE_USERS,
					value: 0,
				};
			}
		},
		[],
	);

	const fetchMessageData = useCallback(
		async (channelArg: Channel, startDate: string, endDate: string) => {
			try {
				const response = await getData(`${MESSAGES_URL}message_count`, {
					channel: channelArg.id,
					start_date: startDate,
					end_date: endDate,
				});
				const data = await response.json();
				return {
					title: MESSAGE_COUNT,
					value: data.value || 0,
				};
			} catch (error) {
				console.error("Error fetching message data:", error);
				return {
					title: MESSAGE_COUNT,
					value: 0,
				};
			}
		},
		[],
	);

	useEffect(() => {
		const updateStats = async () => {
			setIsLoading(true);
			if (!dateRange[0] || !dateRange[1] || !channel) {
				setIsLoading(false);
				return;
			}

			const startDate = toIsoDateString(dateRange[0]);
			const endDate = toIsoDateString(dateRange[1]);

			try {
				const userResponse = await fetchUserData(channel, startDate, endDate);
				const msgsResponse = await fetchMessageData(
					channel,
					startDate,
					endDate,
				);
				setMsgData(msgsResponse);
				setUserData(userResponse);
			} catch (error) {
				console.error("Error fetching stats grid data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		updateStats();
	}, [channel, dateRange, fetchMessageData, fetchUserData]);

	return (
		<div className={styles.root}>
			<Skeleton visible={isLoading}>
				<Group>
					{buildGridItem(msgData)}
					{buildGridItem(userData)}
				</Group>
			</Skeleton>
		</div>
	);
}
