import { useEffect, useState } from "react";
import { useMyCompany } from "../../../hooks/myCompany";
import { useAuth } from "../../../hooks/useAuth.js";
import Toast from "../../../components/Toast/Toast";
import { useMutation } from "@tanstack/react-query";

const CompanyProfile = () => {
    const { token } = useAuth();
    const [toastMessage, setToastMessage] = useState(null);
    const [toastType, setToastType] = useState("success");
    const [removedImages, setRemovedImages] = useState([]);
    const { MyCompanyProfile, updateCompanyProfile } = useMyCompany();
    const [companyData, setCompanyData] = useState({
        companyName: "",
        industry: "",
        phone: "",
        email: "",
        companySize: "",
        location: "",
        address: "",
        website: "",
        linkedinUrl: "",
        facebookUrl: "",
        aboutUs: "",
        imageUrl: "",
        albumImage: [],
        identityImage: [],
        coverImage: "",
        benefit: [],
    });

    const [userData, setUserData] = useState({
        email: "",
        googleId: "",
        password: "",
        role: "EMPLOYER",
        website: "",
        isBanned: false,
    });

    useEffect(() => {
        if (MyCompanyProfile.data?.payload) {
            setCompanyData({ ...MyCompanyProfile.data.payload });
            setUserData({ ...MyCompanyProfile.data.payload.user });
        }
    }, [MyCompanyProfile.isSuccess, MyCompanyProfile.data]);

    const updateMutation = useMutation({
        mutationFn: (data) => {
            // Logic xử lý FormData...
            return updateCompanyProfile(formData, token);
        },
        onSuccess: () => {
            setToastMessage("Success");
            setToastType("success");
            setRemovedImages([]);
        },
        onError: () => {
            setToastMessage("Error");
            setToastType("error");
        },
    });

    const handleSaveChanges = () => {
        updateCompanyProfile.mutate(
            {
                ...companyData,
                removeImages: removedImages,
            },
            {
                onSuccess: () => {
                    setToastMessage("Profile updated successfully!");
                    setToastType("success");
                    setRemovedImages([]);
                },
                onError: (error) => {
                    setToastMessage(
                        error.message || "Failed to update profile"
                    );
                    setToastType("error");
                },
            }
        );
    };

    // Update image handling functions
    const handleImageUpload = async (e, field) => {
        const files = Array.from(e.target.files);
        const MAX_IMAGES = 10;

        if (field === "albumImage") {
            if (companyData.albumImage.length + files.length > MAX_IMAGES) {
                setToastMessage(
                    `You can only upload up to ${MAX_IMAGES} images`
                );
                setToastType("error");
                return;
            }

            setCompanyData((prev) => ({
                ...prev,
                newAlbumImages: [...(prev.newAlbumImages || []), ...files],
                albumImage: [
                    ...prev.albumImage,
                    ...files.map((file) => URL.createObjectURL(file)),
                ],
            }));
        } else {
            const file = files[0];
            setCompanyData((prev) => ({
                ...prev,
                [`new${field.charAt(0).toUpperCase() + field.slice(1)}`]: file,
                [field]: URL.createObjectURL(file),
            }));
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCompanyData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const removeImage = (indexToRemove) => {
        const removedImage = companyData.albumImage[indexToRemove];
        if (!removedImage.startsWith("blob:")) {
            // Only track removal of server images
            setRemovedImages((prev) => [...prev, removedImage]);
        }

        setCompanyData((prev) => ({
            ...prev,
            albumImage: prev.albumImage.filter(
                (_, index) => index !== indexToRemove
            ),
        }));
    };

    const ProfileSkeleton = () => (
        <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-4">
                    <div className="h-32 w-32 bg-gray-200 rounded-lg mx-auto" />
                    <div className="h-10 bg-gray-200 rounded w-full" />
                    <div className="h-10 bg-gray-200 rounded w-full" />
                </div>
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/4" />
                            <div className="h-10 bg-gray-200 rounded w-full" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    if (MyCompanyProfile.isLoading) return <ProfileSkeleton />;
    if (MyCompanyProfile.isError)
        return <div>{MyCompanyProfile.error.message}</div>;

    return (
        <div className="px-4 py-6 md:px-10 md:py-10 bg-gray-100/20">
            {toastMessage && <Toast message={toastMessage} type={toastType} />}
            <div className="mb-4 text-sm text-gray-600">
                <span className="text-gray-400">Home</span> /{" "}
                <span className="text-gray-400">Dashboard</span> /{" "}
                <span className="text-indigo-600 font-semibold">
                    My Profile
                </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                My Profile
            </h1>

            <h2 className="text-lg font-semibold text-indigo-600 mb-4 flex items-center gap-2">
                <i className="fa fa-user"></i> My Account
            </h2>

            <div className="bg-white shadow rounded-lg p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="flex flex-col items-center gap-2">
                        <img
                            src={companyData.imageUrl}
                            alt="Company Logo"
                            className="rounded-md w-32 h-32 object-cover"
                        />
                        <input
                            type="file"
                            onChange={(e) => handleImageUpload(e, "imageUrl")}
                            className="text-sm"
                        />
                        <div className="w-full">
                            <label className="block font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={userData.email}
                                readOnly={!!userData.googleId}
                                // onChange={handleChange}
                                className="w-full border-gray-300 mt-1 p-2 border rounded-md bg-gray-100"
                            />
                        </div>

                        <div className="w-full">
                            <label className="block font-medium">Role</label>
                            <select
                                name="role"
                                value={userData.role}
                                // onChange={handleChange}
                                className="w-full mt-1 p-2 border rounded-md"
                                disabled
                            >
                                <option value="EMPLOYER">EMPLOYER</option>
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>

                        <div className="w-full">
                            <label className="block font-medium">Website</label>
                            <input
                                type="text"
                                name="website"
                                value={userData.website}
                                // onChange={handleChange}
                                placeholder="https://yourwebsite.com"
                                className="w-full mt-1 p-2 border rounded-md"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            {/* <input
                                type="checkbox"
                                name="isBanned"
                                checked={userData.isBanned}
                                // onChange={handleChange}
                            />
                            <label className="font-medium">Is Banned</label> */}
                            {userData.isBanned ? (
                                <div className="px-2 py-3 broder-2 border-red-300 bg-red-400 rounded-2xl text-white">
                                    Banned account
                                </div>
                            ) : (
                                <div className="px-2 py-3 broder-2 border-green-300 bg-green-400 rounded-2xl text-white">
                                    Accout healthy
                                </div>
                            )}
                        </div>

                        <div className="text-sm text-gray-500">
                            <p>
                                Created At:{" "}
                                {new Date(userData.createdAt).toLocaleString()}
                            </p>
                            <p>
                                Updated At:{" "}
                                {new Date(userData.updatedAt).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Company Name
                            </label>
                            <input
                                type="text"
                                name="companyName"
                                value={companyData.companyName}
                                onChange={handleInputChange}
                                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Industry
                            </label>
                            <input
                                type="text"
                                name="industry"
                                value={companyData.industry}
                                onChange={handleInputChange}
                                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Phone
                            </label>
                            <input
                                type="text"
                                name="phone"
                                value={companyData.phone}
                                onChange={handleInputChange}
                                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                value={companyData.email}
                                disabled
                                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Company Size
                            </label>
                            <select
                                value={companyData.companySize}
                                onChange={(e) =>
                                    setCompanyData({
                                        ...companyData,
                                        companySize: e.target.value,
                                    })
                                }
                                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            >
                                <option value="">Choose Size</option>
                                <option value="1-9">1-9</option>
                                <option value="10-50">10-50</option>
                                <option value="51-100">51-100</option>
                                <option value="100+">100+</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={companyData.location}
                                onChange={handleInputChange}
                                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            />
                        </div>

                        {/* Add more fields as needed */}

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                About Us
                            </label>
                            <textarea
                                rows="10"
                                name="aboutUs"
                                value={companyData.aboutUs}
                                onChange={handleInputChange}
                                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                            />
                        </div>

                        {/* Album Images */}
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Album Images ({companyData.albumImage.length}
                                /10)
                            </label>
                            <div className="flex gap-2 mt-2 overflow-x-auto scroll-smooth w-full">
                                {companyData.albumImage.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={img}
                                            alt={`Album ${index + 1}`}
                                            className="w-64 h-64 object-cover rounded"
                                        />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) =>
                                    handleImageUpload(e, "albumImage")
                                }
                                className="mt-2 text-sm"
                                disabled={companyData.albumImage.length >= 10}
                            />
                            {companyData.albumImage.length >= 10 && (
                                <p className="text-red-500 text-sm mt-1">
                                    Maximum number of images reached (10)
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition text-sm disabled:opacity-50"
                        onClick={handleSaveChanges}
                        disabled={updateMutation.isPending}
                    >
                        {updateMutation.isPending
                            ? "Saving..."
                            : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfile;
