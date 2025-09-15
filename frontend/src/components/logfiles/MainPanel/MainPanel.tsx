"use client";

import { Accordion, Flex, Paper } from "@mantine/core";
import { IconFile, IconMoodSmile } from "@tabler/icons-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { EmoteSetTable } from "@/components/emoteSet/EmoteSetTable/EmoteSetTable";
import { getChannelsQuery } from "@/lib/query/channel";
import { getEmoteSetsQuery } from "@/lib/query/emoteset";
import { getLogfilesQuery } from "@/lib/query/logfile";
import { LogTable } from "../LogTable/LogTable";
import { RustlogImport } from "../RustlogImport/RustlogImport";

export default function MainPanel() {
	const { data: channels = [] } = useSuspenseQuery(getChannelsQuery);
	const { data: logFiles = [] } = useSuspenseQuery(getLogfilesQuery);
	const { data: emoteSets = [] } = useSuspenseQuery(getEmoteSetsQuery);

	return (
		<Paper withBorder shadow="md">
			<Accordion multiple defaultValue={["files", "emoteSets"]}>
				<Accordion.Item value="files">
					<Accordion.Control icon={<IconFile />}>Chat Files</Accordion.Control>
					<Accordion.Panel>
						{
							<Flex direction="column" gap="md">
								<RustlogImport />
								<LogTable channels={channels} logfiles={logFiles} />
							</Flex>
						}
					</Accordion.Panel>
				</Accordion.Item>
				<Accordion.Item value="emoteSets">
					<Accordion.Control icon={<IconMoodSmile />}>
						Emote Sets
					</Accordion.Control>
					<Accordion.Panel>
						<EmoteSetTable emoteSets={emoteSets} />
					</Accordion.Panel>
				</Accordion.Item>
			</Accordion>
		</Paper>
	);
}
