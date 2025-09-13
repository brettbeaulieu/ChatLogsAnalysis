"use client";

import { Button, Group, Paper, Select, Stack, Text } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { hasLength, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { useChannels, useLogGrab } from "@/hooks/rustlog";
import { RepoNameValidate } from "../RepoNameValidate/RepoNameValidate";
import styles from "./RustlogImport.module.css";

export function RustlogImport() {
	const [repoName, setRepoName] = useState("");
	const { data: channels = [] } = useChannels(repoName);
	const { mutateAsync } = useLogGrab();

	const form = useForm({
		mode: "uncontrolled",
		name: "rustlog-import-form",
		initialValues: {
			channelName: "",
			dateRange: [null, null] as [Date | null, Date | null],
		},
		validate: {
			channelName: hasLength({ min: 3 }, "Must be at least 3 characters"),
			dateRange: (value) =>
				value[0] && value[1]
					? null
					: "Both start date and end date are required",
		},
	});

	const handleSubmit = async (values: typeof form.values) => {
		if (!values.dateRange[0] || !values.dateRange[1]) {
			notifications.show({
				title: "Form Incomplete",
				message: "Please fill out all fields before submitting.",
				color: "red",
			});
			return;
		}

		await mutateAsync({
			repo_name: repoName,
			channel_name: values.channelName,
			start_date: values.dateRange[0],
			end_date: values.dateRange[1],
		});
	};

	return (
		<form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
			<Paper className={styles.inner_paper} withBorder>
				<Stack justify={"space-between"}>
					<Text className={styles.centered_header}>
						Import From Rustlog API
					</Text>
					<Group align={"flex-end"} className={styles.paramsGroup}>
						<RepoNameValidate repoName={repoName} setRepoName={setRepoName} />
						<Select
							{...form.getInputProps("channelName")}
							label="Channel"
							placeholder="Select channel"
							data={channels.map((channel) => ({
								value: channel.name,
								label: channel.name,
							}))}
							searchable
							nothingFoundMessage={"No channels found"}
						/>
						<DatePickerInput
							{...form.getInputProps("dateRange")}
							label={"Time Range"}
							type={"range"}
							allowSingleDateInRange
						/>
						<Button type="submit" classNames={{ label: styles.submitLabel }}>
							Submit
						</Button>
					</Group>
				</Stack>
			</Paper>
		</form>
	);
}
