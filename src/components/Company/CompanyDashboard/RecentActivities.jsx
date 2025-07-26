import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useCompanyStats } from "@/hooks/company";

const StatsChart = ({ data, title, lineColor }) => {
    return (
        <div style={{ height: "400px" }}>
            <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="count"
                        name={title.split(" trong")[0]} // Lấy tên cho legend
                        stroke={lineColor}
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

const RecentActivities = () => {
    const [range, setRange] = useState("30d");

    // Gọi hook cho từng loại metric
    const { data: followerData, isLoading: loadingFollowers } = useCompanyStats(
        "followers",
        range
    );
    const { data: applicationData, isLoading: loadingApplications } =
        useCompanyStats("applications", range);

    const followerTitle = useMemo(
        () =>
            `Followers in ${
                range === "30d"
                    ? "30 days"
                    : range === "90d"
                    ? "90 days"
                    : "1 year"
            }`,
        [range]
    );

    const applicationTitle = useMemo(
        () =>
            `Applications in ${
                range === "30d"
                    ? "30 days"
                    : range === "90d"
                    ? "90 days"
                    : "1 year"
            }`,
        [range]
    );

    return (
        <Card className="col-span-2">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold">
                        Company Stats
                    </CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <Tabs defaultValue="followers">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="followers">Followers</TabsTrigger>
                        <TabsTrigger value="applications">
                            Applications
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="followers" className="mt-4">
                        {loadingFollowers ? (
                            <p>Loading .....</p>
                        ) : (
                            <StatsChart
                                data={followerData || []}
                                title={followerTitle}
                                lineColor="#8884d8"
                            />
                        )}
                    </TabsContent>
                    <TabsContent value="applications" className="mt-4">
                        {loadingApplications ? (
                            <p>Loading .....</p>
                        ) : (
                            <StatsChart
                                data={applicationData || []}
                                title={applicationTitle}
                                lineColor="#82ca9d"
                            />
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default RecentActivities;
