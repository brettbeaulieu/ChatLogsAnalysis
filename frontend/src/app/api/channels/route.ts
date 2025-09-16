import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/constants";

const getRoute = async () => {
	try {
		// Fetch channels from backend:8000
		const response = await fetch(`${BACKEND_URL}/channels`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			const errorData = await response.json();
			return NextResponse.json(errorData, {
				status: response.status,
			});
		}
		const data = await response.json();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error("Error in /api/channels GET:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{
				status: 500,
			},
		);
	}
};

const postRoute = async (request: Request) => {
	try {
		const body = await request.json();
		// send to backend:8000 to create the channel
		const response = await fetch(`${BACKEND_URL}/channels/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
		if (!response.ok) {
			return NextResponse.json(
				{ error: "Failed to create channel" },
				{
					status: 500,
				},
			);
		}
		const data = await response.json();
		return NextResponse.json(data, { status: 201 });
	} catch (error) {
		return new NextResponse(
			JSON.stringify({
				error: `Failed to create channel: ${(error as Error).toString()}`,
			}),
			{
				status: 500,
			},
		);
	}
};

export { getRoute as GET };
export { postRoute as POST };
