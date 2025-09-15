import { Burger, Group, HoverCard, UnstyledButton } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import styles from "./Header.module.css";

interface HeaderProps {
	opened: boolean;
	toggle: () => void;
}

export function Header({ opened, toggle }: Readonly<HeaderProps>) {
	return (
		<Group h="100%" w="100%" px="md">
			<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="md" />
			<Group visibleFrom="sm" justify="space-between" style={{ flex: 1 }}>
				<Group className={styles.headerGroup}>
					<Group>
						<Group justify="center">
							<HoverCard width={280} shadow="md">
								<HoverCard.Target>
									<UnstyledButton className={styles.control}>
										<Group>
											Chat <IconChevronDown />
										</Group>
									</UnstyledButton>
								</HoverCard.Target>
								<HoverCard.Dropdown className={styles.hoverCard}>
									<UnstyledButton
										component="a"
										href="/analytics/chat/dashboard"
										className={styles.control}
									>
										Chat Dashboard
									</UnstyledButton>
									<UnstyledButton
										component="a"
										href="/analytics/chat/viewer"
										className={styles.control}
									>
										Chat Viewer
									</UnstyledButton>
								</HoverCard.Dropdown>
							</HoverCard>
						</Group>

						<Group justify="center">
							<HoverCard width={280} shadow="md">
								<HoverCard.Target>
									<UnstyledButton className={styles.control}>
										<Group>
											Upload Data <IconChevronDown />
										</Group>
									</UnstyledButton>
								</HoverCard.Target>
								<HoverCard.Dropdown className={styles.hoverCard}>
									<UnstyledButton
										component="a"
										href="/data/logfile"
										className={styles.control}
									>
										Chatlog Data
									</UnstyledButton>
									<UnstyledButton
										component="a"
										href="/data/channel"
										className={styles.control}
									>
										Channel Data
									</UnstyledButton>
									<UnstyledButton
										component="a"
										href="/data/emoteset"
										className={styles.control}
									>
										Emote Set Data
									</UnstyledButton>
								</HoverCard.Dropdown>
							</HoverCard>
						</Group>
					</Group>
					<ThemeToggle />
				</Group>
			</Group>
		</Group>
	);
}
