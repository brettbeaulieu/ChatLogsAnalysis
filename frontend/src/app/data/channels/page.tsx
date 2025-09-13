import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { AppFrame } from "@/components/AppFrame/AppFrame";
import MainPanel from "@/components/channel/ViewPanel/ViewPanel";
import { getChannelsQuery } from "@/lib/query/channel";
import { getQueryClient } from "@/lib/query/get-client";

export default async function Page() {
	const queryClient = getQueryClient();
	queryClient.prefetchQuery(getChannelsQuery);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AppFrame main={<MainPanel />} />
		</HydrationBoundary>
	);
}
