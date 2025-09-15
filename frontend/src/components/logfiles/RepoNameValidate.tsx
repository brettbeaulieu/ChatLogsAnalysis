import { ActionIcon, TextInput, Tooltip } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { useValidate } from "@/hooks/rustlog";

interface RepoNameValidateProps {
	repoName: string;
	setRepoName: (name: string) => void;
}

export function RepoNameValidate({
	repoName,
	setRepoName,
}: Readonly<RepoNameValidateProps>) {
	const { refetch: validate, isFetching } = useValidate(repoName);
	const [isRepoValid, setIsRepoValid] = useState(false);

	const validateRepo = async () => {
		const { data } = await validate();
		if (data) {
			setIsRepoValid(data.valid);
		} else {
			setIsRepoValid(false);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			event.preventDefault();
			validateRepo();
		}
	};

	const handleRepoNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setRepoName(e.currentTarget.value);
		setIsRepoValid(false);
	};

	return (
		<TextInput
			label={"Repository URL"}
			value={repoName}
			onChange={handleRepoNameChange}
			onKeyDown={handleKeyDown}
			rightSection={
				<Tooltip label="Press enter, or click to validate">
					<ActionIcon
						color={isRepoValid ? "teal" : "red"}
						onClick={validateRepo}
						disabled={isFetching}
					>
						{isRepoValid ? <IconCheck size={16} /> : <IconX size={16} />}
					</ActionIcon>
				</Tooltip>
			}
		/>
	);
}
