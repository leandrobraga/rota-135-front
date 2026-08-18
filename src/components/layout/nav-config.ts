import {
	Bell,
	CalendarClock,
	CalendarPlus,
	Car,
	CreditCard,
	LayoutDashboard,
	type LucideIcon,
	Route as RouteIcon,
	Settings,
	Tags,
	UserCircle,
	UserCog,
	Users,
	Wallet,
} from "lucide-react";
import type { Role } from "#/lib/auth-client";

export type NavItem = {
	label: string;
	to: string;
	allowedRoles: Role[];
	icon: LucideIcon;
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
	{
		label: "Dashboard",
		to: "/",
		allowedRoles: ALL_ROLES,
		icon: LayoutDashboard,
	},
	{
		label: "Corridas",
		to: "/trips",
		allowedRoles: OPERATIONAL_ROLES,
		icon: RouteIcon,
	},
	{
		label: "Motoristas",
		to: "/drivers",
		allowedRoles: OPERATIONAL_ROLES,
		icon: UserCircle,
	},
	{
		label: "Veículos",
		to: "/vehicles",
		allowedRoles: OPERATIONAL_ROLES,
		icon: Car,
	},
	{
		label: "Disponibilidade",
		to: "/fleet-availability",
		allowedRoles: OPERATIONAL_ROLES,
		icon: CalendarClock,
	},
	{
		label: "Agendamentos",
		to: "/trip-schedules",
		allowedRoles: OPERATIONAL_ROLES,
		icon: CalendarPlus,
	},
	{
		label: "Clientes",
		to: "/customer",
		allowedRoles: OPERATIONAL_ROLES,
		icon: Users,
	},
	{
		label: "Precificação",
		to: "/pricing",
		allowedRoles: OPERATIONAL_ROLES,
		icon: Tags,
	},
	{ label: "Equipe", to: "/users", allowedRoles: ["ADMIN"], icon: UserCog },
	{
		label: "Configurações",
		to: "/settings",
		allowedRoles: ["ADMIN"],
		icon: Settings,
	},
	{
		label: "Pagamentos",
		to: "/payments",
		allowedRoles: FINANCE_ROLES,
		icon: CreditCard,
	},
	{
		label: "Repasses",
		to: "/payouts",
		allowedRoles: FINANCE_ROLES,
		icon: Wallet,
	},
	{
		label: "Notificações",
		to: "/notifications",
		allowedRoles: ALL_ROLES,
		icon: Bell,
	},
];
