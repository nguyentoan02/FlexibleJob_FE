import React from "react";

const SkeletonRow = () => (
    <tr>
        {Array.from({ length: 9 }).map((_, i) => (
            <td key={i} className="border px-4 py-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
            </td>
        ))}
    </tr>
);

const ApplicationTable = ({ data, isLoading, onViewProfile }) => {
    if (isLoading)
        return (
            <table className="min-w-full border">
                <thead>
                    <tr>
                        {[
                            "#",
                            "Avatar",
                            "Applicant",
                            "Email",
                            "Job Title",
                            "Status",
                            "Applied At",

                            "Note",
                        ].map((h) => (
                            <th
                                key={h}
                                className="border px-4 py-2 bg-blue-50 text-blue-700"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <SkeletonRow key={i} />
                    ))}
                </tbody>
            </table>
        );
    if (!data || !data.list.length)
        return (
            <div className="p-8 text-gray-400 text-center text-lg">
                No applications found.
            </div>
        );

    return (
        <table className="min-w-full border">
            <thead>
                <tr>
                    <th className="border px-4 py-2 bg-blue-50 text-blue-700">
                        #
                    </th>
                    <th className="border px-4 py-2 bg-blue-50 text-blue-700">
                        Avatar
                    </th>
                    <th className="border px-4 py-2 bg-blue-50 text-blue-700">
                        Applicant
                    </th>
                    <th className="border px-4 py-2 bg-blue-50 text-blue-700">
                        Email
                    </th>
                    <th className="border px-4 py-2 bg-blue-50 text-blue-700">
                        Job Title
                    </th>
                    <th className="border px-4 py-2 bg-blue-50 text-blue-700">
                        Status
                    </th>
                    <th className="border px-4 py-2 bg-blue-50 text-blue-700">
                        Applied At
                    </th>

                    <th className="border px-4 py-2 bg-blue-50 text-blue-700">
                        Note
                    </th>
                </tr>
            </thead>
            <tbody>
                {data.list.map((app, idx) => (
                    <tr
                        key={app._id}
                        className="hover:bg-blue-50 transition-colors duration-150"
                    >
                        <td className="border px-4 py-2">{idx + 1}</td>
                        <td className="border px-4 py-2">
                            <img
                                src={app.cvSnapshot?.user?.imageUrl}
                                alt="avatar"
                                className="w-10 h-10 rounded-full object-cover border"
                            />
                        </td>
                        <td className="border px-4 py-2 font-medium">
                            <button
                                className="text-blue-600 underline hover:text-blue-800 transition"
                                onClick={() =>
                                    onViewProfile && onViewProfile(app)
                                }
                            >
                                {app.cvSnapshot?.user?.firstName}{" "}
                                {app.cvSnapshot?.user?.lastName}
                            </button>
                        </td>
                        <td className="border px-4 py-2">
                            {app.cvSnapshot?.user?.email}
                        </td>
                        <td className="border px-4 py-2">{app.jobTitle}</td>
                        <td className="border px-4 py-2">
                            <span
                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                    app.status === "APPLIED"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : app.status === "HIRED"
                                        ? "bg-green-100 text-green-700"
                                        : app.status === "REJECTED"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                            >
                                {app.status}
                            </span>
                        </td>
                        <td className="border px-4 py-2">
                            {new Date(app.createdAt).toLocaleDateString()}
                        </td>

                        <td className="border px-4 py-2">
                            {app.noted || (
                                <span className="text-gray-400">-</span>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ApplicationTable;
