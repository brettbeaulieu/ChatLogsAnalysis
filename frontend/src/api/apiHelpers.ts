import { BASE_URL } from "./endpoints";

// Request Helpers
async function requestData(
	method: string,
	prefix: string,
	data: FormData | null = null,
	jsonFormat = true,
	params = {},
) {
	// Build query string from params object
	const queryString = new URLSearchParams(params).toString();
	const urlWithArgs = queryString
		? `${BASE_URL}/${prefix}?${queryString}`
		: `${BASE_URL}/${prefix}`;

	// Determine the request body and headers
	let body = null;
	const headers: Headers = new Headers();

	if (data) {
		if (jsonFormat) {
			// Handle JSON formatting
			body = JSON.stringify(data);
			headers.append("Content-Type", "application/json");
		} else {
			body = data;
		}
	}

	// Send request
	// Return response
	return fetch(urlWithArgs, {
		method: method,
		headers: headers,
		body: method === "GET" ? null : body,
	});
}

export async function getData(prefix: string, params = {}) {
	return requestData("GET", prefix, null, false, params);
}

export async function deleteData(prefix: string, params = {}) {
	return requestData("DELETE", prefix, null, false, params);
}

export async function postData(prefix: string, data: FormData, params = {}) {
	return requestData("POST", prefix, data, false, params);
}

export async function putData(prefix: string, data: FormData, params = {}) {
	return requestData("PUT", prefix, data, false, params);
}

export async function patchData(prefix: string, data: FormData, params = {}) {
	return requestData("PATCH", prefix, data, false, params);
}
