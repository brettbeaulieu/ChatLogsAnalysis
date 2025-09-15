"use client";

import { Paper } from "@mantine/core";
import { useSuspenseQuery } from "@tanstack/react-query";
import { EmoteSetTable } from "@/components/emoteSet/EmoteSetTable/EmoteSetTable";
import { getEmoteSetsQuery } from "@/lib/query/emoteset";
import { EmoteSetUpload } from "../EmoteSetUpload/EmoteSetUpload";

export default function MainPanel() {
	const { data: emoteSets = [] } = useSuspenseQuery(getEmoteSetsQuery);

	return (
		<Paper withBorder shadow="md">
			<EmoteSetUpload />
			<EmoteSetTable emoteSets={emoteSets} />
		</Paper>
	);
}
