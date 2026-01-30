"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Trash2, Inbox } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { bn } from "date-fns/locale";

import { Calculation } from "@/types/calculations";

interface CalculatorHistoryProps {
  history: Calculation[];
  onDelete: (id: string) => void;
}

export function CalculatorHistory({ history, onDelete }: CalculatorHistoryProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <History className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-bold uppercase tracking-tight">ইতিহাস</h3>
      </div>

      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex gap-4 pb-4">
          {history.length > 0 ? (
            history.map((item) => (
              <Card
                key={item.id}
                className="w-70 shrink-0 hover:border-primary/50 transition-colors"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <p className="text-lg font-bold">{item.resultData.areaSqFt} ft²</p>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(item.id)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                  {item.booking?.title && (
                    <p className="capitalize text-primary font-bold truncate">
                      ● {item.booking.title}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] text-muted-foreground mb-3">
                    <span>উত্তর: {item.inputData?.sides?.[0] ?? 0}ft</span>
                    <span>দক্ষিণ: {item.inputData?.sides?.[1] ?? 0}ft</span>
                    <span>পূর্ব: {item.inputData?.sides?.[2] ?? 0}ft</span>
                    <span>পশ্চিম: {item.inputData?.sides?.[3] ?? 0}ft</span>
                  </div>
                  <div className="flex gap-4 text-xs font-medium text-muted-foreground border-t pt-2">
                    <span>কাঠা: {item.resultData.areaKatha}</span>
                    <span>
                      শতাংশ:{" "}
                      {item.resultData.areaDecimal ??
                        (item.resultData.areaSqFt / 435.6).toFixed(4)}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    {format(new Date(item.createdAt), "p, d MMM", { locale: bn })}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground/50">
              <Inbox className="h-8 w-8 mb-2" />
              <p className="text-sm font-medium">কোনো রেকর্ড নেই</p>
            </div>
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
