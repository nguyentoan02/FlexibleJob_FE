import { useState } from "react";
import { Link } from "react-router-dom";
import { useJobSearch } from "@/hooks/jobSearch";
import { useJobList } from "@/hooks/jobList"; // Thêm dòng này
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import HeaderJobseeker from "@/components/Header/HeaderJobseeker";
import { MapPin, Clock, Search, DollarSign, Building } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import HeaderCompany from "../../components/Header/HeaderCompany";

export default function JobList() {
    const [searchParams, setSearchParams] = useState({
        title: "",
        location: "",
        level: "all",
        jobType: "all",
        experienceYears: "",
        page: 1,
        limit: 2,
    });

    const { user } = useAuth();

    // Kiểm tra có đang filter/search không
    const isFiltering =
        searchParams.title ||
        searchParams.location ||
        (searchParams.level && searchParams.level !== "all") ||
        (searchParams.jobType && searchParams.jobType !== "all") ||
        searchParams.experienceYears;

    // Nếu có filter thì dùng search, không thì dùng jobList
    const { data, isLoading, error } = isFiltering
        ? useJobSearch(searchParams)
        : useJobList(searchParams.page, searchParams.limit);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({
            ...prev,
            [name]: value,
            page: 1, // Reset về trang 1 khi thay đổi filter
        }));
    };

    const handleSelectChange = (name, value) => {
        setSearchParams((prev) => ({
            ...prev,
            [name]: value,
            page: 1, // Reset về trang 1 khi thay đổi filter
        }));
    };

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
            {user?.role === "JOBSEEKER" ? (
                <HeaderJobseeker />
            ) : (
                <HeaderCompany />
            )}
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    {/* Search Form */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <div className="flex flex-col space-y-4">
                            {/* Row 1: Search and Location */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        name="title"
                                        placeholder="Job title, keywords..."
                                        value={searchParams.title}
                                        onChange={handleInputChange}
                                        className="pl-10 bg-gray-50 border border-gray-200 focus:border-blue-500"
                                    />
                                </div>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        name="location"
                                        placeholder="Location..."
                                        value={searchParams.location}
                                        onChange={handleInputChange}
                                        className="pl-10 bg-gray-50 border border-gray-200 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Row 2: Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Select
                                    value={searchParams.level}
                                    onValueChange={(value) =>
                                        handleSelectChange("level", value)
                                    }
                                >
                                    <SelectTrigger className="bg-gray-50 border border-gray-200 focus:border-blue-500">
                                        <SelectValue placeholder="Select Level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Levels
                                        </SelectItem>
                                        <SelectItem value="Intern">
                                            Intern
                                        </SelectItem>
                                        <SelectItem value="Fresher">
                                            Fresher
                                        </SelectItem>
                                        <SelectItem value="Junior">
                                            Junior
                                        </SelectItem>
                                        <SelectItem value="Senior">
                                            Senior
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={searchParams.jobType}
                                    onValueChange={(value) =>
                                        handleSelectChange("jobType", value)
                                    }
                                >
                                    <SelectTrigger className="bg-gray-50 border border-gray-200 focus:border-blue-500">
                                        <SelectValue placeholder="Job Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            All Types
                                        </SelectItem>
                                        <SelectItem value="Full time">
                                            Full time
                                        </SelectItem>
                                        <SelectItem value="Part time">
                                            Part time
                                        </SelectItem>
                                        <SelectItem value="Remote">
                                            Remote
                                        </SelectItem>
                                    </SelectContent>
                                </Select>

                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <Input
                                        name="experienceYears"
                                        type="number"
                                        placeholder="Experience years..."
                                        value={searchParams.experienceYears}
                                        onChange={handleInputChange}
                                        className="pl-10 bg-gray-50 border border-gray-200 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Search Button */}
                            <div className="flex justify-end">
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                                    onClick={() =>
                                        setSearchParams((prev) => ({ ...prev }))
                                    }
                                >
                                    <Search className="h-4 w-4 mr-2" />
                                    Search Jobs
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="lg:col-span-3">
                        <div className="mb-4 flex justify-between items-center">
                            <h2 className="text-xl font-semibold">
                                {isLoading
                                    ? "Searching..."
                                    : `${
                                          data?.payload?.totalJobs || 0
                                      } Jobs Found`}
                            </h2>
                        </div>

                        {isLoading && !data ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-600">
                                Error: {error.message}
                            </div>
                        ) : (
                            <div className="space-y-4 min-h-[400px]">
                                {" "}
                                {/* Thêm min-height */}
                                {data?.payload?.jobs.map((job) => (
                                    <Link key={job._id} to={`/jobs/${job._id}`}>
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
                                                                    job.company
                                                                        .companyName
                                                                }
                                                            </div>
                                                            <div className="flex items-center">
                                                                <MapPin className="h-4 w-4 mr-2" />
                                                                {job.location}
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
                                                                {job.jobType}
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

                        {/* Pagination Section */}
                        <div className="mt-6 flex justify-between items-center">
                            <div className="text-sm text-gray-600">
                                Page {searchParams.page} of{" "}
                                {data?.payload?.totalPages || 1}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={searchParams.page === 1}
                                    onClick={() =>
                                        setSearchParams((prev) => ({
                                            ...prev,
                                            page: prev.page - 1,
                                        }))
                                    }
                                >
                                    Previous
                                </Button>
                                {/* Add page numbers */}
                                <div className="flex gap-1">
                                    {[
                                        ...Array(
                                            data?.payload?.totalPages || 1
                                        ),
                                    ].map((_, index) => (
                                        <Button
                                            key={index + 1}
                                            variant={
                                                searchParams.page === index + 1
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            onClick={() =>
                                                setSearchParams((prev) => ({
                                                    ...prev,
                                                    page: index + 1,
                                                }))
                                            }
                                        >
                                            {index + 1}
                                        </Button>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={
                                        !data?.payload?.totalPages ||
                                        searchParams.page >=
                                            data.payload.totalPages
                                    }
                                    onClick={() =>
                                        setSearchParams((prev) => ({
                                            ...prev,
                                            page: prev.page + 1,
                                        }))
                                    }
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
