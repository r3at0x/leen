"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchDevices, fetchAlerts } from "@/lib/leen-api";
import { Device } from "@/types/device";
import { Alert } from "@/types/alert";
import { useSession } from "next-auth/react"; // Add this import

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/overview";
import { RecentAlerts } from "@/components/recent-alerts";

import { Laptop, AlertTriangle, Clock, Percent } from "lucide-react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession(); // Add this line
  const userEmail = session?.user?.email; // Add this line

  const [isLoading, setIsLoading] = useState(true);
  const [deviceCount, setDeviceCount] = useState(0);
  const [unresolvedAlerts, setUnresolvedAlerts] = useState(0);
  const [offlineDevices, setOfflineDevices] = useState(0);
  const [alertSeverities, setAlertSeverities] = useState({
    low: 0,
    medium: 0,
    high: 0,
  });
  const [averageDeviceUptime, setAverageDeviceUptime] = useState(0);
  const [alertResolutionRate, setAlertResolutionRate] = useState(0);
  const [osVersions, setOsVersions] = useState<
    { name: string; total: number }[]
  >([]);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!userEmail) return; // Add this check

      try {
        setIsLoading(true);
        // Check if the user exists and has valid credentials
        const userCheckResponse = await fetch("/api/check-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        });
        const userCheckData = await userCheckResponse.json();

        if (!userCheckData.exists || !userCheckData.connectionId || !userCheckData.apiKey) {
          // User doesn't exist or doesn't have valid credentials
          setIsLoading(false);
          return;
        }

        // Fetch dashboard data
        const devicesData = await fetchDevices(userEmail, { limit: 500 });
        const alertsData = await fetchAlerts(userEmail, { limit: 500 });

        setDeviceCount(devicesData.items.length);
        setOfflineDevices(
          devicesData.items.filter(
            (device: Device) => device.status === "offline"
          ).length
        );

        const unresolved = alertsData.items.filter(
          (alert: Alert) => alert.status === "unresolved"
        );
        setUnresolvedAlerts(unresolved.length);

        const severities = unresolved.reduce(
          (acc: Record<string, number>, alert: Alert) => {
            acc[alert.severity] = (acc[alert.severity] || 0) + 1;
            return acc;
          },
          { low: 0, medium: 0, high: 0 }
        );
        setAlertSeverities(severities);

        // Calculate average device uptime (assuming last_seen is in ISO format)
        const now = new Date();
        const totalUptime = devicesData.items.reduce(
          (sum: number, device: Device) => {
            const lastSeen = new Date(device.last_seen);
            return sum + (now.getTime() - lastSeen.getTime());
          },
          0
        );
        const avgUptime =
          totalUptime / devicesData.items.length / (1000 * 60 * 60 * 24); // in days
        setAverageDeviceUptime(Math.round(avgUptime * 10) / 10); // Round to 1 decimal place

        // Calculate alert resolution rate
        const totalAlerts = alertsData.items.length;
        const resolvedAlerts = alertsData.items.filter(
          (alert: Alert) => alert.status === "resolved"
        ).length;
        setAlertResolutionRate(
          Math.round((resolvedAlerts / totalAlerts) * 100)
        );

        // Process OS versions data
        const osVersionCounts = devicesData.items.reduce(
          (acc: Record<string, number>, device: Device) => {
            const osVersion = device.os_version || "Unknown";
            acc[osVersion] = (acc[osVersion] || 0) + 1;
            return acc;
          },
          {}
        );

        const osVersionsData = Object.entries(osVersionCounts)
          .map(([name, total]) => ({ name, total: total as number }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 5); // Get top 5 OS versions

        setOsVersions(osVersionsData);

        // Fetch recent alerts
        const recentAlertsData = await fetchAlerts(userEmail, {
          limit: 5,
          sort: "last_event_time:desc",
        });
        setRecentAlerts(recentAlertsData.items);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [userEmail]); // Add userEmail to the dependency array

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-100px)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/dashboard-light.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="block dark:hidden"
        />
        <Image
          src="/examples/dashboard-dark.png"
          width={1280}
          height={866}
          alt="Dashboard"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Main</TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                Alerts
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Devices
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Connected Devices
                    </CardTitle>
                    <Laptop className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{deviceCount}</div>
                    <p className="text-xs text-muted-foreground">
                      {offlineDevices} offline
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Unresolved Alerts
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{unresolvedAlerts}</div>
                    <p className="text-xs text-muted-foreground">
                      {alertSeverities.low} low, {alertSeverities.medium}{" "}
                      medium, {alertSeverities.high} high
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Avg Device Uptime
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {averageDeviceUptime} days
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Average time since last seen
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Alert Resolution Rate
                    </CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {alertResolutionRate}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      of total alerts resolved
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Device OS Versions</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview data={osVersions} />
                  </CardContent>
                </Card>
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Alerts</CardTitle>
                    <CardDescription>
                      Latest security alerts from your network
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentAlerts alerts={recentAlerts} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
