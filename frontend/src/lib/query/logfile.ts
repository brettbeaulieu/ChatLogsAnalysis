import {
	mutationOptions,
	type QueryClient,
	queryOptions,
} from "@tanstack/react-query";

const endpoint = "http://localhost:3000/api/logfiles/";

export const getLogfilesQuery = queryOptions({
	queryKey: ["logfiles"],
	queryFn: async () => {
		const response = await fetch(endpoint, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			cache: "no-cache",
		});
		if (!response.ok) {
			throw new Error("Failed to fetch logfiles");
		}
		return response.json();
	},
});

export const updateLogfileMutation = mutationOptions({
	mutationKey: ["setLogfileName"],
	mutationFn: async ({ id, name }: { id: number; name: string }) => {
		const response = await fetch(`${endpoint}${id}/`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			cache: "no-cache",
			body: JSON.stringify({ name }),
		});
		if (!response.ok) {
			throw new Error("Failed to update logfile");
		}
		return response.json();
	},
	onSuccess: (_data, _variables, context: { queryClient: QueryClient }) => {
		// Invalidate the logfiles query to refetch the updated data
		context?.queryClient.invalidateQueries(getLogfilesQuery);
	},
});

export const deleteLogfileMutation = mutationOptions({
	mutationKey: ["deleteLogfile"],
	mutationFn: async (id: number) => {
		const response = await fetch(`${endpoint}${id}/`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			cache: "no-cache",
		});
		if (!response.ok) {
			throw new Error("Failed to delete logfile");
		}
	},
	onSuccess: (_data, _variables, context: { queryClient: QueryClient }) => {
		// Invalidate the logfiles query to refetch the updated data
		context?.queryClient.invalidateQueries(getLogfilesQuery);
	},
});

export const createLogfileMutation = mutationOptions({
	mutationKey: ["createLogfile"],
	mutationFn: async (name: string) => {
		const response = await fetch(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			cache: "no-cache",
			body: JSON.stringify({ name }),
		});
		if (!response.ok) {
			throw new Error("Failed to create logfile");
		}
		return response.json();
	},
	onSuccess: (_data, _variables, context: { queryClient: QueryClient }) => {
		// Invalidate the logfiles query to refetch the updated data
		context?.queryClient.invalidateQueries(getLogfilesQuery);
	},
});
