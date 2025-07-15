import React, { useState } from 'react';
import { Eye, EyeOff, Key, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '@/components/Layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { useAuth } from '../hooks/useAuth';
import { changePassword } from '../api/auth';

export default function ChangePassword() {
  const { token } = useAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordRequirements = [
    {
      label: 'At least 8 characters',
      met: newPassword.length >= 8,
    },
    {
      label: 'Contains an uppercase letter',
      met: /[A-Z]/.test(newPassword),
    },
    {
      label: 'Contains a number',
      met: /[0-9]/.test(newPassword),
    },
    {
      label: 'Contains a special character',
      met: /[!@#$%^&*]/.test(newPassword),
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      setSuccess(false);
      return;
    }
    if (!passwordRequirements.every(r => r.met)) {
      setMessage('Password does not meet all requirements');
      setSuccess(false);
      return;
    }
    setLoading(true);
    try {
      await changePassword(token, { currentPassword, newPassword });
      setMessage('Password changed successfully!');
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage(err?.response?.data?.message || 'Failed to change password');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="h-full bg-gray-50 min-h-screen">
        <div className="mb-6 pl-8">
          <h1 className="text-3xl font-bold">Change Password</h1>
          <div className="flex items-center text-sm mt-1">
            <span className="text-gray-500">Account</span>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-green-500">Change Password</span>
          </div>
        </div>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
            <div className="bg-green-100 p-2 rounded-lg">
              <Key className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Update your password</h2>
              <p className="text-gray-500 text-sm">
                Make sure your new password is different from the previous one.
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Password requirements
              </h3>
              <div className="space-y-2">
                {passwordRequirements.map((requirement, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {requirement.met ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-300" />
                    )}
                    <span
                      className={`text-sm ${requirement.met ? 'text-green-500' : 'text-gray-500'}`}
                    >
                      {requirement.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {message && <div className={success ? 'mb-2 text-green-600' : 'mb-2 text-red-500'}>{message}</div>}
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                onClick={() => {
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                  setMessage('');
                  setSuccess(false);
                }}
                disabled={loading}
              >
                Cancel
              </button>
              <Button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                disabled={loading}
              >
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
} 
