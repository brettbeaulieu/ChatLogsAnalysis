import type { DateValue } from "@mantine/dates";

// Utility function to convert a Date object to an ISO date string (YYYY-MM-DD)
export function toIsoDateString(date: DateValue): string {
	return date ? new Date(date).toISOString().split("T")[0] : "";
}
