import { Group, Paper, Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import {
	MantineReactTable,
	type MRT_Row,
	type MRT_TableOptions,
	useMantineReactTable,
} from "mantine-react-table";
import { useState } from "react";
import type { EmoteSet } from "@/api";
import { RowActions } from "@/components/table/RowActions";
import { useDelete, useUpdate } from "@/hooks/emoteset";
import styles from "./EmoteSetTable.module.css";
import { useColumns } from "./EmoteSetTableColumns";

interface EmoteSetTableProps {
	emoteSets: EmoteSet[];
}

const validateEmoteSetName = (emoteSets: EmoteSet[], emoteSet: EmoteSet) => {
	const newErrors: Record<string, string | null> = { name: null };
	if (!emoteSet.name || emoteSet.name.trim() === "") {
		newErrors.name = "Name is required";
	} else if (emoteSets.map((es) => es.name).includes(emoteSet.name.trim())) {
		newErrors.name = "Name must be unique";
	} else {
		newErrors.name = null;
	}
	return newErrors;
};

export function EmoteSetTable({ emoteSets }: Readonly<EmoteSetTableProps>) {
	// CRUD hooks
	const { mutateAsync: updateSet, isPending: isUpdating } = useUpdate();
	const { mutateAsync: deleteSet, isPending: isDeleting } = useDelete();

	// Columns
	const [errors, setErrors] = useState<Record<string, string | null>>({
		name: null,
	});
	const columns = useColumns({
		errors: errors,
		setErrors: setErrors,
	});

	const handleSave: MRT_TableOptions<EmoteSet>["onEditingRowSave"] = async ({
		values,
		table: tableObj,
	}) => {
		const newErrors = validateEmoteSetName(emoteSets, { ...values });
		if (Object.values(newErrors).some((error) => error)) {
			setErrors(newErrors);
			return;
		}
		setErrors({});
		await updateSet({ id: values.id, name: values.name });
		tableObj.setEditingRow(null);
	};
	const openDeleteConfirmModal = (row: MRT_Row<EmoteSet>) => {
		modals.openConfirmModal({
			title: "Are you sure you want to delete this emote set?",
			children: (
				<Text>
					Are you sure you want to delete {row.original.name}? This action
					cannot be undone.
				</Text>
			),
			labels: { confirm: "Delete", cancel: "Cancel" },
			confirmProps: { color: "red" },
			onConfirm: () => {
				deleteSet(row.original.id);
			},
		});
	};

	const table = useMantineReactTable({
		columns,
		data: emoteSets,
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
			isSaving: isUpdating || isDeleting,
		},
	});

	return (
		<Paper className={styles.mainPaper} withBorder>
			<Group mb="md">
				<Text className={styles.filesHeader}>
					Uploaded Emote Sets ({emoteSets.length})
				</Text>
			</Group>
			<MantineReactTable table={table} />
		</Paper>
	);
}
