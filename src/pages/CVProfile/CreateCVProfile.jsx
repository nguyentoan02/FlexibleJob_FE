import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { Plus, Minus, Upload } from "lucide-react";
import Toast from "@/components/Toast/Toast";

export default function CreateCVProfile() {
    const navigate = useNavigate();
    const { token } = useAuth();
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
        cvPdf: null, // For file upload
    });

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

    const handleFileChange = (e) => {
        setFormData({ ...formData, cvPdf: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            if (formData.cvPdf) {
                data.append("cvPdf", formData.cvPdf);
            }

            // Fix: Append each skill individually to FormData
            const validSkills = formData.skills.filter(
                (skill) => skill.trim() !== ""
            );
            validSkills.forEach((skill, index) => {
                data.append(`skills[${index}]`, skill);
            });

            // Add education array directly (do not stringify the whole array)
            formData.education.forEach((edu, index) => {
                Object.keys(edu).forEach((key) => {
                    data.append(`education[${index}][${key}]`, edu[key]);
                });
            });

            // Add experience array directly (do not stringify the whole array)
            formData.experience.forEach((exp, index) => {
                Object.keys(exp).forEach((key) => {
                    data.append(`experience[${index}][${key}]`, exp[key]);
                });
            });

            // Add other simple fields
            data.append("description", formData.description);
            data.append("certifications", formData.certifications);
            data.append("number", formData.number);

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/cv-profiles`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setToast({
                message: "CV Profile created successfully!",
                type: "success",
            });

            setTimeout(() => {
                navigate("/cvprofile");
            }, 2000);
        } catch (error) {
            console.error("API Error:", error.response?.data);
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
        <div className="min-h-screen bg-gray-50 py-8">
            {toast.message && (
                <Toast message={toast.message} type={toast.type} />
            )}

            <div className="container mx-auto max-w-4xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">
                            Create Your CV Profile
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Basic Information */}
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
                                            onChange={(e) =>
                                                handleSkillChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Enter a skill"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeSkill(index)}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
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

                            {/* Education Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    Education
                                </h3>
                                {formData.education.map((edu, index) => (
                                    <Card key={index}>
                                        <CardContent className="space-y-4 pt-6">
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
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() =>
                                                    removeEducation(index)
                                                }
                                                className="w-full"
                                            >
                                                Remove Education
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
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

                            {/* Experience Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    Experience
                                </h3>
                                {formData.experience.map((exp, index) => (
                                    <Card key={index}>
                                        <CardContent className="space-y-4 pt-6">
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
                                                />
                                            </div>
                                            <textarea
                                                placeholder="Description"
                                                className="w-full h-32 p-2 border rounded-md"
                                                value={exp.description}
                                                onChange={(e) =>
                                                    handleExperienceChange(
                                                        index,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() =>
                                                    removeExperience(index)
                                                }
                                                className="w-full"
                                            >
                                                Remove Experience
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
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

                            {/* PDF Upload */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">
                                    Upload CV PDF
                                </h3>
                                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                                    <input
                                        type="file"
                                        id="cvPdf"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <Label
                                        htmlFor="cvPdf"
                                        className="cursor-pointer flex flex-col items-center"
                                    >
                                        <Upload className="h-12 w-12 text-gray-400" />
                                        <span className="mt-2 text-sm text-gray-500">
                                            Click to upload PDF
                                        </span>
                                    </Label>
                                    {formData.cvPdf && (
                                        <p className="mt-2 text-sm text-gray-500">
                                            Selected: {formData.cvPdf.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full"
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
