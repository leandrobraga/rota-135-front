import { useState } from "react";
import { UserFormPanel } from "#/features/users/components/UserFormPanel";
import { UsersList } from "#/features/users/components/UsersList";

export function UsersPage() {
	const [creating, setCreating] = useState(false);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h1 className="font-display font-bold text-[22px] text-navy-800">
					Usuários
				</h1>
				<button
					type="button"
					onClick={() => setCreating(true)}
					className="h-11 rounded-[10px] bg-gold-500 px-5 font-bold text-[14px] text-navy-800"
				>
					+ Novo
				</button>
			</div>

			<UsersList />

			<UserFormPanel mode="create" open={creating} onOpenChange={setCreating} />
		</div>
	);
}
