import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

const invoices = [
    {
        plan: "Starter Plan",
        status: "Unpaid",
        order: "#20551",
        date: "01/08/2019",
        color: "bg-orange-100 text-orange-500",
    },
    // ... rest of the invoices array
];

const InvoicesList = () => {
    return (
        <Card>
            <CardContent className="p-0">
                <div className="p-6 border-b font-semibold text-lg">
                    Invoices
                </div>
                <ul>
                    {invoices.map((inv, idx) => (
                        <li
                            key={idx}
                            className="flex items-center gap-4 px-6 py-4 border-b last:border-b-0"
                        >
                            <span
                                className={`flex items-center justify-center w-8 h-8 rounded-full ${inv.color}`}
                            >
                                <FileText className="w-5 h-5" />
                            </span>
                            <div className="flex-1">
                                <div className="font-semibold">{inv.plan}</div>
                                <div className="text-xs text-gray-500">
                                    {inv.status} &nbsp;|&nbsp; Order:{" "}
                                    {inv.order} &nbsp;|&nbsp; Date: {inv.date}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};

export default InvoicesList;
