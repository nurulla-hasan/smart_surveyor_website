import { Suspense } from "react";
import { getClients } from "@/services/clients";
import { ClientListView } from "@/components/clients/client-list-view";
import { SearchParams } from "@/types/global.type";

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
  
  const page = typeof params.page === "string" ? params.page : "1";
  const pageSize = typeof params.pageSize === "string" ? params.pageSize : "10";
  const search = typeof params.search === "string" ? params.search : undefined;

  const initialData = await getClients({
    page,
    pageSize,
    search,
  });

  return (
    <Suspense fallback={<div>লোড হচ্ছে...</div>}>
      <ClientListView initialData={initialData} />
    </Suspense>
  );
}
