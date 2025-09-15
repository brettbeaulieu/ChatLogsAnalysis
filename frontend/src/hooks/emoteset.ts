import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	createEmoteSetMutation,
	deleteEmoteSetMutation,
	getEmoteSetsQuery,
	updateEmoteSetMutation,
} from "@/lib/query/emoteset";

export const useCreate = () => {
	const queryClient = useQueryClient();
	return useMutation({
		...createEmoteSetMutation,
		onSuccess: () => {
			queryClient.invalidateQueries(getEmoteSetsQuery);
			notifications.show({
				title: "Emote Set Created",
				message: "The emote set was created successfully.",
			});
		},
	});
};

export const useUpdate = () => {
	const queryClient = useQueryClient();
	return useMutation({
		...updateEmoteSetMutation,
		onSuccess: () => {
			queryClient.invalidateQueries(getEmoteSetsQuery);
		},
	});
};

export const useDelete = () => {
	const queryClient = useQueryClient();
	return useMutation({
		...deleteEmoteSetMutation,
		onSuccess: () => {
			queryClient.invalidateQueries(getEmoteSetsQuery);
		},
	});
};
