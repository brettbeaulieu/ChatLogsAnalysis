"use client";

import { ModalsProvider } from "@mantine/modals";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query/get-client";

export const Providers = ({ children }: { children: React.ReactNode }) => {
	// This code is only for TypeScript
	// This code is for all users
	const queryClient = getQueryClient();

	if (typeof window !== "undefined") {
		// Ensure we only set this once
		if (!window.__TANSTACK_QUERY_CLIENT__) {
			window.__TANSTACK_QUERY_CLIENT__ = queryClient;
		}
	}

	return (
		<QueryClientProvider client={queryClient}>
			<ModalsProvider>{children}</ModalsProvider>
		</QueryClientProvider>
	);
};

// This code is only for TypeScript
declare global {
	interface Window {
		__TANSTACK_QUERY_CLIENT__: import("@tanstack/query-core").QueryClient;
	}
}
