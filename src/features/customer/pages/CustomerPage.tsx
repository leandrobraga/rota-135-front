import { CustomerList } from "#/features/customer/components/CustomerList";

export function CustomerPage() {
	return (
		<div className="flex flex-col gap-6">
			<h1 className="font-display font-bold text-[22px] text-navy-800">
				Clientes
			</h1>

			<CustomerList />
		</div>
	);
}
