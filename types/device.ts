export interface Device {
  id: string;
  status: "active" | "offline";
  hostnames: string[];
  os_version: string;
  ipv4s: string[];
  mac_addresses?: string[];
  last_seen: string;
}
