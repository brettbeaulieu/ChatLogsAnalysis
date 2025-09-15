"use client";

import { Flex, Paper } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getChannelsQuery } from "@/lib/query/channel";
import { getLogfilesQuery } from "@/lib/query/logfile";
import { LogTable } from "./LogTable";
import { RustlogImport } from "./RustlogImport";

export default function MainPanel() {
	const { data: channels = [] } = useSuspenseQuery(getChannelsQuery);
	const { data: logFiles = [] } = useSuspenseQuery(getLogfilesQuery);

	return (
		<Paper p={"md"} withBorder>
			<Flex direction="column" gap="md">
				<RustlogImport />
				<LogTable channels={channels} logfiles={logFiles} />
			</Flex>
		</Paper>
	);
}
