import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import HeaderJobseeker from "@/components/Header/HeaderJobseeker";
import {
    Briefcase,
    MapPin,
    Clock,
    Search,
    DollarSign,
    Building,
    Filter,
} from "lucide-react";

const fetchJobs = async (page = 1) => {
    const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/jobs?page=${page}&limit=10`
    );
    return res.data;
};

export default function JobList() {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const { data, isLoading, error } = useQuery({
        queryKey: ["jobs", page],
        queryFn: () => fetchJobs(page),
    });

    const formatSalary = (salary) => {
        if (!salary) return "Negotiable";
        const { min, max, currency } = salary;
        return `${currency} ${min / 1000}k - ${max / 1000}k`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    return (
        <>
            <HeaderJobseeker />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    {/* Search Section */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    placeholder="Search jobs..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                <Input
                                    placeholder="Location..."
                                    className="pl-10"
                                />
                            </div>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Search className="mr-2 h-4 w-4" />
                                Search Jobs
                            </Button>
                        </div>
                    </div>

                    {/* Filters and Results */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Filters Sidebar */}
                        <div className="hidden lg:block">
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                                        <Filter className="mr-2 h-5 w-5" />
                                        Filters
                                    </h3>
                                    {/* Add your filter components here */}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Job Listings */}
                        <div className="lg:col-span-3">
                            <div className="mb-4 flex justify-between items-center">
                                <h2 className="text-xl font-semibold">
                                    {data?.payload?.totalJobs || 0} Jobs Found
                                </h2>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={page === 1}
                                        onClick={() => setPage(page - 1)}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!data?.payload?.hasNextPage}
                                        onClick={() => setPage(page + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex justify-center items-center h-64">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                </div>
                            ) : error ? (
                                <div className="text-center text-red-600">
                                    Error loading jobs
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {data?.payload?.jobs.map((job) => (
                                        <Link
                                            key={job._id}
                                            to={`/jobs/${job._id}`}
                                        >
                                            <Card className="hover:shadow-lg transition-shadow duration-200">
                                                <CardContent className="p-6">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                                            <Building className="h-8 w-8 text-gray-400" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-semibold text-blue-600 mb-2">
                                                                {job.title}
                                                            </h3>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                                                                <div className="flex items-center">
                                                                    <Building className="h-4 w-4 mr-2" />
                                                                    {
                                                                        job
                                                                            .company
                                                                            .companyName
                                                                    }
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <MapPin className="h-4 w-4 mr-2" />
                                                                    {
                                                                        job.location
                                                                    }
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <DollarSign className="h-4 w-4 mr-2" />
                                                                    {formatSalary(
                                                                        job.salary
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <Clock className="h-4 w-4 mr-2" />
                                                                    {formatDate(
                                                                        job.datePosted
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                                                                    {job.level}
                                                                </span>
                                                                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">
                                                                    {
                                                                        job.jobType
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
