"use client";

import { AppShell, type MantineTransition, Transition } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { ReactElement } from "react";
import { Header } from "./Header";
import { Navbar } from "./Navbar";

interface AppFrameProps {
	main: ReactElement;
}

const slideY: MantineTransition = {
	in: { transform: "translateY(0)" },
	out: { transform: "translateY(-100%)" },
	common: { transitionProperty: "transform" },
	transitionProperty: "transform",
};

export function AppFrame({ main }: Readonly<AppFrameProps>) {
	const [opened, { toggle }] = useDisclosure();

	return (
		<AppShell
			header={{ height: "5rem" }}
			navbar={{
				width: 300,
				breakpoint: "sm",
				collapsed: { desktop: true, mobile: !opened },
			}}
			padding="md"
		>
			<AppShell.Header zIndex={102}>
				<Header opened={opened} toggle={toggle} />
			</AppShell.Header>

			<Transition mounted={opened} transition={slideY} duration={500}>
				{(tStyles) => (
					<AppShell.Navbar py="lg" style={tStyles}>
						<Navbar />
					</AppShell.Navbar>
				)}
			</Transition>
			<AppShell.Main>{main}</AppShell.Main>
		</AppShell>
	);
}
