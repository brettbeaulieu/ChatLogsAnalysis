import { NextResponse } from "next/server";
import { BACKEND_URL } from "@/lib/constants";

const getRoute = async (
	_request: Request,
	{ params }: { params: { id: string } },
) => {
	const response = await fetch(
		`${BACKEND_URL}/tasks/status?task_id=${params.id}`,
		{ cache: "no-cache" },
	);
	if (!response.ok) {
		return NextResponse.json(
			{ error: "Failed to fetch task" },
			{ status: 500 },
		);
	}
	const data = await response.json();

	return NextResponse.json(data, { status: 200 });
};

export { getRoute as GET };
