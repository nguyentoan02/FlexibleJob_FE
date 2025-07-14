import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useMyCompany } from "../../../hooks/myCompany";

const statusColor = {
    PENDING: "bg-orange-100 text-orange-500",
    PAID: "bg-green-100 text-green-600",
    CANCELLED: "bg-red-100 text-red-500",
};

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB");
}

const InvoicesList = () => {
    const { companyInvoices } = useMyCompany();

    if (companyInvoices.isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[120px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    if (companyInvoices.isError) {
        return (
            <div className="text-center text-red-500 py-4">
                Failed to load invoices.
            </div>
        );
    }

    const invoices = companyInvoices.data?.payload || [];

    return (
        <Card>
            <CardContent className="p-0">
                <div className="p-6 border-b font-semibold text-lg">
                    Invoices
                </div>
                <ul>
                    {invoices.length === 0 && (
                        <li className="px-6 py-6 text-gray-400 text-center">
                            No invoices found.
                        </li>
                    )}
                    {invoices.map((inv) => (
                        <li
                            key={inv._id}
                            className="flex items-center gap-4 px-6 py-4 border-b last:border-b-0"
                        >
                            <span
                                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                    statusColor[inv.status] ||
                                    "bg-gray-100 text-gray-400"
                                }`}
                            >
                                <FileText className="w-5 h-5" />
                            </span>
                            <div className="flex-1">
                                <div className="font-semibold">
                                    {inv.packageId?.name || "N/A"}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Status:{" "}
                                    <span className="font-medium">
                                        {inv.status}
                                    </span>
                                    &nbsp;|&nbsp; Order:{" "}
                                    <span className="font-mono">
                                        {inv.orderCode}
                                    </span>
                                    &nbsp;|&nbsp; Date:{" "}
                                    {formatDate(inv.createdAt)}
                                </div>
                            </div>
                            <div className="font-bold text-indigo-600 min-w-[80px] text-right">
                                {inv.amount?.toLocaleString()}₫
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};

export default InvoicesList;
