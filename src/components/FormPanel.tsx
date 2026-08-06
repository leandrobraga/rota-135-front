import { X } from "lucide-react";
import { Dialog } from "radix-ui";
import type { ReactNode } from "react";

export function FormPanel({
	open,
	onOpenChange,
	title,
	children,
	footer,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	children: ReactNode;
	footer?: ReactNode;
}) {
	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className="fixed inset-0 z-40 bg-navy-900/45 data-[state=open]:animate-[overlayIn_0.2s_ease]" />
				<Dialog.Content
					onPointerDownOutside={(event) => event.preventDefault()}
					onInteractOutside={(event) => event.preventDefault()}
					className={[
						"fixed z-50 flex flex-col gap-4 bg-cream-100 outline-none",
						"inset-x-0 bottom-0 max-h-[90vh] rounded-t-2xl p-6",
						"data-[state=open]:animate-[sheetIn_0.2s_ease]",
						"lg:inset-y-0 lg:right-0 lg:left-auto lg:h-screen lg:max-h-none lg:w-[460px] lg:rounded-none lg:p-7",
						"lg:data-[state=open]:animate-[drawerIn_0.2s_ease]",
					].join(" ")}
				>
					<div className="flex items-center justify-between">
						<Dialog.Title className="font-display font-bold text-[20px] text-navy-800">
							{title}
						</Dialog.Title>
						<Dialog.Close asChild>
							<button
								type="button"
								aria-label="Fechar"
								className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 bg-white text-navy-800"
							>
								<X size={16} strokeWidth={2} />
							</button>
						</Dialog.Close>
					</div>

					<div className="flex-1 overflow-y-auto">{children}</div>

					{footer && <div className="flex flex-col gap-2.5">{footer}</div>}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
