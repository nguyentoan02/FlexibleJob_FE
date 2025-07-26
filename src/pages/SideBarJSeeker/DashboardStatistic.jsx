import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import ApplicationPieChart from "./ApplicationPieChart";
import ApplicationLineChart from "./ApplicationLineChart";

export default function DashboardStatistic() {
    const { token } = useAuth();
    const [filter, setFilter] = useState("month");
    const [selectedMonth, setSelectedMonth] = useState(
        new Date().getMonth() + 1
    );
    const [selectedWeek, setSelectedWeek] = useState(0); // 0 = tuần hiện tại

    // Tính toán tuần hiện tại
    const getCurrentWeek = () => {
        const now = new Date();
        const monday = new Date(now);
        monday.setDate(now.getDate() - now.getDay() + 1); // Thứ 2 của tuần
        return monday;
    };

    // Tính toán tuần dựa trên selectedWeek (offset từ tuần hiện tại)
    const getWeekRange = (weekOffset = 0) => {
        const currentWeek = getCurrentWeek();
        const targetWeek = new Date(currentWeek);
        targetWeek.setDate(currentWeek.getDate() + weekOffset * 7);

        const startOfWeek = new Date(targetWeek);
        const endOfWeek = new Date(targetWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return { startOfWeek, endOfWeek };
    };

    // Query cho tổng quan (không thay đổi theo filter)
    const {
        data: overallStats,
        isLoading: overallLoading,
        error: overallError,
    } = useQuery({
        queryKey: ["jobseekerOverallStats"],
        queryFn: async () => {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/jobs/my-applications/stats`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.json();
        },
        enabled: !!token,
    });

    // Query cho biểu đồ theo thời gian (thay đổi theo filter)
    const {
        data: chartStats,
        isLoading: chartLoading,
        error: chartError,
    } = useQuery({
        queryKey: ["jobseekerChartStats", filter, selectedMonth, selectedWeek],
        queryFn: async () => {
            const params = new URLSearchParams();
            params.append("period", filter);

            if (filter === "month") {
                const year = new Date().getFullYear();
                const startDate = new Date(year, selectedMonth - 1, 1);
                const endDate = new Date(
                    year,
                    selectedMonth,
                    0,
                    23,
                    59,
                    59,
                    999
                );
                params.append("startDate", startDate.toISOString());
                params.append("endDate", endDate.toISOString());
            } else if (filter === "week") {
                const { startOfWeek, endOfWeek } = getWeekRange(selectedWeek);
                params.append("startDate", startOfWeek.toISOString());
                params.append("endDate", endOfWeek.toISOString());
            }

            const res = await fetch(
                `${
                    import.meta.env.VITE_API_URL
                }/jobs/my-applications/stats?${params}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.json();
        },
        enabled: !!token,
    });

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">
                My Application Statistics
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Component biểu đồ tròn - bên trái */}
                <div className="flex-1">
                    <ApplicationPieChart
                        stats={overallStats?.payload || {}}
                        isLoading={overallLoading}
                        error={overallError}
                    />
                </div>

                {/* Component biểu đồ thời gian - bên phải */}
                <div className="flex-1">
                    <ApplicationLineChart
                        chartData={chartStats?.payload?.chart || []}
                        filter={filter}
                        setFilter={setFilter}
                        selectedMonth={selectedMonth}
                        setSelectedMonth={setSelectedMonth}
                        selectedWeek={selectedWeek}
                        setSelectedWeek={setSelectedWeek}
                        isLoading={chartLoading}
                        error={chartError}
                    />
                </div>
            </div>
        </div>
    );
}
