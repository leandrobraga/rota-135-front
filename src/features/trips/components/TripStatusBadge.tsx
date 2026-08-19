import type { TripStatus } from "#/features/trips/types";

const TRIP_STATUS_STYLE: Record<TripStatus, string> = {
	// Dourado = precisa de ação do backoffice. Preenchido = mais urgente
	// (motorista/veículo ainda faltam) vs. outline (só falta embarcar).
	AWAITING_PAYMENT: "bg-gold-500 text-white px-2.5 py-1",
	AWAITING_BOARDING:
		"border-[1.5px] border-gold-500 text-gold-500 px-[9px] py-[3px]",
	// Neutro = estado de espera sem ação pendente.
	SCHEDULED: "bg-neutral-300 text-neutral-600 px-2.5 py-1",
	// Verde-sálvia = corrida em curso/concluída. Preenchido = finalizado.
	IN_PROGRESS: "bg-sage-100 text-sage-500 px-2.5 py-1",
	AWAITING_DROPOFF:
		"border-[1.5px] border-sage-500 text-sage-500 px-[9px] py-[3px]",
	COMPLETED: "bg-sage-500 text-white px-2.5 py-1",
	CANCELLED: "bg-[#F1E6CC] text-[#9C4A3E] px-2.5 py-1",
};

const TRIP_STATUS_LABEL: Record<TripStatus, string> = {
	AWAITING_PAYMENT: "Aguardando pagamento",
	SCHEDULED: "Agendada",
	AWAITING_BOARDING: "Aguardando embarque",
	IN_PROGRESS: "Em andamento",
	AWAITING_DROPOFF: "Aguardando desembarque",
	COMPLETED: "Concluída",
	CANCELLED: "Cancelada",
};

export function TripStatusBadge({ status }: { status: TripStatus }) {
	return (
		<span
			className={`rounded-full font-bold text-[11.5px] ${TRIP_STATUS_STYLE[status]}`}
		>
			{TRIP_STATUS_LABEL[status]}
		</span>
	);
}
