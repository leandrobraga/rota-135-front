import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { FormPanel } from "#/components/FormPanel";
import { useCreateTripScheduleMutation } from "#/features/trip-schedules/mutations/use-create-trip-schedule-mutation";
import { useUpdateTripScheduleMutation } from "#/features/trip-schedules/mutations/use-update-trip-schedule-mutation";
import { useTripScheduleAvailabilityQuery } from "#/features/trip-schedules/queries/use-trip-schedule-availability-query";
import {
	type CreateTripScheduleFormData,
	createTripScheduleSchema,
} from "#/features/trip-schedules/schemas/create-trip-schedule.schema";
import {
	type UpdateTripScheduleFormData,
	updateTripScheduleSchema,
} from "#/features/trip-schedules/schemas/update-trip-schedule.schema";
import type {
	TripSchedule,
	TripScheduleAvailability,
} from "#/features/trip-schedules/types";
import { getApiFieldError } from "#/lib/api-error";

const DIRECTION_OPTIONS: { value: "MOC_TO_BH" | "BH_TO_MOC"; label: string }[] =
	[
		{ value: "MOC_TO_BH", label: "Montes Claros → Belo Horizonte" },
		{ value: "BH_TO_MOC", label: "Belo Horizonte → Montes Claros" },
	];

const DIRECTION_LABELS: Record<"MOC_TO_BH" | "BH_TO_MOC", string> = {
	MOC_TO_BH: "Montes Claros → Belo Horizonte",
	BH_TO_MOC: "Belo Horizonte → Montes Claros",
};

