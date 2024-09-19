export interface Device {
  id: string;
  status: "active" | "offline";
  hostnames: string[];
  os_version: string;
  ipv4s: string[];
  mac_addresses?: string[];
  last_seen: string;
  vendor?: string;
  source_vendors?: Array<{
    vendor: string;
    vendor_id: string;
    agent_info?: {
      agent_version: string;
      signature_version: string;
      policies: Array<any>;
    };
  }>;
}
