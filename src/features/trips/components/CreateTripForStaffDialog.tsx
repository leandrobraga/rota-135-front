import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { FormPanel } from "#/components/FormPanel";
import type { Customer } from "#/features/customer/types";
import { usePricingQuery } from "#/features/pricing/queries/usePricingQuery";
import { ClientPicker } from "#/features/trips/components/ClientPicker";
import { TripBookingTypeBadge } from "#/features/trips/components/TripBookingTypeBadge";
import { VehicleAvailabilityList } from "#/features/trips/components/VehicleAvailabilityList";
import { useCreateTripMutation } from "#/features/trips/mutations/use-create-trip-mutation";
import {
	type CreateTripForStaffFormData,
	createTripForStaffSchema,
} from "#/features/trips/schemas/create-trip-for-staff.schema";
import type { CreateTripResponse } from "#/features/trips/types";
import { getApiFieldError } from "#/lib/api-error";
import { toIsoDatetime } from "#/lib/datetime";
import { formatCurrencyDisplay } from "#/lib/formatters";

const OCCUPANCY_TYPE_OPTIONS: { value: "SEAT" | "FULL_CAR"; label: string }[] =
	[
		{ value: "SEAT", label: "Assento" },
		{ value: "FULL_CAR", label: "Carro inteiro" },
	];

function formatExpiresAt(expiresAt: string): string {
	return new Intl.DateTimeFormat("pt-BR", { timeStyle: "short" }).format(
		new Date(expiresAt),
	);
}

