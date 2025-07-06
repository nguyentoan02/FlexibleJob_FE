import React, { useState } from 'react';
import { AdminHeader } from '@/components/Header/AdminHeader';
import { AdminSidebar } from '@/components/Sidebar/AdminSidebar';

export default function AdminLayout({ children }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminHeader onMenuClick={toggleMobileMenu} />
            
            <div className="flex pt-16">
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                <div
                    className={`${
                        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    } fixed top-16 bottom-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-0`}
                >
                    <AdminSidebar />
                </div>

                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
} 