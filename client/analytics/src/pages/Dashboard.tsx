import { useMemo, useState } from "react"

import { useFetchAnalytics } from "hooks/useAnalyticsApi";
import {
    Col, Card, DateRangePicker, DateRangePickerItem, DateRangePickerValue,
    Grid, Text, Metric, Title, TabGroup, TabList, Tab, TabPanels, TabPanel
} from "@tremor/react"
import { Table, SkeletonLoader, Charts, Pagination } from "components";

import { getChartsData, getDateRangePickerItems } from "./utils";

export const PAGE_SIZE = 10

const Dashboard = () => {
    const [page, setPage] = useState<number>(0);
    const [dateRange, setDateRange] = useState<DateRangePickerValue>({
        from: new Date(2023, 1, 1),
        to: new Date(),
    });

    const params = {
        start_time: +(dateRange.from || 0),
        end_time: +(dateRange?.to || 0),
        page: page * PAGE_SIZE,
        page_size: PAGE_SIZE
    }

    const { data, isLoading } = useFetchAnalytics(params)
    const chartData = useMemo(() => data ? getChartsData(data) : [], [data])

    return (<>
        <Title>Dashboard</Title>
        <Text>API Analytics</Text>
        <DateRangePicker
            className="max-w-md mx-auto mt-4"
            value={dateRange}
            onValueChange={setDateRange}
            selectPlaceholder="Select range"
            color="rose"
        >
            {getDateRangePickerItems().map(item =>
                <DateRangePickerItem key={item.key} value={item.value} from={item.from} to={item.to}>
                    {item.label}
                </DateRangePickerItem>)}
        </DateRangePicker>
        <TabGroup className="mt-6">
            <TabList>
                <Tab>Overview</Tab>
                <Tab>Detail</Tab>
            </TabList>
            <TabPanels>
                <TabPanel>
                    {isLoading ? <SkeletonLoader /> :
                        <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-2">
                            <Col>
                                <Card decoration="top" decorationColor="indigo">
                                    <Text>Total Calls</Text>
                                    <Metric>{data?.total_calls}</Metric>
                                </Card>
                            </Col>
                            <Card decoration="top" decorationColor="indigo">
                                <Text>Total failures</Text>
                                <Metric>{data?.total_failures}</Metric>
                            </Card>
                            <Col>
                                <Card decoration="top" decorationColor="indigo">
                                    <Text>Unique users</Text>
                                    <Metric>{data?.unique_users}</Metric>
                                </Card>
                            </Col>
                        </Grid>
                    }
                    <div className="p-6">
                        <Charts {...{ isLoading, chartData }} />
                    </div>
                </TabPanel>
                <TabPanel>
                    {isLoading ? <SkeletonLoader isTable />
                        : <Table {...{ data, page, setPage }} />
                    }
                    <Pagination {...{ page, setPage }} totalCount={data?.total_count ?? 10} />
                </TabPanel>
            </TabPanels>
        </TabGroup>
    </>
    )
}

export default Dashboard