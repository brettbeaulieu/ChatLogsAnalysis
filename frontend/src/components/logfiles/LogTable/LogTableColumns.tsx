"use client";

import type { MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
import type { Channel, Logfile } from "@/lib/types";

export function useColumns({
	channels,
	errors,
	setErrors,
}: {
	channels: Channel[];
	errors: Record<string, string | null>;
	setErrors: React.Dispatch<
		React.SetStateAction<Record<string, string | null>>
	>;
}) {
	return useMemo<MRT_ColumnDef<Logfile>[]>(
		() => [
			{
				accessorKey: "id",
				header: "ID",
				enableEditing: false,
			},
			{
				accessorKey: "filename",
				header: "Filename",
				mantineEditTextInputProps: {
					type: "text",
					required: true,
					error: errors?.filename,
					onFocus: () =>
						setErrors({
							...errors,
							filename: null,
						}),
				},
			},
			{
				accessorKey: "channel.name",
				header: "Channel",
				editVariant: "select",
				mantineEditSelectProps: {
					data: channels.map((channel) => ({
						value: channel.id.toString(),
						label: channel.name,
					})),
					error: errors?.channelId,
				},
			},
			{
				accessorKey: "is_preprocessed",
				header: "Preprocessed",
				enableEditing: false,
			},
			{
				accessorKey: "uploaded_at",
				header: "Uploaded At",
				enableEditing: false,
			},
		],
		[errors, setErrors, channels],
	);
}
