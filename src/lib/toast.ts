import { useToastStore } from "#/lib/stores/toast-store";

export const toast = {
	success: (message: string) => {
		useToastStore.getState().addToast(message, "success");
	},
	info: (message: string) => {
		useToastStore.getState().addToast(message, "info");
	},
	error: (message: string) => {
		useToastStore.getState().addToast(message, "error");
	},
};
