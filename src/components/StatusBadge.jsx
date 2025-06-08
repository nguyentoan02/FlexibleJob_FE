import React from 'react'

export const StatusBadge = ({ banned }) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        banned
          ? 'bg-red-100 text-red-800'
          : 'bg-green-100 text-green-800'
      }`}
    >
      {banned ? 'Banned' : 'Active'}
    </span>
  )
} 