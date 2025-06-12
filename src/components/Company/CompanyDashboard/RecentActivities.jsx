import { Card, CardContent } from "@/components/ui/card";

const activities = [
    {
        icon: "⭐",
        content: (
            <>
                Your job for <b>IOS Developer</b> has been approved!
            </>
        ),
        color: "bg-violet-100 text-violet-500",
    },
    // ... rest of the activities array
];

const RecentActivities = () => {
    return (
        <Card className="col-span-2">
            <CardContent className="p-0">
                <div className="p-6 border-b font-semibold text-lg">
                    Recent Activities
                </div>
                <ul>
                    {activities.map((act, idx) => (
                        <li
                            key={idx}
                            className="flex items-center gap-4 px-6 py-4 border-b last:border-b-0"
                        >
                            <span
                                className={`flex items-center justify-center w-8 h-8 rounded-full text-lg ${act.color}`}
                            >
                                {act.icon}
                            </span>
                            <span className="text-gray-700 text-sm">
                                {act.content}
                            </span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};

export default RecentActivities;
