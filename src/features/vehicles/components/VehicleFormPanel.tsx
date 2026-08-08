import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { type UseFormRegisterReturn, useForm } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";
import type { z } from "zod";
import { ConfirmDialog } from "#/components/ConfirmDialog";
import { FormPanel } from "#/components/FormPanel";
import { useActivateVehicleMutation } from "#/features/vehicles/mutations/use-activate-vehicle-mutation";
import { useCreateVehicleMutation } from "#/features/vehicles/mutations/use-create-vehicle-mutation";
import { useDeactivateVehicleMutation } from "#/features/vehicles/mutations/use-deactivate-vehicle-mutation";
import { useUpdateVehicleMutation } from "#/features/vehicles/mutations/use-update-vehicle-mutation";
import {
	type CreateVehicleFormData,
	createVehicleSchema,
} from "#/features/vehicles/schemas/create-vehicle.schema";
import {
	type UpdateVehicleFormData,
	updateVehicleSchema,
} from "#/features/vehicles/schemas/update-vehicle.schema";
import type { Vehicle } from "#/features/vehicles/types";
import { getApiFieldError } from "#/lib/api-error";

const VEHICLE_FORM_FIELDS = [
	"plate",
	"brand",
	"model",
	"year",
	"capacity",
	"color",
] as const;
type VehicleFormField = (typeof VEHICLE_FORM_FIELDS)[number];

function isVehicleFormField(
	field: string | undefined,
): field is VehicleFormField {
	return (VEHICLE_FORM_FIELDS as readonly string[]).includes(field ?? "");
}

type Props =
	| {
			mode: "create";
			vehicle?: undefined;
			open: boolean;
			onOpenChange: (open: boolean) => void;
	  }
	| {
			mode: "edit";
			vehicle: Vehicle;
			open: boolean;
			onOpenChange: (open: boolean) => void;
	  };

export function VehicleFormPanel(props: Props) {
	return props.mode === "create" ? (
		<CreateVehicleForm open={props.open} onOpenChange={props.onOpenChange} />
	) : (
		<EditVehicleForm
			vehicle={props.vehicle}
			open={props.open}
			onOpenChange={props.onOpenChange}
		/>
	);
}

