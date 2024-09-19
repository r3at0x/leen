import { Metadata } from "next";
import { DeviceStatusCards } from "@/components/DeviceStatusCards";
import { OsVersion } from "@/components/osVersion";

export const metadata: Metadata = {
  title: "Dashboard | SDMVP",
  description: "Overview of device statuses and OS version distribution",
};

export default function Home() {
  return (
    <div className="flex flex-col items-center h-[calc(100vh-64px)] p-6">
      <div className="w-full max-w-5xl flex flex-col space-y-6">
        <DeviceStatusCards />
        <div className="flex-grow">
          <OsVersion />
        </div>
        <div className="h-full"></div>
      </div>
    </div>
  );
}
