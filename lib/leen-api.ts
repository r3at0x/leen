import axios from "axios";

const createLeenApi = async (email: string) => {
  console.log("Sending email to check-user:", email); // Add this line

  const response = await fetch("/api/check-user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error("Failed to get user credentials");
  }

  const data = await response.json();
  console.log("Response from check-user:", data); // Add this line

  if (!data.exists || !data.connectionId || !data.apiKey) {
    throw new Error("User credentials are missing or invalid");
  }

  const { connectionId, apiKey } = data;

  console.log("Credentials retrieved:", { connectionId, apiKey });

  return axios.create({
    baseURL: "https://api.leen.dev/v1",
    headers: {
      "X-CONNECTION-ID": connectionId,
      "X-API-KEY": apiKey,
    },
  });
};

interface FetchDevicesParams {
  limit?: number;
  offset?: number;
}

export const fetchDevices = async (
  email?: string,
  params: FetchDevicesParams = {}
) => {
  try {
    const leenApi = email
      ? await createLeenApi(email)
      : await createLeenApi("");
    const response = await leenApi.get("/entities/devices", { params });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching devices:",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).response?.data || (error as Error).message
    );
    throw error;
  }
};

interface FetchAlertsParams {
  limit?: number;
  offset?: number;
  sort?: string;
}

export const fetchAlerts = async (
  email: string,
  params: FetchAlertsParams = {}
) => {
  try {
    const leenApi = await createLeenApi(email);
    const response = await leenApi.get("/edr/alerts", { params });
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching alerts:",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error as any).response?.data || (error as Error).message
    );
    throw error;
  }
};

export { createLeenApi };
