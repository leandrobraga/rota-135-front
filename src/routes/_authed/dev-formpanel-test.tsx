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
	cidade: string;
};

const nomes = [
	"João Pereira",
	"Marina Souza",
	"Carlos Lima",
	"Fernanda Rocha",
	"Rafael Nunes",
	"Beatriz Alves",
	"Thiago Martins",
	"Camila Duarte",
	"Eduardo Ramos",
	"Larissa Freitas",
	"Gustavo Barbosa",
	"Patrícia Gomes",
	"André Cardoso",
	"Juliana Teixeira",
	"Bruno Correia",
	"Vanessa Pinto",
	"Diego Farias",
	"Sabrina Castro",
	"Leonardo Vieira",
	"Priscila Moraes",
	"Felipe Azevedo",
	"Renata Monteiro",
	"Hugo Cavalcanti",
	"Aline Borges",
	"Marcelo Tavares",
];

const cidades = [
	"São Paulo",
	"Rio de Janeiro",
	"Belo Horizonte",
	"Curitiba",
	"Porto Alegre",
];

const statusList = ["Ativo", "Pendente", "Cancelado"];

const allFakeData: FakeRow[] = nomes.map((nome, index) => ({
	nome,
	status: statusList[index % statusList.length],
	data: `${String((index % 28) + 1).padStart(2, "0")}/08/2026`,
	cidade: cidades[index % cidades.length],
}));

const PAGE_SIZE = 5;

const columns: DataTableColumn<FakeRow>[] = [
	{ key: "nome", label: "Nome", mobileRole: "title" },
	{
		key: "status",
		label: "Status",
		mobileRole: "badge",
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
	{ key: "cidade", label: "Cidade", mobileRole: "meta" },
	{ key: "data", label: "Data", mobileRole: "meta" },
];

function DevTestPage() {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState("");
	// Cursor único: desktop usa só a página atual (troca), mobile acumula
	// cada página nova que o cursor visita (DataTable soma internamente).
	const [page, setPage] = useState(1);

	const filtered = allFakeData.filter((item) =>
		item.nome.toLowerCase().includes(search.toLowerCase()),
	);
	const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
	const currentPageSlice = filtered.slice(
		(page - 1) * PAGE_SIZE,
		page * PAGE_SIZE,
	);

	function handleSearchChange(value: string) {
		setSearch(value);
		setPage(1);
	}

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
					data={currentPageSlice}
					isLoading={loading}
					emptyMessage="Nenhum registro encontrado."
					onRowClick={(item) => alert(`Clicou em ${item.nome}`)}
					search={{
						value: search,
						onChange: handleSearchChange,
						placeholder: "Buscar por nome...",
					}}
					pagination={{
						page,
						pageCount,
						onPageChange: setPage,
					}}
					mobilePagination={{
						hasMore: page < pageCount,
						onLoadMore: () => setPage((p) => Math.min(p + 1, pageCount)),
					}}
					resetKey={search}
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
