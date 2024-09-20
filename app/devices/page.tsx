import { Metadata } from "next";
import DevicesContent from "./devices-content";

export const metadata: Metadata = {
  title: "Devices | SDMVP",
  description: "List and manage all connected devices",
};

export default function DevicesPage() {
  return (
    <div>
      <DevicesContent />
    </div>
  );
}
