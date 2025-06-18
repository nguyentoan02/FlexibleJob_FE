import React from 'react';
import AdminLayout from '@/components/Layout/AdminLayout';

export default function AdminPage() {
    return (
        <AdminLayout>
            <div className="p-6">
                <div className="container mx-auto">
                    <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
                    {/* Add your dashboard content here */}
                </div>
            </div>
        </AdminLayout>
    );
}
