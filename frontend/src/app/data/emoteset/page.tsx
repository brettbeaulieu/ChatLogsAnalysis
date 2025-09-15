import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { AppFrame } from "@/components/AppFrame/AppFrame";
import MainPanel from "@/components/emoteSet/MainPanel/MainPanel";
import { getEmoteSetsQuery } from "@/lib/query/emoteset";
import { getQueryClient } from "@/lib/query/get-client";

export default function Page() {
	const queryClient = getQueryClient();
	queryClient.prefetchQuery(getEmoteSetsQuery);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AppFrame main={<MainPanel />} />
		</HydrationBoundary>
	);
}
