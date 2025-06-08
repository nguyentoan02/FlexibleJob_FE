import React from 'react'
import { StatusBadge } from './StatusBadge'
import { Ban, Check } from 'lucide-react'

interface Account {
  id: number
  email: string
  role: string
  banned: boolean
}

interface AccountsTableProps {
  accounts: Account[]
  onToggleBan: (id: number) => void
}

export const AccountsTable = ({
  accounts,
  onToggleBan,
}: AccountsTableProps) => {
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
              Trạng thái
            </th>
            <th className="px-6 py-4 text-sm font-medium text-gray-500">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-4 text-sm text-gray-500">{account.id}</td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {account.email}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {account.role}
              </td>
              <td className="px-6 py-4 text-sm">
                <StatusBadge banned={account.banned} />
              </td>
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => onToggleBan(account.id)}
                  className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${account.banned ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                >
                  {account.banned ? (
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