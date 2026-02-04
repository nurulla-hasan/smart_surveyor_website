import { getClients } from "@/services/clients";
import { SearchParams } from "@/types/global.type";
import PageHeader from "@/components/ui/custom/page-header";
import { DataTable } from "@/components/ui/custom/data-table";
import { clientColumns } from "@/components/clients/client-columns";
import { AddClientModal } from "@/components/clients/add-client-modal";
import { SearchInput } from "@/components/ui/custom/search-input";

export const metadata = {
  title: "ক্লায়েন্ট | Smart Surveyor",
  description: "আপনার কাস্টমার ডাটাবেস পরিচালনা করুন।",
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
          title="ক্লায়েন্ট"
          description="আপনার কাস্টমার ডাটাবেস পরিচালনা করুন।"
        />
        <AddClientModal />
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm relative overflow-hidden">
        
        <div className="relative space-y-6">
          <SearchInput placeholder="ক্লায়েন্ট খুঁজুন..." />

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
