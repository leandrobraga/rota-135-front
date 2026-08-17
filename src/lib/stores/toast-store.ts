import { create } from "zustand";

export type ToastVariant = "success" | "info" | "error";

type Toast = {
	id: string;
	message: string;
	variant: ToastVariant;
};

type ToastState = {
	toasts: Toast[];
	addToast: (message: string, variant: ToastVariant) => void;
	removeToast: (id: string) => void;
};

export const useToastStore = create<ToastState>((set) => ({
	toasts: [],
	addToast: (message, variant) =>
		set((state) => ({
			toasts: [...state.toasts, { id: crypto.randomUUID(), message, variant }],
		})),
	removeToast: (id) =>
		set((state) => ({
			toasts: state.toasts.filter((toast) => toast.id !== id),
		})),
}));
