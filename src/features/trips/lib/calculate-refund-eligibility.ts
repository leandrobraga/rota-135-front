export type RefundEligibility = "FULL" | "PARTIAL" | "NONE";

export function calculateRefundEligibility(
	scheduledAt: string,
	fullRefundWindowHours: number,
	partialRefundWindowHours: number,
): RefundEligibility {
	const hoursUntilScheduled =
		(new Date(scheduledAt).getTime() - Date.now()) / (1000 * 60 * 60);

	if (hoursUntilScheduled >= fullRefundWindowHours) return "FULL";
	if (hoursUntilScheduled >= partialRefundWindowHours) return "PARTIAL";
	return "NONE";
}
