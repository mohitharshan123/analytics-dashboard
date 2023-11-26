import axios from "axios";
import { AnalyticsParams } from "hooks/useAnalyticsApi";

export const fetchAnalytics = async (params: AnalyticsParams) => await axios.get("https://i3xdlpowza.execute-api.us-east-1.amazonaws.com/analytics", { params })