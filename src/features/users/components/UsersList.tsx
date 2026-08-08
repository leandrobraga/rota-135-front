import { useState } from "react";
import { ActiveStatusBadge } from "#/components/ActiveStatusBadge";
import { DataTable, type DataTableColumn } from "#/components/DataTable";
import { ResetPasswordPanel } from "#/features/users/components/ResetPasswordPanel";
import { UserFormPanel } from "#/features/users/components/UserFormPanel";
import { UserRoleBadge } from "#/features/users/components/UserRoleBadge";
import { useUsersQuery } from "#/features/users/queries/use-users-query";
import type { User } from "#/features/users/types";
import { useSession } from "#/lib/auth-client";

export function UsersList() {
	const [search, setSearch] = useState("");
	const [editingUser, setEditingUser] = useState<User | null>(null);
	const [resettingPasswordUser, setResettingPasswordUser] =
		useState<User | null>(null);
	const { data: session } = useSession();

	const { data, isLoading } = useUsersQuery();
	const users = (data ?? []) as User[];

	const filteredUsers = search
		? users.filter((user) => {
				const term = search.toLowerCase();
				return (
					user.name.toLowerCase().includes(term) ||
					user.email.toLowerCase().includes(term)
				);
			})
		: users;

	const columns: DataTableColumn<User>[] = [
		{ key: "name", label: "Nome", mobileRole: "title" },
		{ key: "email", label: "E-mail", mobileRole: "meta" },
		{
			key: "role",
			label: "Perfil",
			mobileRole: "badge",
			render: (user) => <UserRoleBadge role={user.role} />,
		},
		{
			key: "active",
			label: "Status",
			mobileRole: "badge",
			render: (user) => <ActiveStatusBadge active={user.active} />,
		},
		{
			key: "id",
			label: "Ações",
			mobileRole: "actions",
			render: (user) =>
				user.id === session?.user.id ? null : (
					<button
						type="button"
						onClick={(event) => {
							event.stopPropagation();
							setResettingPasswordUser(user);
						}}
						className="rounded-full border border-neutral-300 px-2.5 py-1 font-bold text-[11.5px] text-navy-800"
					>
						Redefinir senha
					</button>
				),
		},
	];

	return (
		<>
			<DataTable
				columns={columns}
				data={filteredUsers}
				isLoading={isLoading}
				emptyMessage="Nenhum usuário encontrado."
				onRowClick={(user) => setEditingUser(user)}
				search={{
					value: search,
					onChange: setSearch,
					placeholder: "Buscar por nome ou e-mail...",
				}}
			/>

			{editingUser && (
				<UserFormPanel
					mode="edit"
					user={editingUser}
					open={Boolean(editingUser)}
					onOpenChange={(open) => !open && setEditingUser(null)}
				/>
			)}

			{resettingPasswordUser && (
				<ResetPasswordPanel
					user={resettingPasswordUser}
					open={Boolean(resettingPasswordUser)}
					onOpenChange={(open) => !open && setResettingPasswordUser(null)}
				/>
			)}
		</>
	);
}
