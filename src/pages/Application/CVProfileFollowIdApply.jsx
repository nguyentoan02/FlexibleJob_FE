import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { MapPin, Mail, Phone } from "lucide-react";

export default function CVProfileFollowIdApply({ profile }) {
    // Lấy thông tin user từ profile.user
    const user = profile.user || {};
    // Lấy thông tin CV snapshot từ profile
    const skills = Array.isArray(profile.skills) ? profile.skills : [];
    const education = Array.isArray(profile.education) ? profile.education : [];
    const experience = Array.isArray(profile.experience)
        ? profile.experience
        : [];

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-4">
                            <img
                                src={
                                    user.imageUrl ||
                                    profile.avatar ||
                                    "/image.png"
                                }
                                alt={`${user.firstName || ""} ${
                                    user.lastName || ""
                                }`}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                onError={(e) => {
                                    e.target.src = "/image.png";
                                }}
                            />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {user.firstName || user.lastName
                                        ? `${user.firstName || ""} ${
                                              user.lastName || ""
                                          }`
                                        : "No Name"}
                                </h1>
                                <p className="text-gray-600">
                                    {profile.description || ""}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center text-gray-600">
                                    <MapPin className="w-5 h-5 mr-2" />
                                    {experience[0]?.location || "Not specified"}
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Mail className="w-5 h-5 mr-2" />
                                    {user.email || "No email"}
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Phone className="w-5 h-5 mr-2" />
                                    {profile.number || "No phone"}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">
                                    Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {skills.length > 0 ? (
                                        skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-400">
                                            No skills listed.
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">
                                    Education
                                </h3>
                                {education.length > 0 ? (
                                    education.map((edu, idx) => (
                                        <div
                                            key={edu?._id || edu?.school || idx}
                                            className="border-b pb-4 mb-4"
                                        >
                                            <p className="font-medium">
                                                {edu?.school || "No school"}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {edu?.degree || "No degree"} (
                                                {edu?.startDate
                                                    ? edu.startDate.split(
                                                          "T"
                                                      )[0]
                                                    : "?"}{" "}
                                                -{" "}
                                                {edu?.endDate
                                                    ? edu.endDate.split("T")[0]
                                                    : "?"}
                                                )
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-gray-400">
                                        No education listed.
                                    </span>
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">
                                    Experience
                                </h3>
                                {experience.length > 0 ? (
                                    experience.map((exp, idx) => (
                                        <div
                                            key={
                                                exp?._id || exp?.company || idx
                                            }
                                            className="border-b pb-4 mb-4"
                                        >
                                            <p className="font-medium">
                                                {exp?.company || "No company"}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {exp?.position || "No position"}{" "}
                                                (
                                                {exp?.startDate
                                                    ? exp.startDate.split(
                                                          "T"
                                                      )[0]
                                                    : "?"}{" "}
                                                -{" "}
                                                {exp?.endDate
                                                    ? exp.endDate.split("T")[0]
                                                    : "?"}
                                                )
                                            </p>
                                            <p className="text-sm">
                                                {exp?.description || ""}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <span className="text-gray-400">
                                        No experience listed.
                                    </span>
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">
                                    Certifications
                                </h3>
                                <p>
                                    {profile.certifications ||
                                        "No certifications listed."}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
