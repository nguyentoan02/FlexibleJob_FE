import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function CreatePackageForm({ onClose, onSave, editPackage, isLoading, isModal = false }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    period: 'month',
    description: '',
    benefits: [''],
    isPopular: false,
    isActive: true,
  })

  useEffect(() => {
    if (editPackage) {
      setFormData({
        name: editPackage.name || '',
        price: editPackage.price || '',
        period: editPackage.period || 'month',
        description: editPackage.description || '',
        benefits: editPackage.benefits || [''],
        isPopular: editPackage.isPopular || false,
        isActive: editPackage.isActive !== undefined ? editPackage.isActive : true,
      })
    }
  }, [editPackage])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData(prev => {
      const updated = { ...prev, [name]: newValue };
      console.log('handleChange', name, newValue, updated);
      return updated;
    });
  }

  const handleBenefitChange = (index, value) => {
    const updatedBenefits = [...formData.benefits]
    updatedBenefits[index] = value
    setFormData({
      ...formData,
      benefits: updatedBenefits,
    })
  }

  const addBenefit = () => {
    setFormData({
      ...formData,
      benefits: [...formData.benefits, ''],
    })
  }

  const removeBenefit = (index) => {
    if (formData.benefits.length > 1) {
      const updatedBenefits = formData.benefits.filter((_, i) => i !== index)
      setFormData({
        ...formData,
        benefits: updatedBenefits,
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Validate form
    if (!formData.name.trim() || !formData.price || !formData.description.trim()) {
      alert('Please fill in all required fields')
      return
    }
    // Filter out empty benefits
    const filteredBenefits = formData.benefits.filter(benefit => benefit.trim() !== '')
    if (filteredBenefits.length === 0) {
      alert('Please add at least one feature')
      return
    }
    const packageData = {
      ...(editPackage ? { _id: editPackage._id } : {}),
      name: formData.name,
      price: parseInt(String(formData.price).replace(/[^\d]/g, '')),
      description: formData.description,
      benefits: [...filteredBenefits],
      isPopular: !!formData.isPopular,
      isActive: !!formData.isActive
    }
    console.log('FormData:', formData)
    console.log('Submit packageData:', packageData)
    onSave({ ...packageData })
  }

  const formContent = (
    <div className={isModal ? "bg-white/90 backdrop-blur-sm rounded-lg p-6 w-full max-w-4xl mx-4 shadow-lg border max-h-[90vh] overflow-y-auto" : "bg-white rounded-lg shadow-sm p-6"}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          {editPackage ? 'Edit Service Package' : 'Add New Service Package'}
        </h2>
        {isModal && (
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Package Name *
            </Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              placeholder="E.g., Basic, Professional, Enterprise"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Price (USD) *
            </Label>
            <Input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              placeholder="E.g., 99.99"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Short Description *
            </Label>
            <Input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              placeholder="A brief description of the package"
            />
          </div>
        </div>

        <div className="mb-6">
          <Label className="block text-sm font-medium text-gray-700 mb-2">
            Package Features *
          </Label>
          {formData.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center mb-2">
              <Input
                type="text"
                value={benefit}
                onChange={(e) => handleBenefitChange(index, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter a feature"
              />
              {formData.benefits.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeBenefit(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addBenefit}
            className="mt-2 flex items-center text-sm text-green-600 hover:text-green-800"
          >
            <Plus size={16} className="mr-1" />
            Add Feature
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPopular"
              name="isPopular"
              checked={formData.isPopular}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <Label
              htmlFor="isPopular"
              className="ml-2 block text-sm text-gray-700"
            >
              Mark as most popular package
            </Label>
            <Info
              size={16}
              className="ml-1 text-gray-400"
              title="This package will be highlighted"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <Label
              htmlFor="isActive"
              className="ml-2 block text-sm text-gray-700"
            >
              Activate this service package
            </Label>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-8">
          <Button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:bg-gray-400"
            disabled={isLoading}
          >
            {isLoading ? (editPackage ? 'Saving...' : 'Creating...') : (editPackage ? 'Save Changes' : 'Create Package')}
          </Button>
        </div>
      </form>
    </div>
  )

  return isModal ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      {formContent}
    </div>
  ) : (
    formContent
  )
}
