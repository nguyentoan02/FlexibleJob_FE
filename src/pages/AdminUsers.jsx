import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, banUser } from "../api/users";
import { useAuth } from "../hooks/useAuth";
import AdminLayout from '@/components/Layout/AdminLayout';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, Ban, X } from "lucide-react";
import { useState } from "react";
import Toast from "@/components/Toast/Toast";

export default function AdminUsers() {
    const { token } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");
    const [showBanModal, setShowBanModal] = useState(false);
    const [banReason, setBanReason] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const queryClient = useQueryClient();

    const { data: users, isLoading, isError } = useQuery({
        queryKey: ["users"],
        queryFn: () => fetchUsers(token),
        enabled: !!token,
    });

    const banUserMutation = useMutation({
        mutationFn: ({ userId, reason }) => banUser(token, userId, reason),
        onSuccess: () => {
            queryClient.invalidateQueries(["users"]);
            setShowBanModal(false);
            setBanReason("");
            setSelectedUser(null);
        },
    });

    const handleBanUser = (user) => {
        setSelectedUser(user);
        setShowBanModal(true);
    };

    const handleConfirmBan = () => {
        if (!banReason.trim()) return;
        
        banUserMutation.mutate({
            userId: selectedUser._id,
            reason: banReason.trim()
        });
    };

    const handleCancelBan = () => {
        setShowBanModal(false);
        setBanReason("");
        setSelectedUser(null);
    };

    const filteredUsers = users?.filter(user => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            user.email?.toLowerCase().includes(searchLower) ||
            user.role?.toLowerCase().includes(searchLower)
        );
    });

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                </div>
            </AdminLayout>
        );
    }

    if (isError) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-screen">
                    <div className="text-red-500 text-center">
                        <h2 className="text-2xl font-bold mb-2">Error</h2>
                        <p>Failed to load users</p>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            {/* Ban User Modal */}
            {showBanModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 w-full max-w-sm shadow-lg border mx-4">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold">Ban User</h3>
                            <button onClick={handleCancelBan} className="text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <div className="mb-3">
                            <p className="text-sm text-gray-600 mb-2">
                                Ban <span className="font-semibold">{selectedUser?.email}</span>?
                            </p>
                            
                            <Label htmlFor="banReason" className="text-sm font-medium">
                                Reason *
                            </Label>
                            <textarea
                                id="banReason"
                                value={banReason}
                                onChange={(e) => setBanReason(e.target.value)}
                                placeholder="Enter ban reason..."
                                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-sm bg-white/90"
                                rows="3"
                                required
                            />
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                            <Button onClick={handleCancelBan} className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 text-sm">
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmBan}
                                disabled={banUserMutation.isLoading || !banReason.trim()}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm"
                            >
                                {banUserMutation.isLoading ? "Banning..." : "Ban"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
                        <div className="relative w-64">
                            <Input
                                type="text"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        </div>
                    </div>

                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers?.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img
                                                        className="h-10 w-10 rounded-full"
                                                        src={user.imageUrl || "https://via.placeholder.com/40"}
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.name || "N/A"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.isBanned
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-green-100 text-green-800"
                                            }`}>
                                                {user.isBanned ? "Banned" : "Active"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {!user.isBanned && (
                                                <Button
                                                    onClick={() => handleBanUser(user)}
                                                    disabled={banUserMutation.isLoading}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm"
                                                >
                                                    <Ban className="h-4 w-4 mr-1" />
                                                    Ban
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
