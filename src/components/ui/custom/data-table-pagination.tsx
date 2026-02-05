"use client";

import { Table } from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { PaginationMeta } from "@/types/global.type";
import { cn } from "@/lib/utils";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React from "react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  meta?: PaginationMeta;
}

export function DataTablePagination<TData>({
  table,
  meta,
}: DataTablePaginationProps<TData>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (meta) {
      const totalPages = meta.totalPages ?? Math.ceil(meta.total / meta.limit);

      if (meta.page > totalPages && totalPages > 0) {
        const params = new URLSearchParams(window.location.search);
        params.set("page", totalPages.toString());
        router.push(`${pathname}?${params.toString()}`);
      }
    }
  }, [meta, pathname, router]);

  // Handle server-side pagination URL updates
  const handlePageChange = (page: number) => {
    if (meta) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", page.toString());
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <div className="flex items-center justify-between px-2">
      <div className="text-muted-foreground flex-1 text-sm">
        {meta && (
          <>
            Showing {(meta.page - 1) * meta.limit + 1} to{" "}
            {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
            entries
          </>
        )}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={(e: { preventDefault: () => void; }) => {
                  e.preventDefault();
                  if (meta) {
                    if (meta.page > 1) handlePageChange(meta.page - 1);
                  } else {
                    table.previousPage();
                  }
                }}
                className={cn(
                  "rounded-full cursor-pointer",
                  !table.getCanPreviousPage() &&
                    "pointer-events-none opacity-50",
                )}
              />
            </PaginationItem>

            {(() => {
              const page = table.getState().pagination.pageIndex + 1;
              const totalPages = table.getPageCount();
              const pages: (number | string)[] = [];

              if (totalPages <= 5) {
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                pages.push(1);
                if (page > 3) pages.push("...");
                for (
                  let i = Math.max(2, page - 1);
                  i <= Math.min(totalPages - 1, page + 1);
                  i++
                ) {
                  pages.push(i);
                }
                if (page < totalPages - 2) pages.push("...");
                pages.push(totalPages);
              }

              return pages.map((pageNumItem, idx) => {
                if (pageNumItem === "...") {
                  return (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                const pageNum = pageNumItem as number;
                const isActive = pageNum === page;

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      onClick={(e: { preventDefault: () => void; }) => {
                        e.preventDefault();
                        if (meta) {
                          handlePageChange(pageNum);
                        } else {
                          table.setPageIndex(pageNum - 1);
                        }
                      }}
                      isActive={isActive}
                      className="rounded-full cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              });
            })()}

            <PaginationItem>
              <PaginationNext
                onClick={(e: { preventDefault: () => void; }) => {
                  e.preventDefault();
                  if (meta) {
                    const totalPages =
                      meta.totalPages ?? Math.ceil(meta.total / meta.limit);
                    if (meta.page < totalPages) handlePageChange(meta.page + 1);
                  } else {
                    table.nextPage();
                  }
                }}
                className={cn(
                  "rounded-full cursor-pointer",
                  !table.getCanNextPage() && "pointer-events-none opacity-50",
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
