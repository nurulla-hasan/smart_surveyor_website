"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Report } from "@/types/reports";
import { FileText, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ReportActions } from "./report-actions";
import { Badge } from "@/components/ui/badge";

export const reportColumns: ColumnDef<Report>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.original.title;
      return (
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <FileText className="size-4 text-blue-500" />
          </div>
          <span className="font-bold">{title}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "client",
    header: "Client",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.client?.name || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "mouzaName",
    header: "Mouza",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <MapPin className="size-3 text-muted-foreground" />
        <span className="text-muted-foreground">{row.original.mouzaName}</span>
      </div>
    ),
  },
  {
    accessorKey: "plotNo",
    header: "Plot No",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.plotNo}</Badge>
    ),
  },
  {
    accessorKey: "areaDecimal",
    header: "Area (Decimal)",
    cell: ({ row }) => (
      <span className="font-medium">{row.original.areaDecimal} Decimal</span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground">
        <span>{format(new Date(row.original.createdAt), "MMM d, yyyy")}</span>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right mr-3">Actions</div>,
    cell: ({ row }) => <ReportActions report={row.original} />,
  },
];
