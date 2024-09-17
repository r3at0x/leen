import { auth } from "@/auth";
import AccessDenied from "@/components/accessDenied";
import DevicesContent from "./DevicesContent";

export default async function DevicesPage() {
  try {
    const session = await auth();

    if (!session) {
      return <AccessDenied />;
    }

    return (
      <div>
        <DevicesContent />
      </div>
    );
  } catch (error) {
    console.error("Error in DevicesPage:", error);
    return <div>An error occurred while loading the page.</div>;
  }
}
