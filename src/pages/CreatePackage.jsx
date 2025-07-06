import React, { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { createPackage } from '../api/users'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '@/components/Layout/AdminLayout'
import { CreatePackageForm } from '@/components/PackagesForm/CreatePackageForm'
import Toast from '@/components/Toast/Toast'

export function CreatePackage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [toastMessage, setToastMessage] = useState(null)
  const [toastType, setToastType] = useState('success')
  const queryClient = useQueryClient()

  // Create package mutation
  const createPackageMutation = useMutation({
    mutationFn: (packageData) => createPackage(token, packageData),
    onSuccess: () => {
      setToastMessage('Package created successfully!')
      setToastType('success')
      queryClient.invalidateQueries(['packages'])
      setTimeout(() => {
        navigate('/admin/packages')
      }, 1500)
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || 'Failed to create package.'
      setToastMessage(errorMessage)
      setToastType('error')
    },
  })

  const handleSavePackage = (packageData) => {
    createPackageMutation.mutate(packageData)
  }

  const handleClose = () => {
    navigate('/admin/packages')
  }

  return (
    <AdminLayout>
      {toastMessage && <Toast message={toastMessage} type={toastType} />}
      
      <div className="min-h-full bg-gray-50">
        <div className="mb-6">
          <div className="flex items-center">
            <button
              onClick={handleClose}
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Add New Service Package</h1>
              <div className="flex items-center text-sm mt-1">
                <span className="text-gray-500">Admin</span>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">Packages</span>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-green-500">Add New</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <CreatePackageForm
            onClose={handleClose}
            onSave={handleSavePackage}
            editPackage={null}
            isLoading={createPackageMutation.isLoading}
          />
        </div>
      </div>
    </AdminLayout>
  )
} 