import { useCustomerCreditsQuery } from "#/features/customer/queries/use-customer-credits-query";
import type { CustomerCredit } from "#/features/customer/types";
import { formatCurrencyDisplay } from "#/lib/formatters";

const SOURCE_LABEL: Record<CustomerCredit["source"], string> = {
	CANCELLATION_AUTOMATIC: "Cancelamento automático",
	ADMIN_GRANT: "Concedido manualmente",
};

const SOURCE_STYLE: Record<CustomerCredit["source"], string> = {
	CANCELLATION_AUTOMATIC: "bg-[#F1E6CC] text-gold-500",
	ADMIN_GRANT: "bg-navy-800/10 text-navy-800",
};

export function CreditSelector({
	customerId,
	value,
	onChange,
}: {
	customerId: string;
	value: string[];
	onChange: (creditIds: string[]) => void;
}) {
	const { data: credits } = useCustomerCreditsQuery(customerId);

	const available = (credits ?? []).filter(
		(credit) => Number(credit.remainingAmount) > 0,
	);

	if (available.length === 0) return null;

	function toggle(creditId: string) {
		if (value.includes(creditId)) {
			onChange(value.filter((id) => id !== creditId));
		} else {
			onChange([...value, creditId]);
		}
	}

	return (
		<div>
			<span className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600">
				CRÉDITOS DISPONÍVEIS
			</span>
			<ul className="flex flex-col gap-2">
				{available.map((credit) => (
					<li key={credit.id}>
						<label className="flex cursor-pointer items-center justify-between gap-3 rounded-[10px] border-[1.5px] border-neutral-300 px-4 py-3">
							<span className="flex items-center gap-2.5">
								<input
									type="checkbox"
									checked={value.includes(credit.id)}
									onChange={() => toggle(credit.id)}
									className="accent-gold-500"
								/>
								<span className="text-[14.5px] text-navy-800">
									{formatCurrencyDisplay(credit.remainingAmount)}
								</span>
							</span>
							<span
								className={`rounded-full px-2.5 py-1 font-bold text-[11.5px] ${SOURCE_STYLE[credit.source]}`}
							>
								{SOURCE_LABEL[credit.source]}
							</span>
						</label>
					</li>
				))}
			</ul>
		</div>
	);
}
