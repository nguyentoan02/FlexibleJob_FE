import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Download,
    Mail,
    MapPin,
    Phone,
    Briefcase,
    GraduationCap,
} from "lucide-react";
import { useCVProfile } from "@/hooks/cvprofile";
import HeaderJobseeker from "@/components/Header/HeaderJobseeker";

export default function ViewCVProfile() {
    const { data, isLoading, error } = useCVProfile();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600">
                        Error Loading CV Profile
                    </h2>
                    <p className="text-gray-600">
                        {error.message || "Please try again later"}
                    </p>
                </div>
            </div>
        );
    }

    // Sửa đoạn này: nếu không có CV thì hiện thông báo
    const profile = data?.payload;
    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <HeaderJobseeker />
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        CV Profile Not Found
                    </h2>
                    <p className="text-gray-600">
                        You have not created a CV profile yet.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Header Section */}
                    <div className="p-8 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row items-center md:items-start">
                            <div className="flex-shrink-0">
                                <img
                                    src={
                                        profile.user?.imageUrl || profile.avatar
                                    }
                                    alt={`${profile.user?.firstName} ${profile.user?.lastName}`}
                                    className="w-32 h-32 rounded-full object-cover border-4 border-green-500"
                                />
                            </div>
                            <div className="mt-6 md:mt-0 md:ml-8 text-center md:text-left">
                                <h1 className="text-4xl font-bold text-gray-900">
                                    {profile.user?.firstName}{" "}
                                    {profile.user?.lastName}
                                </h1>
                                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-6">
                                    {/* <div className="flex items-center text-gray-600">
                                        <MapPin className="w-5 h-5 mr-2" />
                                        <span>
                                            {profile.experience?.[0]
                                                ?.location || "Not specified"}
                                        </span>
                                    </div> */}
                                    <div className="flex items-center text-gray-600">
                                        <Mail className="w-5 h-5 mr-2" />
                                        <span>{profile.user?.email}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Phone className="w-5 h-5 mr-2" />
                                        <span>{profile.number}</span>
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                                    {profile.skills?.map((skill, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Description Section (Moved Below Header) */}
                    {profile.description && (
                        <div className="p-8 border-b border-gray-200">
                            <p className="text-lg text-gray-700">
                                {profile.description}
                            </p>
                        </div>
                    )}
                    {/* Main Content */}
                    <div className="p-8">
                        {/* Experience Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center gap-2">
                                <Briefcase className="w-6 h-6" />
                                Experience
                            </h2>
                            {profile.experience?.length > 0 ? (
                                profile.experience.map((exp, idx) => (
                                    <div key={idx} className="mb-6 last:mb-0">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {exp.position}
                                            </h3>
                                            <span className="text-sm text-gray-500">
                                                {new Date(
                                                    exp.startDate
                                                ).toLocaleDateString()}{" "}
                                                -{" "}
                                                {new Date(
                                                    exp.endDate
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-green-600 font-medium">
                                            {exp.company}
                                        </p>
                                        <p className="text-gray-500 text-sm">
                                            {exp.location}
                                        </p>
                                        <p className="mt-2 text-gray-700">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400">
                                    No experience listed.
                                </p>
                            )}
                        </div>
                        {/* Education Section */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center gap-2">
                                <GraduationCap className="w-6 h-6" />
                                Education
                            </h2>
                            {profile.education?.length > 0 ? (
                                profile.education.map((edu, idx) => (
                                    <div key={idx} className="mb-6 last:mb-0">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {edu.degree}
                                        </h3>
                                        <p className="text-green-600 font-medium">
                                            {edu.school}
                                        </p>
                                        <div className="text-sm text-gray-500">
                                            {edu.startDate
                                                ? new Date(
                                                      edu.startDate
                                                  ).toLocaleDateString()
                                                : "?"}{" "}
                                            -{" "}
                                            {edu.endDate
                                                ? new Date(
                                                      edu.endDate
                                                  ).toLocaleDateString()
                                                : "?"}
                                        </div>
                                        <p className="mt-2 text-gray-700">
                                            {edu.description}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400">
                                    No education listed.
                                </p>
                            )}
                        </div>
                        {/* Certifications Section */}
                        {profile.certifications &&
                            profile.certifications.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-2xl font-semibold text-green-700 mb-4">
                                        Certifications
                                    </h2>
                                    <ul className="list-disc pl-6">
                                        {profile.certifications.map(
                                            (cert, idx) => (
                                                <li
                                                    key={idx}
                                                    className="text-gray-700 mb-2"
                                                >
                                                    {cert}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}
