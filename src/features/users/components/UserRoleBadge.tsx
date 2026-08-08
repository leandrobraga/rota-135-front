import type { UserRole } from "#/features/users/types";

const ROLE_STYLE: Record<UserRole, string> = {
	ADMIN: "bg-navy-800 text-cream-50",
	OPERATOR: "bg-[#F1E6CC] text-gold-500",
	FINANCE: "bg-sage-100 text-sage-500",
};

const ROLE_LABEL: Record<UserRole, string> = {
	ADMIN: "Admin",
	OPERATOR: "Operador",
	FINANCE: "Financeiro",
};

export function UserRoleBadge({ role }: { role: UserRole }) {
	return (
		<span
			className={`rounded-full px-2.5 py-1 font-bold text-[11.5px] ${ROLE_STYLE[role]}`}
		>
			{ROLE_LABEL[role]}
		</span>
	);
}
