import React from "react";
import { useNavigate } from "react-router-dom";

const Jobs = ({ jobs, companyAvatar }) => {
    console.log(jobs);
    console.log(companyAvatar);
    const navigate = useNavigate();
    const formatSalary = (salary) => {
        const { min, max, currency } = salary;
        return `${currency} ${min / 1_000_000}M - ${max / 1_000_000}M`;
    };
    console.log(jobs.requirements);
    return (
        <div className="w-full col-span-3">
            <div className="text-lg font-semibold mb-4">
                {jobs.length} New Jobs Found
            </div>
            <div className="space-y-4">
                {jobs.map((job) => (
                    <div
                        key={job._id}
                        className="flex gap-4 border p-4 rounded shadow items-start bg-white"
                    >
                        <img
                            className="w-12 h-12 object-cover rounded-full"
                            src={companyAvatar}
                        />

                        <div className="flex-1 space-y-2">
                            <h2
                                className="text-xl font-semibold hover:cursor-pointer"
                                onClick={() => {
                                    navigate(`/jobs/${job._id}`);
                                }}
                            >
                                {job.title}
                            </h2>
                            <div className="text-gray-600 flex gap-4 flex-wrap text-sm">
                                <span>📍 {job.location}</span>
                                <span>💼 {job.jobType}</span>
                                <span>🔥 {job.level}</span>
                                <span>💰 {formatSalary(job.salary)}</span>
                            </div>
                            <div className="flex gap-2 flex-wrap mt-2">
                                {job.requirements.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-2 py-1 rounded text-sm font-medium border-1 bg-indigo-500 text-white hover:cursor-default"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Jobs;
