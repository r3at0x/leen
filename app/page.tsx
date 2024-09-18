import { DeviceStatusCards } from "@/components/DeviceStatusCards";
import { OsVersion } from "@/components/osVersion";

export default function Home() {
  return (
    <div className="flex flex-col items-center h-[calc(100vh-64px)] p-6">
      <div className="w-full max-w-5xl h-full flex flex-col space-y-6">
        <DeviceStatusCards />
        <div className="flex-grow">
          <OsVersion />
        </div>
      </div>
    </div>
  );
}
