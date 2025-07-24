import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HeaderJobseeker from "@/components/Header/HeaderJobseeker";
import HeaderCompany from "@/components/Header/HeaderCompany";
import { ApplyJobModal } from "@/pages/Application/Applicant";
import { useAuth } from "@/hooks/useAuth";
import { useCVProfile } from "@/hooks/cvprofile";
import Toast from "@/components/Toast/Toast";
import {
    Building,
    MapPin,
    Clock,
    DollarSign,
    Briefcase,
    GraduationCap,
    CheckCircle,
    Share2,
    BookmarkPlus,
    Heart,
    AlertTriangle, // Import AlertTriangle icon
} from "lucide-react";
import { useFavoriteJobs } from "@/hooks/favoriteJob";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import ChatButton from "@/components/Chat/ChatButton";

const fetchJobDetail = async (jobId, token) => {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/jobs/${jobId}`,
        { headers }
    );
    return res.data;
};

const fetchActiveJobsByCompany = async (companyId) => {
    const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/jobs/active/${companyId}`
    );
    return res.data;
};

export default function JobDetail() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user, token } = useAuth();
    const { data: cvData } = useCVProfile();
    const { checkFavoriteStatus, addToFavorites, removeFromFavorites } =
        useFavoriteJobs();
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "" });
    const [isFavorited, setIsFavorited] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false); // State to control the report modal
    const [reportReason, setReportReason] = useState(""); // State to hold the report reason

    // Fetch job details
    const { data, isLoading } = useQuery({
        queryKey: ["job", jobId],
        queryFn: () => fetchJobDetail(jobId, token),
    });

    // Fetch active jobs by company
    // const { data: activeJobsData } = useQuery({
    //     queryKey: ["activeJobs", data?.payload?.company?._id],
    //     queryFn: () => fetchActiveJobsByCompany(data?.payload?.company?._id),
    //     enabled: !!data?.payload?.company?._id,
    // });

    const job = data?.payload;

    const formatSalary = (salary) => {
        if (!salary) return "Negotiable";
        const { min, max, currency } = salary;
        return `${currency} ${min / 1000}k - ${max / 1000}k`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    // Apply mutation
    const applyMutation = useMutation({
        mutationFn: async ({ cvId, noted }) => {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/applications/apply/${jobId}`,
                {
                    cvProfileId: cvId,
                    noted: noted,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            return response.data;
        },
        onSuccess: () => {
            setToast({
                message: "Application submitted successfully!",
                type: "success",
            });
            setShowApplyModal(false);
            queryClient.invalidateQueries(["job", jobId]); // Refetch job details
        },
        onError: (error) => {
            setToast({
                message:
                    error.response?.data?.message ||
                    "Failed to submit application",
                type: "error",
            });
        },
    });

    useEffect(() => {
        const checkFavorite = async () => {
            if (user) {
                const status = await checkFavoriteStatus(jobId);
                setIsFavorited(status);
            }
        };
        checkFavorite();
    }, [jobId, user]);

    const handleFavoriteClick = async () => {
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            if (isFavorited) {
                await removeFromFavorites.mutateAsync(jobId);
                setToast({
                    message: "Removed from favorites",
                    type: "success",
                });
            } else {
                await addToFavorites.mutateAsync(jobId);
                setToast({
                    message: "Added to favorites",
                    type: "success",
                });
            }
            setIsFavorited(!isFavorited);
        } catch (error) {
            setToast({
                message: "Failed to update favorites",
                type: "error",
            });
        }
    };

    const handleApplyClick = () => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (!cvData?.payload) {
            setToast({
                message: "Please create a CV profile first",
                type: "error",
            });
            setTimeout(() => {
                navigate("/user/dashboard/cvprofile/create");
            }, 2000);
            return;
        }

        setShowApplyModal(true);
    };

    const handleApplyConfirm = (note) => {
        applyMutation.mutate({
            cvId: cvData.payload._id,
            noted: note,
        });
    };

    const handleReportClick = () => {
        if (!user) {
            navigate("/login");
            return;
        }
        setShowReportModal(true);
    };

    const handleReportConfirm = async () => {
        try {
            // Call the report API
            await axios.post(
                `${import.meta.env.VITE_API_URL}/jobs/${jobId}/report`,
                { reason: reportReason },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setToast({
                message: "Job reported successfully!",
                type: "success",
            });
        } catch (error) {
            setToast({
                message:
                    error.response?.data?.message || "Failed to report job",
                type: "error",
            });
        } finally {
            setShowReportModal(false);
            setReportReason("");
        }
    };

    const handleReportCancel = () => {
        setShowReportModal(false);
        setReportReason("");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <>
            {user?.role === "JOBSEEKER" ? (
                <HeaderJobseeker />
            ) : (
                <HeaderCompany />
            )}
            {toast.message && (
                <Toast message={toast.message} type={toast.type} />
            )}
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Job Header */}
                            <Card className="mb-0 shadow-xl border-0 bg-white/90 backdrop-blur-lg rounded-2xl">
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-8">
                                        {/* Company avatar */}
                                        <div className="w-24 h-24 bg-gradient-to-tr from-blue-200 to-indigo-200 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg border-4 border-white">
                                            {job.company.imageUrl ? (
                                                <img
                                                    src={job.company.imageUrl}
                                                    alt={
                                                        job.company.companyName
                                                    }
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <Building className="h-12 w-12 text-indigo-600" />
                                            )}
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Badge className="bg-green-100 text-green-800 px-3 py-1 text-sm font-medium">
                                                    {job.jobType}
                                                </Badge>
                                                <Badge className="bg-blue-100 text-blue-800 px-3 py-1 text-sm font-medium">
                                                    {job.level}
                                                </Badge>
                                            </div>
                                            <h1 className="text-4xl font-bold text-gray-800 mb-3">
                                                {job.title}
                                            </h1>
                                            <Link
                                                to={`/company/${job.company._id}`}
                                                className="text-2xl font-semibold text-indigo-600 hover:underline mb-4 block"
                                            >
                                                {job.company.companyName}
                                            </Link>

                                            <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-5 w-5 text-indigo-500" />
                                                    <span className="font-medium">
                                                        {job.location}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-5 w-5 text-green-500" />
                                                    <span className="font-medium">
                                                        Posted{" "}
                                                        {formatDate(
                                                            job.createdAt
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-5 w-5 text-yellow-500" />
                                                    <span className="font-medium">
                                                        {formatSalary(
                                                            job.salary
                                                        )}
                                                    </span>
                                                </div>
                                                {/* Add deadline info here */}
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-5 w-5 text-red-500" />
                                                    <span className="font-medium">
                                                        Deadline:{" "}
                                                        {formatDate(
                                                            job.deadline
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap gap-4">
                                                <Button
                                                    onClick={handleApplyClick}
                                                    className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                                                >
                                                    Apply Now
                                                </Button>

                                                {/* Add Chat Button here */}
                                                <ChatButton
                                                    company={job.company}
                                                />

                                                <Button
                                                    variant="outline"
                                                    onClick={handleReportClick}
                                                    className="border-orange-300 text-orange-600 hover:bg-orange-50 font-semibold py-3 px-6 rounded-full shadow transition-all duration-300 flex items-center gap-2"
                                                >
                                                    <AlertTriangle className="h-5 w-5" />
                                                    Report Job
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Job Description */}
                            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-lg rounded-2xl">
                                <CardContent className="p-8 space-y-8">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-3 text-blue-700">
                                            Job Description
                                        </h2>
                                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                                            {job.description}
                                        </p>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold mb-3 text-blue-700">
                                            Requirements
                                        </h2>
                                        <ul className="space-y-3">
                                            {job.requirements.map(
                                                (req, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-center gap-3 text-gray-700"
                                                    >
                                                        <CheckCircle className="h-6 w-6 text-green-500" />
                                                        <span>{req}</span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold mb-3 text-blue-700">
                                            Benefits
                                        </h2>
                                        <ul className="space-y-3">
                                            {job.benefits.map(
                                                (benefit, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-center gap-3 text-gray-700"
                                                    >
                                                        <CheckCircle className="h-6 w-6 text-indigo-500" />
                                                        <span>{benefit}</span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Active Jobs from the Same Company */}
                            <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-2xl">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold text-indigo-700">
                                        Other Active Jobs from{" "}
                                        {job.company.companyName}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    {job.activeJobs &&
                                    job.activeJobs.length > 0 ? (
                                        <div className="grid gap-4">
                                            {job.activeJobs.map((activeJob) => (
                                                <div
                                                    key={activeJob._id}
                                                    className="border rounded-xl p-4 bg-white/80 hover:bg-blue-50 transition-all shadow flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                                                >
                                                    <div className="flex-1">
                                                        <Link
                                                            to={`/jobs/${activeJob._id}`}
                                                            className="text-lg font-semibold text-blue-600 hover:underline"
                                                        >
                                                            {activeJob.title}
                                                        </Link>
                                                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="w-4 h-4 text-green-500" />
                                                                {
                                                                    activeJob.location
                                                                }
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-4 h-4 text-yellow-500" />
                                                                {formatDate(
                                                                    activeJob.datePosted
                                                                )}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Briefcase className="w-4 h-4 text-blue-500" />
                                                                {
                                                                    activeJob.jobType
                                                                }
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <DollarSign className="w-4 h-4 text-green-600" />
                                                                {formatSalary(
                                                                    activeJob.salary
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 md:mt-0">
                                                        <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow mr-2">
                                                            {activeJob.level}
                                                        </Badge>
                                                        <Badge className="bg-yellow-400 text-white shadow">
                                                            {
                                                                activeJob.experienceYears
                                                            }
                                                            + yrs
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">
                                            This company currently has no other
                                            active jobs.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div>
                            <Card className="sticky top-8 shadow-2xl border-0 bg-white/95 backdrop-blur-lg rounded-2xl">
                                <CardContent className="p-8 space-y-8">
                                    <div>
                                        <h3 className="text-xl font-bold mb-4 text-blue-700">
                                            Job Overview
                                        </h3>
                                        <div className="space-y-5">
                                            <div className="flex items-center gap-4">
                                                <DollarSign className="h-6 w-6 text-green-600" />
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Salary
                                                    </p>
                                                    <p className="font-bold text-lg text-green-700">
                                                        {formatSalary(
                                                            job.salary
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Briefcase className="h-6 w-6 text-blue-600" />
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Job Type
                                                    </p>
                                                    <p className="font-semibold">
                                                        {job.jobType}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <GraduationCap className="h-6 w-6 text-yellow-600" />
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Experience
                                                    </p>
                                                    <p className="font-semibold">
                                                        {job.experienceYears}+
                                                        years
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <Briefcase className="h-6 w-6 text-indigo-600" />
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Applicants
                                                    </p>
                                                    <p className="font-semibold">
                                                        {job.applicantCount}{" "}
                                                        applicants
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {job.hasApplied ? (
                                            <Button
                                                className="w-full bg-gray-400 cursor-not-allowed text-white font-bold py-3 rounded-xl"
                                                disabled
                                            >
                                                Already Applied
                                            </Button>
                                        ) : (
                                            <Button
                                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition-all"
                                                onClick={handleApplyClick}
                                                disabled={
                                                    applyMutation.isLoading
                                                }
                                            >
                                                {applyMutation.isLoading
                                                    ? "Applying..."
                                                    : "Apply Now"}
                                            </Button>
                                        )}
                                        <div className="flex gap-2 mt-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1 border-blue-200 hover:bg-blue-50 rounded-lg shadow"
                                            >
                                                <BookmarkPlus className="h-5 w-5 mr-2 text-blue-500" />
                                                Share
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex-1 border-indigo-200 hover:bg-indigo-50 rounded-lg shadow"
                                            >
                                                <Share2 className="h-5 w-5 mr-2 text-indigo-500" />
                                                Share
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className={`flex-1 rounded-lg shadow ${
                                                    isFavorited
                                                        ? "border-red-200 bg-red-50"
                                                        : "border-gray-200"
                                                }`}
                                                onClick={handleFavoriteClick}
                                                disabled={
                                                    addToFavorites.isLoading ||
                                                    removeFromFavorites.isLoading
                                                }
                                            >
                                                <Heart
                                                    className={`h-5 w-5 mr-2 ${
                                                        isFavorited
                                                            ? "fill-red-500 text-red-500"
                                                            : "text-gray-400"
                                                    }`}
                                                />
                                                {isFavorited ? "Saved" : "Save"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-lg shadow"
                                                onClick={handleReportClick}
                                            >
                                                <AlertTriangle className="h-5 w-5 mr-2" />
                                                Report
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Report Modal */}
            <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Report Job</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for reporting this job.
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        placeholder="Enter your reason here..."
                        className="mt-4"
                    />
                    <DialogFooter>
                        <Button variant="ghost" onClick={handleReportCancel}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleReportConfirm}
                            disabled={!reportReason}
                        >
                            Submit Report
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Apply Modal */}
            <ApplyJobModal
                isOpen={showApplyModal}
                onClose={() => setShowApplyModal(false)}
                onConfirm={handleApplyConfirm}
                cvData={cvData?.payload}
                isLoading={applyMutation.isLoading}
            />
        </>
    );
}
