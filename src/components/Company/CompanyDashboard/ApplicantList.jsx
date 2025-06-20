import React from "react";

const ApplicantList = ({ ApplicantList }) => {
    console.log(ApplicantList);
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };
    return (
        <div className="grid grid-cols-4">
            <div className="col-span-1">
                {ApplicantList.map((app, index) => (
                    <div
                        className="border-1 rounded-2xl flex gap-5"
                        key={index}
                    >
                        <img
                            src={app.user.imageUrl}
                            alt=""
                            className="w-20 h-20 object-cover rounded-full"
                        />
                        <div className="flex flex-col">
                            <div>
                                Candidate Name: {app.user.firstName}{" "}
                                {app.user.lastName}
                            </div>
                            <div>Status: {app.status}</div>
                            <div>
                                Apply Date: {formatDate(app.applicationDate)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div></div>
        </div>
    );
};

export default ApplicantList;
