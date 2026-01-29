"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface OverviewChartProps {
  data: { name: string; total: number }[];
}

export function OverviewChart({ data }: OverviewChartProps) {
  // Creating a smooth SVG path based on data
  const width = 1000;
  const height = 300;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const max = Math.max(...data.map(d => d.total), 1);
  const points = data.map((d, i) => ({
    x: padding + (i * (chartWidth / (data.length - 1))),
    y: height - padding - (d.total / max) * chartHeight
  }));

  // Simple bezier curve logic
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cp1x = curr.x + (next.x - curr.x) / 3;
    const cp2x = curr.x + (next.x - curr.x) * 2 / 3;
    d += ` C ${cp1x} ${curr.y}, ${cp2x} ${next.y}, ${next.x} ${next.y}`;
  }

  return (
    <Card className="overflow-hidden border-border/50">
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-bold">Overview</CardTitle>
        <CardDescription className="text-xs">Monthly booking activity for the current year.</CardDescription>
      </CardHeader>
      <CardContent className="p-0 pt-10">
        <div className="relative h-[300px] w-full">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
            {/* Grid Lines */}
            {[0, 1, 2, 3, 4].map((v) => (
               <line 
                key={v}
                x1={padding} 
                y1={height - padding - (v/4) * chartHeight} 
                x2={width - padding} 
                y2={height - padding - (v/4) * chartHeight}
                className="stroke-muted/30"
                strokeWidth="1"
                strokeDasharray="4 4"
               />
            ))}

            {/* Path */}
            <path
              d={d}
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-primary"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Points */}
            {points.map((p, i) => (
              <circle
                key={i}
                cx={p.x}
                cy={p.y}
                r="6"
                className="fill-background stroke-primary"
                strokeWidth="3"
              />
            ))}

            {/* X Axis Labels */}
            {data.map((d, i) => (
              <text
                key={i}
                x={padding + (i * (chartWidth / (data.length - 1)))}
                y={height - 10}
                className="text-[20px] fill-muted-foreground font-medium"
                textAnchor="middle"
              >
                {d.name}
              </text>
            ))}
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}
