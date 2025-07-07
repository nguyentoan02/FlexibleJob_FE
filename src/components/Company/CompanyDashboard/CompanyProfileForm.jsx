import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMyCompany } from "../../../hooks/myCompany";
import Toast from "../../Toast/Toast";

const CreateCompany = () => {
    const [formData, setFormData] = useState({
        companyName: "",
        industry: "",
        aboutUs: "",
        benefit: "",
        address: "",
        location: "",
        companySize: "1-9",
        website: "",
        email: "",
        phone: "",
        linkedinUrl: "",
        facebookUrl: "",
    });

    const [imageUrl, setImageUrl] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [albumImage, setAlbumImage] = useState([]);
    const [identityImage, setIdentityImage] = useState([]);
    const [error, setError] = useState("");
    const [toast, setToast] = useState({ message: "", type: "" });
    const [removedImages, setRemovedImages] = useState({
        albumImage: [],
        identityImage: [],
    });
    const { MyCompanyProfile, updateCompanyProfile } = useMyCompany();

    useEffect(() => {
        if (MyCompanyProfile.data) {
            setFormData({
                companyName: MyCompanyProfile.data.payload.companyName || "",
                industry: MyCompanyProfile.data.payload.industry || "",
                aboutUs: MyCompanyProfile.data.payload.aboutUs || "",
                benefit: MyCompanyProfile.data.payload.benefit || "",
                address: MyCompanyProfile.data.payload.address || "",
                location: MyCompanyProfile.data.payload.location || "",
                companySize: MyCompanyProfile.data.payload.companySize || "1-9",
                website: MyCompanyProfile.data.payload.website || "",
                email: MyCompanyProfile.data.payload.email || "",
                phone: MyCompanyProfile.data.payload.phone || "",
                linkedinUrl: MyCompanyProfile.data.payload.linkedinUrl || "",
                facebookUrl: MyCompanyProfile.data.payload.facebookUrl || "",
            });
            // setImageUrl(MyCompanyProfile.data.payload.imageUrl);
            // setCoverImage(MyCompanyProfile.data.payload.coverImage);
            // setAlbumImage(MyCompanyProfile.data.payload.albumImage || []);
            // setIdentityImage(MyCompanyProfile.data.payload.identityImage || []);
        }
    }, [MyCompanyProfile.data]);

    if (MyCompanyProfile.isPending)
        return (
            <div className="flex justify-center items-center min-h-screen">
                Loading...
            </div>
        );
    if (MyCompanyProfile.isError)
        return (
            <div className="text-red-500">Error loading company profile!</div>
        );

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");
        setToast({ message: "", type: "" });

        // if (!identityImage || identityImage.length === 0) {
        //     setError("Identity images are required.");
        //     return;
        // }

        const payload = {
            ...formData,
            newProfileImage: imageUrl instanceof File ? imageUrl : undefined,
            newCoverImage: coverImage instanceof File ? coverImage : undefined,
            newAlbumImages: albumImage.filter((f) => f instanceof File),
            newIdentityImages: identityImage.filter((f) => f instanceof File),
            removeImages: [
                ...(removedImages.albumImage || []),
                ...(removedImages.identityImage || []),
            ],
        };

        updateCompanyProfile.mutate(payload, {
            onSuccess: () => {
                setToast({
                    message: "Company profile updated successfully!",
                    type: "success",
                });
                setRemovedImages({ albumImage: [], identityImage: [] });
            },
            onError: (err) => {
                setError("Error updating company profile!");
                setToast({
                    message: "Error updating company profile!",
                    type: "error",
                });
                console.error(err);
            },
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-8 bg-white rounded-2xl shadow-lg max-w-3xl mx-auto mt-10 border border-gray-100"
        >
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                Company Profile
            </h2>

            {error && (
                <div className="mb-4 text-red-600 font-semibold">{error}</div>
            )}
            {toast.message && (
                <Toast message={toast.message} type={toast.type} />
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                        placeholder="Enter company name"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Industry
                    </label>
                    <input
                        type="text"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter industry"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                        placeholder="Enter email"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Phone
                    </label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter phone number"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Company Size
                    </label>
                    <select
                        name="companySize"
                        value={formData.companySize}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        {[
                            "1-9",
                            "10-49",
                            "50-199",
                            "200-499",
                            "500-999",
                            "1000+",
                        ].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Location
                    </label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter location"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-1">
                        About Company
                    </label>
                    <textarea
                        name="aboutUs"
                        value={formData.aboutUs}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows="4"
                        placeholder="Describe your company"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-1">
                        Benefits (comma separated)
                    </label>
                    <input
                        type="text"
                        name="benefit"
                        value={formData.benefit}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="e.g. Insurance, Travel, Holiday bonus"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Website
                    </label>
                    <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter website"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        LinkedIn URL
                    </label>
                    <input
                        type="text"
                        name="linkedinUrl"
                        value={formData.linkedinUrl}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter LinkedIn URL"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Facebook URL
                    </label>
                    <input
                        type="text"
                        name="facebookUrl"
                        value={formData.facebookUrl}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter Facebook URL"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium mb-1">
                        Address
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter address"
                    />
                </div>
            </div>

            {/* Upload image components */}
            <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Avatar */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Avatar Image
                    </label>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition">
                        <span className="text-blue-600 font-semibold mb-2">
                            Choose avatar image
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setImageUrl(e.target.files[0]);
                                }
                            }}
                        />
                        <svg
                            className="w-8 h-8 text-blue-400 mb-2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        {imageUrl && (
                            <img
                                src={URL.createObjectURL(imageUrl)}
                                alt="preview"
                                className="mt-2 w-24 h-24 object-cover rounded-full border border-gray-200 shadow"
                            />
                        )}
                    </label>
                </div>
                {/* Avatar preview từ cloud nếu có */}
                {MyCompanyProfile.data?.payload?.imageUrl && !imageUrl && (
                    <img
                        src={MyCompanyProfile.data.payload.imageUrl}
                        alt="avatar-cloud"
                        className="mt-2 w-24 h-24 object-cover rounded-full border border-gray-200 shadow"
                    />
                )}
                {/* Cover image */}
                <div>
                    <label className="block text-gray-700 font-medium mb-2">
                        Cover Image
                    </label>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition">
                        <span className="text-blue-600 font-semibold mb-2">
                            Choose cover image
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                    setCoverImage(e.target.files[0]);
                                }
                            }}
                        />
                        <svg
                            className="w-8 h-8 text-blue-400 mb-2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        {coverImage && (
                            <img
                                src={URL.createObjectURL(coverImage)}
                                alt="preview"
                                className="mt-2 w-full h-24 object-cover rounded-lg border border-gray-200 shadow"
                            />
                        )}
                    </label>
                </div>
                {/* Cover preview từ cloud nếu có */}
                {MyCompanyProfile.data?.payload?.coverImage && !coverImage && (
                    <img
                        src={MyCompanyProfile.data.payload.coverImage}
                        alt="cover-cloud"
                        className="mt-2 w-full h-24 object-cover rounded-lg border border-gray-200 shadow"
                    />
                )}
                {/* Album images */}
                <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">
                        Album Images
                    </label>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition">
                        <span className="text-blue-600 font-semibold mb-2">
                            Choose multiple album images
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files) {
                                    setAlbumImage((prev) => [
                                        ...prev,
                                        ...Array.from(e.target.files),
                                    ]);
                                }
                            }}
                        />
                        <svg
                            className="w-8 h-8 text-blue-400 mb-2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        {albumImage && albumImage.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {albumImage.map((file, idx) => (
                                    <img
                                        key={idx}
                                        src={URL.createObjectURL(file)}
                                        alt={`album-${idx}`}
                                        className="w-20 h-20 object-cover rounded border border-gray-200 shadow"
                                    />
                                ))}
                            </div>
                        )}
                    </label>
                </div>
                {/* Album preview từ cloud nếu có */}
                {MyCompanyProfile.data?.payload?.albumImage?.length > 0 &&
                    albumImage.length === 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {MyCompanyProfile.data.payload.albumImage
                                .filter(
                                    (url) =>
                                        !removedImages.albumImage.includes(url)
                                )
                                .map((url, idx) => (
                                    <div key={idx} className="relative group">
                                        <img
                                            src={url}
                                            alt={`album-cloud-${idx}`}
                                            className="w-20 h-20 object-cover rounded border border-gray-200 shadow"
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-80 group-hover:opacity-100"
                                            onClick={() => {
                                                setRemovedImages((prev) => ({
                                                    ...prev,
                                                    albumImage: [
                                                        ...prev.albumImage,
                                                        url,
                                                    ],
                                                }));
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                        </div>
                    )}
                {/* Identity images */}
                <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">
                        Identity Images <span className="text-red-500">*</span>
                    </label>
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition">
                        <span className="text-blue-600 font-semibold mb-2">
                            Choose multiple identity images
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files) {
                                    setIdentityImage((prev) => [
                                        ...prev,
                                        ...Array.from(e.target.files),
                                    ]);
                                }
                            }}
                        />
                        <svg
                            className="w-8 h-8 text-blue-400 mb-2"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        {identityImage && identityImage.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {identityImage.map((file, idx) => (
                                    <img
                                        key={idx}
                                        src={URL.createObjectURL(file)}
                                        alt={`identity-${idx}`}
                                        className="w-20 h-20 object-cover rounded border border-gray-200 shadow"
                                    />
                                ))}
                            </div>
                        )}
                    </label>
                </div>
                {/* Identity preview từ cloud nếu có */}
                {MyCompanyProfile.data?.payload?.identityImage?.length > 0 &&
                    identityImage.length === 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {MyCompanyProfile.data.payload.identityImage
                                .filter(
                                    (url) =>
                                        !removedImages.identityImage.includes(
                                            url
                                        )
                                )
                                .map((url, idx) => (
                                    <div key={idx} className="relative group">
                                        <img
                                            src={url}
                                            alt={`identity-cloud-${idx}`}
                                            className="w-20 h-20 object-cover rounded border border-gray-200 shadow"
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs opacity-80 group-hover:opacity-100"
                                            onClick={() => {
                                                setRemovedImages((prev) => ({
                                                    ...prev,
                                                    identityImage: [
                                                        ...prev.identityImage,
                                                        url,
                                                    ],
                                                }));
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                        </div>
                    )}
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 px-6 rounded-lg shadow mt-4 text-lg flex items-center justify-center"
                // disabled={
                //     createCompany.isPending || updateCompanyProfile.isPending
                // }
            >
                {updateCompanyProfile.isPending ? (
                    <>
                        <svg
                            className="animate-spin h-5 w-5 mr-2 text-white"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8z"
                            />
                        </svg>
                        Updating...
                    </>
                ) : (
                    "Update Profile"
                )}
            </button>
        </form>
    );
};

export default CreateCompany;
