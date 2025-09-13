import { ActionIcon, Flex, Tooltip } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";

interface RowActionsProps {
	editAction: () => void;
	deleteAction: () => void;
}

export function RowActions({
	editAction,
	deleteAction,
}: Readonly<RowActionsProps>) {
	return (
		<Flex gap="md">
			<Tooltip label="Edit">
				<ActionIcon onClick={editAction}>
					<IconEdit />
				</ActionIcon>
			</Tooltip>
			<Tooltip label="Delete">
				<ActionIcon color="red" onClick={deleteAction}>
					<IconTrash />
				</ActionIcon>
			</Tooltip>
		</Flex>
	);
}
