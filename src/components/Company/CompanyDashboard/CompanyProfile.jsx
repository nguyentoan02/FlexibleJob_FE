import { useEffect, useState } from "react";
import { useMyCompany } from "../../../hooks/myCompany";

const CompanyProfile = () => {
    const { MyCompanyProfile } = useMyCompany();
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

    if (MyCompanyProfile.isLoading) return <div>...loading</div>;
    if (MyCompanyProfile.isError)
        return <div>{MyCompanyProfile.error.message}</div>;

    console.log(MyCompanyProfile.data.payload);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCompanyData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageUpload = async (e, field) => {
        // Add your image upload logic here
        const file = e.target.files[0];
        // Upload to server and get URL
        // Then update state
        setCompanyData((prev) => ({
            ...prev,
            [field]: URL.createObjectURL(file), // Temporary preview, replace with actual upload
        }));
    };

    return (
        <div className="px-4 py-6 md:px-10 md:py-10 bg-gray-100/20">
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
                                className="w-full mt-1 p-2 border rounded-md"
                            />
                        </div>

                        <div className="w-full">
                            <label className="block font-medium">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                // onChange={handleChange}
                                placeholder="Leave blank to keep unchanged"
                                className="w-full mt-1 p-2 border rounded-md"
                            />
                        </div>
                        <div className="w-full">
                            <label className="block font-medium">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirm password"
                                // onChange={handleChange}
                                placeholder="Leave blank to keep unchanged"
                                className="w-full mt-1 p-2 border rounded-md"
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
                                Album Images
                            </label>
                            <div className="flex gap-2 mt-2 overflow-x-auto scroll-smooth w-full">
                                {companyData.albumImage.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`Album ${index + 1}`}
                                        className="w-64 h-64 object-cover rounded"
                                    />
                                ))}
                            </div>
                            <input
                                type="file"
                                multiple
                                onChange={(e) =>
                                    handleImageUpload(e, "albumImage")
                                }
                                className="mt-2 text-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end">
                    <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition text-sm">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompanyProfile;
