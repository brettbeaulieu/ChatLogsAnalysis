import { Group, Paper, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import {
	MantineReactTable,
	type MRT_Row,
	type MRT_TableOptions,
	useMantineReactTable,
} from "mantine-react-table";
import { useState } from "react";
import type { Channel } from "@/api";
import { RowActions } from "@/components/table/RowActions";
import { useDelete, useUpdate } from "@/hooks/logfile";
import type { Logfile } from "@/lib/types";
import styles from "./LogTable.module.css";
import { useColumns } from "./LogTableColumns";

interface LogTableProps {
	channels: Channel[];
	logfiles: Logfile[];
}

function validateLogfile(input: Logfile) {
	return {
		filename: !input.filename ? "Filename is Required" : "",
		channelId: !input.channel ? "Channel is Required" : "",
	};
}

export function LogTable({ channels, logfiles }: Readonly<LogTableProps>) {
	// CRUD hooks
	const { mutateAsync: updateLog, isPending: isUpdating } = useUpdate();
	const { mutateAsync: deleteLog, isPending: isDeleting } = useDelete();

	// Columns
	const [errors, setErrors] = useState<Record<string, string | null>>({
		name: null,
	});
	const columns = useColumns({
		channels,
		errors: errors,
		setErrors: setErrors,
	});

	const handleSave: MRT_TableOptions<Logfile>["onEditingRowSave"] = async ({
		values,
		table: tableObj,
	}) => {
		const newErrors = validateLogfile({ ...values });
		if (Object.values(newErrors).some((error) => error)) {
			setErrors(newErrors);
			return;
		}
		setErrors({});
		await updateLog({ id: values.id, name: values.filename });
		tableObj.setEditingRow(null);
	};
	const openDeleteConfirmModal = (row: MRT_Row<Logfile>) => {
		modals.openConfirmModal({
			title: "Are you sure you want to delete this logfile?",
			children: (
				<Text>
					Are you sure you want to delete {row.original.filename}? This action
					cannot be undone.
				</Text>
			),
			labels: { confirm: "Delete", cancel: "Cancel" },
			confirmProps: { color: "red" },
			onConfirm: () => deleteLog(row.original.id),
		});
	};

	const table = useMantineReactTable({
		columns,
		data: logfiles,
		editDisplayMode: "row",
		enableEditing: true,
		enableRowSelection: true,
		enableRowActions: true,
		positionActionsColumn: "last",
		getRowId: (row) => row.id.toString(),
		onEditingRowSave: handleSave,
		onEditingRowCancel: () => setErrors({}),
		renderRowActions: ({ row, table: tableObj }) => (
			<RowActions
				editAction={() => tableObj.setEditingRow(row)}
				deleteAction={() => openDeleteConfirmModal(row)}
			/>
		),
		state: {
			isLoading: false,
			isSaving: isUpdating || isDeleting,
		},
	});

	return (
		<Paper className={styles.mainPaper} withBorder>
			<Group mb="md">
				<Text className={styles.filesHeader}>
					Uploaded Files ({logfiles.length})
				</Text>
			</Group>
			<MantineReactTable table={table} />
		</Paper>
	);
}
