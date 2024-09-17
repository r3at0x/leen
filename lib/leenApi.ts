import axios from "axios";

const leenApi = axios.create({
  baseURL: "https://api.leen.dev/v1",
  headers: {
    "X-CONNECTION-ID": process.env.NEXT_PUBLIC_CONNECTION_ID,
    "X-API-KEY": process.env.NEXT_PUBLIC_API_KEY,
  },
});

interface FetchDevicesParams {
  limit?: number;
  offset?: number;
}

export const fetchDevices = async (params: FetchDevicesParams = {}) => {
  try {
    const response = await leenApi.get("/entities/devices", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching devices:", error);
    throw error;
  }
};

export default leenApi;
