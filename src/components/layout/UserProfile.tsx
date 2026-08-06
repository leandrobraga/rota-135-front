import type { Role } from "#/lib/auth-client";

const ROLE_LABELS: Record<Role, string> = {
	ADMIN: "Administrador",
	OPERATOR: "Operador",
	FINANCE: "Financeiro",
	DRIVER: "Motorista",
	CUSTOMER: "Cliente",
};

function getInitials(name: string) {
	const parts = name.trim().split(/\s+/);
	const first = parts[0]?.[0] ?? "";
	const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
	return (first + last).toUpperCase();
}

export function UserProfile({
	name,
	role,
}: {
	name: string | undefined;
	role: Role | undefined;
}) {
	return (
		<div className="flex items-center gap-2.5">
			<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[1.5px] border-gold-500 bg-navy-700 font-semibold text-[13px] text-gold-500">
				{name ? getInitials(name) : ""}
			</div>
			<div className="min-w-0">
				<div className="truncate font-semibold text-[13.5px] text-white">
					{name}
				</div>
				<div className="text-[11.5px] text-navy-300">
					{role ? ROLE_LABELS[role] : ""}
				</div>
			</div>
		</div>
	);
}
