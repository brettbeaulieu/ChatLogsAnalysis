// TODO: should return a ticket id after requesting rustlog data grab
export const POST = async (request: Request) => {
	const { repo_name, channel_name, start_date, end_date } =
		await request.json();

	if (!repo_name || !channel_name || !start_date || !end_date) {
		return new Response(
			JSON.stringify({ error: "Missing required parameters" }),
			{ status: 400 },
		);
	}
	try {
		const response = await fetch("http://backend:8000/api/rustlog/logs/", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ repo_name, channel_name, start_date, end_date }),
		});
		if (!response.ok) {
			throw new Error(`Error fetching Rustlog data: ${response.statusText}`);
		}
		const data = await response.json();
		return new Response(JSON.stringify(data), { status: 200 });
	} catch (error) {
		console.error("Error fetching Rustlog data:", error);
		return new Response(
			JSON.stringify({ error: "Failed to fetch Rustlog data" }),
			{ status: 500 },
		);
	}
};
