import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle, Send, FileText } from "lucide-react";
import { useMyCompany } from "../../../hooks/myCompany";

const StatsCards = () => {
    const { companyJobStats } = useMyCompany();

    if (companyJobStats.isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[120px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    if (companyJobStats.isError) {
        return (
            <div className="text-center text-red-500 py-4">
                Failed to load statistics.
            </div>
        );
    }

    const statsData = companyJobStats.data?.payload || {};

    const stats = [
        {
            label: "Submit Jobs",
            value: statsData.totalJob ?? 0,
            color: "bg-green-500",
            icon: <FileText className="w-8 h-8 text-white/70" />,
        },
        {
            label: "Applications",
            value: statsData.totalApp ?? 0,
            color: "bg-violet-500",
            icon: <Users className="w-8 h-8 text-white/70" />,
        },
        {
            label: "Accepted",
            value: statsData.totalAppAccept ?? 0,
            color: "bg-blue-500",
            icon: <CheckCircle className="w-8 h-8 text-white/70" />,
        },
        {
            label: "Applied",
            value: statsData.totalAppApplied ?? 0,
            color: "bg-indigo-500",
            icon: <Send className="w-8 h-8 text-white/70" />,
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
                <Card
                    key={stat.label}
                    className={`${stat.color} relative overflow-hidden`}
                >
                    <CardContent className="flex items-center justify-between p-6">
                        <div>
                            <div className="text-4xl font-bold text-white">
                                {stat.value}
                            </div>
                            <div className="text-white/90 mt-2">
                                {stat.label}
                            </div>
                        </div>
                        <div className="opacity-40">{stat.icon}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default StatsCards;
