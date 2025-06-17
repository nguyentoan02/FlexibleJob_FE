import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HeaderJobseeker from "@/components/Header/HeaderJobseeker";
// Thay đổi dòng import này
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
} from "lucide-react";

const fetchJobDetail = async (jobId) => {
    const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/jobs/${jobId}`
    );
    return res.data;
};

export default function JobDetail() {
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const { data: cvData } = useCVProfile();
    const [showApplyModal, setShowApplyModal] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "" });

    // Existing job detail query
    const { data, isLoading } = useQuery({
        queryKey: ["job", jobId],
        queryFn: () => fetchJobDetail(jobId),
    });

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
                navigate("/cvprofile/create");
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

    const job = data?.payload;

    const formatSalary = (salary) => {
        if (!salary) return "Negotiable";
        const { min, max, currency } = salary;
        return `${currency} ${min / 1000}k - ${max / 1000}k`;
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
            <HeaderJobseeker />
            {toast.message && (
                <Toast message={toast.message} type={toast.type} />
            )}
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2">
                            {/* Job Header */}
                            <Card className="mb-8">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-6">
                                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <Building className="h-10 w-10 text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                                {job.title}
                                            </h1>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                                <div className="flex items-center">
                                                    <Building className="h-4 w-4 mr-2" />
                                                    {job.company.companyName}
                                                </div>
                                                <div className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-2" />
                                                    {job.location}
                                                </div>
                                                <div className="flex items-center">
                                                    <Clock className="h-4 w-4 mr-2" />
                                                    Posted{" "}
                                                    {new Date(
                                                        job.datePosted
                                                    ).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2 mt-4">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                                                    {job.level}
                                                </span>
                                                <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm">
                                                    {job.jobType}
                                                </span>
                                                <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-sm">
                                                    {job.experienceYears}+ years
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Job Description */}
                            <Card className="mb-8">
                                <CardContent className="p-6 space-y-6">
                                    <div>
                                        <h2 className="text-xl font-semibold mb-4">
                                            Job Description
                                        </h2>
                                        <p className="text-gray-600 whitespace-pre-line">
                                            {job.description}
                                        </p>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-semibold mb-4">
                                            Requirements
                                        </h2>
                                        <ul className="space-y-2">
                                            {job.requirements.map(
                                                (req, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-start gap-2 text-gray-600"
                                                    >
                                                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                                        <span>{req}</span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>

                                    <div>
                                        <h2 className="text-xl font-semibold mb-4">
                                            Benefits
                                        </h2>
                                        <ul className="space-y-2">
                                            {job.benefits.map(
                                                (benefit, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-start gap-2 text-gray-600"
                                                    >
                                                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                                        <span>{benefit}</span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div>
                            <Card className="sticky top-8">
                                <CardContent className="p-6 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">
                                            Job Overview
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <DollarSign className="h-5 w-5 text-blue-500" />
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Salary
                                                    </p>
                                                    <p className="font-medium">
                                                        {formatSalary(
                                                            job.salary
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Briefcase className="h-5 w-5 text-blue-500" />
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Job Type
                                                    </p>
                                                    <p className="font-medium">
                                                        {job.jobType}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <GraduationCap className="h-5 w-5 text-blue-500" />
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Experience
                                                    </p>
                                                    <p className="font-medium">
                                                        {job.experienceYears}+
                                                        years
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Button
                                            className="w-full bg-blue-600 hover:bg-blue-700"
                                            onClick={handleApplyClick}
                                            disabled={applyMutation.isLoading}
                                        >
                                            {applyMutation.isLoading
                                                ? "Applying..."
                                                : "Apply Now"}
                                        </Button>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                className="flex-1"
                                            >
                                                <BookmarkPlus className="h-4 w-4 mr-2" />
                                                Save
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="flex-1"
                                            >
                                                <Share2 className="h-4 w-4 mr-2" />
                                                Share
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Modal */}
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
