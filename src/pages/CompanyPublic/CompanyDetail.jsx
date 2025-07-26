import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MapPin,
    Users,
    Building,
    Globe,
    Mail,
    Phone,
    Calendar,
    ExternalLink,
    Briefcase,
    ArrowLeft,
    Heart,
    Plus,
} from "lucide-react";
import { followCompany, unfollowCompany } from "@/hooks/followCompany";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";

export default function CompanyDetail() {
    const { companyId } = useParams();
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const { user, token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/company/public/${companyId}`)
            .then((res) => res.json())
            .then((data) => {
                setCompany(data.payload);
                setLoading(false);
            });
    }, [companyId]);

    // NEW: Kiểm tra trạng thái follow khi đã có token và companyId
    useEffect(() => {
        const checkFollow = async () => {
            if (!token || !companyId) return;
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/follow-company/`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const followedCompanies = res.data.payload || [];
                setIsFollowing(
                    followedCompanies.some((c) => c._id === companyId)
                );
            } catch (err) {
                setIsFollowing(false);
            }
        };
        checkFollow();
    }, [token, companyId]);

    const handleFollowClick = async () => {
        if (!user || !token) {
            navigate("/login");
            return;
        }
        if (isFollowing) {
            await unfollowCompany(company._id, token);
            setIsFollowing(false);
        } else {
            await followCompany(company._id, token);
            setIsFollowing(true);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">
                        Loading company details...
                    </p>
                </div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="flex justify-center items-center h-screen bg-white">
                <div className="text-center">
                    <div className="text-red-500 text-xl font-semibold mb-4">
                        Company not found
                    </div>
                    <Link
                        to="/company-public"
                        className="text-blue-600 hover:underline"
                    >
                        Back to Companies
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Back Button */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <Link
                        to="/company-public"
                        className="inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Companies
                    </Link>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        {/* Company Logo */}
                        <div className="relative">
                            <div className="w-32 h-32 bg-gray-100 rounded-2xl p-4 border border-gray-200 shadow-sm">
                                <img
                                    src={company.imageUrl || "/image.png"}
                                    alt={company.companyName}
                                    className="w-full h-full object-contain rounded-lg"
                                />
                            </div>
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        </div>

                        {/* Company Info */}
                        <div className="flex-1 text-center lg:text-left">
                            <h1 className="text-4xl font-bold mb-6 text-gray-900">
                                {company.companyName}
                            </h1>
                            <div className="flex flex-wrap gap-6 justify-center lg:justify-start text-gray-600 mb-8">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium">
                                        {company.location}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium">
                                        {company.industry}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium">
                                        {company.companySize}
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-6">
                                <Button
                                    onClick={handleFollowClick}
                                    className={`${
                                        isFollowing
                                            ? "bg-blue-600 text-white hover:bg-blue-700"
                                            : "bg-blue-600 text-white hover:bg-blue-700"
                                    } font-semibold px-6 py-2.5 shadow-sm`}
                                >
                                    {isFollowing ? (
                                        <>
                                            <Heart className="w-4 h-4 mr-2 fill-current" />
                                            Following
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Follow Company
                                        </>
                                    )}
                                </Button>
                                {company.website && (
                                    <Button
                                        variant="outline"
                                        className="border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-6 py-2.5"
                                        asChild
                                    >
                                        <a
                                            href={company.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Globe className="w-4 h-4 mr-2" />
                                            Website
                                        </a>
                                    </Button>
                                )}
                            </div>

                            {/* Social Links */}
                            <div className="flex gap-3 justify-center lg:justify-start">
                                {company.linkedinUrl && (
                                    <Button
                                        variant="outline"
                                        className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2"
                                        asChild
                                    >
                                        <a
                                            href={company.linkedinUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            LinkedIn
                                        </a>
                                    </Button>
                                )}
                                {company.facebookUrl && (
                                    <Button
                                        variant="outline"
                                        className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2"
                                        asChild
                                    >
                                        <a
                                            href={company.facebookUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <ExternalLink className="w-4 h-4 mr-2" />
                                            Facebook
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 py-8">
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-8 bg-white border border-gray-200 rounded-lg p-1">
                        <TabsTrigger
                            value="overview"
                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700 font-semibold py-2.5"
                        >
                            <Building className="w-4 h-4 mr-2" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="jobs"
                            className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-700 font-semibold py-2.5"
                        >
                            <Briefcase className="w-4 h-4 mr-2" />
                            Job Openings ({company.jobs?.length || 0})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Company Details */}
                            <div>
                                <Card className="shadow-sm border border-gray-200 bg-white">
                                    <CardContent className="p-8">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                                <Building className="w-5 h-5 text-white" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-800">
                                                About {company.companyName}
                                            </h2>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed mb-8 text-base">
                                            {company.aboutUs ||
                                                "No description provided."}
                                        </p>

                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                                <Users className="w-4 h-4 text-white" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-800">
                                                Benefits & Perks
                                            </h3>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {company.benefit?.length ? (
                                                company.benefit.map((b, i) => (
                                                    <Badge
                                                        key={i}
                                                        className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-2 text-sm font-medium h-auto whitespace-normal text-left"
                                                    >
                                                        {b}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-gray-500 italic">
                                                    No benefits listed.
                                                </span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Company Album - Add this new section */}
                                {company.albumImage &&
                                    company.albumImage.length > 0 && (
                                        <Card className="shadow-sm border border-gray-200 bg-white mt-6">
                                            <CardContent className="p-8">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            className="text-white"
                                                        >
                                                            <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"></path>
                                                            <circle
                                                                cx="8.5"
                                                                cy="8.5"
                                                                r="1.5"
                                                            ></circle>
                                                            <polyline points="21 15 16 10 5 21"></polyline>
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-gray-800">
                                                        Company Gallery
                                                    </h3>
                                                </div>
                                                <div className="overflow-x-auto pb-2">
                                                    <div className="flex gap-4 snap-x snap-mandatory">
                                                        {company.albumImage.map(
                                                            (image, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex-shrink-0 snap-center"
                                                                >
                                                                    <img
                                                                        src={
                                                                            image
                                                                        }
                                                                        alt={`${
                                                                            company.companyName
                                                                        } - Image ${
                                                                            index +
                                                                            1
                                                                        }`}
                                                                        className="h-48 w-64 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                                                        onClick={() =>
                                                                            window.open(
                                                                                image,
                                                                                "_blank"
                                                                            )
                                                                        }
                                                                    />
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                            </div>

                            {/* Contact Info */}
                            <div>
                                <Card className="shadow-sm border border-gray-200 bg-white">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                                <Phone className="w-4 h-4 text-white" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-800">
                                                Contact Information
                                            </h3>
                                        </div>
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <MapPin className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-800 mb-1">
                                                        Address
                                                    </div>
                                                    <div className="text-gray-600 text-sm">
                                                        {company.address}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                                                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Mail className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-800 mb-1">
                                                        Email
                                                    </div>
                                                    <div className="text-gray-600 text-sm">
                                                        {company.email}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <Phone className="w-4 h-4 text-white" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-800 mb-1">
                                                        Phone
                                                    </div>
                                                    <div className="text-gray-600 text-sm">
                                                        {company.phone}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="jobs">
                        <Card className="shadow-sm border border-gray-200 bg-white">
                            <CardContent className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                        <Briefcase className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Current Job Openings
                                    </h2>
                                </div>
                                {company.jobs?.length ? (
                                    <div className="space-y-4">
                                        {company.jobs.map((job) => (
                                            <div
                                                key={job._id}
                                                className="border border-gray-200 rounded-lg p-6 bg-white hover:bg-gray-50 hover:border-blue-300 transition-all duration-300 shadow-sm hover:shadow-md"
                                            >
                                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-xl font-bold text-gray-800 hover:text-blue-700 mb-2 transition-colors">
                                                            {job.title}
                                                        </h3>
                                                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                                                            <MapPin className="w-4 h-4" />
                                                            <span className="font-medium">
                                                                {job.location}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            <Badge className="bg-green-100 text-green-800 px-3 py-1 font-medium">
                                                                {job.level}
                                                            </Badge>
                                                            <Badge className="bg-purple-100 text-purple-800 px-3 py-1 font-medium">
                                                                {job.salary
                                                                    ?.min &&
                                                                job.salary?.max
                                                                    ? `${
                                                                          job
                                                                              .salary
                                                                              .currency
                                                                      } ${
                                                                          job
                                                                              .salary
                                                                              .min /
                                                                          1000
                                                                      }k - ${
                                                                          job
                                                                              .salary
                                                                              .max /
                                                                          1000
                                                                      }k`
                                                                    : "Negotiable"}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-3">
                                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                            <Calendar className="w-4 h-4" />
                                                            <span>
                                                                {new Date(
                                                                    job.datePosted
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                        <Button
                                                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2"
                                                            asChild
                                                        >
                                                            <Link
                                                                to={`/jobs/${job._id}`}
                                                            >
                                                                View Details
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Briefcase className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-600 text-lg font-medium mb-2">
                                            No job openings at this time.
                                        </p>
                                        <p className="text-gray-500">
                                            Check back later for new
                                            opportunities.
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
