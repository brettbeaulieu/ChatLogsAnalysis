"use client";

import { Button, Group, Paper, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import {
	MantineReactTable,
	type MRT_Row,
	type MRT_TableOptions,
	useMantineReactTable,
} from "mantine-react-table";
import { useState } from "react";
import { RowActions } from "@/components/table/RowActions";
import { useCreate, useDelete, useUpdate } from "@/hooks/channel";
import type { Channel } from "@/lib/types";
import { useChannelColumns as useColumns } from "./ChannelColumns";
import styles from "./ChannelTable.module.css";

function validateChannel(input: { name: string }) {
	return {
		name: !input.name ? "Channel Name is Required" : "",
	};
}

interface ChannelTableProps {
	channels: Channel[];
}

export function ChannelTable({ channels }: Readonly<ChannelTableProps>) {
	// CRUD hooks
	const { mutateAsync: createC, isPending: isCreatingC } = useCreate();
	const { mutateAsync: updateC, isPending: isUpdatingC } = useUpdate();
	const { mutateAsync: deleteC, isPending: isDeletingC } = useDelete();

	// Columns
	const [errors, setErrors] = useState<Record<string, string | null>>({
		name: null,
	});
	const columns = useColumns({
		errors: errors,
		setErrors: setErrors,
	});

	// Table actions
	const handleCreate: MRT_TableOptions<Channel>["onCreatingRowSave"] = async ({
		values,
		exitCreatingMode,
	}) => {
		const newErrors = validateChannel(values);
		if (Object.values(newErrors).some((error) => !!error)) {
			setErrors(newErrors);
		} else {
			setErrors({});
			await createC(values.name);
			exitCreatingMode();
		}
	};
	const handleSave: MRT_TableOptions<Channel>["onEditingRowSave"] = async ({
		values,
		table,
	}) => {
		const newErrors = validateChannel(values);
		if (Object.values(newErrors).some((error) => error)) {
			setErrors(newErrors);
			return;
		}
		setErrors({});
		await updateC(values);
		table.setEditingRow(null); //exit editing mode
	};
	const openDeleteConfirmModal = (row: MRT_Row<Channel>) => {
		modals.openConfirmModal({
			title: "Are you sure you want to delete this channel?",
			children: (
				<Text>
					Are you sure you want to delete {row.original.name}? This action
					cannot be undone.
				</Text>
			),
			labels: { confirm: "Delete", cancel: "Cancel" },
			confirmProps: { color: "red" },
			onConfirm: () => {
				deleteC(row.original.id);
			},
		});
	};

	const table = useMantineReactTable({
		columns,
		data: channels,
		createDisplayMode: "row",
		editDisplayMode: "row",
		enableEditing: true,
		enableRowSelection: true,
		enableRowActions: true,
		positionActionsColumn: "last",
		getRowId: (row) => row.id.toString(),
		onCreatingRowCancel: () => setErrors({}),
		onCreatingRowSave: handleCreate,
		onEditingRowSave: handleSave,
		onEditingRowCancel: () => setErrors({}),
		renderRowActions: ({ row, table }) => (
			<RowActions
				editAction={() => table.setEditingRow(row)}
				deleteAction={() => openDeleteConfirmModal(row)}
			/>
		),
		renderTopToolbarCustomActions: ({ table }) => (
			<Button
				onClick={() => {
					table.setCreatingRow(true);
				}}
			>
				Create New Channel
			</Button>
		),
		state: {
			isLoading: false,
			isSaving: isUpdatingC || isDeletingC || isCreatingC,
		},
	});

	return (
		<Paper className={styles.mainPaper} withBorder>
			<Group mb="md">
				<Text className={styles.filesHeader}>Channels ({channels.length})</Text>
			</Group>
			<MantineReactTable table={table} />
		</Paper>
	);
}
