import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { AppFrame } from "@/components/AppFrame/AppFrame";
import MainPanel from "@/components/logfiles/MainPanel/MainPanel";
import { getChannelsQuery } from "@/lib/query/channel";
import { getQueryClient } from "@/lib/query/get-client";
import { getLogfilesQuery } from "@/lib/query/logfile";

export default function Page() {
	const queryClient = getQueryClient();
	queryClient.prefetchQuery(getLogfilesQuery);
	queryClient.prefetchQuery(getChannelsQuery);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AppFrame main={<MainPanel />} />
		</HydrationBoundary>
	);
}
