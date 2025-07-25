import AdminLayout from "@/components/Layout/AdminLayout";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";

const fetchJobList = async (page, limit, isHidden) => {
    const res = await axios.get(
        `${
            import.meta.env.VITE_API_URL
        }/jobs?page=${page}&limit=${limit}&isHidden=${isHidden}`
    );
    return res.data;
};

const hideJob = async (jobId, token) => {
    const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/jobs/${jobId}/hide`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res.data;
};

const unhideJob = async (jobId, token) => {
    const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/jobs/${jobId}/unhide`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return res.data;
};

export default function ManageJob() {
    const [activeTab, setActiveTab] = useState("active");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const queryClient = useQueryClient();
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedReports, setSelectedReports] = useState([]);
    const { user, token } = useAuth();

    // Query jobs
    const {
        data: jobsData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["jobs", page, limit, activeTab],
        queryFn: () =>
            fetchJobList(page, limit, activeTab === "hidden" ? true : false),
        keepPreviousData: true,
    });

    // Lấy danh sách jobs và tổng số jobs an toàn
    const jobs = jobsData?.payload?.jobs || [];
    const totalJobs = jobsData?.payload?.totalJobs ?? 0;
    const totalPages = jobsData?.payload?.totalPages || 1;

    // Hide job mutation
    const hideJobMutation = useMutation({
        mutationFn: ({ jobId, token }) => hideJob(jobId, token),
        onSuccess: () => {
            queryClient.invalidateQueries(["jobs", page, limit, activeTab]);
        },
    });

    // Unhide job mutation
    const unhideJobMutation = useMutation({
        mutationFn: ({ jobId, token }) => unhideJob(jobId, token),
        onSuccess: () => {
            queryClient.invalidateQueries(["jobs", page, limit, activeTab]);
        },
    });

    const handleHideJob = (jobId) => {
        setSelectedJobId(jobId);
        setShowConfirmationModal(true);
    };

    const confirmHideJob = () => {
        hideJobMutation.mutate({ jobId: selectedJobId, token });
        setShowConfirmationModal(false);
        setSelectedJobId(null);
    };

    const cancelHideJob = () => {
        setShowConfirmationModal(false);
        setSelectedJobId(null);
    };

    // Lọc jobs theo searchTerm (nếu cần)
    const filteredJobs = searchTerm
        ? jobs.filter((job) =>
              job.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : jobs;

    return (
        <AdminLayout>
            <div className="p-8">
                <h1 className="text-3xl font-bold mb-6">Manage Jobs</h1>

                {/* Search Bar */}
                <div className="relative w-64 mb-4">
                    <Input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>

                {/* Tabs */}
                <div className="flex space-x-2 mb-4">
                    <button
                        className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 ${
                            activeTab === "active"
                                ? "border-green-500 text-green-600 bg-white"
                                : "border-transparent text-gray-500 bg-gray-100"
                        }`}
                        onClick={() => {
                            setActiveTab("active");
                            setPage(1);
                        }}
                    >
                        Active Jobs
                    </button>
                    <button
                        className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 ${
                            activeTab === "hidden"
                                ? "border-red-500 text-red-600 bg-white"
                                : "border-transparent text-gray-500 bg-gray-100"
                        }`}
                        onClick={() => {
                            setActiveTab("hidden");
                            setPage(1);
                        }}
                    >
                        Hidden Jobs
                    </button>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                            {filteredJobs.length === 0
                                ? 0
                                : (page - 1) * limit + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                            {filteredJobs.length === 0
                                ? 0
                                : Math.min(page * limit, totalJobs)}
                        </span>{" "}
                        of <span className="font-medium">{totalJobs}</span> jobs
                    </p>
                    <div className="flex items-center space-x-2">
                        <Button
                            onClick={() =>
                                setPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={page === 1}
                            variant="outline"
                            size="sm"
                        >
                            Previous
                        </Button>
                        <Button
                            onClick={() =>
                                setPage((prev) =>
                                    Math.min(prev + 1, totalPages)
                                )
                            }
                            disabled={page === totalPages}
                            variant="outline"
                            size="sm"
                        >
                            Next
                        </Button>
                        <Select
                            value={limit.toString()}
                            onValueChange={(value) => {
                                setLimit(parseInt(value));
                                setPage(1); // Reset page to 1 when limit changes
                            }}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Limit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {isLoading ? (
                    <div>Loading jobs...</div>
                ) : isError ? (
                    <div>Error loading jobs.</div>
                ) : (
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[400px]">
                                        Title
                                    </TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Reports</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredJobs.map((job) => (
                                    <TableRow key={job._id}>
                                        <TableCell>{job.title}</TableCell>
                                        <TableCell>
                                            {job.company?.companyName}
                                        </TableCell>
                                        <TableCell>
                                            {job.reports &&
                                            job.reports.length > 0 ? (
                                                <>
                                                    <span className="font-bold text-red-600 mr-2">
                                                        {job.reports.length}
                                                    </span>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setSelectedReports(
                                                                job.reports
                                                            );
                                                            setShowReportModal(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        View
                                                    </Button>
                                                </>
                                            ) : (
                                                <span>0</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {activeTab === "active" ? (
                                                <Button
                                                    onClick={() =>
                                                        handleHideJob(job._id)
                                                    }
                                                    disabled={
                                                        hideJobMutation.isLoading
                                                    }
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                                >
                                                    {hideJobMutation.isLoading &&
                                                    selectedJobId === job._id
                                                        ? "Hiding..."
                                                        : "Hide"}
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() =>
                                                        unhideJobMutation.mutate(
                                                            {
                                                                jobId: job._id,
                                                                token,
                                                            }
                                                        )
                                                    }
                                                    disabled={
                                                        unhideJobMutation.isLoading
                                                    }
                                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                                >
                                                    {unhideJobMutation.isLoading &&
                                                    selectedJobId === job._id
                                                        ? "Unhiding..."
                                                        : "Unhide"}
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}

                {/* Hide Confirmation Modal */}
                <Dialog
                    open={showConfirmationModal}
                    onOpenChange={setShowConfirmationModal}
                >
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Confirm Hide</DialogTitle>
                            <DialogDescription>
                                Are you sure you want to hide this job? This
                                action can be undone by updating the database.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={cancelHideJob}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={confirmHideJob}
                                disabled={hideJobMutation.isLoading}
                            >
                                {hideJobMutation.isLoading
                                    ? "Hiding..."
                                    : "Hide"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Report Modal */}
                <Dialog
                    open={showReportModal}
                    onOpenChange={setShowReportModal}
                >
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>
                                Reports ({selectedReports.length})
                            </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2">
                            {selectedReports.map((report, idx) => (
                                <div
                                    key={report._id || idx}
                                    className="border rounded p-2 bg-gray-50"
                                >
                                    <div className="font-semibold">
                                        Lý do: {report.reason}
                                    </div>
                                    {report.reportedAt && (
                                        <div className="text-xs text-gray-500">
                                            Ngày báo cáo:{" "}
                                            {new Date(
                                                report.reportedAt
                                            ).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowReportModal(false)}
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
} 