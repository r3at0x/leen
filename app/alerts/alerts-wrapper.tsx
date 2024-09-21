"use client";

import { useSession } from "next-auth/react";
import AlertsContent from "./alerts-content";

export default function AlertsPageWrapper() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email as string | undefined;

  return <AlertsContent userEmail={userEmail} />;
}
