import AdminLayout from "@/components/Layout/AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPendingCompanies, updateCompanyApproval } from "@/api/company";
import { useAuth } from "@/hooks/useAuth";
import Toast from "@/components/Toast/Toast";
import { useState } from "react";

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
                    <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-4 py-3 border-b-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
                                        Avatar
                                    </th>
                                    <th className="px-4 py-3 border-b-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
                                        Company Name
                                    </th>
                                    <th className="px-4 py-3 border-b-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 border-b-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
                                        Industry
                                    </th>
                                    <th className="px-4 py-3 border-b-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
                                        Size
                                    </th>
                                    <th className="px-4 py-3 border-b-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
                                        Location
                                    </th>
                                    <th className="px-4 py-3 border-b-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
                                        Website
                                    </th>
                                    <th className="px-4 py-3 border-b-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
                                        Phone
                                    </th>
                                    <th className="px-4 py-3 border-b-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
                                        LinkedIn
                                    </th>
                                    <th className="px-4 py-3 border-b-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
                                        Facebook
                                    </th>
                                    <th className="px-4 py-3 border-b-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
                                        Identity Images
                                    </th>
                                    <th className="px-4 py-3 border-b-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
                                        Album Images
                                    </th>
                                    <th className="px-4 py-3 border-b-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {companies.payload.map((company) => (
                                    <tr key={company._id}>
                                        <td className="px-4 py-4 border-b bg-white text-sm">
                                            <img
                                                src={company.imageUrl}
                                                alt="avatar"
                                                className="w-12 h-12 rounded-full object-cover border"
                                            />
                                        </td>
                                        <td className="px-4 py-4 border-b bg-white text-sm font-bold">
                                            {company.companyName || "N/A"}
                                        </td>
                                        <td className="px-4 py-4 border-b bg-white text-sm">
                                            {company.user?.email ||
                                                company.email}
                                        </td>
                                        <td className="px-4 py-4 border-b bg-white text-sm">
                                            {company.industry}
                                        </td>
                                        <td className="px-4 py-4 border-b bg-white text-sm">
                                            {company.companySize}
                                        </td>
                                        <td className="px-4 py-4 border-b bg-white text-sm">
                                            {company.location}
                                        </td>
                                        <td className="px-4 py-4 border-b bg-white text-sm">
                                            <a
                                                href={company.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline"
                                            >
                                                {company.website}
                                            </a>
                                        </td>
                                        <td className="px-4 py-4 border-b bg-white text-sm">
                                            {company.phone}
                                        </td>
                                        <td className="px-4 py-4 border-b bg-white text-sm">
                                            <a
                                                href={company.linkedinUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline"
                                            >
                                                LinkedIn
                                            </a>
                                        </td>
                                        <td className="px-4 py-4 border-b bg-white text-sm">
                                            <a
                                                href={company.facebookUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline"
                                            >
                                                Facebook
                                            </a>
                                        </td>
                                        <td className="px-4 py-4 border-b bg-white text-sm">
                                            {company.identityImage &&
                                            company.identityImage.length > 0 ? (
                                                <button
                                                    className="group relative focus:outline-none"
                                                    onClick={() =>
                                                        setIdentityModal({
                                                            open: true,
                                                            images: company.identityImage,
                                                            index: 0,
                                                        })
                                                    }
                                                >
                                                    <img
                                                        src={
                                                            company
                                                                .identityImage[0]
                                                        }
                                                        alt="identity"
                                                        className="w-10 h-10 rounded border object-cover transition-transform duration-200 group-hover:scale-110"
                                                    />
                                                    {company.identityImage
                                                        .length > 1 && (
                                                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full shadow">
                                                            +
                                                            {company
                                                                .identityImage
                                                                .length - 1}
                                                        </span>
                                                    )}
                                                    <span className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 rounded transition"></span>
                                                </button>
                                            ) : (
                                                <span className="text-gray-400">
                                                    No image
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 border-b bg-white text-sm">
                                            {company.albumImage &&
                                            company.albumImage.length > 0 ? (
                                                <div className="flex gap-2">
                                                    {company.albumImage.map(
                                                        (img, idx) => (
                                                            <img
                                                                key={idx}
                                                                src={img}
                                                                alt="album"
                                                                className="w-10 h-10 rounded border"
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">
                                                    No image
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 border-b bg-white text-sm">
                                            <button
                                                onClick={() =>
                                                    handleApproval(
                                                        company._id,
                                                        true,
                                                        company.companyName
                                                    )
                                                }
                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                                                disabled={mutation.isLoading}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleApproval(
                                                        company._id,
                                                        false,
                                                        company.companyName
                                                    )
                                                }
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                                disabled={mutation.isLoading}
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
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
                                <button
                                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
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
                                </button>
                                <button
                                    className={`px-4 py-2 rounded text-white ${
                                        confirmModal.isApproved
                                            ? "bg-green-600 hover:bg-green-700"
                                            : "bg-red-600 hover:bg-red-700"
                                    }`}
                                    onClick={handleConfirm}
                                    disabled={mutation.isLoading}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {identityModal.open && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                        <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-lg w-full flex flex-col items-center">
                            <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl"
                                onClick={() =>
                                    setIdentityModal({
                                        open: false,
                                        images: [],
                                        index: 0,
                                    })
                                }
                            >
                                ×
                            </button>
                            <img
                                src={identityModal.images[identityModal.index]}
                                alt={`identity-${identityModal.index}`}
                                className="max-h-96 max-w-full rounded shadow mb-4 transition-all duration-300"
                                style={{ objectFit: "contain" }}
                            />
                            <div className="flex items-center gap-4">
                                <button
                                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                    onClick={() =>
                                        setIdentityModal((prev) => ({
                                            ...prev,
                                            index: prev.index - 1,
                                        }))
                                    }
                                    disabled={identityModal.index === 0}
                                >
                                    &#8592; Prev
                                </button>
                                <span className="text-sm text-gray-600">
                                    {identityModal.index + 1} /{" "}
                                    {identityModal.images.length}
                                </span>
                                <button
                                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                    onClick={() =>
                                        setIdentityModal((prev) => ({
                                            ...prev,
                                            index: prev.index + 1,
                                        }))
                                    }
                                    disabled={
                                        identityModal.index ===
                                        identityModal.images.length - 1
                                    }
                                >
                                    Next &#8594;
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
