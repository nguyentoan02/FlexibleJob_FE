import { FileAddOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useCategory } from "../../../hooks/category";

const JobForm = ({ handleSubmit, title, initialData }) => {
    const { AllCategory } = useCategory();

    const [formData, setFormData] = useState(
        initialData || {
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
            category: "",
        }
    );

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

    useEffect(() => {
        if (AllCategory.isSuccess && AllCategory.data?.payload) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                category: AllCategory.data.payload,
            }));
        }
    }, [AllCategory.data, AllCategory.isSuccess]);

    if (AllCategory.isLoading) return <div>...loading</div>;
    if (AllCategory.isError) return <div>{AllCategory.error.message}</div>;

    return (
        <>
            <h2 className="text-4xl font-semibold mb-4 flex items-center">
                {title || "Post a new Job"}
            </h2>
            <div className="mb-4 text-sm text-gray-600">
                <span className="text-gray-400">Home</span> /{" "}
                <span className="text-gray-400">Dashboard</span> /{" "}
                <span className="text-indigo-600 font-semibold">
                    {title || "Post Job"}
                </span>
            </div>

            <form
                onSubmit={(e) => handleSubmit(formData, e)}
                className="w-full mx-auto space-y-6 p-6 bg-white rounded shadow"
            >
                <div className="flex gap-2 items-center">
                    <FileAddOutlined />
                    <h2 className="text-2xl font-semibold">
                        {title || "Post Job"}
                    </h2>
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
                <div>
                    <label className="block font-medium mb-1">Category</label>

                    <select
                        name="category"
                        value={formData.category} // Should be a string like "1"
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">Select a category</option>
                        {AllCategory?.data?.payload?.map((cate) => (
                            <option key={cate._id} value={cate._id}>
                                {cate.categoryName}
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
        </>
    );
};

export default JobForm;
