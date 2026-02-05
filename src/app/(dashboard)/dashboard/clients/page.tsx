import { getClients } from "@/services/clients";
import { SearchParams } from "@/types/global.type";
import PageHeader from "@/components/ui/custom/page-header";
import { DataTable } from "@/components/ui/custom/data-table";
import { clientColumns } from "@/components/dashboard/clients/client-columns";
import { AddClientModal } from "@/components/dashboard/clients/add-client-modal";
import { SearchInput } from "@/components/ui/custom/search-input";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Clients | Smart Surveyor",
  description: "Manage your customer database.",
};

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const { clients, meta } = await getClients(params);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Clients"
          description="Manage your customer database."
        />
        <AddClientModal />
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
        
        <div className="relative space-y-6">
          <SearchInput placeholder="Search clients..." />

          <DataTable
            columns={clientColumns}
            data={clients}
            pageSize={meta.pageSize}
            meta={{
              total: meta.totalItems,
              page: meta.currentPage,
              limit: meta.pageSize,
              totalPages: meta.totalPages,
            }}
          />
        </div>
      </div>
    </div>
  );
}
