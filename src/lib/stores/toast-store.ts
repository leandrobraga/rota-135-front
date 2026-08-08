import { create } from "zustand";

type Toast = {
	id: string;
	message: string;
};

type ToastState = {
	toasts: Toast[];
	addToast: (message: string) => void;
	removeToast: (id: string) => void;
};

export const useToastStore = create<ToastState>((set) => ({
	toasts: [],
	addToast: (message) =>
		set((state) => ({
			toasts: [...state.toasts, { id: crypto.randomUUID(), message }],
		})),
	removeToast: (id) =>
		set((state) => ({
			toasts: state.toasts.filter((toast) => toast.id !== id),
		})),
}));
