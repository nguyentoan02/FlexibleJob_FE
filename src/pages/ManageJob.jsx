import AdminLayout from "@/components/Layout/AdminLayout";
import { useState, useEffect } from "react";
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
const fetchJobList = async (page, limit) => {
    const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/jobs?page=${page}&limit=${limit}`
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

export default function ManageJob() {
    const [activeTab, setActiveTab] = useState("active");
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const queryClient = useQueryClient();
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const { user, token } = useAuth();
    const {
        data: jobsData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["jobs", page, limit],
        queryFn: () => fetchJobList(page, limit),
        keepPreviousData: true,
    });

    const hideJobMutation = useMutation({
        mutationFn: ({ jobId, token }) => hideJob(jobId, token),
        onSuccess: () => {
            queryClient.invalidateQueries(["jobs", page, limit]);
        },
    });

    // Filter jobs by tab and search
    const jobs = jobsData?.payload?.jobs || [];
    const filteredJobs = jobs.filter((job) => {
        const matchesTab =
            activeTab === "active" ? !job.isHidden : job.isHidden;
        const matchesSearch = job.title
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const totalPages = jobsData?.payload?.totalPages || 1;

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
                        onClick={() => setActiveTab("active")}
                    >
                        Active Jobs
                    </button>
                    <button
                        className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 ${
                            activeTab === "hidden"
                                ? "border-red-500 text-red-600 bg-white"
                                : "border-transparent text-gray-500 bg-gray-100"
                        }`}
                        onClick={() => setActiveTab("hidden")}
                    >
                        Hidden Jobs
                    </button>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-700">
                        Showing{" "}
                        <span className="font-medium">
                            {(page - 1) * limit + 1}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                            {Math.min(
                                page * limit,
                                jobsData?.payload?.totalJobs
                            )}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">
                            {jobsData?.payload?.totalJobs}
                        </span>{" "}
                        jobs
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
                                                <span className="text-gray-400">
                                                    Hidden
                                                </span>
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
            </div>
        </AdminLayout>
    );
}
