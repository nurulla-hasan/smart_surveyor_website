"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Calculation } from "@/types/calculations";
import { Calculator, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { CalculationActions } from "./calculation-actions";

export const calculationColumns: ColumnDef<Calculation>[] = [
  {
    accessorKey: "resultData.areaSqFt",
    header: "Area (Square Feet)",
    cell: ({ row }) => {
      const sqft = row.original.resultData.areaSqFt;
      return (
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Calculator className="size-4 text-emerald-600" />
          </div>
          <span className="font-bold">{sqft} ft²</span>
        </div>
      );
    },
  },
  {
    accessorKey: "booking",
    header: "Booking/Client",
    cell: ({ row }) => {
      const booking = row.original.booking;
      if (!booking) return <span className="text-muted-foreground/50">-</span>;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-primary">{booking.title}</span>
          {booking.client && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <User className="size-3" />
              <span>{booking.client.name}</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "resultData.areaDecimal",
    header: "Shotok/Katha",
    cell: ({ row }) => {
      const { areaDecimal, areaKatha } = row.original.resultData;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{areaDecimal} Shotok</span>
          <span className="text-[10px] text-muted-foreground">{areaKatha} Katha</span>
        </div>
      );
    },
  },
  {
    accessorKey: "inputData",
    header: "Measurements (feet)",
    cell: ({ row }) => {
      const sides = row.original.inputData?.sides || [];
      return (
        <div className="text-[10px] text-muted-foreground grid grid-cols-2 gap-x-2">
          <span>N: {sides[0] ?? 0}</span>
          <span>S: {sides[1] ?? 0}</span>
          <span>E: {sides[2] ?? 0}</span>
          <span>W: {sides[3] ?? 0}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-muted-foreground text-xs">
        <Calendar className="size-3" />
        <span>{format(new Date(row.original.createdAt), "d MMM, yyyy", { locale: enUS })}</span>
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-right mr-3">Actions</div>,
    cell: ({ row }) => <CalculationActions calculation={row.original} />,
  },
];
