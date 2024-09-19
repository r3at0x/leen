import { Metadata } from "next";
import DevicesContent from "./DevicesContent";

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
