"use client";

import { useSession } from "next-auth/react";
import DevicesPage from "./devices-content";

export default function DevicesPageWrapper() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email as string | undefined;

  return <DevicesPage userEmail={userEmail} />;
}
