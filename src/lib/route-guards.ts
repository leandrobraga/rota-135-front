import { redirect } from "@tanstack/react-router";
import { authClient, type Role } from "#/lib/auth-client";

export async function requireSession(currentHref: string) {
	const { data: session } = await authClient.getSession();

	if (!session) {
		throw redirect({ to: "/login", search: { redirect: currentHref } });
	}

	return session;
}

export async function requireRole(currentHref: string, allowedRoles: Role[]) {
	const session = await requireSession(currentHref);

	if (!allowedRoles.includes(session.user.role as Role)) {
		throw redirect({ to: "/" });
	}

	return session;
}
