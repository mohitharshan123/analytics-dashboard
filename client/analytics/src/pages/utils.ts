import { ChartData } from "components/Charts";
import { AnalyticsData } from "hooks/useAnalyticsApi";

export const getDateRangePickerItems = () => {
    const now = new Date();
    const last24HoursFrom = new Date(now);
    last24HoursFrom.setHours(now.getHours() - 24);

    const last7DaysFrom = new Date(now);
    last7DaysFrom.setDate(now.getDate() - 7);
    const last7DaysTo = new Date(now);

    const dateRangePickerItems = [
        {
            key: "last_24_hours",
            value: "last_24_hours",
            from: last24HoursFrom,
            label: "Last 24 hours"
        },
        {
            key: "last_7_days",
            value: "last_7_days",
            from: last7DaysFrom,
            to: last7DaysTo,
            label: "Last 7 days"
        },
    ];
    return dateRangePickerItems
}

export const getChartsData = (data: AnalyticsData): ChartData => ([
    {
        name: "Total calls",
        value: data?.total_calls,
    },
    {
        name: "Total failures",
        value: data?.total_failures
    },
    {
        name: "Unique users",
        value: data?.unique_users
    },
])