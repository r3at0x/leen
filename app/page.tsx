import { DeviceStatusCards } from "@/components/DeviceStatusCards";
import { OsVersion } from "@/components/osVersion";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-10">
      <div className="w-full max-w-3xl h-[calc(100vh-80px)] space-y-10">
        <DeviceStatusCards />
        <OsVersion />
      </div>
    </div>
  );
}
