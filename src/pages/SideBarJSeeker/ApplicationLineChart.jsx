import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";

const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

export default function ApplicationLineChart({
    chartData,
    filter,
    setFilter,
    selectedMonth,
    setSelectedMonth,
    selectedWeek,
    setSelectedWeek,
    isLoading,
    error,
}) {
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

    // Format tuần để hiển thị
    const formatWeekRange = (weekOffset = 0) => {
        const { startOfWeek, endOfWeek } = getWeekRange(weekOffset);
        const formatDate = (date) => {
            return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
        };
        return `${formatDate(startOfWeek)} - ${formatDate(endOfWeek)}`;
    };

    // Format dữ liệu để hiển thị ngày tháng rõ ràng
    const formatChartData = (data) => {
        return data.map((item) => ({
            ...item,
            _id: new Date(item._id).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }),
        }));
    };

    // Chuyển tuần trước/sau
    const handlePreviousWeek = () => {
        setSelectedWeek(selectedWeek - 1);
    };

    const handleNextWeek = () => {
        setSelectedWeek(selectedWeek + 1);
    };

    if (isLoading) {
        return (
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Applications Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Applications Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-red-600 h-64 flex items-center justify-center">
                        Error loading chart data
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Applications Over Time</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4 mb-4">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border rounded px-3 py-2 text-sm"
                    >
                        <option value="month">By Month</option>
                        <option value="week">By Week</option>
                    </select>

                    {filter === "month" && (
                        <select
                            value={selectedMonth}
                            onChange={(e) =>
                                setSelectedMonth(Number(e.target.value))
                            }
                            className="border rounded px-3 py-2 text-sm"
                        >
                            {months.map((m, idx) => (
                                <option key={m} value={idx + 1}>
                                    {m}
                                </option>
                            ))}
                        </select>
                    )}

                    {filter === "week" && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePreviousWeek}
                                className="p-2 border rounded hover:bg-gray-100"
                                title="Previous week"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-sm font-medium min-w-32 text-center">
                                {formatWeekRange(selectedWeek)}
                            </span>
                            <button
                                onClick={handleNextWeek}
                                className="p-2 border rounded hover:bg-gray-100"
                                title="Next week"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    )}
                </div>

                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={formatChartData(chartData)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" fill="#6366f1" />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
