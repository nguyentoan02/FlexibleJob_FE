import React from "react";
import StatsCards from "./StatsCards";
import RecentActivities from "./RecentActivities";
import InvoicesList from "./InvoicesList";

const Dashboard = () => {
    return (
        <div className="space-y-8">
            {/* Stats */}
            <StatsCards />

            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <RecentActivities />
                <InvoicesList />
            </div>
        </div>
    );
};

export default Dashboard;
