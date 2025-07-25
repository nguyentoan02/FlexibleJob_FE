import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMyCompany } from "../../../hooks/myCompany";
import Toast from "../../Toast/Toast";

const CreateCompany = () => {
    // Danh sách thành phố - giống như trong JobList và JobForm
    const cities = [
        { value: "Hanoi", label: "Hanoi" },
        { value: "Ho Chi Minh City", label: "Ho Chi Minh City" },
        { value: "Da Nang", label: "Da Nang" },
        { value: "Hai Phong", label: "Hai Phong" },
        { value: "Can Tho", label: "Can Tho" },
        { value: "Bien Hoa", label: "Bien Hoa" },
        { value: "Hue", label: "Hue" },
        { value: "Nha Trang", label: "Nha Trang" },
        { value: "Vung Tau", label: "Vung Tau" },
        { value: "Quy Nhon", label: "Quy Nhon" },
    ];

    const [formData, setFormData] = useState({
        companyName: "",
        industry: "",
        aboutUs: "",
        benefit: "",
        address: "",
        location: "", // Sẽ chứa giá trị thành phố được chọn
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

        const payload = {
            ...formData,
            newImageUrl: imageUrl instanceof File ? imageUrl : undefined, // Đổi từ newProfileImage thành newImageUrl
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
                    <select
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Select a location</option>
                        {cities.map((city) => (
                            <option key={city.value} value={city.value}>
                                {city.label}
                            </option>
                        ))}
                    </select>
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
            <div className="my-8 space-y-8">
                {/* Avatar và Cover trong cùng một row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Avatar */}
                    <div className="space-y-4">
                        <label className="block text-gray-700 font-medium text-lg">
                            Avatar Image
                        </label>

                        {/* Preview current avatar */}
                        {(MyCompanyProfile.data?.payload?.imageUrl ||
                            imageUrl) && (
                            <div className="flex justify-center mb-4">
                                <div className="relative">
                                    <img
                                        src={
                                            imageUrl
                                                ? URL.createObjectURL(imageUrl)
                                                : MyCompanyProfile.data.payload
                                                      .imageUrl
                                        }
                                        alt="Current Avatar"
                                        className="w-32 h-32 object-cover rounded-full border-4 border-blue-200 shadow-lg"
                                    />
                                    {imageUrl && (
                                        <button
                                            type="button"
                                            onClick={() => setImageUrl(null)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Upload button */}
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-xl p-6 cursor-pointer hover:bg-blue-50 hover:border-blue-500 transition-all duration-200">
                            <div className="text-center space-y-2">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                    <svg
                                        className="w-6 h-6 text-blue-500"
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
                                </div>
                                <div>
                                    <span className="text-blue-600 font-semibold">
                                        Choose Avatar
                                    </span>
                                    <p className="text-gray-500 text-sm mt-1">
                                        PNG, JPG up to 5MB
                                    </p>
                                </div>
                            </div>
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
                        </label>
                    </div>

                    {/* Cover Image */}
                    <div className="space-y-4">
                        <label className="block text-gray-700 font-medium text-lg">
                            Cover Image
                        </label>

                        {/* Preview current cover */}
                        {(MyCompanyProfile.data?.payload?.coverImage ||
                            coverImage) && (
                            <div className="mb-4">
                                <div className="relative">
                                    <img
                                        src={
                                            coverImage
                                                ? URL.createObjectURL(
                                                      coverImage
                                                  )
                                                : MyCompanyProfile.data.payload
                                                      .coverImage
                                        }
                                        alt="Current Cover"
                                        className="w-full h-40 object-cover rounded-xl border-2 border-gray-200 shadow-md"
                                    />
                                    {coverImage && (
                                        <button
                                            type="button"
                                            onClick={() => setCoverImage(null)}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Upload button */}
                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-xl p-6 cursor-pointer hover:bg-blue-50 hover:border-blue-500 transition-all duration-200">
                            <div className="text-center space-y-2">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                    <svg
                                        className="w-6 h-6 text-blue-500"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-blue-600 font-semibold">
                                        Choose Cover Image
                                    </span>
                                    <p className="text-gray-500 text-sm mt-1">
                                        Recommended: 1200x400px
                                    </p>
                                </div>
                            </div>
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
                        </label>
                    </div>
                </div>

                {/* Album Images */}
                <div className="space-y-4">
                    <label className="block text-gray-700 font-medium text-lg">
                        Album Images
                        <span className="text-gray-500 text-sm font-normal ml-2">
                            (Multiple images allowed)
                        </span>
                    </label>

                    {/* Preview existing album images */}
                    {MyCompanyProfile.data?.payload?.albumImage?.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-3">
                                Current Images:
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {MyCompanyProfile.data.payload.albumImage
                                    .filter(
                                        (url) =>
                                            !removedImages.albumImage.includes(
                                                url
                                            )
                                    )
                                    .map((url, idx) => (
                                        <div
                                            key={idx}
                                            className="relative group"
                                        >
                                            <img
                                                src={url}
                                                alt={`Album ${idx + 1}`}
                                                className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 shadow-sm group-hover:shadow-md transition-shadow"
                                            />
                                            <button
                                                type="button"
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                                                onClick={() => {
                                                    setRemovedImages(
                                                        (prev) => ({
                                                            ...prev,
                                                            albumImage: [
                                                                ...prev.albumImage,
                                                                url,
                                                            ],
                                                        })
                                                    );
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Preview new album images */}
                    {albumImage.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-3">
                                New Images to Upload:
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {albumImage.map((file, idx) => (
                                    <div key={idx} className="relative group">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`New Album ${idx + 1}`}
                                            className="w-full h-24 object-cover rounded-lg border-2 border-green-200 shadow-sm group-hover:shadow-md transition-shadow"
                                        />
                                        <button
                                            type="button"
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                                            onClick={() => {
                                                setAlbumImage((prev) =>
                                                    prev.filter(
                                                        (_, i) => i !== idx
                                                    )
                                                );
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upload button */}
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-xl p-8 cursor-pointer hover:bg-blue-50 hover:border-blue-500 transition-all duration-200">
                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                                <svg
                                    className="w-8 h-8 text-blue-500"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <span className="text-blue-600 font-semibold text-lg">
                                    Add Album Images
                                </span>
                                <p className="text-gray-500 text-sm mt-1">
                                    Select multiple images to showcase your
                                    company
                                </p>
                                <p className="text-gray-400 text-xs">
                                    PNG, JPG up to 5MB each
                                </p>
                            </div>
                        </div>
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
                    </label>
                </div>

                {/* Identity Images */}
                <div className="space-y-4">
                    <label className="block text-gray-700 font-medium text-lg">
                        Identity Images
                        <span className="text-red-500">*</span>
                        <span className="text-gray-500 text-sm font-normal ml-2">
                            (Business license, certificates, etc.)
                        </span>
                    </label>

                    {/* Preview existing identity images */}
                    {MyCompanyProfile.data?.payload?.identityImage?.length >
                        0 && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-3">
                                Current Documents:
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {MyCompanyProfile.data.payload.identityImage
                                    .filter(
                                        (url) =>
                                            !removedImages.identityImage.includes(
                                                url
                                            )
                                    )
                                    .map((url, idx) => (
                                        <div
                                            key={idx}
                                            className="relative group"
                                        >
                                            <img
                                                src={url}
                                                alt={`Identity Document ${
                                                    idx + 1
                                                }`}
                                                className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm group-hover:shadow-md transition-shadow"
                                            />
                                            <button
                                                type="button"
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                                                onClick={() => {
                                                    setRemovedImages(
                                                        (prev) => ({
                                                            ...prev,
                                                            identityImage: [
                                                                ...prev.identityImage,
                                                                url,
                                                            ],
                                                        })
                                                    );
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* Preview new identity images */}
                    {identityImage.length > 0 && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-3">
                                New Documents to Upload:
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {identityImage.map((file, idx) => (
                                    <div key={idx} className="relative group">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`New Identity Document ${
                                                idx + 1
                                            }`}
                                            className="w-full h-32 object-cover rounded-lg border-2 border-green-200 shadow-sm group-hover:shadow-md transition-shadow"
                                        />
                                        <button
                                            type="button"
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                                            onClick={() => {
                                                setIdentityImage((prev) =>
                                                    prev.filter(
                                                        (_, i) => i !== idx
                                                    )
                                                );
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upload button */}
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-orange-400 rounded-xl p-8 cursor-pointer hover:bg-orange-50 hover:border-orange-500 transition-all duration-200">
                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                                <svg
                                    className="w-8 h-8 text-orange-500"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            </div>
                            <div>
                                <span className="text-orange-600 font-semibold text-lg">
                                    Upload Identity Documents
                                </span>
                                <p className="text-gray-500 text-sm mt-1">
                                    Business license, certificates, legal
                                    documents
                                </p>
                                <p className="text-gray-400 text-xs">
                                    Required for company verification
                                </p>
                            </div>
                        </div>
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
                    </label>
                </div>
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
