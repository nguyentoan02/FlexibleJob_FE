import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/Layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { User, Briefcase, AlertTriangle, DollarSign, TrendingUp, TrendingDown, ShoppingCart, Ban, Unlock, UserPlus, FileText, CheckCircle } from 'lucide-react';
import {
  fetchTotalUsers,
  fetchTotalEmployers,
  fetchTotalJobseekers,
  fetchTotalCompanies
} from '../../api/users';
import { fetchRevenue } from '../../api/payment';
import { useAuth } from '../../hooks/useAuth';
import DashboardChart from "@/components/dashboard/DashboardChart";
import { fetchRecentActivity, fetchReportedJobsStats } from '../../api/stats';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEmployers: 0,
    totalJobseekers: 0,
    totalCompanies: 0,
    revenue: 0,
    reportedJobs: 0,
    totalJobs: 0,
    loading: true,
    error: null,
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [users, employers, jobseekers, companies, revenue, reportedJobsData] = await Promise.all([
          fetchTotalUsers(token),
          fetchTotalEmployers(token),
          fetchTotalJobseekers(token),
          fetchTotalCompanies(token),
          fetchRevenue(token),
          fetchReportedJobsStats(token),
        ]);
        setStats({
          totalUsers: users,
          totalEmployers: employers,
          totalJobseekers: jobseekers,
          totalCompanies: companies,
          revenue: revenue,
          reportedJobs: reportedJobsData.reportedJobs || 0,
          totalJobs: reportedJobsData.totalJobs || 0,
          loading: false,
          error: null,
        });
      } catch (error) {
        setStats((prev) => ({ ...prev, loading: false, error: 'Failed to fetch stats' }));
      }
    }
    if (token) fetchStats();
  }, [token]);

  useEffect(() => {
    // Fetch recent activity
    async function getRecentActivity() {
      try {
        const data = await fetchRecentActivity(token);
        setRecentActivity(data);
      } catch {
        setRecentActivity([]);
      }
    }
    if (token) getRecentActivity();
  }, [token]);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <h1 className="text-3xl font-bold mb-2">System Administration</h1>
        <div className="flex items-center text-sm mb-6">
          <span className="text-gray-500">Admin</span>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-green-500">Overview</span>
        </div>
        {stats.loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : stats.error ? (
          <div className="text-red-500 text-center mb-6">{stats.error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users */}
            <Card className="p-6 flex flex-col bg-white shadow rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-6 w-6 text-blue-500 bg-blue-100 rounded p-1" />
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-green-500 text-xs font-medium">+12%</span>
              </div>
              <span className="text-3xl font-bold">{stats.totalUsers}</span>
              <span className="text-gray-700 font-medium mt-1">Total Users</span>
              <span className="text-gray-400 text-sm mt-1">Employers: {stats.totalEmployers} | Jobseekers: {stats.totalJobseekers}</span>
            </Card>
            {/* Total Companies */}
            <Card className="p-6 flex flex-col bg-white shadow rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Briefcase className="h-6 w-6 text-green-500 bg-green-100 rounded p-1" />
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-green-500 text-xs font-medium">+5%</span>
              </div>
              <span className="text-3xl font-bold">{stats.totalCompanies}</span>
              <span className="text-gray-700 font-medium mt-1">Total Companies</span>
            </Card>
            {/* Reported Jobs */}
            <Card className="p-6 flex flex-col bg-white shadow rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-6 w-6 text-red-500 bg-red-100 rounded p-1" />
                <TrendingDown className="h-4 w-4 text-red-500" />
                <span className="text-red-500 text-xs font-medium">-8%</span>
              </div>
              <span className="text-3xl font-bold">{stats.reportedJobs}</span>
              <span className="text-gray-700 font-medium mt-1">Reported Jobs</span>
              <span className="text-gray-400 text-sm mt-1">Total Jobs: {stats.totalJobs}</span>
            </Card>
            {/* Revenue */}
            <Card className="p-6 flex flex-col bg-white shadow rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-6 w-6 text-yellow-500 bg-yellow-100 rounded p-1" />
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-green-500 text-xs font-medium">+3%</span>
              </div>
              <span className="text-3xl font-bold">${stats.revenue}</span>
              <span className="text-gray-700 font-medium mt-1">Revenue</span>
            </Card>
          </div>
        )}
        {/* Tabs */}
        <div className="flex gap-6 border-b mb-6">
          <button
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'overview' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-green-500'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'users' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-green-500'}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'jobs' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-green-500'}`}
            onClick={() => setActiveTab('jobs')}
          >
            Jobs
          </button>
          {/* Xóa tab Reports */}
          <button
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'company' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-green-500'}`}
            onClick={() => setActiveTab('company')}
          >
            Company
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'revenue' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-green-500'}`}
            onClick={() => setActiveTab('revenue')}
          >
            Revenue
          </button>
        </div>
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart/Graph Placeholder */}
          <Card className="col-span-2 p-6 bg-white shadow rounded-lg min-h-[300px] flex items-center justify-center">
            <DashboardChart type={activeTab} />
          </Card>
          {/* Recent Activity - Custom UI */}
          <Card className="p-6 bg-white shadow rounded-lg min-h-[300px]">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="max-h-[400px] overflow-y-auto">
              <ul className="space-y-3">
                {recentActivity.length === 0 ? (
                  <li className="text-gray-400 text-sm">No recent activity.</li>
                ) : (
                  recentActivity.map((item, idx) => {
                    let icon = null;
                    let color = "text-gray-600";
                    if (item.type === "user_register") {
                      icon = <UserPlus className="mr-2 h-5 w-5 text-blue-500" />;
                      color = "text-blue-600";
                    } else if (item.type === "user_banned") {
                      icon = <Ban className="mr-2 h-5 w-5 text-red-500" />;
                      color = "text-red-600";
                    } else if (item.type === "user_unbanned") {
                      icon = <Unlock className="mr-2 h-5 w-5 text-green-500" />;
                      color = "text-green-600";
                    } else if (item.type === "company_post_job") {
                      icon = <Briefcase className="mr-2 h-5 w-5 text-yellow-500" />;
                      color = "text-yellow-600";
                    } else if (item.type === "package_purchase_success") {
                      icon = <ShoppingCart className="mr-2 h-5 w-5 text-green-500" />;
                      color = "text-green-600";
                    } else if (item.type === "job_application") {
                      icon = <FileText className="mr-2 h-5 w-5 text-purple-500" />;
                      color = "text-purple-600";
                    } else if (item.type === "success") {
                      icon = <CheckCircle className="mr-2 h-5 w-5 text-green-500" />;
                      color = "text-green-600";
                    }
                    return (
                      <li key={idx} className={`text-sm flex items-start ${color}`}>
                        <div className="flex-shrink-0 pt-0.5">{icon}</div>
                        <div className="flex-1">
                          <div className="font-medium text-base">{item.message}</div>
                          <div className="flex gap-2 mt-1 text-xs text-gray-400">
                            <span>{item.type}</span>
                            {item.createdAt && (
                              <span>{new Date(item.createdAt).toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
