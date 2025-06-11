import { FileAddOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { createNewJob } from "../../../api/job";
import { useAuth } from "../../../hooks/useAuth";

const AddNewJob = () => {
    const [toastMessage, setToastMessage] = useState(null); // State for toast message
    const [toastType, setToastType] = useState("success"); // State for toast type
    const { token } = useAuth();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        requirements: [""],
        benefits: [""],
        experienceYears: 0,
        level: "Junior",
        jobType: "Full-time",
        location: "",
        isRemote: false,
        salary: {
            min: "",
            max: "",
            currency: "USD",
        },
        deadline: "",
        expiredAt: "",
    });

    const jobMutation = useMutation({
        mutationFn: () => createNewJob(formData, token),
        onSuccess: (data) => {
            setToastMessage("Create Job successful!"); // Show success toast
            setToastType("success");
            console.log(data);
        },
        onError: () => {
            setToastMessage("Create Job failed. Please try again."); // Show error toast
            setToastType("error");
        },
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes("salary.")) {
            const key = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                salary: { ...prev.salary, [key]: value },
            }));
        } else if (type === "checkbox") {
            setFormData({ ...formData, [name]: checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleArrayChange = (name, index, value) => {
        setFormData((prev) => {
            const updated = [...prev[name]];
            updated[index] = value;
            return { ...prev, [name]: updated };
        });
    };

    const addField = (field) => {
        setFormData((prev) => ({
            ...prev,
            [field]: [...prev[field], ""],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form data:", formData);
        jobMutation.mutate(formData, token);
    };
    return (
        <div className="px-4 py-6 md:px-10 md:py-10 bg-gray-100/20">
            <h2 className="text-4xl font-semibold mb-4 flex items-center">
                Post a new Job
            </h2>
            <div className="mb-4 text-sm text-gray-600">
                <span className="text-gray-400">Home</span> /{" "}
                <span className="text-gray-400">Dashboard</span> /{" "}
                <span className="text-indigo-600 font-semibold">Post Job</span>
            </div>

            <form
                onSubmit={handleSubmit}
                className="w-full mx-auto space-y-6 p-6 bg-white rounded shadow"
            >
                <div className="flex gap-2 items-center">
                    <FileAddOutlined />
                    <h2 className="text-2xl font-semibold">Post Job</h2>
                </div>

                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Job Title"
                    className="w-full border p-2 rounded"
                />

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Job Description"
                    className="w-full border p-2 rounded"
                    rows="4"
                />

                <div>
                    <label className="block font-medium mb-1">
                        Requirements
                    </label>
                    {formData.requirements.map((req, i) => (
                        <input
                            key={i}
                            value={req}
                            onChange={(e) =>
                                handleArrayChange(
                                    "requirements",
                                    i,
                                    e.target.value
                                )
                            }
                            className="w-full border p-2 mb-2 rounded"
                            placeholder={`Requirement ${i + 1}`}
                        />
                    ))}
                    <button
                        type="button"
                        onClick={() => addField("requirements")}
                        className="text-white border rounded-2xl px-3 py-2 bg-indigo-400 hover:bg-indigo-700 duration-300 text-sm"
                    >
                        + Add Requirement
                    </button>
                </div>

                <div>
                    <label className="block font-medium mb-1">Benefits</label>
                    {formData.benefits.map((b, i) => (
                        <input
                            key={i}
                            value={b}
                            onChange={(e) =>
                                handleArrayChange("benefits", i, e.target.value)
                            }
                            className="w-full border p-2 mb-2 rounded"
                            placeholder={`Benefit ${i + 1}`}
                        />
                    ))}
                    <button
                        type="button"
                        onClick={() => addField("benefits")}
                        className="text-white border rounded-2xl px-3 py-2 bg-indigo-400 hover:bg-indigo-700 duration-300 text-sm"
                    >
                        + Add Benefit
                    </button>
                </div>
                <div>
                    <label className="block font-medium mb-1">
                        experience Year required
                    </label>

                    <input
                        type="number"
                        name="experienceYears"
                        value={formData.experienceYears}
                        onChange={handleChange}
                        placeholder="Experience (Years)"
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">
                        Level of candidate
                    </label>

                    <select
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    >
                        {[
                            "Intern",
                            "Fresher",
                            "Junior",
                            "Mid",
                            "Senior",
                            "Manager",
                        ].map((lvl) => (
                            <option key={lvl} value={lvl}>
                                {lvl}
                            </option>
                        ))}
                    </select>
                </div>

                <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                >
                    {[
                        "Full-time",
                        "Part-time",
                        "Internship",
                        "Contract",
                        "Remote",
                    ].map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>

                <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="w-full border p-2 rounded"
                />

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="isRemote"
                        checked={formData.isRemote}
                        onChange={handleChange}
                    />
                    <span>Remote?</span>
                </label>

                <div className="grid grid-cols-3 gap-4">
                    <input
                        type="number"
                        name="salary.min"
                        value={formData.salary.min}
                        onChange={handleChange}
                        placeholder="Min Salary"
                        className="border p-2 rounded"
                    />
                    <input
                        type="number"
                        name="salary.max"
                        value={formData.salary.max}
                        onChange={handleChange}
                        placeholder="Max Salary"
                        className="border p-2 rounded"
                    />
                    <select
                        name="salary.currency"
                        value={formData.salary.currency}
                        onChange={handleChange}
                        className="border p-2 rounded"
                    >
                        <option value="USD">USD</option>
                        <option value="VND">VND</option>
                    </select>
                </div>

                <div>
                    <label className="block font-medium mb-1">
                        Deadline of applicant
                    </label>
                    <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">
                        expired date
                    </label>
                    <input
                        type="date"
                        name="expiredAt"
                        value={formData.expiredAt}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-400 text-white rounded duration-300 hover:bg-indigo-700"
                >
                    Submit Job
                </button>
            </form>
        </div>
    );
};

export default AddNewJob;
