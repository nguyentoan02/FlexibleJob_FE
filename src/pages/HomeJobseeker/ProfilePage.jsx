import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/profilepage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Toast from "@/components/Toast/Toast";

export default function ProfilePage() {
    const { profileQuery, profileMutation } = useProfile();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        imageUrl: "",
    });
    const [imageFile, setImageFile] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastType, setToastType] = useState("success");

    // NEW: Sử dụng useEffect để cập nhật form state khi dữ liệu profile được fetch thành công.
    // Điều này ngăn chặn lỗi re-render vô hạn và đảm bảo form được điền đúng dữ liệu.
    useEffect(() => {
        if (profileQuery.isSuccess && profileQuery.data) {
            setForm({
                firstName: profileQuery.data.firstName || "",
                lastName: profileQuery.data.lastName || "",
                imageUrl: profileQuery.data.imageUrl || "",
            });
        }
    }, [profileQuery.isSuccess, profileQuery.data]); // Chạy lại khi query thành công hoặc data thay đổi

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

    if (profileQuery.isLoading) return <p>Loading profile...</p>;
    if (profileQuery.isError)
        return <p>Error loading profile data: {profileQuery.error.message}</p>;

    return (
        <div className="flex items-center justify-center min-h-screen">
            {/* NEW: Chỉ hiển thị Toast khi có toastMessage */}
            {toastMessage && <Toast message={toastMessage} type={toastType} />}
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md p-6 bg-white shadow rounded space-y-4"
            >
                <h2 className="text-2xl font-bold text-center">Edit Profile</h2>
                <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                        id="firstName"
                        value={form.firstName}
                        onChange={(e) =>
                            setForm({ ...form, firstName: e.target.value })
                        }
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                        id="lastName"
                        value={form.lastName}
                        onChange={(e) =>
                            setForm({ ...form, lastName: e.target.value })
                        }
                        required
                    />
                </div>
                <div>
                    <Label htmlFor="profileImage">Profile Image</Label>
                    <Input
                        id="profileImage"
                        type="file"
                        onChange={(e) => setImageFile(e.target.files[0])}
                    />
                    {(imageFile || form.imageUrl) && (
                        <img
                            src={
                                imageFile
                                    ? URL.createObjectURL(imageFile) // Hiển thị ảnh xem trước nếu có file mới
                                    : form.imageUrl // Ngược lại, hiển thị ảnh hiện tại
                            }
                            alt="Profile"
                            className="mt-2 w-24 h-24 rounded-full object-cover"
                        />
                    )}
                </div>
                <Button
                    type="submit"
                    className="w-full"
                    disabled={profileMutation.isLoading}
                >
                    {profileMutation.isLoading ? "Saving..." : "Save Changes"}
                </Button>
            </form>
        </div>
    );
}
