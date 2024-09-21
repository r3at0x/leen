import { useState, useEffect } from "react";
import { fetchDevices, fetchAlerts } from "@/lib/leen-api";
import { Device } from "@/types/device";

export function useDevices(userEmail?: string) {
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userEmail) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchDevices(userEmail, { limit: 500 });
        setDevices(data.items);
      } catch (err) {
        setError(() => null);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userEmail]);

  return { devices: devices as Device[], isLoading, error };
}

export function useAlerts(userEmail: string | undefined) {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userEmail) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAlerts(userEmail, { limit: 500 });
        setAlerts(data.items);
      } catch (err) {
        setError(() => null);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userEmail]);

  return { alerts, isLoading, error };
}
