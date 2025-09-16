import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/constants";

const postRoute = async (request: Request) => {
	const { repo_name, channel_name, start_date, end_date } =
		await request.json();

	if (!repo_name || !channel_name || !start_date || !end_date) {
		return NextResponse.json(
			{ error: "Missing required parameters" },
			{ status: 400 },
		);
	}
	try {
		const response = await fetch(`${BACKEND_URL}/rustlog/logs/`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ repo_name, channel_name, start_date, end_date }),
		});
		if (!response.ok) {
			throw new Error(`Error fetching Rustlog data: ${response.statusText}`);
		}
		const data = await response.json();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error("Error fetching Rustlog data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch Rustlog data" },
			{ status: 500 },
		);
	}
};

export { postRoute as POST };
