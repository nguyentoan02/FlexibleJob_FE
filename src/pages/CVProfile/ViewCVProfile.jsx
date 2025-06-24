import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useCVProfile } from "@/hooks/cvprofile";
import {
    Briefcase,
    GraduationCap,
    Mail,
    MapPin,
    Download,
    Clock,
    Phone,
} from "lucide-react";

export default function ViewCVProfile() {
    const { data, isLoading, error } = useCVProfile(); // Không cần truyền ID nữa
    const [activeTab, setActiveTab] = useState("about");

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">
                        Error Loading CV Profile
                    </h2>
                    <p className="text-gray-600">
                        {error.message || "Please try again later"}
                    </p>
                </div>
            </div>
        );
    }

    const profile = data?.payload;

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        CV Profile Not Found
                    </h2>
                    <p className="text-gray-600">
                        The requested CV profile could not be found
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Profile Header Card */}
                    <Card className="mb-8">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                                {/* Avatar Section */}
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="relative">
                                        <img
                                            src={
                                                profile.user?.imageUrl ||
                                                profile.avatar
                                            }
                                            alt={`${profile.user?.firstName} ${profile.user?.lastName}`}
                                            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                                        />
                                        <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></div>
                                    </div>
                                    <Button
                                        className="bg-green-500 hover:bg-green-600 text-white w-full flex items-center justify-center px-4 py-2 rounded-md transition-colors"
                                        onClick={() => {
                                            const a =
                                                document.createElement("a");
                                            a.href = profile.linkUrl;
                                            a.setAttribute(
                                                "download",
                                                "resume.pdf"
                                            );
                                            a.style.display = "none";
                                            document.body.appendChild(a);
                                            a.click();
                                            document.body.removeChild(a);
                                        }}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Resume
                                    </Button>
                                </div>

                                {/* Profile Info */}
                                <div className="flex-1 text-center md:text-left">
                                    <h1 className="text-3xl font-bold text-gray-900">
                                        {`${profile.user?.firstName} ${profile.user?.lastName}`}
                                    </h1>
                                    <p className="text-xl text-gray-600 mt-1">
                                        {profile.description}
                                    </p>

                                    <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-4">
                                        <div className="flex items-center text-gray-600">
                                            <MapPin className="w-5 h-5 mr-2" />
                                            {profile.experience?.[0]
                                                ?.location || "Not specified"}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Mail className="w-5 h-5 mr-2" />
                                            {profile.user?.email}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Phone className="w-5 h-5 mr-2" />
                                            {profile.number}
                                        </div>
                                    </div>

                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {profile.skills?.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Navigation Tabs */}
                    <div className="flex space-x-1 bg-white p-1 rounded-lg shadow mb-8">
                        {["about", "experience", "education"].map((tab) => (
                            <button
                                key={tab}
                                className={`flex-1 py-3 px-6 rounded-md text-sm font-medium capitalize transition-colors ${
                                    activeTab === tab
                                        ? "bg-green-500 text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                }`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Content Sections */}
                    {activeTab === "about" && (
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-4">
                                    About
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    {profile.description}
                                </p>
                                {profile.certifications && (
                                    <>
                                        <h3 className="text-xl font-semibold mb-4">
                                            Certifications
                                        </h3>
                                        <p className="text-gray-600">
                                            {profile.certifications}
                                        </p>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "experience" && (
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                                    <Briefcase className="w-6 h-6 mr-2 text-green-500" />
                                    Work Experience
                                </h2>

                                <div className="space-y-6">
                                    {profile.experience?.map((exp, index) => (
                                        <div
                                            key={index}
                                            className="border-l-2 border-green-500 pl-4 pb-6"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {exp.position}
                                            </h3>
                                            <p className="text-green-600 font-medium">
                                                {exp.company}
                                            </p>
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {exp.location}
                                                <span className="mx-2">•</span>
                                                <Clock className="w-4 h-4 mr-1" />
                                                {new Date(
                                                    exp.startDate
                                                ).getFullYear()}{" "}
                                                -{" "}
                                                {new Date(
                                                    exp.endDate
                                                ).getFullYear()}
                                            </div>
                                            <p className="mt-2 text-gray-600">
                                                {exp.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === "education" && (
                        <Card>
                            <CardContent className="p-6">
                                <h2 className="text-2xl font-semibold mb-6 flex items-center">
                                    <GraduationCap className="w-6 h-6 mr-2 text-green-500" />
                                    Education
                                </h2>

                                <div className="space-y-6">
                                    {profile.education?.map((edu, index) => (
                                        <div
                                            key={index}
                                            className="border-l-2 border-green-500 pl-4 pb-6"
                                        >
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {edu.degree}
                                            </h3>
                                            <p className="text-green-600 font-medium">
                                                {edu.school}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}
