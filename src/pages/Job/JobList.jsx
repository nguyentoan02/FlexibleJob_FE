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

export default function JobList() {
    const defaultValues = {
        title: "",
        location: "",
        level: "all",
        jobType: "all",
        experienceYears: "",
        page: 1,
        limit: 2,
    };
    const [formValues, setFormValues] = useState(defaultValues);
    const [searchParams, setSearchParams] = useState(defaultValues);

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
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
            page: 1,
        }));
    };

    const handleSelectChange = (name, value) => {
        setFormValues((prev) => ({
            ...prev,
            [name]: value,
            page: 1,
        }));
    };

    const handleSearch = () => {
        setSearchParams({ ...formValues });
    };

    const handleClear = () => {
        setFormValues(defaultValues);
        setSearchParams(defaultValues);
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
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                        <div className="flex flex-wrap items-center gap-3 md:gap-4">
                            <div className="relative flex-1 min-w-[220px]">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
                                <Input
                                    name="title"
                                    placeholder="Job title, keywords..."
                                    value={formValues.title}
                                    onChange={handleInputChange}
                                    className="pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 shadow-sm"
                                />
                            </div>
                            <div className="relative flex-1 min-w-[180px]">
                                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
                                <Input
                                    name="location"
                                    placeholder="Location..."
                                    value={formValues.location}
                                    onChange={handleInputChange}
                                    className="pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 shadow-sm"
                                />
                            </div>
                            <div className="flex items-center gap-3 flex-1 min-w-[160px]">
                                <Select
                                    value={formValues.level}
                                    onValueChange={(value) =>
                                        handleSelectChange("level", value)
                                    }
                                >
                                    <SelectTrigger className="bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 py-3 px-4 shadow-sm w-full">
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
                            </div>
                            <div className="flex items-center gap-3 flex-1 min-w-[160px]">
                                <Select
                                    value={formValues.jobType}
                                    onValueChange={(value) =>
                                        handleSelectChange("jobType", value)
                                    }
                                >
                                    <SelectTrigger className="bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 py-3 px-4 shadow-sm w-full">
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
                            <div className="relative flex-1 min-w-[160px]">
                                <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 h-5 w-5" />
                                <Input
                                    name="experienceYears"
                                    type="number"
                                    placeholder="Experience years..."
                                    value={formValues.experienceYears}
                                    onChange={handleInputChange}
                                    className="pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-500 shadow-sm"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow font-semibold flex gap-2"
                                    onClick={handleSearch}
                                >
                                    <Search className="h-5 w-5" />
                                    Search Jobs
                                </Button>
                                <Button
                                    variant="outline"
                                    className="px-6 py-3 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-100"
                                    onClick={handleClear}
                                    type="button"
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="lg:col-span-3">
                        <div className="mb-4 flex justify-between items-center">
                            {isLoading ? (
                                <h2 className="text-xl font-semibold text-blue-600 animate-pulse">
                                    Searching...
                                </h2>
                            ) : data?.payload?.jobs?.length > 0 ? (
                                <h2 className="text-xl font-semibold">
                                    {data?.payload?.totalJobs} Jobs Found
                                </h2>
                            ) : (
                                <h2 className="text-xl font-semibold text-gray-500">
                                    No jobs found
                                </h2>
                            )}
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
                                    <Link
                                        key={job._id}
                                        to={`/jobs/${job._id}`}
                                        className="block group"
                                        style={{ textDecoration: "none" }}
                                    >
                                        <Card className="relative overflow-hidden border-0 shadow-lg group-hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-blue-50 via-white to-indigo-100 rounded-2xl">
                                            {/* Ribbon HOT */}
                                            {job.isHot && (
                                                <span className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                                                    HOT
                                                </span>
                                            )}
                                            <CardContent className="p-6 flex gap-6 items-center">
                                                {/* Company Logo */}
                                                <div className="w-20 h-20 rounded-xl border-4 border-blue-200 bg-white flex items-center justify-center overflow-hidden shadow-md group-hover:scale-105 transition-transform duration-300">
                                                    {job.company?.imageUrl ? (
                                                        <img
                                                            src={
                                                                job.company
                                                                    .imageUrl
                                                            }
                                                            alt={
                                                                job.company
                                                                    .companyName
                                                            }
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Building className="h-10 w-10 text-blue-300" />
                                                    )}
                                                </div>
                                                {/* Job Info */}
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-base font-bold text-blue-700 group-hover:text-indigo-700 transition-colors">
                                                            {job.title}
                                                        </span>
                                                        {job.isUrgent && (
                                                            <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs font-semibold ml-2">
                                                                Urgent
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Building className="h-4 w-4 text-blue-400" />
                                                        <span className="font-medium text-gray-700">
                                                            {
                                                                job.company
                                                                    ?.companyName
                                                            }
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 mb-3">
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="h-4 w-4 text-indigo-400" />
                                                            <span>
                                                                {job.location}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <DollarSign className="h-4 w-4 text-green-500" />
                                                            <span>
                                                                {formatSalary(
                                                                    job.salary
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-4 w-4 text-yellow-500" />
                                                            <span>
                                                                {formatDate(
                                                                    job.datePosted
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <span className="bg-gradient-to-r from-blue-200 to-blue-400 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                                                                {job.level}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold shadow">
                                                            {job.jobType}
                                                        </span>
                                                        {job.skills
                                                            ?.slice(0, 3)
                                                            .map(
                                                                (
                                                                    skill,
                                                                    idx
                                                                ) => (
                                                                    <span
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs"
                                                                    >
                                                                        {skill}
                                                                    </span>
                                                                )
                                                            )}
                                                    </div>
                                                </div>
                                                {/* Apply Button */}
                                                <div className="hidden md:block">
                                                    <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:scale-105 hover:from-indigo-500 hover:to-blue-500 transition-all">
                                                        View Details
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Pagination Section */}
                        <div className="mt-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div className="text-sm text-gray-600">
                                Page {searchParams.page} of{" "}
                                {data?.payload?.totalPages || 1}
                            </div>
                            <div className="flex gap-2 items-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full border-blue-300 hover:bg-blue-50 transition"
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
                                <div className="flex gap-1">
                                    {[
                                        ...Array(
                                            data?.payload?.totalPages || 1
                                        ),
                                    ].map((_, index) => (
                                        <button
                                            key={index + 1}
                                            className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-200 font-semibold
                                                ${
                                                    searchParams.page ===
                                                    index + 1
                                                        ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white border-blue-500 shadow-lg scale-110"
                                                        : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50"
                                                }
                                            `}
                                            onClick={() =>
                                                setSearchParams((prev) => ({
                                                    ...prev,
                                                    page: index + 1,
                                                }))
                                            }
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full border-blue-300 hover:bg-blue-50 transition"
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
