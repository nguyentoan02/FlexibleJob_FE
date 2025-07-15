import React, { useState } from "react";
import { useMyApplications } from "@/hooks/manageapplicant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import HeaderJobseeker from "@/components/Header/HeaderJobseeker";
import { Building, MapPin, Clock, FileText, Briefcase } from "lucide-react";
import CVProfileFollowIdApply from "@/pages/Application/CVProfileFollowIdApply";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

const MyApplicationsPage = () => {
    const { data, isLoading, isError, error } = useMyApplications();
    const [openModal, setOpenModal] = useState(false);
    const [selectedCv, setSelectedCv] = useState(null);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusBadgeVariant = (status) => {
        switch (status) {
            case "APPLIED":
                return "default";
            case "REVIEWED":
                return "secondary";
            case "REJECTED":
                return "destructive";
            case "HIRED":
                return "success";
            default:
                return "outline";
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <HeaderJobseeker />
                <div className="container mx-auto py-10 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                        Loading your applications...
                    </p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-gray-50">
                <HeaderJobseeker />
                <div className="container mx-auto py-10 text-center text-red-600">
                    Error: {error.response?.data?.message || error.message}
                </div>
            </div>
        );
    }

    const applications = data?.payload || [];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
            <HeaderJobseeker />
            <main className="container mx-auto py-12 px-4">
                <h1 className="text-4xl font-extrabold mb-10 text-indigo-800 drop-shadow">
                    <span className="inline-flex items-center gap-2">
                        <FileText className="text-indigo-500" size={32} />
                        My Applications
                    </span>
                </h1>
                {applications.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-8">
                        {applications.map((app) => (
                            <Card
                                key={app._id}
                                className="relative overflow-hidden shadow-lg hover:shadow-2xl transition-shadow border-0 bg-white group rounded-2xl"
                            >
                                {/* Ribbon status */}
                                <div
                                    className={`absolute top-0 right-0 px-4 py-1 rounded-bl-xl text-xs font-bold uppercase tracking-wider z-10
                        ${
                            app.status === "HIRED"
                                ? "bg-green-500 text-white"
                                : app.status === "REJECTED"
                                ? "bg-red-500 text-white"
                                : app.status === "REVIEWED"
                                ? "bg-yellow-400 text-gray-900"
                                : "bg-blue-500 text-white"
                        }
                    `}
                                >
                                    {app.status}
                                </div>
                                <CardHeader className="pb-2">
                                    <div className="flex items-center gap-4">
                                        {/* Only show company image if it's not default */}
                                        {app.job.company.imageUrl &&
                                            !app.job.company.imageUrl.includes(
                                                "default"
                                            ) && (
                                                <div className="w-14 h-14 rounded-full border-2 border-indigo-200 shadow bg-white flex items-center justify-center overflow-hidden">
                                                    <img
                                                        src={
                                                            app.job.company
                                                                .imageUrl
                                                        }
                                                        alt="Company Logo"
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                            )}
                                        <div>
                                            <CardTitle className="text-2xl font-bold text-indigo-700 group-hover:underline transition">
                                                <Link
                                                    to={`/jobs/${app.job._id}`}
                                                >
                                                    {app.job.title}
                                                </Link>
                                            </CardTitle>
                                            <div className="text-sm text-gray-500 mt-1 flex items-center gap-4 flex-wrap">
                                                <span className="flex items-center gap-1">
                                                    <Building size={14} />{" "}
                                                    {
                                                        app.job.company
                                                            .companyName
                                                    }
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={14} />{" "}
                                                    {app.job.company.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex flex-col md:flex-row justify-between items-center gap-4 pt-0">
                                    <div className="flex flex-col gap-2 text-gray-600 text-sm">
                                        <span className="flex items-center gap-2">
                                            <Clock size={14} />
                                            <span>
                                                Applied on:{" "}
                                                <span className="font-semibold text-indigo-700">
                                                    {formatDate(
                                                        app.applicationDate
                                                    )}
                                                </span>
                                            </span>
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Briefcase size={14} />
                                            <span>
                                                Type:{" "}
                                                <span className="font-medium">
                                                    {app.job.jobType || "N/A"}
                                                </span>
                                            </span>
                                        </span>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-indigo-500 text-indigo-700 hover:bg-indigo-50 transition"
                                        onClick={() => {
                                            setSelectedCv({
                                                ...app.cvSnapshot,
                                                user: app.user,
                                            });
                                            setOpenModal(true);
                                        }}
                                    >
                                        <FileText size={16} className="mr-2" />
                                        View Submitted CV
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed rounded-lg bg-white shadow-lg">
                        <Briefcase
                            size={56}
                            className="mx-auto text-gray-300"
                        />
                        <h2 className="mt-6 text-2xl font-bold text-gray-700">
                            No Applications Found
                        </h2>
                        <p className="text-gray-500 mt-2">
                            You haven't applied for any jobs yet. Keep
                            searching!
                        </p>
                        <Button
                            asChild
                            className="mt-8 px-8 py-3 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow"
                        >
                            <Link to="/jobs">Find Jobs</Link>
                        </Button>
                    </div>
                )}

                {/* Modal hiển thị CV snapshot */}
                <Dialog open={openModal} onOpenChange={setOpenModal}>
                    <DialogContent className="max-w-3xl p-0 bg-gray-50 rounded-2xl shadow-2xl overflow-hidden">
                        <div className="bg-white px-8 py-8 border-b border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-8">
                            {selectedCv?.user?.imageUrl && (
                                <img
                                    src={selectedCv.user.imageUrl}
                                    alt="Avatar"
                                    className="w-28 h-28 rounded-full object-cover border-4 border-indigo-200 shadow"
                                />
                            )}
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-3xl font-bold text-indigo-800">
                                    {selectedCv?.user?.firstName}{" "}
                                    {selectedCv?.user?.lastName}
                                </h2>
                                <div className="mt-2 flex flex-col md:flex-row md:items-center gap-2 md:gap-6 text-gray-600 justify-center md:justify-start">
                                    <span className="flex items-center gap-2">
                                        <FileText size={16} />
                                        {selectedCv?.user?.email}
                                    </span>
                                    {selectedCv?.experience?.[0]?.location && (
                                        <span className="flex items-center gap-2">
                                            <MapPin size={16} />
                                            {selectedCv.experience[0].location}
                                        </span>
                                    )}
                                </div>
                                {selectedCv?.description && (
                                    <p className="mt-4 text-gray-700 text-base">
                                        {selectedCv.description}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="px-8 py-6 bg-gray-50">
                            {/* Skills */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-indigo-700 mb-2">
                                    Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {selectedCv?.skills?.length > 0 ? (
                                        selectedCv.skills.map((skill, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400">
                                            No skills listed.
                                        </span>
                                    )}
                                </div>
                            </div>
                            {/* Education */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-indigo-700 mb-2">
                                    Education
                                </h3>
                                {selectedCv?.education?.length > 0 ? (
                                    selectedCv.education.map((edu, idx) => (
                                        <div key={idx} className="mb-2">
                                            <div className="font-medium">
                                                {edu.school}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {edu.degree} (
                                                {edu.startDate
                                                    ? new Date(
                                                          edu.startDate
                                                      ).getFullYear()
                                                    : "?"}{" "}
                                                -{" "}
                                                {edu.endDate
                                                    ? new Date(
                                                          edu.endDate
                                                      ).getFullYear()
                                                    : "?"}
                                                )
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-gray-400">
                                        No education listed.
                                    </span>
                                )}
                            </div>
                            {/* Experience */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-indigo-700 mb-2">
                                    Experience
                                </h3>
                                {selectedCv?.experience?.length > 0 ? (
                                    selectedCv.experience.map((exp, idx) => (
                                        <div key={idx} className="mb-2">
                                            <div className="font-medium">
                                                {exp.company}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {exp.position} (
                                                {exp.startDate
                                                    ? new Date(
                                                          exp.startDate
                                                      ).getFullYear()
                                                    : "?"}{" "}
                                                -{" "}
                                                {exp.endDate
                                                    ? new Date(
                                                          exp.endDate
                                                      ).getFullYear()
                                                    : "?"}
                                                )
                                            </div>
                                            <div className="text-gray-500 text-sm">
                                                {exp.description}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-gray-400">
                                        No experience listed.
                                    </span>
                                )}
                            </div>
                            {/* Certifications */}
                            <div>
                                <h3 className="text-lg font-semibold text-indigo-700 mb-2">
                                    Certifications
                                </h3>
                                <div className="text-gray-700">
                                    {selectedCv?.certifications || (
                                        <span className="text-gray-400">
                                            No certifications listed.
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
};

export default MyApplicationsPage;
