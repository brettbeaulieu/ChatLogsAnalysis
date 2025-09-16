import { queryOptions } from "@tanstack/react-query";
import { API_URL } from "@/lib/constants";

const REFETCH_INTERVAL = 1500;

type TaskStatusResponse = {
	task_id: string;
	status: "PENDING" | "STARTED" | "SUCCESS" | "FAILURE" | "REVOKED";
};

export function taskStatusQuery(taskId: string) {
	return queryOptions<TaskStatusResponse>({
		enabled: !!taskId,
		queryKey: ["taskStatus", taskId],
		queryFn: async () => {
			const response = await fetch(`${API_URL}/tasks/${taskId}/`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				cache: "no-cache",
			});
			if (!response.ok) {
				throw new Error("Failed to fetch task status");
			}
			return response.json();
		},
		select: (task) => {
			const status = task?.status;
			if (["FAILURE", "REVOKED"].includes(status)) {
				throw new Error(`Task ended with status ${status}`);
			}
			return task;
		},
		refetchInterval: (query) => {
			if (!query.state.data) {
				return REFETCH_INTERVAL;
			}
			const terminal = ["SUCCESS", "FAILURE", "REVOKED"].includes(
				query.state.data.status,
			);
			return terminal ? false : REFETCH_INTERVAL;
		},
		refetchIntervalInBackground: true,
		retry: false,
		refetchOnWindowFocus: false,
		staleTime: 500,
	});
}
