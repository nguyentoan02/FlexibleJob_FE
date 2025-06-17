import { FileAddOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { createNewJob } from "../../../api/job";
import { useAuth } from "../../../hooks/useAuth";
import { useCategory } from "../../../hooks/category";
import Toast from "../../Toast/Toast";
import JobForm from "./JobForm";

const AddNewJob = () => {
    const [toastMessage, setToastMessage] = useState(null); // State for toast message
    const [toastType, setToastType] = useState("success"); // State for toast type
    const { token } = useAuth();

    const jobMutation = useMutation({
        mutationFn: (formData) => createNewJob(formData, token),
        onSuccess: (data) => {
            setToastMessage("Create Job successful!"); // Show success toast
            setToastType("success");
            console.log(data);
        },
        onError: (data) => {
            setToastMessage("Create Job failed. Please try again.");
            console.log(data); // Show error toast
            setToastType("error");
        },
    });

    const handleSubmit = (formData, e) => {
        e.preventDefault();
        console.log("Form data:", formData, token);
        jobMutation.mutate(formData);
    };
    return (
        <div className="px-4 py-6 md:px-10 md:py-10 bg-gray-100/20">
            {toastMessage && <Toast message={toastMessage} type={toastType} />}
            <JobForm handleSubmit={handleSubmit} />
        </div>
    );
};

export default AddNewJob;
