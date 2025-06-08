import React, { useState, useEffect } from 'react'
import { AdminHeader } from '@/components/Header/AdminHeader'
import { AdminSidebar } from '@/components/AdminSidebar'
import { AccountsTable } from '@/components/AccountsTable'
import { userApi } from '@/api/userApi'
import Toast from '@/components/Toast/Toast'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function BannedAccountsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)
  const [toastType, setToastType] = useState('success')

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      navigate('/')
    }
  }, [user, navigate])

  // Fetch accounts
  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const data = await userApi.getAllUsers()
      setAccounts(data)
      setLoading(false)
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch accounts'
      setError(errorMessage)
      setLoading(false)
      
      // Show error toast
      setToastMessage(errorMessage)
      setToastType('error')
      setTimeout(() => setToastMessage(null), 3000)

      // If unauthorized or forbidden, redirect to login
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate('/login')
      }
    }
  }

  const handleToggleBan = async (id) => {
    try {
      const account = accounts.find(acc => acc.id === id)
      if (!account) return

      await userApi.toggleBanUser(id, !account.banned)

      // Update local state
      setAccounts(accounts.map(acc =>
        acc.id === id ? { ...acc, banned: !acc.banned } : acc
      ))

      // Show success message
      setToastMessage(`Account successfully ${account.banned ? 'unbanned' : 'banned'}`)
      setToastType('success')
      setTimeout(() => setToastMessage(null), 3000)
    } catch (err) {
      const errorMessage = err.message || 'Failed to update account status'
      setToastMessage(errorMessage)
      setToastType('error')
      setTimeout(() => setToastMessage(null), 3000)

      // If unauthorized or forbidden, redirect to login
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        navigate('/login')
      }
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  // Show error state
  if (error && !toastMessage) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
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
              <h1 className="text-2xl font-semibold text-gray-900">Account Management</h1>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="py-4">
                {toastMessage && (
                  <Toast message={toastMessage} type={toastType} />
                )}
                <div className="bg-white shadow rounded-lg">
                  <AccountsTable 
                    accounts={accounts}
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