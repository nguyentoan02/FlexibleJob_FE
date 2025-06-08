import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AdminHeader } from '@/components/Header/AdminHeader'
import { AdminSidebar } from '@/components/Sidebar/AdminSidebar'
import { AccountsTable } from '@/components/BanAccount/AccountsTable'
import { userApi } from '@/api/userApi'
import Toast from '@/components/Toast/Toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function BannedAccountsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [toastType, setToastType] = useState('success')
  const [searchTerm, setSearchTerm] = useState('')

  // Verify admin access
  if (!user) {
    navigate('/login')
    return null
  }
  
  if (user.role !== 'ADMIN') {
    navigate('/404')
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error.message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminHeader onMenuClick={toggleMobileMenu} />
      
      <div className="flex pt-16">
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div
          className={`${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed top-16 bottom-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-0`}
        >
          <AdminSidebar />
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Account Management</h1>
                <div className="relative w-64">
                  <Input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={handleSearch}
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
        </main>
      </div>
    </div>
  )
} 