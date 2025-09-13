"use client";

import { Group, Stack } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChannelTable } from "@/components/channel/ChannelTable/ChannelTable";
import { getChannelsQuery } from "@/lib/query/channel";
import styles from "./ViewPanel.module.css";

export default function ViewPanel() {
	const { data: channels = [] } = useSuspenseQuery(getChannelsQuery);

	return (
		<Stack className={styles.mainStack}>
			<Group className={styles.botGroup}>
				<ChannelTable channels={channels} />
			</Group>
		</Stack>
	);
}
