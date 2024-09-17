"use client";

import React, { useState, useEffect } from "react";
import { fetchDevices } from "@/lib/leenApi";
import { Wifi, WifiOff, HelpCircle, LucideIcon, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Device } from "@/types/device";

export function DeviceStatusCards() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDevices() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchDevices({ limit: 500 });
        setDevices(data.items);
      } catch (error) {
        console.error("Error fetching devices:", error);
        setError("Failed to load devices");
      } finally {
        setIsLoading(false);
      }
    }

    loadDevices();
  }, []);

  if (isLoading) {
    return <Loader2 className="h-8 w-8 animate-spin" />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const activeDevices = devices.filter(d => d.status === "active");
  const offlineDevices = devices.filter(d => d.status === "offline");
  const unknownDevices = devices.filter(d => d.status !== "active" && d.status !== "offline");

  const totalDevices = devices.length;

  return (
    <div className="grid grid-cols-3 gap-4 w-full">
      <DeviceStatusCard 
        title="Active" 
        count={activeDevices.length} 
        percentage={(activeDevices.length / totalDevices) * 100}
        icon={Wifi}
      />
      <DeviceStatusCard 
        title="Offline" 
        count={offlineDevices.length} 
        percentage={(offlineDevices.length / totalDevices) * 100}
        icon={WifiOff}
      />
      <DeviceStatusCard 
        title="Unknown" 
        count={unknownDevices.length} 
        percentage={(unknownDevices.length / totalDevices) * 100}
        icon={HelpCircle}
      />
    </div>
  );
}

function DeviceStatusCard({
  title,
  count,
  percentage,
  icon: Icon,
}: {
  title: string;
  count: number;
  percentage: number;
  icon: LucideIcon;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}% of total devices</p>
      </CardContent>
    </Card>
  );
}
