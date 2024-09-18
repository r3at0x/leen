"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { fetchDevices } from "@/lib/leenApi";
import { Device } from "@/types/device";

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

export function OsVersion() {
  const [chartData, setChartData] = useState<
    { version: string; count: number }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOsVersionData() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchDevices({ limit: 500 });
        const devices: Device[] = data.items;

        const osVersionCounts = devices.reduce((acc, device) => {
          const version = device.os_version || "Unknown";
          acc[version] = (acc[version] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const sortedData = Object.entries(osVersionCounts)
          .sort(([, a], [, b]) => b - a)
          .map(([version, count]) => ({ version, count }));

        setChartData(sortedData);
      } catch (error) {
        console.error("Error fetching OS version data:", error);
        setError("Failed to fetch OS version data");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOsVersionData();
  }, []);

  if (isLoading) {
    return <div className="text-foreground">Loading OS version data...</div>;
  }

  if (error) {
    return <div className="text-foreground">Error: {error}</div>;
  }

  const mostCommonVersion = chartData[0]?.version || "Unknown";

  return (
    <Card>
      <CardHeader>
        <CardTitle>OS Version Distribution</CardTitle>
        <CardDescription>Across all devices</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart width={600} height={300} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="version" stroke="var(--foreground)" />
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
