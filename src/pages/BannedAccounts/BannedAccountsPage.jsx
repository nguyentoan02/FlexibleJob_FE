import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AccountsTable } from '@/components/BanAccount/AccountsTable'
import { userApi } from '@/api/userApi'
import Toast from '@/components/Toast/Toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import AdminLayout from '@/components/Layout/AdminLayout'

export default function BannedAccountsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [toastMessage, setToastMessage] = useState(null)
  const [toastType, setToastType] = useState('success')
  const [searchTerm, setSearchTerm] = useState('')

  // Verify admin access
  if (!user || user.role !== 'ADMIN') {
    navigate(user ? '/404' : '/login')
    return null
  }

  // Fetch users data
  const { data: accounts, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: userApi.getAllUsers,
    refetchOnWindowFocus: false,
    staleTime: 30000, // Consider data fresh for 30 seconds
    retry: 1
  })

  // Filter accounts based on search term
  const filteredAccounts = accounts?.filter(account => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      account.email?.toLowerCase().includes(searchLower) ||
      account.name?.toLowerCase().includes(searchLower)
    )
  })

  // Toggle ban mutation
  const toggleBanMutation = useMutation({
    mutationFn: async ({ userId, isBanned }) => {
      return userApi.toggleBanUser(userId, isBanned)
    },
    onSuccess: (data, variables) => {
      // Update local data
      queryClient.setQueryData(['users'], (oldData) => {
        return oldData.map(user => 
          user._id === variables.userId 
            ? { ...user, isBanned: !variables.isBanned }
            : user
        )
      })

      // Show success message
      setToastMessage(`Account successfully ${variables.isBanned ? 'banned' : 'unbanned'}`)
      setToastType('success')
      setTimeout(() => setToastMessage(null), 3000)
    },
    onError: (error) => {
      const errorMessage = error.message || 'Failed to update account status'
      setToastMessage(errorMessage)
      setToastType('error')
      setTimeout(() => setToastMessage(null), 3000)

      // If unauthorized or forbidden, redirect to login
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login')
      }
    }
  })

  const handleToggleBan = (userId) => {
    const account = accounts?.find(acc => acc._id === userId)
    if (!account) return

    toggleBanMutation.mutate({ 
      userId, 
      isBanned: account.isBanned 
    })
  }

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

  return (
    <AdminLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Account Management</h1>
            <div className="relative w-64">
              <Input
                type="text"
                placeholder="Search by name or email..."
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
            {toastMessage && (
              <Toast message={toastMessage} type={toastType} />
            )}
            <div className="bg-white shadow rounded-lg">
              <AccountsTable 
                accounts={filteredAccounts || []}
                onToggleBan={handleToggleBan}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 