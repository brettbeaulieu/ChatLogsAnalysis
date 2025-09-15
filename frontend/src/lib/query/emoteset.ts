import { mutationOptions, queryOptions } from "@tanstack/react-query";

export const getEmoteSetsQuery = queryOptions({
	queryKey: ["emoteSets"],
	queryFn: async () => {
		const response = await fetch("http://localhost:3000/api/emotesets/", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			cache: "no-cache",
		});
		if (!response.ok) {
			throw new Error("Failed to fetch emote sets");
		}
		return response.json();
	},
});

export const createEmoteSetMutation = mutationOptions({
	mutationKey: ["createEmoteSet"],
	mutationFn: async (id: string) => {
		const response = await fetch("http://localhost:3000/api/emotesets/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id }),
		});
		if (!response.ok) {
			throw new Error("Failed to create emote set");
		}
		return response.json();
	},
});

export const updateEmoteSetMutation = mutationOptions({
	mutationKey: ["setEmoteSetName"],
	mutationFn: async ({ id, name }: { id: number; name: string }) => {
		const response = await fetch(`http://localhost:3000/api/emotesets/${id}/`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ name }),
		});
		if (!response.ok) {
			throw new Error("Failed to update emote set");
		}
		return response.json();
	},
});

export const deleteEmoteSetMutation = mutationOptions({
	mutationKey: ["deleteEmoteSet"],
	mutationFn: async (id: number) => {
		const response = await fetch(`http://localhost:3000/api/emotesets/${id}/`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			throw new Error("Failed to delete emote set");
		}
		return response.json();
	},
});