function formatScheduledAtReadOnly(scheduledAt: string): string {
	return new Date(scheduledAt).toLocaleString("pt-BR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

// Motorista/veículo atuais do TripSchedule vêm available:false na consulta
// (o backend conta o próprio agendamento como ocupação) — força true pros
// dois pra não bloquear a opção óbvia de "manter o mesmo".
function withCurrentAvailable(
	availability: TripScheduleAvailability | undefined,
	tripSchedule: TripSchedule,
): TripScheduleAvailability | undefined {
	if (!availability) return availability;
	return {
		drivers: availability.drivers.map((driver) =>
			driver.id === tripSchedule.driver.id
				? { ...driver, available: true }
				: driver,
		),
		vehicles: availability.vehicles.map((vehicle) =>
			vehicle.id === tripSchedule.vehicle.id
				? { ...vehicle, available: true }
				: vehicle,
		),
	};
}

type Props =
	| {
			mode: "create";
			tripSchedule?: undefined;
			open: boolean;
			onOpenChange: (open: boolean) => void;
	  }
	| {
			mode: "edit";
			tripSchedule: TripSchedule;
			open: boolean;
			onOpenChange: (open: boolean) => void;
	  };

export function TripScheduleFormPanel(props: Props) {
	return props.mode === "create" ? (
		<CreateTripScheduleForm
			open={props.open}
			onOpenChange={props.onOpenChange}
		/>
	) : (
		<EditTripScheduleForm
			tripSchedule={props.tripSchedule}
			open={props.open}
			onOpenChange={props.onOpenChange}
		/>
	);
}

function CreateTripScheduleForm({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const createMutation = useCreateTripScheduleMutation();
	const {
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<
		z.input<typeof createTripScheduleSchema>,
		// biome-ignore lint/suspicious/noExplicitAny: RHF context generic, unused
		any,
		z.output<typeof createTripScheduleSchema>
	>({
		resolver: zodResolver(createTripScheduleSchema),
		mode: "onChange",
	});

	const scheduledAt = watch("scheduledAt");

	const scheduledAtIso = scheduledAt ? new Date(scheduledAt).toISOString() : "";
	const { data: availability, isLoading: isLoadingAvailability } =
		useTripScheduleAvailabilityQuery({ scheduledAt: scheduledAtIso });

	async function onSubmit(values: CreateTripScheduleFormData) {
		try {
			await createMutation.mutateAsync({
				...values,
				scheduledAt: new Date(values.scheduledAt).toISOString(),
			});
			reset();
			onOpenChange(false);
		} catch (error) {
			const { field, message } = getApiFieldError(error);
			if (
				field === "direction" ||
				field === "scheduledAt" ||
				field === "vehicleId" ||
				field === "driverId"
			) {
				setError(field, { message });
			} else {
				setError("root", { message });
			}
		}
	}

	function handleOpenChange(nextOpen: boolean) {
		if (!nextOpen) reset();
		onOpenChange(nextOpen);
	}

	return (
		<FormPanel
			open={open}
			onOpenChange={handleOpenChange}
			title="Novo agendamento"
			footer={
				<button
					type="submit"
					form="create-trip-schedule-form"
					disabled={isSubmitting}
					className={`h-[50px] rounded-[10px] font-bold text-[15px] transition-colors ${
						isSubmitting
							? "cursor-not-allowed bg-[#E8E3D8] text-[#A9A196]"
							: "cursor-pointer bg-gold-500 text-navy-800"
					}`}
				>
					{isSubmitting ? "Criando..." : "Criar agendamento"}
				</button>
			}
		>
			<form
				id="create-trip-schedule-form"
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
				noValidate
			>
				<div>
					<label
						htmlFor="direction"
						className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
					>
						DIREÇÃO
					</label>
					<select
						id="direction"
						className="h-[50px] w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500"
						{...register("direction")}
					>
						<option value="">Selecione</option>
						{DIRECTION_OPTIONS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
					{errors.direction && (
						<span className="mt-1.5 block text-[12px] leading-none text-[#9C4A3E]">
							{errors.direction.message}
						</span>
					)}
				</div>

				<div>
					<label
						htmlFor="scheduledAt"
						className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
					>
						DATA E HORÁRIO
					</label>
					<input
						id="scheduledAt"
						type="datetime-local"
						className="h-[50px] w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500"
						{...register("scheduledAt", {
							onChange: () => {
								setValue("vehicleId", "", { shouldValidate: true });
								setValue("driverId", "", { shouldValidate: true });
							},
						})}
					/>
					{errors.scheduledAt && (
						<span className="mt-1.5 block text-[12px] leading-none text-[#9C4A3E]">
							{errors.scheduledAt.message}
						</span>
					)}
				</div>

				{scheduledAt && (
					<>
						<div>
							<label
								htmlFor="vehicleId"
								className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
							>
								VEÍCULO
							</label>
							<select
								id="vehicleId"
								disabled={isLoadingAvailability}
								className="h-[50px] w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500 disabled:opacity-60"
								{...register("vehicleId")}
							>
								<option value="">
									{isLoadingAvailability ? "Carregando..." : "Selecione"}
								</option>
								{(availability?.vehicles ?? []).map((vehicle) => (
									<option
										key={vehicle.id}
										value={vehicle.id}
										disabled={!vehicle.available}
									>
										{vehicle.plate} · {vehicle.brand} {vehicle.model}
										{!vehicle.available ? " (indisponível)" : ""}
									</option>
								))}
							</select>
							{errors.vehicleId && (
								<span className="mt-1.5 block text-[12px] leading-none text-[#9C4A3E]">
									{errors.vehicleId.message}
								</span>
							)}
						</div>

						<div>
							<label
								htmlFor="driverId"
								className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
							>
								MOTORISTA
							</label>
							<select
								id="driverId"
								disabled={isLoadingAvailability}
								className="h-[50px] w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500 disabled:opacity-60"
								{...register("driverId")}
							>
								<option value="">
									{isLoadingAvailability ? "Carregando..." : "Selecione"}
								</option>
								{(availability?.drivers ?? []).map((driver) => (
									<option
										key={driver.id}
										value={driver.id}
										disabled={!driver.available}
									>
										{driver.name}
										{!driver.available ? " (indisponível)" : ""}
									</option>
								))}
							</select>
							{errors.driverId && (
								<span className="mt-1.5 block text-[12px] leading-none text-[#9C4A3E]">
									{errors.driverId.message}
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
		</FormPanel>
	);
}

function EditTripScheduleForm({
	tripSchedule,
	open,
	onOpenChange,
}: {
	tripSchedule: TripSchedule;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const updateMutation = useUpdateTripScheduleMutation(tripSchedule.id);
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<
		z.input<typeof updateTripScheduleSchema>,
		// biome-ignore lint/suspicious/noExplicitAny: RHF context generic, unused
		any,
		z.output<typeof updateTripScheduleSchema>
	>({
		resolver: zodResolver(updateTripScheduleSchema),
		mode: "onChange",
		defaultValues: {
			vehicleId: tripSchedule.vehicle.id,
			driverId: tripSchedule.driver.id,
		},
	});

	const { data: rawAvailability, isLoading: isLoadingAvailability } =
		useTripScheduleAvailabilityQuery({
			scheduledAt: tripSchedule.scheduledAt,
		});
	const availability = withCurrentAvailable(rawAvailability, tripSchedule);

	async function onSubmit(values: UpdateTripScheduleFormData) {
		if (!values.vehicleId && !values.driverId) {
			setError("root", {
				message: "Selecione ao menos um veículo ou motorista pra atualizar",
			});
			return;
		}

		try {
			await updateMutation.mutateAsync(values);
			onOpenChange(false);
		} catch (error) {
			const { field, message } = getApiFieldError(error);
			if (field === "vehicleId" || field === "driverId") {
				setError(field, { message });
			} else {
				setError("root", { message });
			}
		}
	}

	function handleOpenChange(nextOpen: boolean) {
		if (!nextOpen) reset();
		onOpenChange(nextOpen);
	}

	return (
		<FormPanel
			open={open}
			onOpenChange={handleOpenChange}
			title="Editar agendamento"
			footer={
				<button
					type="submit"
					form="edit-trip-schedule-form"
					disabled={isSubmitting}
					className={`h-[50px] rounded-[10px] font-bold text-[15px] transition-colors ${
						isSubmitting
							? "cursor-not-allowed bg-[#E8E3D8] text-[#A9A196]"
							: "cursor-pointer bg-gold-500 text-navy-800"
					}`}
				>
					{isSubmitting ? "Salvando..." : "Salvar alterações"}
				</button>
			}
		>
			<form
				id="edit-trip-schedule-form"
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
				noValidate
			>
				<div>
					<span className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600">
						DIREÇÃO
					</span>
					<div className="flex h-[50px] w-full items-center rounded-[10px] border-[1.5px] border-dashed border-neutral-300 bg-cream-50 px-4 font-medium text-[14.5px] text-neutral-600">
						{DIRECTION_LABELS[tripSchedule.direction]}
					</div>
					<span className="mt-1.5 block text-[11.5px] text-neutral-500">
						Direção não pode ser alterada após a criação.
					</span>
				</div>

				<div>
					<span className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600">
						DATA E HORÁRIO
					</span>
					<div className="flex h-[50px] w-full items-center rounded-[10px] border-[1.5px] border-dashed border-neutral-300 bg-cream-50 px-4 font-medium text-[14.5px] text-neutral-600">
						{formatScheduledAtReadOnly(tripSchedule.scheduledAt)}
					</div>
					<span className="mt-1.5 block text-[11.5px] text-neutral-500">
						Data/horário não pode ser alterado após a criação.
					</span>
				</div>

				<div>
					<label
						htmlFor="vehicleId"
						className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
					>
						VEÍCULO
					</label>
					<select
						id="vehicleId"
						disabled={isLoadingAvailability}
						className="h-[50px] w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500 disabled:opacity-60"
						{...register("vehicleId")}
					>
						<option value="">
							{isLoadingAvailability ? "Carregando..." : "Selecione"}
						</option>
						{(availability?.vehicles ?? []).map((vehicle) => (
							<option
								key={vehicle.id}
								value={vehicle.id}
								disabled={!vehicle.available}
							>
								{vehicle.plate} · {vehicle.brand} {vehicle.model}
								{!vehicle.available ? " (indisponível)" : ""}
							</option>
						))}
					</select>
					{errors.vehicleId && (
						<span className="mt-1.5 block text-[12px] leading-none text-[#9C4A3E]">
							{errors.vehicleId.message}
						</span>
					)}
				</div>

				<div>
					<label
						htmlFor="driverId"
						className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
					>
						MOTORISTA
					</label>
					<select
						id="driverId"
						disabled={isLoadingAvailability}
						className="h-[50px] w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500 disabled:opacity-60"
						{...register("driverId")}
					>
						<option value="">
							{isLoadingAvailability ? "Carregando..." : "Selecione"}
						</option>
						{(availability?.drivers ?? []).map((driver) => (
							<option
								key={driver.id}
								value={driver.id}
								disabled={!driver.available}
							>
								{driver.name}
								{!driver.available ? " (indisponível)" : ""}
							</option>
						))}
					</select>
					{errors.driverId && (
						<span className="mt-1.5 block text-[12px] leading-none text-[#9C4A3E]">
							{errors.driverId.message}
						</span>
					)}
				</div>

				{errors.root && (
					<div className="rounded-[10px] bg-[#F1E6CC] px-3.5 py-2.5 text-center text-[13px] font-medium text-[#9C4A3E]">
						{errors.root.message}
					</div>
				)}
			</form>
		</FormPanel>
	);
}
