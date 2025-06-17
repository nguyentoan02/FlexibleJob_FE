import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
    Briefcase,
    GraduationCap,
    Mail,
    MapPin,
    Phone,
    CheckCircle,
} from "lucide-react";

export function ApplyJobModal({
    isOpen,
    onClose,
    onConfirm,
    cvData,
    isLoading,
}) {
    const [note, setNote] = useState("");

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Review Your Application</DialogTitle>
                    <DialogDescription>
                        Please review your CV before submitting your application
                    </DialogDescription>
                </DialogHeader>

                {/* CV Preview */}
                <div className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <img
                                    src={cvData?.user?.imageUrl}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <h3 className="text-xl">
                                        {cvData?.user?.firstName}{" "}
                                        {cvData?.user?.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {cvData?.description}
                                    </p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Contact Info */}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <Mail className="w-4 h-4 mr-2" />
                                    {cvData?.user?.email}
                                </div>
                                <div className="flex items-center">
                                    <Phone className="w-4 h-4 mr-2" />
                                    {cvData?.number}
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {cvData?.experience?.[0]?.location}
                                </div>
                            </div>

                            {/* Skills */}
                            <div>
                                <h4 className="font-semibold mb-2">Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {cvData?.skills?.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Experience Preview */}
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center">
                                    <Briefcase className="w-4 h-4 mr-2" />
                                    Latest Experience
                                </h4>
                                {cvData?.experience?.[0] && (
                                    <div className="text-sm">
                                        <p className="font-medium">
                                            {cvData.experience[0].position}
                                        </p>
                                        <p className="text-gray-600">
                                            {cvData.experience[0].company}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Education Preview */}
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center">
                                    <GraduationCap className="w-4 h-4 mr-2" />
                                    Latest Education
                                </h4>
                                {cvData?.education?.[0] && (
                                    <div className="text-sm">
                                        <p className="font-medium">
                                            {cvData.education[0].degree}
                                        </p>
                                        <p className="text-gray-600">
                                            {cvData.education[0].school}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Additional Note */}
                            <div className="space-y-2">
                                <label htmlFor="note" className="font-semibold">
                                    Additional Note (Optional)
                                </label>
                                <Textarea
                                    id="note"
                                    placeholder="Add a note to your application..."
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="min-h-[100px]"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => onConfirm(note)}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isLoading ? "Submitting..." : "Submit Application"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