export function CreateTripForStaffDialog({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const createMutation = useCreateTripMutation();
	const { data: pricing } = usePricingQuery();
	const [client, setClient] = useState<Customer | null>(null);
	const [created, setCreated] = useState<CreateTripResponse | null>(null);
	const [copied, setCopied] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<
		z.input<typeof createTripForStaffSchema>,
		// biome-ignore lint/suspicious/noExplicitAny: RHF context generic, unused
		any,
		z.output<typeof createTripForStaffSchema>
	>({
		resolver: zodResolver(createTripForStaffSchema),
		mode: "onChange",
	});

	const occupancyType = watch("occupancyType");
	const scheduledAt = watch("scheduledAt");
	const scheduledAtIso = toIsoDatetime(scheduledAt ?? "") ?? undefined;
	const vehicleId = watch("vehicleId");
	const selectedPrice = pricing?.find(
		(item) => item.occupancyType === occupancyType,
	)?.price;

	async function onSubmit(values: CreateTripForStaffFormData) {
		try {
			const result = await createMutation.mutateAsync(values);
			setCreated(result);
		} catch (error) {
			const { field, message } = getApiFieldError(error);
			if (
				field === "clientId" ||
				field === "occupancyType" ||
				field === "vehicleId"
			) {
				setError(field, { message });
			} else {
				setError("root", { message });
			}
		}
	}

	function handleOpenChange(nextOpen: boolean) {
		if (!nextOpen) {
			reset();
			setClient(null);
			setCreated(null);
			setCopied(false);
		}
		onOpenChange(nextOpen);
	}

	async function handleCopyCode() {
		if (!created) return;
		await navigator.clipboard.writeText(created.payment.brCode);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<FormPanel
			open={open}
			onOpenChange={handleOpenChange}
			title={created ? "Corrida criada — repasse o pagamento" : "Nova corrida"}
			footer={
				created ? (
					<button
						type="button"
						onClick={() => handleOpenChange(false)}
						className="h-[50px] rounded-[10px] bg-gold-500 font-bold text-[15px] text-navy-800"
					>
						Fechar
					</button>
				) : (
					<button
						type="submit"
						form="create-trip-for-staff-form"
						disabled={isSubmitting}
						className={`h-[50px] rounded-[10px] font-bold text-[15px] transition-colors ${
							isSubmitting
								? "cursor-not-allowed bg-[#E8E3D8] text-[#A9A196]"
								: "cursor-pointer bg-gold-500 text-navy-800"
						}`}
					>
						{isSubmitting ? "Criando..." : "Criar corrida"}
					</button>
				)
			}
		>
			{created ? (
				<div className="flex flex-col gap-4">
					<div className="flex items-center gap-2">
						<TripBookingTypeBadge bookingType={created.trip.bookingType} />
					</div>

					<div className="flex justify-center">
						<img
							src={`data:image/png;base64,${created.payment.brCodeBase64}`}
							alt="QR Code do pagamento PIX"
							className="size-[200px] rounded-xl border border-neutral-300"
						/>
					</div>

					<div>
						<label
							htmlFor="pix-copy-paste"
							className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
						>
							CÓDIGO COPIA E COLA
						</label>
						<div className="flex gap-2">
							<input
								id="pix-copy-paste"
								readOnly
								value={created.payment.brCode}
								className="h-[46px] w-full flex-1 rounded-[10px] border-[1.5px] border-neutral-300 bg-cream-100 px-4 font-medium text-[13px] text-navy-800 outline-none"
							/>
							<button
								type="button"
								onClick={handleCopyCode}
								className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[10px] border-[1.5px] border-neutral-300 text-navy-800"
							>
								{copied ? (
									<Check size={18} className="text-sage-500" />
								) : (
									<Copy size={18} />
								)}
							</button>
						</div>
						{copied && (
							<span className="mt-1.5 block text-[12px] text-sage-500">
								Copiado!
							</span>
						)}
					</div>

					<p className="text-[13.5px] text-neutral-600">
						Válido até {formatExpiresAt(created.payment.expiresAt)}
					</p>
				</div>
			) : (
				<form
					id="create-trip-for-staff-form"
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
					noValidate
				>
					<div>
						<span className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600">
							CLIENTE
						</span>
						<ClientPicker
							selected={client}
							onSelect={(customer) => {
								setClient(customer);
								setValue("clientId", customer?.id ?? "", {
									shouldValidate: true,
								});
							}}
						/>
						{errors.clientId && (
							<span className="mt-1.5 block text-[12px] leading-none text-[#9C4A3E]">
								{errors.clientId.message}
							</span>
						)}
					</div>

					{client && (
						<>
							<div>
								<label
									htmlFor="occupancyType"
									className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
								>
									TIPO DE OCUPAÇÃO
								</label>
								<div className="flex items-center gap-3">
									<select
										id="occupancyType"
										className="h-[46px] flex-1 rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500"
										{...register("occupancyType")}
									>
										<option value="">Selecione</option>
										{OCCUPANCY_TYPE_OPTIONS.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</select>
									{selectedPrice !== undefined && (
										<span className="font-display font-bold text-[16px] text-navy-800">
											{formatCurrencyDisplay(selectedPrice)}
										</span>
									)}
								</div>
								{errors.occupancyType && (
									<span className="mt-1.5 block text-[12px] leading-none text-[#9C4A3E]">
										{errors.occupancyType.message}
									</span>
								)}
							</div>

							<div>
								<label
									htmlFor="scheduledAt"
									className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
								>
									DATA E HORA
								</label>
								<input
									id="scheduledAt"
									type="datetime-local"
									className="h-[46px] w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500"
									{...register("scheduledAt")}
								/>
								{errors.scheduledAt && (
									<span className="mt-1.5 block text-[12px] leading-none text-[#9C4A3E]">
										{errors.scheduledAt.message}
									</span>
								)}
							</div>

							<div>
								<span className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600">
									VEÍCULO
								</span>
								<VehicleAvailabilityList
									scheduledAt={scheduledAtIso ?? ""}
									value={vehicleId ?? null}
									onChange={(id) =>
										setValue("vehicleId", id, { shouldValidate: true })
									}
								/>
								{errors.vehicleId && (
									<span className="mt-1.5 block text-[12px] leading-none text-[#9C4A3E]">
										{errors.vehicleId.message}
									</span>
								)}
							</div>

							<div>
								<label
									htmlFor="pickupAddress"
									className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
								>
									ENDEREÇO DE EMBARQUE
								</label>
								<input
									id="pickupAddress"
									type="text"
									placeholder="Endereço de embarque"
									className="h-[46px] w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500"
									{...register("pickupAddress")}
								/>
								{errors.pickupAddress && (
									<span className="mt-1.5 block text-[12px] leading-none text-[#9C4A3E]">
										{errors.pickupAddress.message}
									</span>
								)}
							</div>

							<div>
								<label
									htmlFor="dropoffAddress"
									className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
								>
									ENDEREÇO DE DESEMBARQUE
								</label>
								<input
									id="dropoffAddress"
									type="text"
									placeholder="Endereço de desembarque"
									className="h-[46px] w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500"
									{...register("dropoffAddress")}
								/>
								{errors.dropoffAddress && (
									<span className="mt-1.5 block text-[12px] leading-none text-[#9C4A3E]">
										{errors.dropoffAddress.message}
									</span>
								)}
							</div>
						</>
					)}

					{errors.root && (
						<div className="rounded-[10px] bg-[#F1E6CC] px-3.5 py-2.5 text-center text-[13px] font-medium text-[#9C4A3E]">
							{errors.root.message}
						</div>
					)}
				</form>
			)}
		</FormPanel>
	);
}
