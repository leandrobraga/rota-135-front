import { AlertDialog } from "radix-ui";

export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel,
	cancelLabel = "Cancelar",
	onConfirm,
	isConfirming,
	variant = "default",
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	confirmLabel: string;
	cancelLabel?: string;
	onConfirm: () => void;
	isConfirming?: boolean;
	variant?: "default" | "destructive";
}) {
	return (
		<AlertDialog.Root open={open} onOpenChange={onOpenChange}>
			<AlertDialog.Portal>
				<AlertDialog.Overlay className="fixed inset-0 z-40 bg-navy-900/45 data-[state=open]:animate-[overlayIn_0.2s_ease]" />
				<AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2.5rem)] max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-cream-100 p-6 outline-none data-[state=open]:animate-[sheetIn_0.2s_ease]">
					<AlertDialog.Title className="font-display font-bold text-[18px] text-navy-800">
						{title}
					</AlertDialog.Title>
					<AlertDialog.Description className="mt-2 text-[13.5px] text-neutral-600">
						{description}
					</AlertDialog.Description>

					<div className="mt-6 flex flex-col gap-2.5">
						<AlertDialog.Action asChild>
							<button
								type="button"
								onClick={onConfirm}
								disabled={isConfirming}
								className={`h-[46px] rounded-[10px] font-bold text-[14.5px] transition-colors disabled:cursor-not-allowed ${
									variant === "destructive"
										? "bg-[#9C4A3E] text-white disabled:opacity-60"
										: "bg-gold-500 text-navy-800 disabled:opacity-60"
								}`}
							>
								{isConfirming ? "Aguarde..." : confirmLabel}
							</button>
						</AlertDialog.Action>
						<AlertDialog.Cancel asChild>
							<button
								type="button"
								className="h-[46px] rounded-[10px] border border-neutral-300 bg-white font-bold text-[14.5px] text-navy-800"
							>
								{cancelLabel}
							</button>
						</AlertDialog.Cancel>
					</div>
				</AlertDialog.Content>
			</AlertDialog.Portal>
		</AlertDialog.Root>
	);
}
