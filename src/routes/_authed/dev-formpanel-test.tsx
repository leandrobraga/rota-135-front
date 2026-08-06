import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DataTable, type DataTableColumn } from "#/components/DataTable";
import { FormPanel } from "#/components/FormPanel";
import { requireSession } from "#/lib/route-guards";

export const Route = createFileRoute("/_authed/dev-formpanel-test")({
	beforeLoad: ({ location }) => requireSession(location.href),
	component: DevTestPage,
});

type FakeRow = {
	nome: string;
	status: string;
	data: string;
};

const fakeData: FakeRow[] = [
	{ nome: "João Pereira", status: "Ativo", data: "12/08/2026" },
	{ nome: "Marina Souza", status: "Pendente", data: "13/08/2026" },
	{ nome: "Carlos Lima", status: "Ativo", data: "14/08/2026" },
	{ nome: "Fernanda Rocha", status: "Cancelado", data: "15/08/2026" },
	{ nome: "Rafael Nunes", status: "Ativo", data: "16/08/2026" },
];

const columns: DataTableColumn<FakeRow>[] = [
	{ key: "nome", label: "Nome", primary: true },
	{
		key: "status",
		label: "Status",
		primary: true,
		render: (item) => (
			<span
				className={`rounded-full px-2.5 py-1 font-bold text-[11.5px] ${
					item.status === "Ativo"
						? "bg-sage-100 text-sage-500"
						: "bg-[#F1E6CC] text-gold-500"
				}`}
			>
				{item.status}
			</span>
		),
	},
	{ key: "data", label: "Data" },
];

function DevTestPage() {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	return (
		<div className="flex flex-col gap-8">
			<div>
				<h1 className="mb-3 font-display font-bold text-[22px] text-navy-800">
					FormPanel
				</h1>
				<button
					type="button"
					onClick={() => setOpen(true)}
					className="h-11 rounded-[10px] bg-gold-500 px-5 font-bold text-[14px] text-navy-800"
				>
					Abrir painel
				</button>
			</div>

			<div>
				<div className="mb-3 flex items-center justify-between">
					<h1 className="font-display font-bold text-[22px] text-navy-800">
						DataTable
					</h1>
					<button
						type="button"
						onClick={() => setLoading((v) => !v)}
						className="h-9 rounded-[9px] border border-neutral-300 px-3.5 font-semibold text-[12.5px] text-navy-800"
					>
						{loading ? "Mostrar dados" : "Mostrar loading"}
					</button>
				</div>
				<DataTable
					columns={columns}
					data={fakeData}
					isLoading={loading}
					emptyMessage="Nenhum registro encontrado."
					onRowClick={(item) => alert(`Clicou em ${item.nome}`)}
				/>
			</div>

			<FormPanel
				open={open}
				onOpenChange={setOpen}
				title="Novo cadastro"
				footer={
					<button
						type="button"
						onClick={() => setOpen(false)}
						className="h-[50px] rounded-[10px] bg-gold-500 font-bold text-[15px] text-navy-800"
					>
						Salvar
					</button>
				}
			>
				<form className="flex flex-col gap-4">
					<div>
						<label
							htmlFor="dev-nome"
							className="mb-1.5 block text-[12px] font-bold text-neutral-600 tracking-[0.3px]"
						>
							NOME
						</label>
						<input
							id="dev-nome"
							className="h-[50px] w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500"
							placeholder="Nome completo"
						/>
					</div>
					<div>
						<label
							htmlFor="dev-email"
							className="mb-1.5 block text-[12px] font-bold text-neutral-600 tracking-[0.3px]"
						>
							E-MAIL
						</label>
						<input
							id="dev-email"
							type="email"
							className="h-[50px] w-full rounded-[10px] border-[1.5px] border-neutral-300 px-4 font-medium text-[14.5px] text-navy-800 outline-none focus:border-gold-500"
							placeholder="voce@rota135.com.br"
						/>
					</div>
				</form>
			</FormPanel>
		</div>
	);
}
