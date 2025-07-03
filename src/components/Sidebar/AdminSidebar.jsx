import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
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
  AlertTriangle,
  Building2,
} from 'lucide-react'

function NavItem({ icon, label, to, badge, active = false, onClick }) {
  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`w-full flex items-center px-3 py-2 rounded-md my-1 ${
          active ? 'bg-green-50 text-green-500' : 'text-gray-700 hover:bg-gray-50'
        }`}
      >
        <div className="mr-3 text-gray-400">{icon}</div>
        <span>{label}</span>
        {badge && (
          <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {badge}
          </span>
        )}
      </button>
    )
  }

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
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

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
              icon={<Building2 size={20} />} 
              label="Manage Companies" 
              to="/admin/companies"
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
              icon={<Package size={20} />} 
              label="Manage Packages" 
              to="/admin/packages"
              active={location.pathname === '/admin/packages'}
            />
            <NavItem 
              icon={<AlertTriangle size={20} />} 
              label="Reports" 
              to="/admin/report"
              active={location.pathname === '/admin/reportreport'}
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
              to="/admin/profile"
            />
            <NavItem 
              icon={<Key size={20} />} 
              label="Change Password" 
              to="/admin/change-password"
            />
            <NavItem 
              icon={<LogOut size={20} />} 
              label="Log Out" 
              onClick={handleLogout}
            />
          </nav>
        </div>
      </div>
    </aside>
  )
} 