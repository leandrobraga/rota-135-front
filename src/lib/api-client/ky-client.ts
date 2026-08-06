import ky from "ky";

import { router } from "#/router";

export const api = ky.create({
	prefix: import.meta.env.VITE_API_URL,
	credentials: "include",
	hooks: {
		afterResponse: [
			({ response }) => {
				if (response.status === 401) {
					router.navigate({ to: "/login" });
				}
			},
		],
	},
});
