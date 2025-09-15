import { Stack, UnstyledButton } from "@mantine/core";
import { ThemeToggle } from "@/components";
import styles from "./Navbar.module.css";

export function Navbar() {
	return (
		<>
			<Stack>
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
			</Stack>
			<ThemeToggle />
		</>
	);
}
