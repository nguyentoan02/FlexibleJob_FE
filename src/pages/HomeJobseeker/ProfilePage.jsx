import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/profilepage";
import { useAuth } from "@/hooks/useAuth"; // Thêm import này
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Toast from "@/components/Toast/Toast";
import { Camera, User } from "lucide-react"; // Thêm icon nếu có sẵn

export default function ProfilePage() {
    const { profileQuery, profileMutation } = useProfile();
    const { user } = useAuth(); // Lấy thông tin user từ auth context
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        imageUrl: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastType, setToastType] = useState("success");

    // Sửa lại useEffect để kết hợp dữ liệu từ API và token
    useEffect(() => {
        const profileData = profileQuery.data || {};
        const userData = user || {};

        setForm({
            firstName: profileData.firstName || userData.firstName || "",
            lastName: profileData.lastName || userData.lastName || "",
            imageUrl: profileData.imageUrl || "",
        });
    }, [profileQuery.data, user]);

    // NEW: useEffect để lắng nghe trạng thái của profileMutation và hiển thị Toast
    useEffect(() => {
        if (profileMutation.isSuccess) {
            setToastMessage("Profile updated successfully!");
            setToastType("success");
            // Cập nhật lại form state với dữ liệu mới từ mutation
            // React Query tự động cập nhật cache sau mutation thành công,
            // nhưng việc cập nhật state cục bộ này đảm bảo UI phản ánh ngay lập tức.
            setForm({
                firstName: profileMutation.data.firstName,
                lastName: profileMutation.data.lastName,
                imageUrl: profileMutation.data.imageUrl,
            });
            setImageFile(null); // Xóa file đã chọn sau khi upload thành công
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

        // NEW: Luôn reset toast trước khi gửi mutation
        setToastMessage(null);
        setToastType("success"); // Đặt mặc định là success
        // Không cần setTimeout 0 nữa vì React Query quản lý trạng thái pending/success/error.
        // Toast sẽ được render lại dựa trên useEffect lắng nghe profileMutation.

        const formData = new FormData();
        formData.append("firstName", form.firstName);
        formData.append("lastName", form.lastName);
        if (imageFile) {
            formData.append("profileImage", imageFile);
        }

        // Kích hoạt mutation để cập nhật profile
        profileMutation.mutate(formData);
    };

    if (profileQuery.isLoading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );

    if (profileQuery.isError)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <div className="text-red-500 text-xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-red-600 mb-2">
                        Error
                    </h2>
                    <p className="text-gray-600">
                        {profileQuery.error.message}
                    </p>
                </div>
            </div>
        );

    return (
        <div className="min-h-screen py-12 bg-gray-50 px-4">
            {/* Toast component */}
            {toastMessage && (
                <div className="fixed top-4 right-4 z-50">
                    <Toast message={toastMessage} type={toastType} />
                </div>
            )}

            <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-6 px-8 text-white">
                    <h2 className="text-2xl font-bold">Edit Profile</h2>
                    <p className="text-blue-100 text-sm">
                        Update your personal information
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Profile Image Section */}
                    <div className="flex flex-col items-center mb-2">
                        <div className="relative mb-4">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
                                {imageFile || form.imageUrl ? (
                                    <img
                                        src={
                                            imageFile
                                                ? URL.createObjectURL(imageFile)
                                                : form.imageUrl
                                        }
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                        <User size={48} />
                                    </div>
                                )}
                            </div>

                            <label
                                htmlFor="profileImage"
                                className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md transition-colors"
                            >
                                <Camera size={16} />
                            </label>

                            <Input
                                id="profileImage"
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                    setImageFile(e.target.files[0])
                                }
                                accept="image/*"
                            />
                        </div>
                        <p className="text-sm text-gray-500">
                            Click the icon to change your profile picture
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div>
                            <Label
                                htmlFor="firstName"
                                className="text-gray-700 font-medium block mb-1"
                            >
                                First Name
                            </Label>
                            <Input
                                id="firstName"
                                value={form.firstName}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        firstName: e.target.value,
                                    })
                                }
                                required
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                placeholder="Enter your first name"
                            />
                        </div>

                        <div>
                            <Label
                                htmlFor="lastName"
                                className="text-gray-700 font-medium block mb-1"
                            >
                                Last Name
                            </Label>
                            <Input
                                id="lastName"
                                value={form.lastName}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        lastName: e.target.value,
                                    })
                                }
                                required
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                                placeholder="Enter your last name"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        disabled={profileMutation.isLoading}
                    >
                        {profileMutation.isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                                <span>Saving...</span>
                            </div>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
