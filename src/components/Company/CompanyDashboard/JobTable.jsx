import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useCompanyJobId } from "../../../hooks/companyJob";

const JobTable = ({ jobs, isFetching, onEdit, onViewApplicants, onExpire }) => {
    return (
        <div className="overflow-x-auto relative">
            {isFetching && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            )}

            <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="py-3 px-4 text-left">Title</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-center">Posted Date</th>
                        <th className="py-3 px-4 text-center">Expired</th>
                        <th className="py-3 px-4 text-center">Applications</th>
                        <th className="py-3 px-4 text-center">Salary</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {jobs.map((job) => (
                        <tr key={job._id} className="hover:bg-gray-50">
                            <td className="py-4 px-4">
                                <div className="font-medium">{job.title}</div>
                                <div className="text-sm text-gray-500">
                                    {job.location} • {job.jobType}
                                </div>
                            </td>
                            <td className="py-4 px-4 text-center">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                        job.isExpired
                                            ? "bg-red-100 text-red-800"
                                            : "bg-green-100 text-green-800"
                                    }`}
                                >
                                    {job.isExpired ? "Expired" : "Active"}
                                </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                                {new Date(job.datePosted).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4 text-center">
                                {new Date(job.expiredAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4 text-center">
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                                    Total {job.applicants.length}
                                </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                                {`${
                                    job.salary.currency
                                } ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`}
                            </td>
                            <td className="py-4 px-4">
                                <div className="flex justify-center space-x-2">
                                    <button
                                        className="p-1 hover:text-blue-600 transition-colors bg-indigo-200 rounded-full px-2"
                                        onClick={() =>
                                            onViewApplicants(job._id)
                                        }
                                    >
                                        <EyeOutlined />
                                    </button>
                                    <button
                                        className="p-1 hover:text-green-600 transition-colors bg-green-200 rounded-full px-2"
                                        onClick={() => onEdit(job)}
                                    >
                                        <EditOutlined />
                                    </button>
                                    <button
                                        className="p-1 hover:text-red-600 transition-colors bg-red-200 rounded-full px-2"
                                        onClick={() => onExpire(job._id)}
                                    >
                                        <DeleteOutlined />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default JobTable;
