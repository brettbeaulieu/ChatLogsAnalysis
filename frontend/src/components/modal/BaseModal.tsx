import { Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

interface BaseModalProps {
	title: string;
	children: React.ReactNode;
}

export const BaseModal = ({ title, children }: BaseModalProps) => {
	const [opened, { close }] = useDisclosure(false);

	return (
		<Modal.Root opened={opened} onClose={close} centered>
			<Modal.Overlay />
			<Modal.Content>
				<Modal.Header>
					<Modal.Title>
						<Text size="xl">{title}</Text>
					</Modal.Title>
					<Modal.CloseButton />
				</Modal.Header>
				<Modal.Body>{children}</Modal.Body>
			</Modal.Content>
		</Modal.Root>
	);
};
