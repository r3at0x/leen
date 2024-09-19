import { Metadata } from "next";
import AlertsContent from "./alertsContent";

export const metadata: Metadata = {
  title: "Alerts | SDMVP",
  description: "View and manage security alerts",
};

export default function AlertsPage() {
  return (
    <div>
      <AlertsContent />
    </div>
  );
}
