import api from "./api";
import { toast } from "react-toastify";

export const fetchElections = async (BASE_URL) => {
  try {
    const response = await api.get(`${BASE_URL}api/elections/elections/`);
    if (response.status === 200) {
      return response.data.results;
    }
  } catch (error) {
    toast.error("Error fetching elections");
    return [];
  }
};
