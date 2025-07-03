import React, { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { updatePackage, fetchPackages } from '../api/users'
import { useAuth } from '../hooks/useAuth'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import AdminLayout from '@/components/Layout/AdminLayout'
import { CreatePackageForm } from '@/components/PackagesForm/CreatePackageForm'
import Toast from '@/components/Toast/Toast'

export function EditPackage() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const { packageId } = useParams()
  const location = useLocation()
  const [toastMessage, setToastMessage] = useState(null)
  const [toastType, setToastType] = useState('success')
  const queryClient = useQueryClient()
  const [editPackage, setEditPackage] = useState(location.state?.package || null)

  // Fetch package if not available in location.state
  useEffect(() => {
    if (!editPackage && token) {
      fetchPackages(token).then(pkgs => {
        const found = pkgs.find(pkg => pkg._id === packageId)
        if (found) setEditPackage(found)
        else navigate('/admin/packages')
      })
    }
  }, [editPackage, token, packageId, navigate])

  // Update package mutation
  const updatePackageMutation = useMutation({
    mutationFn: (packageData) => updatePackage(token, packageId, packageData),
    onSuccess: () => {
      setToastMessage('Package updated successfully!')
      setToastType('success')
      queryClient.invalidateQueries(['packages'])
      setTimeout(() => {
        navigate('/admin/packages')
      }, 1500)
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || 'Failed to update package.'
      setToastMessage(errorMessage)
      setToastType('error')
    },
  })

  const handleSavePackage = (packageData) => {
    console.log('handleSavePackage', packageData)
    console.log('API CALL', packageId, packageData)
    updatePackageMutation.mutate(packageData)
  }

  const handleClose = () => {
    navigate('/admin/packages')
  }

  if (!editPackage) {
    return <div>Loading...</div>
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
              <h1 className="text-3xl font-bold">Edit Service Package</h1>
              <div className="flex items-center text-sm mt-1">
                <span className="text-gray-500">Admin</span>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">Packages</span>
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-green-500">Edit</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <CreatePackageForm
            onClose={handleClose}
            onSave={handleSavePackage}
            editPackage={editPackage}
            isLoading={updatePackageMutation.isLoading}
          />
        </div>
      </div>
    </AdminLayout>
  )
} 