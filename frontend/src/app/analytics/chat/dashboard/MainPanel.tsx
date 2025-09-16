"use client";

import { Group, Paper, Stack } from "@mantine/core";
import { useEffect, useState } from "react";
import { CHANNELS_URL, getData } from "@/api";
import { InteractiveAreaChart, StatsGrid } from "@/components";
import { ChannelDateGroup } from "@/components/channel/ChannelDateGroup";
import type { Channel } from "@/lib/types";
import { EmoteList, ParametersGroup } from "./components";
import styles from "./MainPanel.module.css";

export default function MainPanel() {
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);

	const [channel, setChannel] = useState<Channel | undefined>(undefined);
	const [channelList, setChannelList] = useState<Channel[]>([]);
	const [chartStyle, setChartStyle] = useState<string>("Area");
	const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
		yesterday,
		today,
	]);
	const [granularity, setGranularity] = useState<string | undefined>("Day");
	const [useMA, setUseMA] = useState<boolean>(false);
	const [maPeriod, setMAPeriod] = useState<string | number>(1);

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

	return (
		<main className={styles.main}>
			<Paper className={styles.mainPaper}>
				<Stack className={styles.mainStack}>
					<Group>
						<StatsGrid channel={channel} dateRange={dateRange} />
						<ChannelDateGroup
							channel={channel}
							setChannel={setChannel}
							channelList={channelList}
							dateRange={dateRange}
							setDateRange={setDateRange}
						/>
					</Group>
					<ParametersGroup
						granularity={granularity}
						setGranularity={setGranularity}
						chartStyle={chartStyle}
						setChartStyle={setChartStyle}
						useMA={useMA}
						setUseMA={setUseMA}
						maPeriod={maPeriod}
						setMAPeriod={setMAPeriod}
					/>

					<Group className={styles.mainGroup}>
						<Stack className={styles.mainstack1} justify="space-between">
							<InteractiveAreaChart
								dateRange={dateRange}
								fetchURL={"chat/messages/message_count_aggregate"}
								channel={channel}
								dataKey={"date"}
								series={[{ label: "Messages", name: "value", color: "bright" }]}
								useMA={useMA}
								maPeriod={maPeriod}
								granularity={granularity}
								unit={" Msgs"}
								style={chartStyle}
								title={"Messages"}
							/>
							<InteractiveAreaChart
								fetchURL={"chat/messages/unique_users_aggregate"}
								channel={channel}
								useMA={useMA}
								maPeriod={maPeriod}
								granularity={granularity}
								dateRange={dateRange}
								series={[{ label: "Users", name: "value", color: "bright" }]}
								dataKey="date"
								unit={" Users"}
								style={chartStyle}
								title={"Unique Users"}
							/>
						</Stack>

						<Stack className={styles.mainstack2} justify="space-between">
							<InteractiveAreaChart
								fetchURL={"chat/messages/sentiment_aggregate"}
								channel={channel}
								useMA={useMA}
								maPeriod={maPeriod}
								granularity={granularity}
								dateRange={dateRange}
								series={[
									{
										label: "Normalized Sentiment",
										name: "value",
										color: "bright",
									},
								]}
								dataKey={"date"}
								type={"split"}
								style={chartStyle}
								title={"Normalized Sentiment"}
								yAxisRange={[-1, 1]}
							/>
							<EmoteList channel={channel} dateRange={dateRange} />
						</Stack>
					</Group>
				</Stack>
			</Paper>
		</main>
	);
}
