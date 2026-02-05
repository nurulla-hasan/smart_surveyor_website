"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Client } from "@/types/clients";
import { User } from "lucide-react";
import { format } from "date-fns";
import { ClientActions } from "./client-actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export const clientColumns: ColumnDef<Client>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.original.name;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border">
            <AvatarFallback className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
              {getInitials(name) || <User className="h-3 w-3" />}
            </AvatarFallback>
          </Avatar>
          <span className="font-bold">{name}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.phone}</span>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.email || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.address || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Joined At",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground">
        <span>{format(new Date(row.original.createdAt), "MMM d, yyyy")}</span>
      </div>
    ),
  },
  {
    id: "actions",
    header:()=><><div className="text-right mr-3">Actions</div></>,
    cell: ({ row }) => <ClientActions client={row.original} />,
  },
];
