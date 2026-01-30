"use client";

import * as React from "react"
import { usePathname, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type PaginationIdentifier = number | "...";

const getPaginationRange = (totalPages: number, currentPage: number, siblingCount = 1): PaginationIdentifier[] => {
  const totalPageNumbers = siblingCount + 5;

  if (totalPageNumbers >= totalPages) {
    return [...Array(totalPages)].map((_, idx) => idx + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = [...Array(leftItemCount)].map((_, i) => i + 1);
    return [...leftRange, "...", totalPages];
  }

  if (shouldShowLeftDots && !shouldShowRightDots) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = [...Array(rightItemCount)].map(
      (_, i) => totalPages - rightItemCount + i + 1
    );
    return [firstPageIndex, "...", ...rightRange];
  }

  if (shouldShowLeftDots && shouldShowRightDots) {
    const middleRange = [];
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      middleRange.push(i);
    }
    return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
  }
  return [];
};

type CustomPaginationProps = {
  currentPage: number;
  totalPages: number;
};

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalPages,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const paginationRange = getPaginationRange(totalPages, currentPage);

  if (currentPage === 0 || paginationRange.length === 0) {
    return null;
  }

  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === "...") {
            return (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href={createPageUrl(pageNumber as number)}
                isActive={currentPage === pageNumber}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            href={currentPage < totalPages ? createPageUrl(currentPage + 1) : "#"}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
