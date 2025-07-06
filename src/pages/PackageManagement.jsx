import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Edit, AlertTriangle } from 'lucide-react'
import { fetchPackages, deletePackage } from '../api/users'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '@/components/Layout/AdminLayout'
import { Button } from '@/components/ui/button'
import Toast from '@/components/Toast/Toast'

export function PackageManagement() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [toastMessage, setToastMessage] = useState(null)
  const [toastType, setToastType] = useState('success')
  const queryClient = useQueryClient()

  // Fetch packages
  const { data: packages, isLoading, isError } = useQuery({
    queryKey: ['packages'],
    queryFn: () => fetchPackages(token),
    enabled: !!token,
  })

  // Delete package mutation
  const deletePackageMutation = useMutation({
    mutationFn: (packageId) => deletePackage(token, packageId),
    onSuccess: () => {
      setToastMessage('Package deleted successfully!')
      setToastType('success')
      queryClient.invalidateQueries(['packages'])
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || 'Failed to delete package.'
      setToastMessage(errorMessage)
      setToastType('error')
    },
  })

  const handleEdit = (pkg) => {
    navigate(`/admin/packages/edit/${pkg._id}`, { state: { package: pkg } })
  }

  const handleCreate = () => {
    navigate('/admin/packages/create')
  }

  const handleDelete = (packageId) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      deletePackageMutation.mutate(packageId)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted');
    // ... các bước khác
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

  if (isError) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="text-red-500 text-center">
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p>Failed to load packages</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      {toastMessage && <Toast message={toastMessage} type={toastType} />}
      
      <div className="min-h-full bg-gray-50 px-8">
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mt-8">Package Management</h1>
              <div className="flex items-center text-sm mt-1">
                <span className="text-gray-500">Admin</span>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-green-500">Packages</span>
              </div>
            </div>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white px- py-2 rounded-md flex items-center mt-8"
              onClick={handleCreate}
            >
              <Plus size={18} className="mr-2" />
              Add New Package
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold">Package List</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <colgroup>
                <col className="w-1/6" />
                <col className="w-1/12" />
                <col className="w-2/6" />
                <col className="w-1/6" />
                <col className="w-1/12" />
                <col className="w-1/6" />
              </colgroup>
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Features
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
                {packages?.map((pkg) => (
                  <tr key={pkg._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {pkg.name}
                      </div>
                      {pkg.isPopular && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                          Popular
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {pkg.price?.toLocaleString('en-US')}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate">
                      <span className="text-sm text-gray-500 block truncate" title={pkg.description}>
                        {pkg.description}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-[120px] truncate">
                      <span className="text-sm text-gray-500 block truncate">
                        {pkg.benefits?.length || 0} features
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {pkg.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-500">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(pkg)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(pkg._id)}
                          className="text-red-600 hover:text-red-900"
                          disabled={deletePackageMutation.isLoading}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800">
                Important Note
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                Changing service packages can affect current users. Please
                consider carefully before making major changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
} 