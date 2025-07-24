import AdminLayout from "@/components/Layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPendingCompanies, updateCompanyApproval } from "@/api/company";
import { useAuth } from "@/hooks/useAuth";
import Toast from "@/components/Toast/Toast";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Mail,
    Phone,
    Globe,
    Linkedin,
    Facebook,
    Briefcase,
    Users,
    MapPin,
    Image as ImageIcon,
    BookImage,
} from "lucide-react";

export default function ManageCompany() {
    const { token } = useAuth();
    const queryClient = useQueryClient();
    const [toast, setToast] = useState({ message: "", type: "" });
    const [identityModal, setIdentityModal] = useState({
        open: false,
        images: [],
        index: 0,
    });

    const [confirmModal, setConfirmModal] = useState({
        open: false,
        companyId: null,
        isApproved: null,
        companyName: "",
    });

    const [selectedCompany, setSelectedCompany] = useState(null);

    const {
        data: companies,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["pendingCompanies"],
        queryFn: () => getPendingCompanies(token),
        enabled: !!token,
    });

    const mutation = useMutation({
        mutationFn: updateCompanyApproval,
        onSuccess: (data) => {
            queryClient.invalidateQueries(["pendingCompanies"]);
            setToast({
                message: `Company ${data.payload.companyName} has been ${
                    data.payload.isApproved ? "approved" : "rejected"
                }.`,
                type: "success",
            });
        },
        onError: (error) => {
            setToast({
                message: "Failed to update company status.",
                type: "error",
            });
            console.error(error);
        },
    });

    const handleApproval = (companyId, isApproved, companyName) => {
        setConfirmModal({
            open: true,
            companyId,
            isApproved,
            companyName,
        });
    };

    const handleConfirm = () => {
        mutation.mutate({
            companyId: confirmModal.companyId,
            isApproved: confirmModal.isApproved,
            token,
        });
        setConfirmModal({
            open: false,
            companyId: null,
            isApproved: null,
            companyName: "",
        });
    };

    return (
        <AdminLayout>
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">
                    Manage Company Approval
                </h1>
                {toast.message && (
                    <Toast message={toast.message} type={toast.type} />
                )}
                {isLoading && <p>Loading pending companies...</p>}
                {isError && (
                    <p className="text-red-500">Error fetching data.</p>
                )}
                {companies && companies.payload.length === 0 && (
                    <p>No pending company approvals.</p>
                )}
                {companies && companies.payload.length > 0 && (
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="min-w-full">
                            <thead>
                                <tr>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Company Name
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Industry
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Size
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">
                                        Location
                                    </th>
                                    <th className="px-6 py-3 bg-gray-50 text-center text-xs font-semibold text-gray-600 uppercase">
                                        View
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {companies.payload.map((company) => (
                                    <tr
                                        key={company._id}
                                        className="hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-4 font-bold">
                                            {company.companyName || "N/A"}
                                        </td>
                                        <td className="px-6 py-4">
                                            {company.user?.email ||
                                                company.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {company.industry}
                                        </td>
                                        <td className="px-6 py-4">
                                            {company.companySize}
                                        </td>
                                        <td className="px-6 py-4">
                                            {company.location}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    setSelectedCompany(company)
                                                }
                                            >
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal hiển thị chi tiết công ty */}
                <Dialog
                    open={!!selectedCompany}
                    onOpenChange={() => setSelectedCompany(null)}
                >
                    <DialogContent className="max-w-2xl p-0">
                        <DialogHeader className="p-6 pb-4">
                            <DialogTitle className="text-2xl font-bold text-gray-800">
                                Company Details
                            </DialogTitle>
                        </DialogHeader>
                        {selectedCompany && (
                            <div className="px-6 pb-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <Briefcase className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {selectedCompany.companyName}
                                            </h3>
                                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />{" "}
                                                {selectedCompany.location}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                                        <div className="flex items-center gap-3 text-sm">
                                            <Briefcase className="w-5 h-5 text-gray-400" />
                                            <span className="font-semibold text-gray-600">
                                                Industry:
                                            </span>
                                            <span>
                                                {selectedCompany.industry}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Users className="w-5 h-5 text-gray-400" />
                                            <span className="font-semibold text-gray-600">
                                                Size:
                                            </span>
                                            <span>
                                                {selectedCompany.companySize}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Mail className="w-5 h-5 text-gray-400" />
                                            <span className="font-semibold text-gray-600">
                                                Email:
                                            </span>
                                            <a
                                                href={`mailto:${
                                                    selectedCompany.user
                                                        ?.email ||
                                                    selectedCompany.email
                                                }`}
                                                className="text-blue-600 hover:underline truncate"
                                            >
                                                {selectedCompany.user?.email ||
                                                    selectedCompany.email}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <Phone className="w-5 h-5 text-gray-400" />
                                            <span className="font-semibold text-gray-600">
                                                Phone:
                                            </span>
                                            <span>
                                                {selectedCompany.phone || "N/A"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="space-y-2 pt-4 border-t">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Globe className="w-5 h-5 text-gray-400" />
                                        <span className="font-semibold text-gray-600 w-20">
                                            Website:
                                        </span>
                                        <a
                                            href={selectedCompany.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline truncate"
                                        >
                                            {selectedCompany.website || "N/A"}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Linkedin className="w-5 h-5 text-gray-400" />
                                        <span className="font-semibold text-gray-600 w-20">
                                            LinkedIn:
                                        </span>
                                        <a
                                            href={selectedCompany.linkedinUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline truncate"
                                        >
                                            {selectedCompany.linkedinUrl ||
                                                "N/A"}
                                        </a>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Facebook className="w-5 h-5 text-gray-400" />
                                        <span className="font-semibold text-gray-600 w-20">
                                            Facebook:
                                        </span>
                                        <a
                                            href={selectedCompany.facebookUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline truncate"
                                        >
                                            {selectedCompany.facebookUrl ||
                                                "N/A"}
                                        </a>
                                    </div>
                                </div>

                                {/* Identity Images */}
                                {/* 
                                <div className="pt-4 border-t">
                                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <ImageIcon className="w-5 h-5 text-gray-500" />
                                        Identity Images
                                    </h4>
                                    {selectedCompany.identityImage &&
                                    selectedCompany.identityImage.length > 0 ? (
                                        <div className="flex flex-wrap gap-3">
                                            {selectedCompany.identityImage.map(
                                                (img, idx) => (
                                                    <img
                                                        key={idx}
                                                        src={img}
                                                        alt={`identity-${idx}`}
                                                        className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 shadow-sm hover:scale-105 transition-transform cursor-pointer"
                                                    />
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-sm">
                                            No identity images provided.
                                        </span>
                                    )}
                                </div>
                                */}

                                {/* Album Images */}
                                <div className="pt-4 border-t">
                                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                        <BookImage className="w-5 h-5 text-gray-500" />
                                        Album Images
                                    </h4>
                                    {selectedCompany.albumImage &&
                                    selectedCompany.albumImage.length > 0 ? (
                                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                            {selectedCompany.albumImage.map(
                                                (img, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="relative group rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm hover:scale-105 transition-transform"
                                                    >
                                                        <img
                                                            src={img}
                                                            alt={`album-${idx}`}
                                                            className="w-full h-24 object-cover"
                                                        />
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-sm">
                                            No album images provided.
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                        <DialogFooter className="p-6 bg-gray-50 border-t">
                            <Button
                                variant="destructive"
                                onClick={() => {
                                    setConfirmModal({
                                        open: true,
                                        companyId: selectedCompany._id,
                                        isApproved: false,
                                        companyName:
                                            selectedCompany.companyName,
                                    });
                                    setSelectedCompany(null);
                                }}
                            >
                                Reject
                            </Button>
                            <Button
                                variant="success"
                                onClick={() => {
                                    setConfirmModal({
                                        open: true,
                                        companyId: selectedCompany._id,
                                        isApproved: true,
                                        companyName:
                                            selectedCompany.companyName,
                                    });
                                    setSelectedCompany(null);
                                }}
                            >
                                Accept
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Modal xác nhận */}
                {confirmModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                        <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                            <h2 className="text-lg font-semibold mb-4 text-gray-800">
                                {confirmModal.isApproved ? "Approve" : "Reject"}{" "}
                                Company
                            </h2>
                            <p className="mb-6 text-gray-600">
                                Are you sure you want to{" "}
                                <span
                                    className={
                                        confirmModal.isApproved
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }
                                >
                                    {confirmModal.isApproved
                                        ? "approve"
                                        : "reject"}
                                </span>{" "}
                                company{" "}
                                <span className="font-bold">
                                    {confirmModal.companyName}
                                </span>
                                ?
                            </p>
                            <div className="flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setConfirmModal({
                                            open: false,
                                            companyId: null,
                                            isApproved: null,
                                            companyName: "",
                                        })
                                    }
                                    disabled={mutation.isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant={
                                        confirmModal.isApproved
                                            ? "success"
                                            : "destructive"
                                    }
                                    onClick={handleConfirm}
                                    disabled={mutation.isLoading}
                                >
                                    Confirm
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
