export interface Alert {
  id: string;
  vendor_id: string;
  title: string;
  description: string;
  assigned_user: string;
  severity: string;
  vendor_severity: string;
  status: string;
  vendor_status: string;
  first_event_time: string;
  last_event_time: string;
  resolved_time: string;
  vendor: string;
  // Add other fields as needed
}
