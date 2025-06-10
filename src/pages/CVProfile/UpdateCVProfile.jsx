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
        certifications: "",
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
                ...formData,
                skills: skills || [""],
                education: education || [],
                experience: experience || [],
                description: description || "",
                certifications: certifications || "",
                number: number || "",
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

    // Main form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            if (formData.cvPdf) {
                data.append("cvPdf", formData.cvPdf);
            }

            // Fix: Handle skills properly
            const validSkills = formData.skills.filter(
                (skill) => skill.trim() !== ""
            );
            validSkills.forEach((skill, index) => {
                data.append(`skills[${index}]`, skill);
            });

            // Rest of the form data
            data.append("description", formData.description);
            data.append("certifications", formData.certifications);
            data.append("number", formData.number);

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
                navigate("/cvprofile");
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
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Basic Information Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    Basic Information
                                </h3>

                                <div>
                                    <Label htmlFor="description">
                                        Professional Summary
                                    </Label>
                                    <textarea
                                        id="description"
                                        className="w-full h-32 p-2 border rounded-md"
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="number">
                                        Contact Number
                                    </Label>
                                    <Input
                                        id="number"
                                        type="tel"
                                        value={formData.number}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                number: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            {/* Skills Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    Skills
                                </h3>
                                {formData.skills.map((skill, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={skill}
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
                            </div>

                            {/* Education Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    Education
                                </h3>
                                {formData.education.map((edu, index) => (
                                    <Card key={index || edu._id}>
                                        <CardContent className="space-y-4 pt-6">
                                            <Input
                                                placeholder="School"
                                                value={edu.school}
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
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    type="date"
                                                    value={
                                                        edu.startDate?.split(
                                                            "T"
                                                        )[0]
                                                    }
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

                            {/* Experience Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    Experience
                                </h3>
                                {formData.experience.map((exp, index) => (
                                    <Card key={index || exp._id}>
                                        <CardContent className="space-y-4 pt-6">
                                            <Input
                                                placeholder="Company"
                                                value={exp.company}
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
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input
                                                    type="date"
                                                    value={
                                                        exp.startDate?.split(
                                                            "T"
                                                        )[0]
                                                    }
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
                                                className="w-full h-32 p-2 border rounded-md"
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

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full"
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
