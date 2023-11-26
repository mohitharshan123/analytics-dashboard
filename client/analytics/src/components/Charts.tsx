import { ChartBarIcon, ChartPieIcon, Bars3BottomLeftIcon } from "@heroicons/react/24/solid";
import { TabGroup, TabList, Tab, TabPanels, TabPanel, BarChart, DonutChart, BarList } from "@tremor/react";

import SkeletonLoader from "./SkeletonLoader";

export type ChartData = Array<{ name: string, value: number }>

type ChartProps = {
    isLoading: boolean,
    chartData: ChartData
}

const Charts: React.FC<ChartProps> = ({ isLoading, chartData }) => <TabGroup>
    <TabList className="mt-8">
        <Tab icon={ChartBarIcon}></Tab>
        <Tab icon={ChartPieIcon}></Tab>
        <Tab icon={Bars3BottomLeftIcon}></Tab>
    </TabList>
    <TabPanels>
        <TabPanel>
            {isLoading ? <SkeletonLoader /> :
                <div className="mt-10">
                    <BarChart
                        className="mt-6"
                        data={chartData}
                        index="name"
                        categories={["value"]}
                        colors={["blue", "red"]}
                        yAxisWidth={48}
                    />
                </div>
            }
        </TabPanel>
        <TabPanel>
            {isLoading ? <SkeletonLoader /> :
                <div className="mt-10">
                    <DonutChart
                        className="mt-6"
                        data={chartData}
                        category="value"
                        index="name"
                        colors={["slate", "violet", "indigo"]}
                    />
                </div>
            }

        </TabPanel>
        <TabPanel>
            {isLoading ? <SkeletonLoader /> :
                <div className="mt-10">
                    <BarList data={chartData} className="mt-2" />
                </div>
            }
        </TabPanel>
    </TabPanels>
</TabGroup>


export default Charts;