import { useToastStore } from "#/lib/stores/toast-store";

export const toast = {
	success: (message: string) => {
		useToastStore.getState().addToast(message);
	},
};
