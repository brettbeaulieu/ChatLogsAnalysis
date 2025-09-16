import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
	createEmoteSetMutation,
	deleteEmoteSetMutation,
	getEmoteSetsQuery,
	updateEmoteSetMutation,
} from "@/lib/query/emoteset";
import { taskStatusQuery } from "@/lib/query/task";

export const useCreate = () => {
	const queryClient = useQueryClient();
	const [taskId, setTaskId] = useState<string | null>(null);
	const statusQuery = useQuery(taskStatusQuery(taskId ?? ""));

	useEffect(() => {
		const status = statusQuery.data?.status;
		if (!status) {
			return;
		}
		if (status === "SUCCESS") {
			queryClient.invalidateQueries(getEmoteSetsQuery);
			notifications.show({
				title: "Emote Set Created",
				message: "The emote set was created successfully.",
			});
			setTaskId(null);
		}
	}, [statusQuery.data, queryClient]);

	useEffect(() => {
		if (!statusQuery.error) {
			return;
		}
		notifications.show({
			title: "Emote Set Creation Failed",
			message: statusQuery.error.message,
			color: "red",
		});
		setTaskId(null);
	}, [statusQuery.error]);

	return useMutation({
		...createEmoteSetMutation,
		onSuccess: ({ task_id }) => {
			notifications.show({
				title: "Emote Set Creation Started",
				message: "The emote set creation process has started.",
				color: "blue",
			});
			queryClient.invalidateQueries(getEmoteSetsQuery);
			setTaskId(task_id);
		},
		onError: (error: Error) => {
			notifications.show({
				title: "Emote Set Creation Failed",
				message: error.message,
				color: "red",
			});
		},
	});
};

export const useUpdate = () => {
	const queryClient = useQueryClient();
	return useMutation({
		...updateEmoteSetMutation,
		onSuccess: () => {
			notifications.show({
				title: "Emote Set Updated",
				message: "The emote set was updated successfully.",
			});
			queryClient.invalidateQueries(getEmoteSetsQuery);
		},
	});
};

export const useDelete = () => {
	const queryClient = useQueryClient();
	return useMutation({
		...deleteEmoteSetMutation,
		onSuccess: () => {
			notifications.show({
				title: "Emote Set Deleted",
				message: "The emote set was deleted successfully.",
			});
			queryClient.invalidateQueries(getEmoteSetsQuery);
		},
	});
};
