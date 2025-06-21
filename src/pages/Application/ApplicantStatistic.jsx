import React from "react";
import { useMyApplications } from "@/hooks/manageapplicant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import HeaderJobseeker from "@/components/Header/HeaderJobseeker";
import { Building, MapPin, Clock, FileText, Briefcase } from "lucide-react";

const MyApplicationsPage = () => {
    const { data, isLoading, isError, error } = useMyApplications();

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
        <div className="min-h-screen bg-gray-50">
            <HeaderJobseeker />
            <main className="container mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold mb-8">My Applications</h1>
                {applications.length > 0 ? (
                    <div className="space-y-6">
                        {applications.map((app) => (
                            <Card
                                key={app._id}
                                className="shadow-sm hover:shadow-md transition-shadow"
                            >
                                <CardHeader>
                                    <div className="flex justify-between items-start flex-wrap gap-2">
                                        <div>
                                            <CardTitle className="text-xl font-semibold text-blue-700 hover:underline">
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
                                        <Badge
                                            variant={getStatusBadgeVariant(
                                                app.status
                                            )}
                                            className="capitalize"
                                        >
                                            {app.status.toLowerCase()}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex justify-between items-center flex-wrap gap-4">
                                    <div className="text-sm text-gray-600 flex items-center gap-2">
                                        <Clock size={14} />
                                        Applied on:{" "}
                                        {formatDate(app.applicationDate)}
                                    </div>
                                    <Button asChild variant="outline" size="sm">
                                        <a
                                            href={app.cv.linkUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <FileText
                                                size={14}
                                                className="mr-2"
                                            />{" "}
                                            View Submitted CV
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg bg-white">
                        <Briefcase
                            size={48}
                            className="mx-auto text-gray-400"
                        />
                        <h2 className="mt-4 text-xl font-semibold text-gray-700">
                            No Applications Found
                        </h2>
                        <p className="text-gray-500 mt-2">
                            You haven't applied for any jobs yet. Keep
                            searching!
                        </p>
                        <Button asChild className="mt-6">
                            <Link to="/jobs">Find Jobs</Link>
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyApplicationsPage;
