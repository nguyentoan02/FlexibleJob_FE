import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useCVProfile } from "@/hooks/cvprofile";
import axios from "axios";
import { Plus, Minus, Upload, Trash2 } from "lucide-react";
import Toast from "@/components/Toast/Toast";

export default function UpdateCVProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const { data: cvData, isLoading } = useCVProfile();
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "" });
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        skills: [""],
        education: [
            {
                school: "",
                degree: "",
                fieldOfStudy: "",
                startDate: "",
                endDate: "",
                description: "",
            },
        ],
        experience: [
            {
                company: "",
                position: "",
                startDate: "",
                endDate: "",
                description: "",
                location: "",
            },
        ],
        description: "",
        certifications: [""], // sửa thành mảng
        number: "",
        cvPdf: null,
    });

    // Load existing CV data when component mounts
    useEffect(() => {
        if (cvData?.payload) {
            const {
                skills,
                education,
                experience,
                description,
                certifications,
                number,
            } = cvData.payload;
            setFormData({
                skills: skills || [""],
                education: education || [],
                experience: experience || [],
                description: description || "",
                certifications: Array.isArray(certifications)
                    ? certifications.length > 0
                        ? certifications
                        : [""]
                    : [""],
                number: number || "",
                cvPdf: null,
            });
        }
    }, [cvData]);

    // Handle individual section updates
    const handleEducationUpdate = async (index, eduData) => {
        try {
            if (eduData._id) {
                // Update existing education
                await axios.put(
                    `${
                        import.meta.env.VITE_API_URL
                    }/cv-profiles/${id}/education/${eduData._id}`,
                    eduData,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            } else {
                // Add new education
                await axios.post(
                    `${
                        import.meta.env.VITE_API_URL
                    }/cv-profiles/${id}/education`,
                    eduData,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            }
            setToast({
                message: "Education updated successfully!",
                type: "success",
            });
        } catch (error) {
            setToast({ message: "Failed to update education", type: "error" });
        }
    };

    const handleExperienceUpdate = async (index, expData) => {
        try {
            if (expData._id) {
                // Update existing experience
                await axios.put(
                    `${
                        import.meta.env.VITE_API_URL
                    }/cv-profiles/${id}/experience/${expData._id}`,
                    expData,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            } else {
                // Add new experience
                await axios.post(
                    `${
                        import.meta.env.VITE_API_URL
                    }/cv-profiles/${id}/experience`,
                    expData,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            }
            setToast({
                message: "Experience updated successfully!",
                type: "success",
            });
        } catch (error) {
            setToast({ message: "Failed to update experience", type: "error" });
        }
    };

    const handleEducationDelete = async (eduId) => {
        try {
            await axios.delete(
                `${
                    import.meta.env.VITE_API_URL
                }/cv-profiles/${id}/education/${eduId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setToast({
                message: "Education deleted successfully!",
                type: "success",
            });
            // Update local state
            setFormData((prev) => ({
                ...prev,
                education: prev.education.filter((edu) => edu._id !== eduId),
            }));
        } catch (error) {
            setToast({ message: "Failed to delete education", type: "error" });
        }
    };

    const handleExperienceDelete = async (expId) => {
        try {
            await axios.delete(
                `${
                    import.meta.env.VITE_API_URL
                }/cv-profiles/${id}/experience/${expId}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setToast({
                message: "Experience deleted successfully!",
                type: "success",
            });
            // Update local state
            setFormData((prev) => ({
                ...prev,
                experience: prev.experience.filter((exp) => exp._id !== expId),
            }));
        } catch (error) {
            setToast({ message: "Failed to delete experience", type: "error" });
        }
    };

    const validate = () => {
        const newErrors = {};
        // Basic info
        if (!formData.description.trim())
            newErrors.description = "Professional summary is required";
        if (!formData.number.trim())
            newErrors.number = "Contact number is required";
        else if (!/^\d{10}$/.test(formData.number.trim()))
            newErrors.number = "Contact number must be 10 digits";

        // Skills
        if (!formData.skills.length || formData.skills.some((s) => !s.trim()))
            newErrors.skills =
                "At least 1 skill is required and cannot be empty";

        // Certifications
        if (
            !formData.certifications.length ||
            formData.certifications.some((c) => !c.trim())
        )
            newErrors.certifications =
                "At least 1 certification is required and cannot be empty";

        // LOẠI BỎ VALIDATE EDUCATION VÀ EXPERIENCE - chúng có API riêng

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Main form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            setToast({
                message: "Please fix the errors in the form.",
                type: "error",
            });
            return;
        }
        setLoading(true);

        try {
            const data = new FormData();
            if (formData.cvPdf) {
                data.append("cvPdf", formData.cvPdf);
            }

            // Skills
            const validSkills = formData.skills.filter(
                (skill) => skill.trim() !== ""
            );
            validSkills.forEach((skill, index) => {
                data.append(`skills[${index}]`, skill);
            });

            // LOẠI BỎ PHẦN GỬI EDUCATION VÀ EXPERIENCE DATA - chúng có API riêng

            // Rest of the form data
            data.append("description", formData.description);
            data.append("number", formData.number);
            // Certifications (mảng)
            formData.certifications
                .filter((cert) => cert.trim() !== "")
                .forEach((cert, index) => {
                    data.append(`certifications[${index}]`, cert);
                });

            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/cv-profiles/${id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setToast({
                message: "CV Profile updated successfully!",
                type: "success",
            });

            setTimeout(() => {
                navigate("/user/dashboard/cvprofile");
            }, 2000);
        } catch (error) {
            setToast({
                message:
                    error.response?.data?.message ||
                    "Error updating CV Profile",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const today = new Date().toISOString().split("T")[0];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            {toast.message && (
                <Toast message={toast.message} type={toast.type} />
            )}

            <div className="container mx-auto max-w-4xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">
                            Update Your CV Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-10 bg-white rounded-2xl shadow-xl p-10 border border-gray-100"
                        >
                            {/* Basic Information Section */}
                            <div className="space-y-4 border-b pb-6">
                                <h3 className="text-xl font-bold text-green-700 flex items-center gap-2">
                                    <span className="inline-block w-2 h-6 bg-green-500 rounded-full mr-2"></span>
                                    Basic Information
                                </h3>
                                <div>
                                    <Label
                                        htmlFor="description"
                                        className="font-semibold text-gray-700"
                                    >
                                        Professional Summary
                                    </Label>
                                    <textarea
                                        id="description"
                                        className={`w-full h-28 p-3 border rounded-lg focus:ring-2 focus:ring-green-300 transition ${
                                            errors.description
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                    />
                                    {errors.description && (
                                        <p className="text-red-500 text-sm">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label
                                        htmlFor="number"
                                        className="font-semibold text-gray-700"
                                    >
                                        Contact Number
                                    </Label>
                                    <Input
                                        id="number"
                                        type="tel"
                                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-300 transition ${
                                            errors.number
                                                ? "border-red-500"
                                                : ""
                                        }`}
                                        value={formData.number}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                number: e.target.value,
                                            })
                                        }
                                    />
                                    {errors.number && (
                                        <p className="text-red-500 text-sm">
                                            {errors.number}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Skills Section */}
                            <div className="space-y-4 border-b pb-6">
                                <h3 className="text-xl font-bold text-blue-700 flex items-center gap-2">
                                    <span className="inline-block w-2 h-6 bg-blue-500 rounded-full mr-2"></span>
                                    Skills
                                </h3>
                                {formData.skills.map((skill, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={skill}
                                            className="flex-1 border rounded-lg focus:ring-2 focus:ring-blue-300 transition"
                                            onChange={(e) => {
                                                const newSkills = [
                                                    ...formData.skills,
                                                ];
                                                newSkills[index] =
                                                    e.target.value;
                                                setFormData({
                                                    ...formData,
                                                    skills: newSkills,
                                                });
                                            }}
                                            placeholder="Enter a skill"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => {
                                                const newSkills =
                                                    formData.skills.filter(
                                                        (_, i) => i !== index
                                                    );
                                                setFormData({
                                                    ...formData,
                                                    skills: newSkills,
                                                });
                                            }}
                                            disabled={
                                                formData.skills.length === 1
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            skills: [...formData.skills, ""],
                                        })
                                    }
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Skill
                                </Button>
                                {errors.skills && (
                                    <p className="text-red-500 text-sm">
                                        {errors.skills}
                                    </p>
                                )}
                            </div>

                            {/* Education Section - Sửa logic xóa */}
                            <div className="space-y-4 border-b pb-6">
                                <h3 className="text-xl font-bold text-purple-700 flex items-center gap-2">
                                    <span className="inline-block w-2 h-6 bg-purple-500 rounded-full mr-2"></span>
                                    Education
                                </h3>
                                {formData.education.map((edu, index) => (
                                    <Card
                                        key={index || edu._id}
                                        className="mb-4 border border-purple-200 shadow-sm"
                                    >
                                        <CardContent className="space-y-4 pt-6">
                                            <Input
                                                placeholder="School"
                                                value={edu.school}
                                                className="border rounded-lg"
                                                onChange={(e) => {
                                                    const newEducation = [
                                                        ...formData.education,
                                                    ];
                                                    newEducation[index] = {
                                                        ...newEducation[index],
                                                        school: e.target.value,
                                                    };
                                                    setFormData({
                                                        ...formData,
                                                        education: newEducation,
                                                    });
                                                }}
                                            />
                                            <Input
                                                placeholder="Degree"
                                                value={edu.degree}
                                                className="border rounded-lg"
                                                onChange={(e) => {
                                                    const newEducation = [
                                                        ...formData.education,
                                                    ];
                                                    newEducation[index] = {
                                                        ...newEducation[index],
                                                        degree: e.target.value,
                                                    };
                                                    setFormData({
                                                        ...formData,
                                                        education: newEducation,
                                                    });
                                                }}
                                            />
                                            <textarea
                                                placeholder="Description"
                                                className="w-full h-24 p-3 border rounded-lg focus:ring-2 focus:ring-purple-300 transition"
                                                value={edu.description}
                                                onChange={(e) => {
                                                    const newEducation = [
                                                        ...formData.education,
                                                    ];
                                                    newEducation[index] = {
                                                        ...newEducation[index],
                                                        description:
                                                            e.target.value,
                                                    };
                                                    setFormData({
                                                        ...formData,
                                                        education: newEducation,
                                                    });
                                                }}
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    type="date"
                                                    value={
                                                        edu.startDate?.split(
                                                            "T"
                                                        )[0]
                                                    }
                                                    className="border rounded-lg"
                                                    // Xóa thuộc tính max để cho phép chọn ngày trong tương lai
                                                    onChange={(e) => {
                                                        const newEducation = [
                                                            ...formData.education,
                                                        ];
                                                        newEducation[index] = {
                                                            ...newEducation[
                                                                index
                                                            ],
                                                            startDate:
                                                                e.target.value,
                                                        };
                                                        setFormData({
                                                            ...formData,
                                                            education:
                                                                newEducation,
                                                        });
                                                    }}
                                                />
                                                <Input
                                                    type="date"
                                                    value={
                                                        edu.endDate?.split(
                                                            "T"
                                                        )[0]
                                                    }
                                                    className="border rounded-lg"
                                                    // Xóa thuộc tính max để cho phép chọn ngày trong tương lai
                                                    onChange={(e) => {
                                                        const newEducation = [
                                                            ...formData.education,
                                                        ];
                                                        newEducation[index] = {
                                                            ...newEducation[
                                                                index
                                                            ],
                                                            endDate:
                                                                e.target.value,
                                                        };
                                                        setFormData({
                                                            ...formData,
                                                            education:
                                                                newEducation,
                                                        });
                                                    }}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEducationUpdate(
                                                            index,
                                                            edu
                                                        )
                                                    }
                                                >
                                                    Save Education
                                                </Button>
                                                {edu._id && (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleEducationDelete(
                                                                edu._id
                                                            )
                                                        }
                                                        disabled={
                                                            formData.education
                                                                .length === 1
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            education: [
                                                ...formData.education,
                                                {
                                                    school: "",
                                                    degree: "",
                                                    fieldOfStudy: "",
                                                    startDate: "",
                                                    endDate: "",
                                                    description: "",
                                                },
                                            ],
                                        })
                                    }
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Education
                                </Button>
                            </div>

                            {/* Experience Section - Sửa logic xóa */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-orange-700 flex items-center gap-2">
                                    <span className="inline-block w-2 h-6 bg-orange-500 rounded-full mr-2"></span>
                                    Experience
                                </h3>
                                {formData.experience.map((exp, index) => (
                                    <Card
                                        key={index || exp._id}
                                        className="mb-4 border border-orange-200 shadow-sm"
                                    >
                                        <CardContent className="space-y-4 pt-6">
                                            <Input
                                                placeholder="Company"
                                                value={exp.company}
                                                className="border rounded-lg"
                                                onChange={(e) => {
                                                    const newExperience = [
                                                        ...formData.experience,
                                                    ];
                                                    newExperience[index] = {
                                                        ...newExperience[index],
                                                        company: e.target.value,
                                                    };
                                                    setFormData({
                                                        ...formData,
                                                        experience:
                                                            newExperience,
                                                    });
                                                }}
                                            />
                                            <Input
                                                placeholder="Position"
                                                value={exp.position}
                                                className="border rounded-lg"
                                                onChange={(e) => {
                                                    const newExperience = [
                                                        ...formData.experience,
                                                    ];
                                                    newExperience[index] = {
                                                        ...newExperience[index],
                                                        position:
                                                            e.target.value,
                                                    };
                                                    setFormData({
                                                        ...formData,
                                                        experience:
                                                            newExperience,
                                                    });
                                                }}
                                            />
                                            <Input
                                                placeholder="Location"
                                                value={exp.location}
                                                className="border rounded-lg"
                                                onChange={(e) => {
                                                    const newExperience = [
                                                        ...formData.experience,
                                                    ];
                                                    newExperience[index] = {
                                                        ...newExperience[index],
                                                        location:
                                                            e.target.value,
                                                    };
                                                    setFormData({
                                                        ...formData,
                                                        experience:
                                                            newExperience,
                                                    });
                                                }}
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    type="date"
                                                    value={
                                                        exp.startDate?.split(
                                                            "T"
                                                        )[0]
                                                    }
                                                    className="border rounded-lg"
                                                    // Xóa thuộc tính max để cho phép chọn ngày trong tương lai
                                                    onChange={(e) => {
                                                        const newExperience = [
                                                            ...formData.experience,
                                                        ];
                                                        newExperience[index] = {
                                                            ...newExperience[
                                                                index
                                                            ],
                                                            startDate:
                                                                e.target.value,
                                                        };
                                                        setFormData({
                                                            ...formData,
                                                            experience:
                                                                newExperience,
                                                        });
                                                    }}
                                                />
                                                <Input
                                                    type="date"
                                                    value={
                                                        exp.endDate?.split(
                                                            "T"
                                                        )[0]
                                                    }
                                                    className="border rounded-lg"
                                                    // Xóa thuộc tính max để cho phép chọn ngày trong tương lai
                                                    onChange={(e) => {
                                                        const newExperience = [
                                                            ...formData.experience,
                                                        ];
                                                        newExperience[index] = {
                                                            ...newExperience[
                                                                index
                                                            ],
                                                            endDate:
                                                                e.target.value,
                                                        };
                                                        setFormData({
                                                            ...formData,
                                                            experience:
                                                                newExperience,
                                                        });
                                                    }}
                                                />
                                            </div>
                                            <textarea
                                                placeholder="Description"
                                                className="w-full h-24 p-3 border rounded-lg focus:ring-2 focus:ring-orange-300 transition"
                                                value={exp.description}
                                                onChange={(e) => {
                                                    const newExperience = [
                                                        ...formData.experience,
                                                    ];
                                                    newExperience[index] = {
                                                        ...newExperience[index],
                                                        description:
                                                            e.target.value,
                                                    };
                                                    setFormData({
                                                        ...formData,
                                                        experience:
                                                            newExperience,
                                                    });
                                                }}
                                            />
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    onClick={() =>
                                                        handleExperienceUpdate(
                                                            index,
                                                            exp
                                                        )
                                                    }
                                                >
                                                    Save Experience
                                                </Button>
                                                {exp._id && (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        onClick={() =>
                                                            handleExperienceDelete(
                                                                exp._id
                                                            )
                                                        }
                                                        disabled={
                                                            formData.experience
                                                                .length === 1
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            experience: [
                                                ...formData.experience,
                                                {
                                                    company: "",
                                                    position: "",
                                                    startDate: "",
                                                    endDate: "",
                                                    description: "",
                                                    location: "",
                                                },
                                            ],
                                        })
                                    }
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Experience
                                </Button>
                            </div>

                            {/* Certifications Section */}
                            <div className="space-y-4 border-b pb-6">
                                <h3 className="text-xl font-bold text-pink-700 flex items-center gap-2">
                                    <span className="inline-block w-2 h-6 bg-pink-500 rounded-full mr-2"></span>
                                    Certifications
                                </h3>
                                {formData.certifications.map((cert, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={cert}
                                            onChange={(e) => {
                                                const newCerts = [
                                                    ...formData.certifications,
                                                ];
                                                newCerts[index] =
                                                    e.target.value;
                                                setFormData({
                                                    ...formData,
                                                    certifications: newCerts,
                                                });
                                            }}
                                            placeholder="Enter a certification"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => {
                                                const newCerts =
                                                    formData.certifications.filter(
                                                        (_, i) => i !== index
                                                    );
                                                setFormData({
                                                    ...formData,
                                                    certifications:
                                                        newCerts.length
                                                            ? newCerts
                                                            : [""],
                                                });
                                            }}
                                            disabled={
                                                formData.certifications
                                                    .length === 1
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            certifications: [
                                                ...formData.certifications,
                                                "",
                                            ],
                                        })
                                    }
                                    className="w-full"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Certification
                                </Button>
                                {errors.certifications && (
                                    <p className="text-red-500 text-sm">
                                        {errors.certifications}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full mt-8 py-3 text-lg font-bold bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl shadow-lg hover:from-green-500 hover:to-blue-600 transition"
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update CV Profile"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
