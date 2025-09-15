import { Center, SegmentedControl, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export function ThemeToggle() {
	// State to hold the current theme
	const { colorScheme, setColorScheme } = useMantineColorScheme();

	const onChangeColor = (value: unknown) => {
		if (value === "light" || value === "dark" || value === "auto") {
			setColorScheme(value);
		}
	};

	return (
		<SegmentedControl
			style={{ height: "fit-content" }}
			onChange={onChangeColor}
			value={colorScheme}
			data={[
				{
					label: (
						<Center>
							<IconSun />
							<span>Light</span>
						</Center>
					),
					value: "light",
				},
				{
					label: (
						<Center>
							<IconMoon />
							<span>Dark</span>
						</Center>
					),
					value: "dark",
				},
			]}
		/>
	);
}
