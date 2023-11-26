import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import { AxiosResponse } from "axios"; 
import { fetchAnalytics } from "api/dashboard";

export type AnalyticsParams = {
    start_time: number,
    end_time: number,
    page: number,
    page_size: number
};

type AnalyticsApiResponse = AxiosResponse<{ 
    hits: { hits: Array<{ hits: any }>, 
    total: { value: number } }, 
    aggregations: any }>;

export type AnalyticsData = {
    total_calls: number;
    total_failures: number;
    unique_users: number;
    data: Array<any>;
    total_count: number;
};

export const useFetchAnalytics = (
    params: AnalyticsParams,
    options?: UseQueryOptions<AnalyticsApiResponse, unknown, AnalyticsData>
): UseQueryResult<AnalyticsData, any> => {
    return useQuery({
        queryKey: ["analytics", params],
        queryFn: () => fetchAnalytics(params),
        select: ({ data }: AnalyticsApiResponse) => {
            const { aggregations, hits } = data;
            const total_calls = aggregations?.total_calls?.value;
            const total_failures = aggregations?.total_failures?.failed_calls?.value;
            const unique_users = aggregations?.unique_users?.value;
            const hitsData = hits?.hits.map((hit: any) => hit._source);
            const total_count = hits?.total?.value;

            return {
                total_calls,
                total_failures,
                unique_users,
                total_count,
                data: hitsData,
            };
        },
        ...options,
    });
};
