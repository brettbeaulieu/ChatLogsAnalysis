import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/constants";

const getRoute = async (request: Request) => {
	const { searchParams } = new URL(request.url);
	const repoUrl = searchParams.get("repo_url");
	if (!repoUrl) {
		return NextResponse.json(
			{ error: "Missing repo_url parameter" },
			{ status: 400 },
		);
	}
	try {
		const response = await fetch(
			`${BACKEND_URL}/rustlog/channels/?repo_url=` +
				encodeURIComponent(repoUrl),
		);
		if (!response.ok) {
			throw new Error(`Error fetching channels: ${response.statusText}`);
		}

		const data = (await response.json()).data;
		return NextResponse.json(
			{ valid: data.valid, channels: data.channels },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error fetching channels:", error);
		return NextResponse.json({ valid: false, channels: [] }, { status: 500 });
	}
};

export { getRoute as GET };
