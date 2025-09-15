"use client";

import type { MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
import type { Emote, EmoteSet } from "@/api/model_interfaces";
import type { Channel } from "@/lib/types";

export function useColumns({
	errors,
	setErrors,
}: {
	errors: Record<string, string | null>;
	setErrors: React.Dispatch<
		React.SetStateAction<Record<string, string | null>>
	>;
}) {
	return useMemo<MRT_ColumnDef<EmoteSet>[]>(
		() => [
			{
				accessorKey: "id",
				header: "ID",
				enableEditing: false,
			},
			{
				accessorKey: "name",
				header: "Name",
				mantineEditTextInputProps: {
					type: "text",
					required: true,
					error: errors?.name,
					onFocus: () =>
						setErrors({
							...errors,
							name: null,
						}),
				},
			},
			{
				accessorKey: "set_id",
				header: "Set ID",
			},
			{
				accessorKey: "channels",
				header: "Channels",
				Cell: ({ cell }) => (
					<div>
						{cell.getValue().map((channel: Channel) => (
							<div key={channel.id}>{channel.name}</div>
						))}
					</div>
				),
			},
			{
				accessorKey: "emotes",
				header: "Emotes",
				Cell: ({ cell }) => (
					<div>
						{cell.getValue().map((emote: Emote) => (
							<div key={emote.id}>{emote.name}</div>
						))}
					</div>
				),
			},
		],
		[errors, setErrors],
	);
}
