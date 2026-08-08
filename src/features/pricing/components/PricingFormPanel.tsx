import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { FormPanel } from "#/components/FormPanel";
import { useUpdatePricingMutation } from "#/features/pricing/mutations/useUpdatePricingMutation";
import {
	type UpdatePricingFormData,
	updatePricingSchema,
} from "#/features/pricing/schemas/update-pricing.schema";
import type { Pricing } from "#/features/pricing/types";
import { getApiFieldError } from "#/lib/api-error";

const OCCUPANCY_TYPE_LABELS: Record<Pricing["occupancyType"], string> = {
	SEAT: "Por assento",
	FULL_CAR: "Carro inteiro",
};

export function PricingFormPanel({
	pricing,
	open,
	onOpenChange,
}: {
	pricing: Pricing;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const updateMutation = useUpdatePricingMutation(pricing.occupancyType);
	const {
		register,
		handleSubmit,
		reset,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<
		z.input<typeof updatePricingSchema>,
		// biome-ignore lint/suspicious/noExplicitAny: RHF context generic, unused
		any,
		z.output<typeof updatePricingSchema>
	>({
		resolver: zodResolver(updatePricingSchema),
		mode: "onChange",
		defaultValues: {
			price: Number(pricing.price),
		},
	});

	async function onSubmit(values: UpdatePricingFormData) {
		try {
			await updateMutation.mutateAsync(values.price);
			onOpenChange(false);
		} catch (error) {
			const { field, message } = getApiFieldError(error);
			if (field === "price") {
				setError("price", { message });
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
			title={`Editar preço — ${OCCUPANCY_TYPE_LABELS[pricing.occupancyType]}`}
			footer={
				<button
					type="submit"
					form="update-pricing-form"
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
				id="update-pricing-form"
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col gap-4"
				noValidate
			>
				<div>
					<label
						htmlFor="price"
						className="mb-1.5 block text-[12px] font-bold tracking-[0.3px] text-neutral-600"
					>
						PREÇO
					</label>
					<input
						id="price"
						type="number"
						step="0.01"
						placeholder="0,00"
						className="h-[50px] w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500"
						{...register("price")}
					/>
					{errors.price && (
						<span className="mt-1.5 block text-[12px] leading-none text-[#9C4A3E]">
							{errors.price.message}
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
