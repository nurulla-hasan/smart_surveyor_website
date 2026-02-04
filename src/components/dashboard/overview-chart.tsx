"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSmartFilter } from "@/hooks/useSmartFilter";

interface OverviewChartProps {
  data: { name: string; total: number }[];
}

const chartConfig = {
  total: {
    label: "Booking",
    color: "#3b82f6",
  },
} satisfies ChartConfig;

export function OverviewChart({ data = [] }: OverviewChartProps) {
  const { getFilter, updateFilter } = useSmartFilter();
  const currentYear = getFilter("year") || new Date().getFullYear().toString();
  const years = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() + i).toString());

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold">Statistics</CardTitle>
          <CardDescription className="text-xs">Monthly booking activity of the year.</CardDescription>
        </div>
        <Select
          value={currentYear}
          onValueChange={(value) => updateFilter("year", value)}
        >
          <SelectTrigger className="w-27.5 h-8 text-xs border-border/50">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {data.length > 0 ? (
          <ChartContainer config={chartConfig} className="mx-auto aspect-video max-h-75 w-full">
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                top: 20,
                left: 12,
                right: 12,
                bottom: 20
              }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/50" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                tickFormatter={(value) => value}
                className="text-[14px]"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                width={40}
                className="text-[12px]"
                domain={[0, 60]}
                ticks={[0, 10, 20, 30, 40, 50, 60]}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    nameKey="total"
                    hideLabel
                  />
                }
              />
              <Line
                dataKey="total"
                type="natural"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#3b82f6",
                  strokeWidth: 2,
                  stroke: "var(--background)",
                }}
                activeDot={{
                  r: 6,
                  fill: "#3b82f6",
                  stroke: "var(--background)",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="flex h-75 items-center justify-center text-muted-foreground  text-sm">
            No data found
          </div>
        )}
      </CardContent>
    </Card>
  );
}
