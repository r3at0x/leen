import { Alert } from "@/types/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format, parseISO } from "date-fns";

interface RecentAlertsProps {
  alerts: Alert[];
}

export function RecentAlerts({ alerts }: RecentAlertsProps) {
  return (
    <div className="space-y-8">
      {alerts.map((alert) => (
        <div key={alert.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{alert.severity.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{alert.title}</p>
            <p className="text-sm text-muted-foreground">
              {alert.vendor} - {alert.status}
            </p>
          </div>
          <div className="ml-auto font-medium">
            {alert.last_event_time 
              ? format(parseISO(alert.last_event_time), "MMM d, HH:mm")
              : "N/A"}
          </div>
        </div>
      ))}
    </div>
  );
}
