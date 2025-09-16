import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	createChannelMutation,
	deleteChannelMutation,
	getChannelsQuery,
	updateChannelMutation,
} from "@/lib/query/channel";

export const useCreate = () => {
	const queryClient = useQueryClient();
	return useMutation(
		{
			...createChannelMutation,
			onSuccess: (data) => {
				notifications.show({
					title: "Channel creation task sent",
					message: `Ticket: ${data.ticket}`,
				});
				queryClient.invalidateQueries(getChannelsQuery);
			},
		},
		queryClient,
	);
};

export const useUpdate = () => {
	const queryClient = useQueryClient();
	return useMutation({
		...updateChannelMutation,
		onSuccess: () => {
			notifications.show({
				title: "Channel Updated",
				message: "The channel was updated successfully.",
			});
			queryClient.invalidateQueries(getChannelsQuery);
		},
	});
};

export const useDelete = () => {
	const queryClient = useQueryClient();
	return useMutation({
		...deleteChannelMutation,
		onSuccess: () => {
			notifications.show({
				title: "Channel Deleted",
				message: "The channel was deleted successfully.",
			});
			queryClient.invalidateQueries(getChannelsQuery);
		},
	});
};
