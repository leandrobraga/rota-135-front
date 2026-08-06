import type { Role } from "#/lib/auth-client";

export type NavItem = {
	label: string;
	to: string;
	allowedRoles: Role[];
};

const ALL_ROLES: Role[] = [
	"ADMIN",
	"OPERATOR",
	"FINANCE",
	"DRIVER",
	"CUSTOMER",
];
const OPERATIONAL_ROLES: Role[] = ["ADMIN", "OPERATOR"];
const FINANCE_ROLES: Role[] = ["ADMIN", "FINANCE"];

export const navItems: NavItem[] = [
	{ label: "Dashboard", to: "/", allowedRoles: ALL_ROLES },
	{ label: "Clientes", to: "/customer", allowedRoles: OPERATIONAL_ROLES },
	{ label: "Motoristas", to: "/drivers", allowedRoles: OPERATIONAL_ROLES },
	{ label: "Veículos", to: "/vehicles", allowedRoles: OPERATIONAL_ROLES },
	{ label: "Precificação", to: "/pricing", allowedRoles: OPERATIONAL_ROLES },
	{ label: "Corridas", to: "/trips", allowedRoles: OPERATIONAL_ROLES },
	{ label: "Pagamentos", to: "/payments", allowedRoles: FINANCE_ROLES },
	{ label: "Repasses", to: "/payouts", allowedRoles: FINANCE_ROLES },
	{ label: "Usuários", to: "/users", allowedRoles: ["ADMIN"] },
	{ label: "Notificações", to: "/notifications", allowedRoles: ALL_ROLES },
];
