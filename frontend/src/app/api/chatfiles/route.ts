import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/constants";

const getRoute = async () => {
	try {
		// Fetch chat files from backend:8000
		const response = await fetch(`${BACKEND_URL}/chatfiles`, {
			method: "GET",
		});
		if (!response.ok) {
			throw new Error(`Failed to fetch chat files: ${response.status}`);
		}
		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching chat files:", error);
		return NextResponse.error();
	}
};

export { getRoute as GET };
