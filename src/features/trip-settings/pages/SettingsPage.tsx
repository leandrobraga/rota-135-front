import { SettingsTabs } from "#/components/SettingsTabs";
import { PaymentSettingsForm } from "#/features/payment-settings/components/PaymentSettingsForm";
import { TripSettingsForm } from "#/features/trip-settings/components/TripSettingsForm";

export function SettingsPage() {
	return (
		<div className="flex flex-col gap-6">
			<h1 className="font-display font-bold text-[22px] text-navy-800">
				Configurações
			</h1>

			<SettingsTabs
				tabs={[
					{ value: "trips", label: "Corridas", content: <TripSettingsForm /> },
					{
						value: "payments",
						label: "Pagamentos",
						content: <PaymentSettingsForm />,
					},
				]}
			/>
		</div>
	);
}
