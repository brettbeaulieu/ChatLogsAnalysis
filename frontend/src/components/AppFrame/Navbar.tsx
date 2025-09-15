import { Stack, UnstyledButton } from "@mantine/core";
import { ThemeToggle } from "@/components";

interface NavbarButtonProps {
	link: string;
	title: string;
}

function NavbarButton({ link, title }: Readonly<NavbarButtonProps>) {
	return (
		<UnstyledButton component="a" href={link} p="sm">
			{title}
		</UnstyledButton>
	);
}

export function Navbar() {
	return (
		<Stack justify="space-between" h="100%">
			<Stack align="center">
				<NavbarButton link="/analytics/chat/dashboard" title="Chat Dashboard" />
				<NavbarButton link="/analytics/chat/viewer" title="Chat Viewer" />
				<NavbarButton link="/data/logfile" title="Chatlog Data" />
				<NavbarButton link="/data/channel" title="Channel Data" />
				<NavbarButton link="/data/emoteset" title="Emote Set Data" />
			</Stack>
			<Stack p={"sm"}>
				<ThemeToggle />
			</Stack>
		</Stack>
	);
}
