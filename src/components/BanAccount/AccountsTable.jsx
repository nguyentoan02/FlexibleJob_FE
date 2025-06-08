import React from 'react'
import { StatusBadge } from './StatusBadge'
import { Ban, Check, Mail, Calendar } from 'lucide-react'

export const AccountsTable = ({ accounts, onToggleBan }) => {
  // Format date to local string
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-4 text-sm font-medium text-gray-500">STT</th>
            <th className="px-6 py-4 text-sm font-medium text-gray-500">
              Email
            </th>
            <th className="px-6 py-4 text-sm font-medium text-gray-500">
              Vai trò
            </th>
            <th className="px-6 py-4 text-sm font-medium text-gray-500">
              Ngày tạo
            </th>
            <th className="px-6 py-4 text-sm font-medium text-gray-500">
              Trạng thái
            </th>
            <th className="px-6 py-4 text-sm font-medium text-gray-500">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account, index) => (
            <tr key={account._id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-500">
                {index + 1}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-1 text-gray-400" />
                      {account.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                  ${account.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
                    account.role === 'EMPLOYER' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'}`}
                >
                  {account.role}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                  {formatDate(account.createdAt)}
                </div>
              </td>
              <td className="px-6 py-4 text-sm">
                <StatusBadge isBanned={account.isBanned} />
              </td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => onToggleBan(account._id)}
                  className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                    account.isBanned
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  {account.isBanned ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Unban
                    </>
                  ) : (
                    <>
                      <Ban className="w-4 h-4 mr-1" />
                      Ban
                    </>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 