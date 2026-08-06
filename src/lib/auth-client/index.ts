import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export type Role = "ADMIN" | "OPERATOR" | "FINANCE" | "DRIVER" | "CUSTOMER";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  basePath: "/auth",
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: ["ADMIN", "OPERATOR", "FINANCE", "DRIVER", "CUSTOMER"],
        },
      },
    }),
  ],
});

export const { useSession } = authClient;
