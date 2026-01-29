
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  color?: string;
  trend?: {
    label: string;
    icon: LucideIcon;
    color: string;
  };
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color,
  trend,
}: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h2 className="text-3xl font-bold mt-2">{value}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">{description}</span>
              {trend && (
                <div className={cn("flex items-center gap-0.5 text-[10px] font-bold", trend.color)}>
                  <trend.icon className="h-3 w-3" />
                  {trend.label}
                </div>
              )}
            </div>
          </div>
          <div className={cn("p-4 rounded-2xl bg-muted", color)}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
