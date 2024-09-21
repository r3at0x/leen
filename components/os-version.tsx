"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { useDevices } from "@/lib/api-hooks";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "OS Version Distribution";

const chartConfig = {
  count: {
    label: "Device Count",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function OsVersion({ userEmail }: { userEmail?: string }) {
  const { devices } = useDevices(userEmail);

  const mostCommonVersion =
    (devices as { os_version: string }[])[0]?.os_version || "Unknown";

  return (
    <Card>
      <CardHeader>
        <CardTitle>OS Version Distribution</CardTitle>
        <CardDescription>Across all devices</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart width={600} height={300} data={devices}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="os_version" stroke="var(--foreground)" />
            <YAxis stroke="var(--foreground)" />
            <Tooltip content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {mostCommonVersion} is the most common version{" "}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing distribution of OS versions across all devices
        </div>
      </CardFooter>
    </Card>
  );
}
