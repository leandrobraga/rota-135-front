import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Toast } from "radix-ui";
import type { ToastVariant } from "#/lib/stores/toast-store";
import { useToastStore } from "#/lib/stores/toast-store";

const VARIANT_STYLE: Record<
	ToastVariant,
	{
		border: string;
		iconBg: string;
		iconColor: string;
		icon: typeof CheckCircle;
	}
> = {
	success: {
		border: "border-sage-500",
		iconBg: "bg-sage-100",
		iconColor: "text-sage-500",
		icon: CheckCircle,
	},
	info: {
		border: "border-gold-500",
		iconBg: "bg-[#F1E6CC]",
		iconColor: "text-gold-500",
		icon: Clock,
	},
	error: {
		border: "border-[#9C4A3E]",
		iconBg: "bg-[#F1E6CC]",
		iconColor: "text-[#9C4A3E]",
		icon: AlertTriangle,
	},
};

export function Toaster() {
	const toasts = useToastStore((state) => state.toasts);
	const removeToast = useToastStore((state) => state.removeToast);

	return (
		<Toast.Provider swipeDirection="right">
			{toasts.map((toast) => {
				const {
					border,
					iconBg,
					iconColor,
					icon: Icon,
				} = VARIANT_STYLE[toast.variant];

				return (
					<Toast.Root
						key={toast.id}
						duration={4000}
						onOpenChange={(open) => {
							if (!open) removeToast(toast.id);
						}}
						className={`flex items-center gap-3 rounded-2xl border-l-4 bg-white px-4 py-3.5 shadow-lg data-[state=open]:animate-[toastIn_0.2s_ease] data-[state=closed]:animate-[toastOut_0.2s_ease] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=end]:animate-[toastSwipeOut_0.2s_ease] ${border}`}
					>
						<div
							className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconBg}`}
						>
							<Icon size={18} strokeWidth={2} className={iconColor} />
						</div>
						<Toast.Description className="text-[14px] font-semibold text-navy-800">
							{toast.message}
						</Toast.Description>
					</Toast.Root>
				);
			})}
			<Toast.Viewport className="fixed top-6 right-6 z-[100] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2.5 outline-none" />
		</Toast.Provider>
	);
}
