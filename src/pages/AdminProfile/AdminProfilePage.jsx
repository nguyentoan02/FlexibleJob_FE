import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/profilepage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Toast from "@/components/Toast/Toast";
import { AdminHeader } from '@/components/Header/AdminHeader'
import { AdminSidebar } from '@/components/AdminSidebar'

export default function AdminProfilePage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { profileQuery, profileMutation } = useProfile();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        imageUrl: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastType, setToastType] = useState("success");

    useEffect(() => {
        if (profileQuery.isSuccess && profileQuery.data) {
            setForm({
                firstName: profileQuery.data.firstName || "",
                lastName: profileQuery.data.lastName || "",
                email: profileQuery.data.email || "",
                phoneNumber: profileQuery.data.phoneNumber || "",
                imageUrl: profileQuery.data.imageUrl || "",
            });
        }
    }, [profileQuery.isSuccess, profileQuery.data]);

    useEffect(() => {
        if (profileMutation.isSuccess) {
            setToastMessage("Profile updated successfully!");
            setToastType("success");
            setForm({
                firstName: profileMutation.data.firstName,
                lastName: profileMutation.data.lastName,
                email: profileMutation.data.email,
                phoneNumber: profileMutation.data.phoneNumber,
                imageUrl: profileMutation.data.imageUrl,
            });
            setImageFile(null);
        } else if (profileMutation.isError) {
            const errorMessage =
                profileMutation.error?.response?.data?.message ||
                "Failed to update profile.";
            setToastMessage(errorMessage);
            setToastType("error");
        }
    }, [
        profileMutation.isSuccess,
        profileMutation.isError,
        profileMutation.data,
        profileMutation.error,
    ]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setToastMessage(null);
        setToastType("success");

        const formData = new FormData();
        formData.append("firstName", form.firstName);
        formData.append("lastName", form.lastName);
        formData.append("email", form.email);
        formData.append("phoneNumber", form.phoneNumber);
        if (imageFile) {
            formData.append("profileImage", imageFile);
        }

        profileMutation.mutate(formData);
    };

    if (profileQuery.isLoading) return <p>Loading profile...</p>;
    if (profileQuery.isError)
        return <p>Error loading profile data: {profileQuery.error.message}</p>;

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <AdminHeader onMenuClick={toggleMobileMenu} />
            
            <div className="flex pt-16">
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                <div
                    className={`${
                        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    } fixed top-16 bottom-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-0`}
                >
                    <AdminSidebar />
                </div>

                <main className="flex-1">
                    {toastMessage && <Toast message={toastMessage} type={toastType} />}
                    
                    <div className="bg-white min-h-[calc(100vh-4rem)] shadow-lg">
                        <div className="bg-green-500 px-8 py-6">
                            <h2 className="text-4xl font-bold text-white">Admin Profile</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                                {/* Profile Image Section */}
                                <div className="lg:col-span-1 flex flex-col items-center space-y-6">
                                    <div className="relative">
                                        <div className="w-64 h-64 rounded-full border-8 border-green-500 overflow-hidden">
                                            <img
                                                src={imageFile ? URL.createObjectURL(imageFile) : (form.imageUrl || 'https://via.placeholder.com/256')}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <label 
                                            htmlFor="profileImage" 
                                            className="absolute bottom-4 right-4 bg-green-500 rounded-full p-4 cursor-pointer hover:bg-green-600 transition-colors"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </label>
                                        <Input
                                            id="profileImage"
                                            type="file"
                                            onChange={(e) => setImageFile(e.target.files[0])}
                                            className="hidden"
                                            accept="image/*"
                                        />
                                    </div>
                                    <p className="text-lg text-gray-500">Click the camera icon to change profile picture</p>
                                </div>

                                {/* Form Fields Section */}
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* Personal Information */}
                                        <div className="space-y-8">
                                            <div>
                                                <Label htmlFor="firstName" className="text-xl font-semibold block mb-3">First Name</Label>
                                                <Input
                                                    id="firstName"
                                                    value={form.firstName}
                                                    onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                                    required
                                                    className="text-lg py-3"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="lastName" className="text-xl font-semibold block mb-3">Last Name</Label>
                                                <Input
                                                    id="lastName"
                                                    value={form.lastName}
                                                    onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                                    required
                                                    className="text-lg py-3"
                                                />
                                            </div>
                                        </div>

                                        {/* Contact Information */}
                                        <div className="space-y-8">
                                            <div>
                                                <Label htmlFor="email" className="text-xl font-semibold block mb-3">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={form.email}
                                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                    required
                                                    className="text-lg py-3"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="phoneNumber" className="text-xl font-semibold block mb-3">Phone Number</Label>
                                                <Input
                                                    id="phoneNumber"
                                                    type="tel"
                                                    value={form.phoneNumber}
                                                    onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                                                    className="text-lg py-3"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-8">
                                        <Button
                                            type="submit"
                                            className="bg-green-500 hover:bg-green-600 text-white px-12 py-6 text-xl rounded-lg"
                                            disabled={profileMutation.isLoading}
                                        >
                                            {profileMutation.isLoading ? "Saving..." : "Save Changes"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
} 