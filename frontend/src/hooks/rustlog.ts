import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLogfilesQuery } from "@/lib/query/logfile";

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

				notifications.show({
					title: "Log Grab Initiated",
					message: "Your request to grab logs has been sent.",
					color: "blue",
				});

				if (!response.ok) {
					throw new Error("Failed to grab logs");
				}
				return response.json();
			},
			onSuccess: () => {
				// update the logfiles list after a successful grab
				queryClient.invalidateQueries(getLogfilesQuery);
				notifications.show({
					title: "Success",
					message: "Logs grabbed successfully",
					color: "green",
				});
			},
			onError: (error) => {
				if (error instanceof Error) {
					console.error("Log grab error:", error.message);
				}
				notifications.show({
					title: "Error",
					message: "An error occurred while grabbing logs",
					color: "red",
				});
			},
		},
		queryClient,
	);
};
