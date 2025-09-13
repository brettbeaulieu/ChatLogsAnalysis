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
				// close(); // Removed undefined function call
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
			queryClient.invalidateQueries(getChannelsQuery);
		},
	});
};

export const useDelete = () => {
	const queryClient = useQueryClient();
	return useMutation({
		...deleteChannelMutation,
		onSuccess: () => {
			queryClient.invalidateQueries(getChannelsQuery);
		},
	});
};
