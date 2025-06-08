import React, { useState } from 'react'
import { AdminSidebar } from '../../components/Sidebar/AdminSidebar'
import { AdminHeader } from '../../components/Header/AdminHeader'

export default function AdminPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminHeader onMenuClick={toggleMobileMenu} />
            
            <div className="flex pt-16"> {/* Add pt-16 to account for fixed header height */}
                {/* Mobile menu backdrop */}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <div
                    className={`${
                        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    } fixed top-16 bottom-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-0`}
                >
                    <AdminSidebar />
                </div>

                {/* Main content */}
                <main className="flex-1 p-6">
                    <div className="container mx-auto">
                        <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
                        {/* Add your dashboard content here */}
                    </div>
                </main>
            </div>
        </div>
    )
}
