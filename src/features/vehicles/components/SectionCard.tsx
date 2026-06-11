import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Separator } from "@base-ui/react";

interface SectionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  columns?: 1 | 2 | 3;
  children: React.ReactNode;
}

export function SectionCard({
  icon,
  title,
  description,
  columns = 3,
  children,
}: SectionCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-md bg-silver-100 dark:bg-silver-800">
            {icon}
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent
        className={cn(
          "grid gap-4 pt-5 md:gap-5 md:pt-6",
          columns === 3 && "md:grid-cols-3",
          columns === 2 && "md:grid-cols-2",
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
}
