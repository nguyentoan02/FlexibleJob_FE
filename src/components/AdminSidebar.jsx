import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  Bookmark,
  Package,
  MessageSquare,
  User,
  Key,
  Trash2,
  LogOut,
  ShieldAlert,
} from 'lucide-react'

function NavItem({ icon, label, to, badge, active = false }) {
  return (
    <Link
      to={to}
      className={`flex items-center px-3 py-2 rounded-md my-1 ${
        active ? 'bg-green-50 text-green-500' : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <div className="mr-3 text-gray-400">{icon}</div>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  )
}

export function AdminSidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 hidden md:block min-h-screen">
      <div className="p-4">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Main Navigation
          </h3>
          <nav className="mt-2">
            <NavItem
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              to="/admin/dashboard"
              active={location.pathname === '/admin/dashboard'}
            />
            <NavItem 
              icon={<Users size={20} />} 
              label="Manage Users" 
              to="/admin/users"
              active={location.pathname === '/admin/users'}
            />
            <NavItem 
              icon={<Briefcase size={20} />} 
              label="Manage Jobs" 
              to="/admin/jobs"
            />
            <NavItem 
              icon={<MessageSquare size={20} />} 
              label="Messages" 
              to="/admin/messages"
              badge={4}
            />
          </nav>
        </div>
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Admin Controls
          </h3>
          <nav className="mt-2">
            <NavItem 
              icon={<Users size={20} />} 
              label="Manage Jobseekers" 
              to="/admin/jobseekers"
            />
            <NavItem
              icon={<ShieldAlert size={20} />}
              label="Banned Accounts"
              to="/admin/banned"
              badge={2}
            />
          </nav>
        </div>
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            My Account
          </h3>
          <nav className="mt-2">
            <NavItem 
              icon={<User size={20} />} 
              label="My Profile" 
              to="/user/profile"
            />
            <NavItem 
              icon={<Key size={20} />} 
              label="Change Password" 
              to="/admin/change-password"
            />
            <NavItem 
              icon={<LogOut size={20} />} 
              label="Log Out" 
              to="/logout"
            />
          </nav>
        </div>
      </div>
    </aside>
  )
} 