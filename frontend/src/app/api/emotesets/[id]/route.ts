import { NextResponse } from "next/server";

export const PATCH = async (
	request: Request,
	{ params }: { params: { id: string } },
) => {
	try {
		const body = await request.json();

		const id = params.id;
		if (!id) {
			return new Response(JSON.stringify({ error: "id is required" }), {
				status: 400,
			});
		}

		// send to backend:8000 to update the emote set name
		const response = await fetch(`http://backend:8000/api/emotesets/${id}/`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			return new Response(
				JSON.stringify({ error: "Failed to update emote set" }),
				{
					status: 500,
				},
			);
		}

		const data = await response.json();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		return new NextResponse(
			JSON.stringify({
				error: `Failed to update emote set: ${(error as Error).toString()}`,
			}),
			{
				status: 500,
			},
		);
	}
};

export const DELETE = async (
	_request: Request,
	{ params }: { params: { id: string } },
) => {
	try {
		const id = params.id;
		if (!id) {
			return NextResponse.json(
				{ error: "id is required" },
				{
					status: 400,
				},
			);
		}
		// send to backend:8000 to delete the emote set
		const response = await fetch(`http://backend:8000/api/emotesets/${id}/`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});

		// expecting a 204 No Content response
		if (!response.ok) {
			return NextResponse.json(
				{ error: "Failed to delete emote set" },
				{
					status: 500,
				},
			);
		}
		return new NextResponse(null, { status: 204 });
	} catch (error) {
		let errStr = "Failed to delete emote set: unknown error";
		if (error instanceof Error) {
			errStr = `Failed to delete emote set: ${error.toString()}`;
		}
		return NextResponse.json({ error: errStr }, { status: 500 });
	}
};
