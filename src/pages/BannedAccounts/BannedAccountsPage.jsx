import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchBannedUsers, unbanUser } from '@/api/users'
import Toast from '@/components/Toast/Toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, User, Mail, Calendar, AlertTriangle, Unlock, X } from 'lucide-react'
import AdminLayout from '@/components/Layout/AdminLayout'

export default function BannedAccountsPage() {
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const queryClient = useQueryClient()
  const [toastMessage, setToastMessage] = useState(null)
  const [toastType, setToastType] = useState('success')
  const [searchTerm, setSearchTerm] = useState('')
  const [showUnbanModal, setShowUnbanModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Verify admin access
  if (!user || user.role !== 'ADMIN') {
    navigate(user ? '/404' : '/login')
    return null
  }

  // Fetch banned users data
  const { data: bannedUsers, isLoading, error } = useQuery({
    queryKey: ['bannedUsers'],
    queryFn: () => fetchBannedUsers(token),
    enabled: !!token,
    refetchOnWindowFocus: false,
    staleTime: 30000, // Consider data fresh for 30 seconds
    retry: 1
  })

  // Unban user mutation
  const unbanUserMutation = useMutation({
    mutationFn: (userId) => unbanUser(token, userId),
    onSuccess: () => {
      setToastMessage("User unbanned successfully!");
      setToastType("success");
      queryClient.invalidateQueries(['bannedUsers']);
      setShowUnbanModal(false);
      setSelectedUser(null);
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Failed to unban user.";
      setToastMessage(errorMessage);
      setToastType("error");
    },
  });

  const handleUnbanUser = (user) => {
    setSelectedUser(user);
    setShowUnbanModal(true);
  };

  const handleConfirmUnban = () => {
    unbanUserMutation.mutate(selectedUser._id);
  };

  const handleCancelUnban = () => {
    setShowUnbanModal(false);
    setSelectedUser(null);
  };

  // Filter accounts based on search term
  const filteredAccounts = bannedUsers?.filter(account => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      account.email?.toLowerCase().includes(searchLower) ||
      account.role?.toLowerCase().includes(searchLower)
    )
  })

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-500 text-center">
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p>{error.message}</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <AdminLayout>
      {toastMessage && <Toast message={toastMessage} type={toastType} />}
      
      {/* Unban User Modal */}
      {showUnbanModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 w-full max-w-sm shadow-lg border mx-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Unban User</h3>
              <button
                onClick={handleCancelUnban}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-2">
                Unban <span className="font-semibold">{selectedUser?.email}</span>?
              </p>
              <p className="text-sm text-gray-500">
                This will restore the user's access to the platform.
              </p>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                onClick={handleCancelUnban}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-3 py-1 text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmUnban}
                disabled={unbanUserMutation.isLoading}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm"
              >
                {unbanUserMutation.isLoading ? "Unbanning..." : "Unban"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Banned Accounts</h1>
            <div className="relative w-64">
              <Input
                type="text"
                placeholder="Search by email or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ban Reason
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Banned At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAccounts?.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-red-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.email?.split('@')[0] || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {user._id.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-red-400 mr-2" />
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {user.banReason || "No reason provided"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {user.banAt ? formatDate(user.banAt) : "N/A"}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.createdAt ? formatDate(user.createdAt) : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Button
                          onClick={() => handleUnbanUser(user)}
                          disabled={unbanUserMutation.isLoading}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-sm"
                        >
                          <Unlock className="h-4 w-4 mr-1" />
                          Unban
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredAccounts?.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-500">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No banned accounts found</p>
                    <p className="text-sm">All accounts are currently active</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 