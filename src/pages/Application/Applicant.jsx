import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export function ApplyJobModal({
    isOpen,
    onClose,
    onConfirm,
    cvData,
    isLoading,
}) {
    const navigate = useNavigate();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-2xl shadow-2xl border border-blue-100">
                <DialogHeader>
                    <DialogTitle className="text-blue-700 font-bold text-2xl drop-shadow">
                        Confirm Your Application
                    </DialogTitle>
                    <DialogDescription className="text-base text-gray-600">
                        Your CV will be used to apply for this job.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-4 my-6">
                    <Card className="w-full bg-white/80 rounded-xl shadow border-0">
                        <CardHeader>
                            <CardTitle className="text-lg text-green-700 font-semibold">
                                Your CV Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-4">
                                <img
                                    src={
                                        cvData?.user?.imageUrl ||
                                        cvData?.avatar ||
                                        "/default-avatar.png"
                                    }
                                    alt="CV Avatar"
                                    className="w-16 h-16 rounded-full object-cover border-4 border-blue-200 shadow"
                                />
                                <div>
                                    <h3 className="font-semibold text-blue-900 text-lg">
                                        {cvData?.user?.firstName}{" "}
                                        {cvData?.user?.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {cvData?.user?.email}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Button
                        variant="secondary"
                        className="whitespace-nowrap bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold shadow hover:from-green-500 hover:to-blue-600"
                        onClick={() => navigate("/user/dashboard/cvprofile")}
                    >
                        View CV
                    </Button>
                </div>
                <DialogFooter className="flex justify-end space-x-2">
                    <Button
                        variant="outline"
                        className="border-blue-400 text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="bg-gradient-to-r from-blue-500 to-green-400 text-white font-bold shadow hover:from-blue-600 hover:to-green-500"
                        onClick={() => onConfirm()}
                        disabled={isLoading}
                    >
                        {isLoading ? "Submitting..." : "Confirm"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
