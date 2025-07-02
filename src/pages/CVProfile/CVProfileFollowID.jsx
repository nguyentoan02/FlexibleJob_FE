import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Phone } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { changeApplicationStatus } from "../../api/job";
import { useAuth } from "../../hooks/useAuth";

export default function CVProfileFollowID({ profile, onStatusChange }) {
    const [error] = useState(null);
    const { token } = useAuth();


    const applicationMutation = useMutation({
        mutationFn: (action) =>
            changeApplicationStatus(profile._id, token, action),
        onSuccess: () => {
            if (onStatusChange) onStatusChange();
        },
    });

    const handleAccept = () => {
        applicationMutation.mutate("HIRED");
    };

    const handleReject = () => {
        applicationMutation.mutate("REJECTED");
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-2">
                        Error Loading CV Profile
                    </h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-4">
                            <img
                                src={profile.user?.imageUrl || profile.avatar}
                                alt={`${profile.user?.firstName} ${profile.user?.lastName}`}
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {`${profile.user?.firstName} ${profile.user?.lastName}`}
                                </h1>
                                <p className="text-gray-600">
                                    {profile.cvSnapshot.description}
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center text-gray-600">
                                    <MapPin className="w-5 h-5 mr-2" />
                                    {profile.cvSnapshot.experience?.[0]
                                        ?.location || "Not specified"}
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Mail className="w-5 h-5 mr-2" />
                                    {profile.cvSnapshot.user?.email}
                                </div>
                                <div className="flex items-center text-gray-600">
                                    <Phone className="w-5 h-5 mr-2" />
                                    {profile.cvSnapshot.number}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">
                                    Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile.cvSnapshot.skills?.map(
                                        (skill, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                                            >
                                                {skill}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">
                                    Education
                                </h3>
                                {profile.cvSnapshot.education?.map((edu) => (
                                    <div
                                        key={edu._id}
                                        className="border-b pb-4 mb-4"
                                    >
                                        <p className="font-medium">
                                            {edu.school}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {edu.degree} (
                                            {edu.startDate.split("T")[0]} -{" "}
                                            {edu.endDate.split("T")[0]})
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">
                                    Experience
                                </h3>
                                {profile.cvSnapshot.experience?.map((exp) => (
                                    <div
                                        key={exp._id}
                                        className="border-b pb-4 mb-4"
                                    >
                                        <p className="font-medium">
                                            {exp.company}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {exp.position} (
                                            {exp.startDate.split("T")[0]} -{" "}
                                            {exp.endDate.split("T")[0]})
                                        </p>
                                        <p className="text-sm">
                                            {exp.description}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">
                                    Certifications
                                </h3>
                                <p>
                                    {profile.cvSnapshot.certifications ||
                                        "No certifications listed."}
                                </p>
                            </div>
                            <div className="flex gap-5">
                                <Button
                                    className="bg-green-500 hover:bg-green-600 text-white"
                                    onClick={handleAccept}
                                    disabled={applicationMutation.isPending}
                                >
                                    Accept
                                </Button>
                                <Button
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                    onClick={handleReject}
                                    disabled={applicationMutation.isPending}
                                >
                                    Reject
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
