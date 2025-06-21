import { useState } from "react";
import { Link } from "react-router-dom";
import { useJobSearch } from "@/hooks/jobSearch";
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

export default function JobList() {
    const [searchParams, setSearchParams] = useState({
        title: "",
        location: "",
        level: "all",
        jobType: "all",
        experienceYears: "",
        page: 1,
    });

    const { data, isLoading, error } = useJobSearch(searchParams);

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
            <HeaderJobseeker />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    {/* Search Form */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Input
                                name="title"
                                placeholder="Job title, keywords..."
                                value={searchParams.title}
                                onChange={handleInputChange}
                            />
                            <Input
                                name="location"
                                placeholder="Location..."
                                value={searchParams.location}
                                onChange={handleInputChange}
                            />
                            <Input
                                name="experienceYears"
                                type="number"
                                placeholder="Experience years..."
                                value={searchParams.experienceYears}
                                onChange={handleInputChange}
                            />
                            <Select
                                value={searchParams.level}
                                onValueChange={(value) =>
                                    handleSelectChange("level", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Level" />
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
                                <SelectTrigger>
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

                        {isLoading && !data ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-600">
                                Error: {error.message}
                            </div>
                        ) : (
                            <div className="space-y-4">
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
                    </div>
                </div>
            </div>
        </>
    );
}
