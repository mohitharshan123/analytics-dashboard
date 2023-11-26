import axios from "axios";

export const fetchAnalytics = async (params: any) => await axios.get("https://i3xdlpowza.execute-api.us-east-1.amazonaws.com/analytics", { params })