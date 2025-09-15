import { Button, Paper, Stack, Text, TextInput } from "@mantine/core";
import { useState } from "react";
import { useCreate } from "@/hooks/emoteset";

export function EmoteSetUpload() {
	const { mutateAsync: createEmoteSet, isPending } = useCreate();

	const [inputURL, setInputURL] = useState("");

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputURL(event.target.value);
	};

	const handleSubmit = async () => {
		let submittedUrl = inputURL;
		if (submittedUrl.includes("/")) {
			submittedUrl = inputURL.substring(
				inputURL.lastIndexOf("/") + 1,
				inputURL.length,
			);
		}

		await createEmoteSet(submittedUrl);
	};

	return (
		<Paper p="md" withBorder>
			<Stack>
				<Text>Import Emote Set URL</Text>
				<TextInput
					label={"Emote Set ID/URL"}
					value={inputURL}
					onChange={handleInputChange}
					placeholder={"https://7tv.app/emote-sets/<x>"}
				/>
				<Button loading={isPending} onClick={handleSubmit}>
					Submit
				</Button>
			</Stack>
		</Paper>
	);
}
