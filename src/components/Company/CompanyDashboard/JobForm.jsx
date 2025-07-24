import { FileAddOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useCategory } from "../../../hooks/category";
import LimitTationJobPost from "./LimitTationJobPost";

const JobForm = ({ handleSubmit, title, initialData, limitData }) => {
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

    const [errors, setErrors] = useState({});

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

    const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, "0");
        const day = `${date.getDate()}`.padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Title is required";
        if (!formData.description.trim())
            newErrors.description = "Description is required";
        if (!formData.requirements.some((r) => r.trim()))
            newErrors.requirements = "At least 1 requirement";
        if (!formData.benefits.some((b) => b.trim()))
            newErrors.benefits = "At least 1 benefit";
        if (!formData.location.trim())
            newErrors.location = "Location is required";
        if (!formData.salary.min || !formData.salary.max)
            newErrors.salary = "Salary min & max required";
        if (Number(formData.salary.min) > Number(formData.salary.max))
            newErrors.salary = "Min salary must be <= max";
        if (!formData.deadline) {
            newErrors.deadline = "Deadline is required";
        } else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const minDeadline = new Date(today);
            minDeadline.setDate(minDeadline.getDate() + 7); // tối thiểu 1 tuần
            const deadlineDate = new Date(formData.deadline);
            if (deadlineDate <= today) {
                newErrors.deadline = "Deadline must be after today";
            } else if (deadlineDate < minDeadline) {
                newErrors.deadline =
                    "Deadline must be at least 1 week from today";
            }
        }
        if (!formData.category) newErrors.category = "Category is required";

        // Validate expiredAt nếu có (chỉ khi tạo mới)
        if (!initialData) {
            if (!formData.expiredAt) {
                newErrors.expiredAt = "Expired date is required";
            } else {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const minExpired = new Date(today);
                minExpired.setDate(minExpired.getDate() + 7);
                const expiredDate = new Date(formData.expiredAt);
                if (expiredDate <= today) {
                    newErrors.expiredAt = "Expired date must be after today";
                } else if (expiredDate < minExpired) {
                    newErrors.expiredAt =
                        "Expired date must be at least 1 week from today";
                }
            }
        }

        return newErrors;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const foundErrors = validate();
        setErrors(foundErrors);
        if (Object.keys(foundErrors).length === 0) {
            handleSubmit(formData, e);
        }
    };

    useEffect(() => {
        // Nếu là tạo mới (không có initialData), set category mặc định là rỗng
        if (
            !initialData &&
            AllCategory.isSuccess &&
            AllCategory.data?.payload
        ) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                category: "",
            }));
        }
    }, [AllCategory.data, AllCategory.isSuccess, initialData]);

    if (AllCategory.isLoading) return <div>...loading</div>;
    if (AllCategory.isError) return <div>{AllCategory.error.message}</div>;

    const handleUpdate = (formData, e) => {
        e.preventDefault();
        // Nếu category là array object, lấy _id
        let category = formData.category;
        if (
            Array.isArray(category) &&
            category.length > 0 &&
            typeof category[0] === "object"
        ) {
            category = category.map((c) => c._id);
            // Nếu chỉ cho phép 1 category, lấy category[0]
            category = category[0];
        }
        const submitData = { ...formData, category };
        jobMutaion.mutate(submitData);
        setEditModal(false);
    };

    const handleEdit = (job) => {
        // Nếu job.category là object, lấy _id, nếu là string thì giữ nguyên
        setJobdata({
            ...job,
            category:
                typeof job.category === "object"
                    ? job.category._id
                    : job.category,
        });
        setEditModal(true);
    };

    return (
        <>
            <div className="flex justify-between mb-2">
                <div>
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
                </div>
                {!initialData && (
                    <div>
                        <LimitTationJobPost data={limitData} />
                    </div>
                )}
            </div>

            <form
                onSubmit={onSubmit}
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
                {errors.title && (
                    <div className="text-red-500 text-sm">{errors.title}</div>
                )}

                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Job Description"
                    className="w-full border p-2 rounded"
                    rows="4"
                />
                {errors.description && (
                    <div className="text-red-500 text-sm">
                        {errors.description}
                    </div>
                )}

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
                    {errors.requirements && (
                        <div className="text-red-500 text-sm">
                            {errors.requirements}
                        </div>
                    )}
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
                    {errors.benefits && (
                        <div className="text-red-500 text-sm">
                            {errors.benefits}
                        </div>
                    )}
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
                        min={0}
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
                        onChange={handleChange}
                        value={formData.category}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">Select a category</option>
                        {AllCategory?.data?.payload?.map((cate) => (
                            <option key={cate._id} value={cate._id}>
                                {cate.categoryName}
                            </option>
                        ))}
                    </select>
                    {errors.category && (
                        <div className="text-red-500 text-sm">
                            {errors.category}
                        </div>
                    )}
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
                {errors.location && (
                    <div className="text-red-500 text-sm">
                        {errors.location}
                    </div>
                )}

                {/* <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="isRemote"
                        checked={formData.isRemote}
                        onChange={handleChange}
                    />
                    <span>Remote?</span>
                </label> */}

                <div className="grid grid-cols-3 gap-4">
                    <input
                        type="number"
                        name="salary.min"
                        value={formData.salary.min}
                        onChange={handleChange}
                        placeholder="Min Salary"
                        className="border p-2 rounded"
                        min={0}
                    />
                    <input
                        type="number"
                        name="salary.max"
                        value={formData.salary.max}
                        onChange={handleChange}
                        placeholder="Max Salary"
                        className="border p-2 rounded"
                        min={0}
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
                {errors.salary && (
                    <div className="text-red-500 text-sm">{errors.salary}</div>
                )}

                <div>
                    <label className="block font-medium mb-1">
                        Deadline of applicant
                    </label>
                    <input
                        type="date"
                        name="deadline"
                        value={formatDateForInput(formData.deadline)}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                    {errors.deadline && (
                        <div className="text-red-500 text-sm">
                            {errors.deadline}
                        </div>
                    )}
                </div>
                {!initialData && (
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
                        {errors.expiredAt && (
                            <div className="text-red-500 text-sm">
                                {errors.expiredAt}
                            </div>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-400 text-white rounded duration-300 hover:bg-indigo-700"
                >
                    {initialData ? "update this job" : "submit job"}
                </button>
            </form>
        </>
    );
};

export default JobForm;
