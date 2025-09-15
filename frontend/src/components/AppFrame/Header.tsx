import { Burger, Flex, Group, HoverCard, UnstyledButton } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";

interface LinkButtonProps {
	title: string;
}

function LinkGroup({ title }: Readonly<LinkButtonProps>) {
	return (
		<HoverCard.Target>
			<UnstyledButton p="sm">
				<Group>
					{title} <IconChevronDown />
				</Group>
			</UnstyledButton>
		</HoverCard.Target>
	);
}

interface DropdownItemProps {
	link: string;
	title: string;
}

function DropdownItem({ link, title }: Readonly<DropdownItemProps>) {
	return (
		<UnstyledButton component="a" href={link} p="sm">
			<Group>{title}</Group>
		</UnstyledButton>
	);
}

interface HeaderProps {
	opened: boolean;
	toggle: () => void;
}

export function Header({ opened, toggle }: Readonly<HeaderProps>) {
	return (
		<Flex w="100%" h="5rem" align="center" p={"sm"}>
			<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="md" />
			<Flex
				w="100%"
				h="100%"
				align="center"
				visibleFrom="sm"
				justify="space-between"
			>
				<Group p="sm" justify="center" align="center">
					<Group justify="center">
						<HoverCard>
							<LinkGroup title="Chat" />
							<HoverCard.Dropdown dir="column">
								<DropdownItem
									link="/analytics/chat/dashboard"
									title="Chat Dashboard"
								/>
								<DropdownItem
									link="/analytics/chat/viewer"
									title="Chat Viewer"
								/>
							</HoverCard.Dropdown>
						</HoverCard>
					</Group>

					<Group justify="center">
						<HoverCard>
							<LinkGroup title="Data" />
							<HoverCard.Dropdown>
								<DropdownItem link="/data/logfile" title="Chatlog Data" />
								<DropdownItem link="/data/channel" title="Channel Data" />
								<DropdownItem link="/data/emoteset" title="Emote Set Data" />
							</HoverCard.Dropdown>
						</HoverCard>
					</Group>
				</Group>
				<Group>
					<ThemeToggle />
				</Group>
			</Flex>
		</Flex>
	);
}
