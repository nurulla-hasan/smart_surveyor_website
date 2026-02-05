"use client";

import PageHeader from "@/components/ui/custom/page-header";
import { DataTable } from "@/components/ui/custom/data-table";
import { clientColumns } from "./client-columns";
import { GetClientsResponse } from "@/types/clients";
import { AddClientModal } from "./add-client-modal";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSmartFilter } from "@/hooks/useSmartFilter";

interface ClientListViewProps {
  initialData: GetClientsResponse | null;
}

export function ClientListView({ initialData }: ClientListViewProps) {
  const { updateFilter, getFilter } = useSmartFilter();
  const searchParam = getFilter("search");

  const clients = initialData?.data?.clients || [];
  const meta = initialData?.data?.meta || {
    total: 0,
    totalPages: 0,
    page: 1,
    limit: 10,
  };


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
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative space-y-6">
          <div className="relative max-w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-10 bg-muted/20"
              defaultValue={searchParam}
              onChange={(e) => updateFilter("search", e.target.value, 500)}
            />
          </div>

          <DataTable
            columns={clientColumns}
            data={clients}
            limit={meta.limit}
            meta={meta}
          />
        </div>
      </div>
    </div>
  );
}
