import { notifications } from "@mantine/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	createLogfileMutation,
	deleteLogfileMutation,
	getLogfilesQuery,
	updateLogfileMutation,
} from "@/lib/query/logfile";

export const useCreate = () => {
	const queryClient = useQueryClient();
	return useMutation({
		...createLogfileMutation,
		onSuccess: (data) => {
			notifications.show({
				title: "Logfile creation task sent",
				message: `Ticket: ${data.ticket}`,
			});
			queryClient.invalidateQueries(getLogfilesQuery);
		},
	});
};

export const useUpdate = () => {
	const queryClient = useQueryClient();
	return useMutation({
		...updateLogfileMutation,
		onSuccess: () => {
			queryClient.invalidateQueries(getLogfilesQuery);
		},
	});
};

export const useDelete = () => {
	const queryClient = useQueryClient();
	return useMutation({
		...deleteLogfileMutation,
		onSuccess: () => {
			queryClient.invalidateQueries(getLogfilesQuery);
		},
	});
};
