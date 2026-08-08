import { CheckCircle } from "lucide-react";
import { Toast } from "radix-ui";
import { useToastStore } from "#/lib/stores/toast-store";

export function Toaster() {
	const toasts = useToastStore((state) => state.toasts);
	const removeToast = useToastStore((state) => state.removeToast);

	return (
		<Toast.Provider swipeDirection="right">
			{toasts.map((toast) => (
				<Toast.Root
					key={toast.id}
					duration={4000}
					onOpenChange={(open) => {
						if (!open) removeToast(toast.id);
					}}
					className="flex items-center gap-3 rounded-2xl border-l-4 border-sage-500 bg-white px-4 py-3.5 shadow-lg data-[state=open]:animate-[toastIn_0.2s_ease] data-[state=closed]:animate-[toastOut_0.2s_ease] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=end]:animate-[toastSwipeOut_0.2s_ease]"
				>
					<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sage-100">
						<CheckCircle size={18} strokeWidth={2} className="text-sage-500" />
					</div>
					<Toast.Description className="text-[14px] font-semibold text-navy-800">
						{toast.message}
					</Toast.Description>
				</Toast.Root>
			))}
			<Toast.Viewport className="fixed top-6 right-6 z-[100] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2.5 outline-none" />
		</Toast.Provider>
	);
}
