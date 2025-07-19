import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#34d399", "#f87171", "#60a5fa"];

export default function ApplicationPieChart({ stats, isLoading, error }) {
    const pieData = [
        { name: "Applied", value: stats.applied || 0 },
        { name: "Rejected", value: stats.rejected || 0 },
        { name: "Hired", value: stats.hired || 0 },
    ];

    if (isLoading) {
        return (
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Status Ratio</CardTitle>
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
                    <CardTitle>Status Ratio</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-red-600 h-64 flex items-center justify-center">
                        Error loading data
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Status Ratio</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                        >
                            {pieData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>

                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">
                            {stats.total || 0}
                        </div>
                        <div className="text-gray-500 text-sm">
                            Total Applications
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">
                            {stats.applied || 0}
                        </div>
                        <div className="text-gray-500 text-sm">Applied</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-500">
                            {stats.rejected || 0}
                        </div>
                        <div className="text-gray-500 text-sm">Rejected</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-500">
                            {stats.hired || 0}
                        </div>
                        <div className="text-gray-500 text-sm">Hired</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
