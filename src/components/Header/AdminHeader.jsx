import React from 'react'
import { Menu } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover"
import { Button } from "@/components/ui/button"

export function AdminHeader({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const menuItems = [
    { 
      label: "Dashboard", 
      subItems: ["Analytics", "Reports", "Statistics"] 
    },
    { 
      label: "Users", 
      subItems: ["All Users", "Employers", "Job Seekers", "Banned Users"] 
    },
    { 
      label: "Jobs", 
      subItems: ["All Jobs", "Pending Jobs", "Featured Jobs", "Expired Jobs"] 
    },
    { 
      label: "Settings", 
      subItems: ["Site Settings", "Email Settings", "Security", "Backup"] 
    },
  ]

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Mobile Menu & Logo */}
        <div className="flex items-center flex-shrink-0">
          <button
            onClick={onMenuClick}
            className="text-gray-500 hover:text-gray-700 md:hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-4"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center">
            <div className="bg-green-500 rounded-full w-8 h-8 flex items-center justify-center mr-2">
              <span className="text-white text-lg font-bold">J</span>
            </div>
            <span className="text-xl font-bold text-gray-800">JobFlexibale</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-1 flex-1 justify-center">
          {menuItems.map((item, index) => (
            <Popover key={index}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-green-600"
                >
                  {item.label}
                </Button>
              </PopoverTrigger>
              {item.subItems.length > 0 && (
                <PopoverContent
                  align="start"
                  sideOffset={4}
                  className="bg-white shadow-lg rounded-lg p-4 w-48 z-50"
                >
                  <ul className="space-y-2">
                    {item.subItems.map((subItem, subIndex) => (
                      <li
                        key={subIndex}
                        className="hover:text-green-600 cursor-pointer text-gray-700 text-sm"
                      >
                        {subItem}
                      </li>
                    ))}
                  </ul>
                </PopoverContent>
              )}
            </Popover>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <span className="text-gray-700 hidden md:inline">
            Welcome, <strong>{user?.username || 'Admin'}</strong>
          </span>
          <Button
            variant="default"
            className="bg-gray-800 text-white hover:bg-gray-700"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
} 