import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { Plus, Minus } from "lucide-react";
import Toast from "@/components/Toast/Toast";
import { useQueryClient } from "@tanstack/react-query";

export default function CreateCVProfile() {
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const queryClient = useQueryClient();
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
        certifications: [""],
        number: "",
    });

    // Validate function
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

        // Education
        if (!formData.education.length)
            newErrors.education = "At least 1 education is required";
        formData.education.forEach((edu, idx) => {
            if (
                !edu.school.trim() ||
                !edu.degree.trim() ||
                !edu.startDate ||
                !edu.endDate
            ) {
                newErrors[`education_${idx}`] = "All fields are required";
            }
            // BỎ kiểm tra ngày endDate > hôm nay
            if (!edu.description.trim()) {
                newErrors[`education_${idx}_description`] =
                    "Description is required";
            }
        });

        // Experience
        if (!formData.experience.length)
            newErrors.experience = "At least 1 experience is required";
        formData.experience.forEach((exp, idx) => {
            if (
                !exp.company.trim() ||
                !exp.position.trim() ||
                !exp.startDate ||
                !exp.endDate ||
                !exp.location.trim()
            ) {
                newErrors[`experience_${idx}`] = "All fields are required";
            }
            // BỎ kiểm tra ngày endDate > hôm nay
            if (!exp.description.trim()) {
                newErrors[`experience_${idx}_description`] =
                    "Description is required";
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSkillChange = (index, value) => {
        const newSkills = [...formData.skills];
        newSkills[index] = value;
        setFormData({ ...formData, skills: newSkills });
    };

    const addSkill = () => {
        setFormData({ ...formData, skills: [...formData.skills, ""] });
    };

    const removeSkill = (index) => {
        const newSkills = formData.skills.filter((_, i) => i !== index);
        setFormData({ ...formData, skills: newSkills });
    };

    const handleEducationChange = (index, field, value) => {
        const newEducation = [...formData.education];
        newEducation[index] = { ...newEducation[index], [field]: value };
        setFormData({ ...formData, education: newEducation });
    };

    const addEducation = () => {
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
        });
    };

    const removeEducation = (index) => {
        const newEducation = formData.education.filter((_, i) => i !== index);
        setFormData({ ...formData, education: newEducation });
    };

    const handleExperienceChange = (index, field, value) => {
        const newExperience = [...formData.experience];
        newExperience[index] = { ...newExperience[index], [field]: value };
        setFormData({ ...formData, experience: newExperience });
    };

    const addExperience = () => {
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
        });
    };

    const removeExperience = (index) => {
        const newExperience = formData.experience.filter((_, i) => i !== index);
        setFormData({ ...formData, experience: newExperience });
    };

    // Certification handlers
    const handleCertificationChange = (index, value) => {
        const newCerts = [...formData.certifications];
        newCerts[index] = value;
        setFormData({ ...formData, certifications: newCerts });
    };

    const addCertification = () => {
        setFormData({
            ...formData,
            certifications: [...formData.certifications, ""],
        });
    };

    const removeCertification = (index) => {
        const newCerts = formData.certifications.filter((_, i) => i !== index);
        setFormData({ ...formData, certifications: newCerts });
    };

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

            // Skills
            formData.skills.forEach((skill, index) => {
                data.append(`skills[${index}]`, skill);
            });

            // Education
            formData.education.forEach((edu, index) => {
                Object.keys(edu).forEach((key) => {
                    data.append(`education[${index}][${key}]`, edu[key]);
                });
            });

            // Experience
            formData.experience.forEach((exp, index) => {
                Object.keys(exp).forEach((key) => {
                    data.append(`experience[${index}][${key}]`, exp[key]);
                });
            });

            // Certifications
            formData.certifications.forEach((cert, index) => {
                data.append(`certifications[${index}]`, cert);
            });

            data.append("description", formData.description);
            data.append("number", formData.number);

            await axios.post(
                `${import.meta.env.VITE_API_URL}/cv-profiles`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // Invalidate the query to refetch the data on the view page
            await queryClient.invalidateQueries(["cvProfile", user?.id]);

            setToast({
                message: "CV Profile created successfully!",
                type: "success",
            });

            navigate("/user/dashboard/cvprofile");
        } catch (error) {
            setToast({
                message:
                    error.response?.data?.message ||
                    "Error creating CV Profile",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            {toast.message && (
                <Toast message={toast.message} type={toast.type} />
            )}
            <div className="container mx-auto max-w-3xl">
                <Card className="shadow-2xl border-0 rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-center text-blue-700">
                            Create Your CV Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-blue-700">
                                    Professional Summary
                                </h3>
                                <textarea
                                    id="description"
                                    className={`w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-300 transition resize-y ${
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
                                    placeholder="Write a summary about yourself..."
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm">
                                        {errors.description}
                                    </p>
                                )}
                                <Label
                                    htmlFor="number"
                                    className="font-semibold text-gray-700"
                                >
                                    Contact Number
                                </Label>
                                <Input
                                    id="number"
                                    type="tel"
                                    maxLength={10}
                                    value={formData.number}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            number: e.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 10),
                                        })
                                    }
                                    placeholder="Enter 10-digit phone number"
                                    className={
                                        errors.number ? "border-red-500" : ""
                                    }
                                />
                                {errors.number && (
                                    <p className="text-red-500 text-sm">
                                        {errors.number}
                                    </p>
                                )}
                            </div>

                            {/* Skills */}
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-green-700">
                                    Skills
                                </h3>
                                {formData.skills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-2 items-center"
                                    >
                                        <Input
                                            value={skill}
                                            onChange={(e) =>
                                                handleSkillChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter a skill"
                                            className={
                                                errors.skills
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => removeSkill(index)}
                                            disabled={
                                                formData.skills.length === 1
                                            }
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {errors.skills && (
                                    <p className="text-red-500 text-sm">
                                        {errors.skills}
                                    </p>
                                )}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addSkill}
                                    className="w-full"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Skill
                                </Button>
                            </div>

                            {/* Education */}
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-purple-700">
                                    Education
                                </h3>
                                {formData.education.map((edu, index) => (
                                    <Card
                                        key={index}
                                        className="mb-4 border border-purple-200 shadow-sm"
                                    >
                                        <CardContent className="space-y-3 pt-6">
                                            <Input
                                                placeholder="School"
                                                value={edu.school}
                                                onChange={(e) =>
                                                    handleEducationChange(
                                                        index,
                                                        "school",
                                                        e.target.value
                                                    )
                                                }
                                                className={
                                                    errors[`education_${index}`]
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            <Input
                                                placeholder="Degree"
                                                value={edu.degree}
                                                onChange={(e) =>
                                                    handleEducationChange(
                                                        index,
                                                        "degree",
                                                        e.target.value
                                                    )
                                                }
                                                className={
                                                    errors[`education_${index}`]
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            <Input
                                                placeholder="Field of Study"
                                                value={edu.fieldOfStudy}
                                                onChange={(e) =>
                                                    handleEducationChange(
                                                        index,
                                                        "fieldOfStudy",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    type="date"
                                                    value={edu.startDate}
                                                    onChange={(e) =>
                                                        handleEducationChange(
                                                            index,
                                                            "startDate",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={
                                                        errors[
                                                            `education_${index}`
                                                        ]
                                                            ? "border-red-500"
                                                            : ""
                                                    }
                                                />
                                                <Input
                                                    type="date"
                                                    value={edu.endDate}
                                                    onChange={(e) =>
                                                        handleEducationChange(
                                                            index,
                                                            "endDate",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={
                                                        errors[
                                                            `education_${index}_endDate`
                                                        ]
                                                            ? "border-red-500"
                                                            : ""
                                                    }
                                                />
                                            </div>
                                            <textarea
                                                placeholder="Description"
                                                className={`w-full h-20 p-2 border rounded-md resize-y ${
                                                    errors[
                                                        `education_${index}_description`
                                                    ]
                                                        ? "border-red-500"
                                                        : ""
                                                }`}
                                                value={edu.description}
                                                onChange={(e) =>
                                                    handleEducationChange(
                                                        index,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            {errors[`education_${index}`] && (
                                                <p className="text-red-500 text-sm">
                                                    {
                                                        errors[
                                                            `education_${index}`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                            {errors[
                                                `education_${index}_endDate`
                                            ] && (
                                                <p className="text-red-500 text-sm">
                                                    {
                                                        errors[
                                                            `education_${index}_endDate`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                            {errors[
                                                `education_${index}_description`
                                            ] && (
                                                <p className="text-red-500 text-sm">
                                                    {
                                                        errors[
                                                            `education_${index}_description`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() =>
                                                    removeEducation(index)
                                                }
                                                className="w-full"
                                                disabled={
                                                    formData.education
                                                        .length === 1
                                                }
                                            >
                                                Remove Education
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                                {errors.education && (
                                    <p className="text-red-500 text-sm">
                                        {errors.education}
                                    </p>
                                )}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addEducation}
                                    className="w-full"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Education
                                </Button>
                            </div>

                            {/* Experience */}
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-orange-700">
                                    Experience
                                </h3>
                                {formData.experience.map((exp, index) => (
                                    <Card
                                        key={index}
                                        className="mb-4 border border-orange-200 shadow-sm"
                                    >
                                        <CardContent className="space-y-3 pt-6">
                                            <Input
                                                placeholder="Company"
                                                value={exp.company}
                                                onChange={(e) =>
                                                    handleExperienceChange(
                                                        index,
                                                        "company",
                                                        e.target.value
                                                    )
                                                }
                                                className={
                                                    errors[
                                                        `experience_${index}`
                                                    ]
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            <Input
                                                placeholder="Position"
                                                value={exp.position}
                                                onChange={(e) =>
                                                    handleExperienceChange(
                                                        index,
                                                        "position",
                                                        e.target.value
                                                    )
                                                }
                                                className={
                                                    errors[
                                                        `experience_${index}`
                                                    ]
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            <Input
                                                placeholder="Location"
                                                value={exp.location}
                                                onChange={(e) =>
                                                    handleExperienceChange(
                                                        index,
                                                        "location",
                                                        e.target.value
                                                    )
                                                }
                                                className={
                                                    errors[
                                                        `experience_${index}`
                                                    ]
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    type="date"
                                                    value={exp.startDate}
                                                    onChange={(e) =>
                                                        handleExperienceChange(
                                                            index,
                                                            "startDate",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={
                                                        errors[
                                                            `experience_${index}`
                                                        ]
                                                            ? "border-red-500"
                                                            : ""
                                                    }
                                                />
                                                <Input
                                                    type="date"
                                                    value={exp.endDate}
                                                    onChange={(e) =>
                                                        handleExperienceChange(
                                                            index,
                                                            "endDate",
                                                            e.target.value
                                                        )
                                                    }
                                                    className={
                                                        errors[
                                                            `experience_${index}_endDate`
                                                        ]
                                                            ? "border-red-500"
                                                            : ""
                                                    }
                                                />
                                            </div>
                                            <textarea
                                                placeholder="Description"
                                                className={`w-full h-24 p-2 border rounded-md resize-y ${
                                                    errors[
                                                        `experience_${index}_description`
                                                    ]
                                                        ? "border-red-500"
                                                        : ""
                                                }`}
                                                value={exp.description}
                                                onChange={(e) =>
                                                    handleExperienceChange(
                                                        index,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            {errors[`experience_${index}`] && (
                                                <p className="text-red-500 text-sm">
                                                    {
                                                        errors[
                                                            `experience_${index}`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                            {errors[
                                                `experience_${index}_endDate`
                                            ] && (
                                                <p className="text-red-500 text-sm">
                                                    {
                                                        errors[
                                                            `experience_${index}_endDate`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                            {errors[
                                                `experience_${index}_description`
                                            ] && (
                                                <p className="text-red-500 text-sm">
                                                    {
                                                        errors[
                                                            `experience_${index}_description`
                                                        ]
                                                    }
                                                </p>
                                            )}
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() =>
                                                    removeExperience(index)
                                                }
                                                className="w-full"
                                                disabled={
                                                    formData.experience
                                                        .length === 1
                                                }
                                            >
                                                Remove Experience
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                                {errors.experience && (
                                    <p className="text-red-500 text-sm">
                                        {errors.experience}
                                    </p>
                                )}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addExperience}
                                    className="w-full"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Experience
                                </Button>
                            </div>

                            {/* Certifications */}
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-pink-700">
                                    Certifications
                                </h3>
                                {formData.certifications.map((cert, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-2 items-center"
                                    >
                                        <Input
                                            value={cert}
                                            onChange={(e) =>
                                                handleCertificationChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter a certification"
                                            className={
                                                errors.certifications
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() =>
                                                removeCertification(index)
                                            }
                                            disabled={
                                                formData.certifications
                                                    .length === 1
                                            }
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {errors.certifications && (
                                    <p className="text-red-500 text-sm">
                                        {errors.certifications}
                                    </p>
                                )}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addCertification}
                                    className="w-full"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Certification
                                </Button>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full mt-6 py-3 text-lg font-bold bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-xl shadow-lg hover:from-green-500 hover:to-blue-600 transition"
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create CV Profile"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