function CreateVehicleForm({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const createMutation = useCreateVehicleMutation();
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<
		z.input<typeof createVehicleSchema>,
		// biome-ignore lint/suspicious/noExplicitAny: RHF context generic, unused
		any,
		z.output<typeof createVehicleSchema>
	>({
		resolver: zodResolver(createVehicleSchema),
		mode: "onChange",
	});
	const registerWithMask = useHookFormMask(register);

	async function onSubmit(values: CreateVehicleFormData) {
		try {
			await createMutation.mutateAsync(values);
			reset();
			onOpenChange(false);
		} catch (error) {
			const { field, message } = getApiFieldError(error);
			if (isVehicleFormField(field)) {
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
			title="Novo veículo"
			footer={
				<button
					type="submit"
					form="create-vehicle-form"
					disabled={isSubmitting}
					className={`h-[50px] rounded-[10px] font-bold text-[15px] transition-colors ${
						isSubmitting
							? "cursor-not-allowed bg-[#E8E3D8] text-[#A9A196]"
							: "cursor-pointer bg-gold-500 text-navy-800"
					}`}
				>
					{isSubmitting ? "Salvando..." : "Cadastrar veículo"}
				</button>
			}
		>
			<form
				id="create-vehicle-form"
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
				noValidate
			>
				<TextField
					id="plate"
					label="Placa"
					placeholder="ABC1D23"
					error={errors.plate?.message}
					register={registerWithMask("plate", "aaa9*99", {
						autoUnmask: true,
						casing: "upper",
					})}
				/>
				<TextField
					id="brand"
					label="Marca"
					placeholder="Toyota"
					error={errors.brand?.message}
					register={register("brand")}
				/>
				<TextField
					id="model"
					label="Modelo"
					placeholder="Corolla"
					error={errors.model?.message}
					register={register("model")}
				/>
				<TextField
					id="year"
					label="Ano"
					type="number"
					placeholder="2024"
					error={errors.year?.message}
					register={register("year")}
				/>
				<TextField
					id="capacity"
					label="Capacidade"
					type="number"
					placeholder="5"
					error={errors.capacity?.message}
					register={register("capacity")}
				/>
				<TextField
					id="color"
					label="Cor"
					placeholder="Opcional"
					error={errors.color?.message}
					register={register("color")}
				/>
				{errors.root && (
					<div className="rounded-[10px] bg-[#F1E6CC] px-3.5 py-2.5 text-center text-[13px] font-medium text-[#9C4A3E]">
						{errors.root.message}
					</div>
				)}
			</form>
		</FormPanel>
	);
}

function EditVehicleForm({
	vehicle,
	open,
	onOpenChange,
}: {
	vehicle: Vehicle;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [confirmingDeactivate, setConfirmingDeactivate] = useState(false);
	const updateMutation = useUpdateVehicleMutation(vehicle.id);
	const deactivateMutation = useDeactivateVehicleMutation(vehicle.id);
	const activateMutation = useActivateVehicleMutation(vehicle.id);
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<
		z.input<typeof updateVehicleSchema>,
		// biome-ignore lint/suspicious/noExplicitAny: RHF context generic, unused
		any,
		z.output<typeof updateVehicleSchema>
	>({
		resolver: zodResolver(updateVehicleSchema),
		mode: "onChange",
		defaultValues: {
			plate: vehicle.plate,
			brand: vehicle.brand,
			model: vehicle.model,
			year: vehicle.year,
			capacity: vehicle.capacity,
			color: vehicle.color ?? "",
		},
	});
	const registerWithMask = useHookFormMask(register);

	async function onSubmit(values: UpdateVehicleFormData) {
		try {
			await updateMutation.mutateAsync(values);
			onOpenChange(false);
		} catch (error) {
			const { field, message } = getApiFieldError(error);
			if (isVehicleFormField(field)) {
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
		<>
			<FormPanel
				open={open}
				onOpenChange={handleOpenChange}
				title="Editar veículo"
				footer={
					<>
						<button
							type="submit"
							form="edit-vehicle-form"
							disabled={isSubmitting}
							className={`h-[50px] rounded-[10px] font-bold text-[15px] transition-colors ${
								isSubmitting
									? "cursor-not-allowed bg-[#E8E3D8] text-[#A9A196]"
									: "cursor-pointer bg-gold-500 text-navy-800"
							}`}
						>
							{isSubmitting ? "Salvando..." : "Salvar alterações"}
						</button>
						{vehicle.active ? (
							<button
								type="button"
								onClick={() => setConfirmingDeactivate(true)}
								className="h-[50px] rounded-[10px] border border-[#9C4A3E] font-bold text-[15px] text-[#9C4A3E]"
							>
								Desativar veículo
							</button>
						) : (
							<button
								type="button"
								onClick={() =>
									activateMutation.mutate(undefined, {
										onSuccess: () => onOpenChange(false),
									})
								}
								disabled={activateMutation.isPending}
								className="h-[50px] rounded-[10px] border border-sage-500 font-bold text-[15px] text-sage-500 disabled:cursor-not-allowed disabled:opacity-50"
							>
								{activateMutation.isPending
									? "Reativando..."
									: "Reativar veículo"}
							</button>
						)}
					</>
				}
			>
				<form
					id="edit-vehicle-form"
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
					noValidate
				>
					<TextField
						id="plate"
						label="Placa"
						placeholder="ABC1D23"
						error={errors.plate?.message}
						register={registerWithMask("plate", "aaa9*99", {
							autoUnmask: true,
							casing: "upper",
						})}
					/>
					<TextField
						id="brand"
						label="Marca"
						placeholder="Toyota"
						error={errors.brand?.message}
						register={register("brand")}
					/>
					<TextField
						id="model"
						label="Modelo"
						placeholder="Corolla"
						error={errors.model?.message}
						register={register("model")}
					/>
					<TextField
						id="year"
						label="Ano"
						type="number"
						placeholder="2024"
						error={errors.year?.message}
						register={register("year")}
					/>
					<TextField
						id="capacity"
						label="Capacidade"
						type="number"
						placeholder="5"
						error={errors.capacity?.message}
						register={register("capacity")}
					/>
					<TextField
						id="color"
						label="Cor"
						placeholder="Opcional"
						error={errors.color?.message}
						register={register("color")}
					/>
					{errors.root && (
						<div className="rounded-[10px] bg-[#F1E6CC] px-3.5 py-2.5 text-center text-[13px] font-medium text-[#9C4A3E]">
							{errors.root.message}
						</div>
					)}
				</form>
			</FormPanel>

			<ConfirmDialog
				open={confirmingDeactivate}
				onOpenChange={setConfirmingDeactivate}
				title="Desativar veículo"
				description={`Tem certeza que deseja desativar o veículo ${vehicle.plate}? O cadastro não será excluído.`}
				confirmLabel="Desativar"
				variant="destructive"
				isConfirming={deactivateMutation.isPending}
				onConfirm={() => {
					deactivateMutation.mutate(undefined, {
						onSuccess: () => {
							setConfirmingDeactivate(false);
							onOpenChange(false);
						},
					});
				}}
			/>
		</>
	);
}

function TextField({
	id,
	label,
	type = "text",
	placeholder,
	error,
	register,
}: {
	id: string;
	label: string;
	type?: string;
	placeholder?: string;
	error?: string;
	register: UseFormRegisterReturn;
}) {
	return (
		<div>
			<label
				htmlFor={id}
				className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
			>
				{label.toUpperCase()}
			</label>
			<input
				id={id}
				type={type}
				placeholder={placeholder}
				className="h-[50px] w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500"
				{...register}
			/>
			{error && (
				<span className="mt-1.5 block text-[12px] leading-none text-[#9C4A3E]">
					{error}
				</span>
			)}
		</div>
	);
}
