import { Card, CardContent } from "@/components/ui/card";
import { Users, Bell, Bookmark, FileText } from "lucide-react";

const stats = [
    {
        label: "Submit Jobs",
        value: 46,
        color: "bg-green-500",
        icon: <FileText className="w-8 h-8 text-white/70" />,
    },
    {
        label: "Applications",
        value: 87,
        color: "bg-violet-500",
        icon: <Users className="w-8 h-8 text-white/70" />,
    },
    {
        label: "Notifications",
        value: 312,
        color: "bg-red-500",
        icon: <Bell className="w-8 h-8 text-white/70" />,
    },
    {
        label: "Bookmark",
        value: 32,
        color: "bg-blue-500",
        icon: <Bookmark className="w-8 h-8 text-white/70" />,
    },
];

const StatsCards = () => {
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
