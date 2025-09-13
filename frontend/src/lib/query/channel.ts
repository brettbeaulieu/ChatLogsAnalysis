import {
	mutationOptions,
	type QueryClient,
	queryOptions,
} from "@tanstack/react-query";

export const getChannelsQuery = queryOptions({
	queryKey: ["channels"],
	queryFn: async () => {
		const response = await fetch("http://localhost:3000/api/channels/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			cache: "no-cache",
		});
		if (!response.ok) {
			throw new Error("Failed to fetch channels");
		}
		return response.json();
	},
});

export const updateChannelMutation = mutationOptions({
	mutationKey: ["setChannelName"],
	mutationFn: async ({ id, name }: { id: number; name: string }) => {
		const response = await fetch(`http://localhost:3000/api/channels/${id}/`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			cache: "no-cache",
			body: JSON.stringify({ name }),
		});
		if (!response.ok) {
			throw new Error("Failed to update channel name");
		}
		return response.json();
	},
	onSuccess: (_data, _variables, context: { queryClient: QueryClient }) => {
		// Invalidate the channels query to refetch the updated data
		context?.queryClient.invalidateQueries(getChannelsQuery);
	},
});

export const deleteChannelMutation = mutationOptions({
	mutationKey: ["deleteChannel"],
	mutationFn: async (id: number) => {
		const response = await fetch(`http://localhost:3000/api/channels/${id}/`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			cache: "no-cache",
		});
		if (!response.ok) {
			throw new Error("Failed to delete channel");
		}
	},
	onSuccess: (_data, _variables, context: { queryClient: QueryClient }) => {
		// Invalidate the channels query to refetch the updated data
		context?.queryClient.invalidateQueries(getChannelsQuery);
	},
});

export const createChannelMutation = mutationOptions({
	mutationKey: ["createChannel"],
	mutationFn: async (name: string) => {
		const response = await fetch("http://localhost:3000/api/channels/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			cache: "no-cache",
			body: JSON.stringify({ name }),
		});
		if (!response.ok) {
			throw new Error("Failed to create channel");
		}
		return response.json();
	},
	onSuccess: (_data, _variables, context: { queryClient: QueryClient }) => {
		// Invalidate the channels query to refetch the updated data
		context?.queryClient.invalidateQueries(getChannelsQuery);
	},
});
