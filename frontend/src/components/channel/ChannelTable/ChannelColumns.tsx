"use client";

import type { MRT_ColumnDef } from "mantine-react-table";
import { useMemo } from "react";
import type { Channel } from "@/lib/types";

export function useChannelColumns({
	errors,
	setErrors,
}: {
	errors: Record<string, string | null>;
	setErrors: React.Dispatch<
		React.SetStateAction<Record<string, string | null>>
	>;
}) {
	return useMemo<MRT_ColumnDef<Channel>[]>(
		() => [
			{
				accessorKey: "id",
				header: "ID",
				enableEditing: false,
			},
			{
				accessorKey: "name",
				header: "Channel Name",
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
		],
		[errors, setErrors],
	);
}
