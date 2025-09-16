import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getLogfilesQuery } from "@/lib/query/logfile";
import { taskStatusQuery } from "@/lib/query/task";

type ValidateResponse = {
	valid: boolean;
	channels: { name: string; userID: string }[];
};

// validate url based on a passed repoURL
export const useValidate = (repoUrl: string) => {
	const queryClient = useQueryClient();
	return useQuery<ValidateResponse>(
		{
			enabled: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
			retry: false,
			queryKey: ["validateRustlogRepo", repoUrl],
			queryFn: async ({ queryKey }) => {
				const repoInput = queryKey[1];
				if (typeof repoInput !== "string") {
					throw new Error("Invalid repository URL");
				}

				const response = await fetch(
					`/api/rustlog/validate?repo_url=${encodeURIComponent(repoInput)}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
						cache: "no-cache",
					},
				);
				if (!response.ok) {
					throw new Error("Validation failed");
				}

				const result = await response.json();

				queryClient.setQueryData(
					["fetchRustlogChannels", repoUrl],
					result.channels,
				);

				return result;
			},
		},
		queryClient,
	);
};

export const useChannels = (repoUrl: string) => {
	const queryClient = useQueryClient();
	return useQuery<{ name: string; userID: string }[]>(
		{
			enabled: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
			retry: false,
			queryKey: ["fetchRustlogChannels", repoUrl],
			queryFn: async ({ queryKey }) => {
				const repoInput = queryKey[1];
				if (typeof repoInput !== "string") {
					throw new Error("Invalid repository URL");
				}
				const response = await fetch(
					`/api/rustlog/channels?repo_url=${encodeURIComponent(repoInput)}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
						},
						cache: "no-cache",
					},
				);
				if (!response.ok) {
					throw new Error("Failed to fetch channels");
				}
				const result = await response.json();
				return result.channels;
			},
		},
		queryClient,
	);
};

export const useLogGrab = () => {
	const queryClient = useQueryClient();
	const [taskId, setTaskId] = useState<string | null>(null);
	const statusQuery = useQuery(taskStatusQuery(taskId ?? ""));

	useEffect(() => {
		const status = statusQuery.data?.status;
		if (!status) {
			return;
		}

		if (status === "SUCCESS") {
			queryClient.invalidateQueries(getLogfilesQuery);
			notifications.show({
				title: "Log Grab Complete",
				message: "The log grabbing process completed successfully.",
			});
			setTaskId(null);
		}
	}, [statusQuery.data, queryClient]);

	useEffect(() => {
		if (!statusQuery.error) {
			return;
		}
		notifications.show({
			title: "Log Grab Failed",
			message: statusQuery.error.message,
			color: "red",
		});
		setTaskId(null);
	}, [statusQuery.error]);

	return useMutation(
		{
			mutationKey: ["grabRustlogLogs"],
			mutationFn: async (data: {
				repo_name: string;
				channel_name: string;
				start_date: Date;
				end_date: Date;
			}) => {
				const response = await fetch("/api/rustlog/grab/", {
					method: "POST",
					body: JSON.stringify(data),
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					throw new Error("Failed to grab logs");
				}
				return response.json();
			},
			onSuccess: ({ task_id }) => {
				notifications.show({
					title: "Log Grab Started",
					message: "The log grabbing process has started.",
					color: "blue",
				});
				setTaskId(task_id);
			},
			onError: (error: Error) => {
				notifications.show({
					title: "Log Grab Failed",
					message: error.message,
					color: "red",
				});
			},
		},
		queryClient,
	);
};
