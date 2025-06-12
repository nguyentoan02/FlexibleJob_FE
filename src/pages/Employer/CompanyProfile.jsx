import HeaderJobseeker from "../../components/Header/HeaderJobseeker";
import { useParams } from "react-router-dom";
import { useCompany } from "../../hooks/company";
import {
    FacebookOutlined,
    LinkedinOutlined,
    LoadingOutlined,
    MailOutlined,
    MehOutlined,
    PhoneOutlined,
} from "@ant-design/icons";
import Footer from "../../components/Footer/Footer";
import { useState } from "react";
import Detail from "../../components/Company/CompanyProfile/Detail";
import Jobs from "../../components/Company/CompanyProfile/Jobs";
import Review from "../../components/Company/CompanyProfile/Review";

function CompanyProfile() {
    const { companyId } = useParams();
    const { CompanyProfile, CompanyJos } = useCompany(companyId);
    const [actions, setActions] = useState("DETAIL");

    if (CompanyProfile.isError || CompanyJos.isError)
        return <div>Error loading data</div>;

    return (
        <>
            <HeaderJobseeker />
            <div className="bg-gray-200 w-full h-56 flex items-center">
                <div className="flex flex-col gap-4 px-4 md:ms-20 lg:ms-52">
                    <h1 className="text-3xl font-semibold">Employer Detail</h1>
                    <div className="flex gap-2 font-light">
                        <h1>Home / Employer / </h1>
                        <a className="text-indigo-700 hover:cursor-pointer">
                            {" "}
                            {CompanyProfile.isLoading ||
                            CompanyJos.isLoading ? (
                                <LoadingOutlined />
                            ) : (
                                <h1>
                                    {CompanyProfile.data.payload.companyName}
                                </h1>
                            )}
                        </a>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setActions("DETAIL")}
                            className={`w-20 border-1 rounded-2xl hover:cursor-pointer text-white hover:bg-indigo-600 duration-300 ${
                                actions === "DETAIL"
                                    ? "bg-indigo-700"
                                    : "bg-indigo-400"
                            }`}
                        >
                            Detail
                        </button>
                        <button
                            onClick={() => setActions("JOBS")}
                            className={`w-20 border-1 rounded-2xl hover:cursor-pointer text-white hover:bg-indigo-600 duration-300 ${
                                actions === "JOBS"
                                    ? "bg-indigo-700"
                                    : "bg-indigo-400"
                            }`}
                        >
                            Job List
                        </button>
                        <button
                            onClick={() => setActions("REVIEW")}
                            className={`w-20 border-1 rounded-2xl hover:cursor-pointer text-white hover:bg-indigo-600 duration-300 ${
                                actions === "REVIEW"
                                    ? "bg-indigo-700"
                                    : "bg-indigo-400"
                            }`}
                        >
                            Review
                        </button>
                    </div>
                </div>
            </div>
            <div className="px-4 md:px-20 lg:px-52 text-center"></div>
            <div className="grid grid-cols-1 md:grid-cols-5 px-4 md:px-20 lg:px-52 my-10 gap-10">
                {CompanyProfile.isLoading && CompanyJos.isLoading && (
                    <>
                        <div className="md:col-span-2">
                            <div className="border rounded-2xl p-5 space-y-4 ">
                                <div className="w-32 h-32 bg-gray-500 rounded-2xl mx-auto"></div>
                                <div className="h-2 bg-gray-500 rounded w-3/4 mx-auto"></div>
                                <div className="h-2 bg-gray-500 rounded w-1/2 mx-auto"></div>
                                <div className="space-y-2 mt-4">
                                    <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                                    <div className="flex justify-between">
                                        <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                                        <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                                        <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                                        <div className="flex justify-between">
                                            <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                                            <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                                            <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                                        </div>
                                        <div className="h-10 bg-gray-300 rounded w-full mt-3"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="md:col-span-3 space-y-6">
                            <div>
                                <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                                <div className="h-24 bg-gray-200 rounded"></div>
                            </div>
                            <div>
                                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            </div>
                            <div>
                                <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            </div>
                            <div>
                                <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
                                <div className="flex gap-2 overflow-x-auto">
                                    <div className="w-1/3 h-48 bg-gray-300 rounded-xl"></div>
                                    <div className="w-1/3 h-48 bg-gray-300 rounded-xl"></div>
                                    <div className="w-1/3 h-48 bg-gray-300 rounded-xl"></div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                {CompanyProfile.data && (
                    <div className="col-span-2">
                        <div className="border-1 rounded-2xl p-5 ">
                            <div className="items-center flex flex-col relative">
                                <img
                                    src={CompanyProfile.data.payload.coverImage}
                                    className="absolute h-40 w-full object-cover opacity-100"
                                />
                                <img
                                    className="w-32 h-32 p-2 border-1 rounded-2xl object-cover z-10 mt-4 ring-1 ring-black/5 shadow-lg isolate aspect-video bg-white/20"
                                    src={CompanyProfile.data.payload.imageUrl}
                                />
                                <h1 className="font-semibold text-xl mt-4">
                                    {CompanyProfile.data.payload.companyName}
                                </h1>
                                <h1 className="font-extralight">
                                    <MehOutlined /> {"  "}
                                    {CompanyProfile.data.payload.location},
                                    Vietnam
                                </h1>
                            </div>
                            <div className="font-light">
                                <h1 className="font-semibold">
                                    {CompanyProfile.data.payload.industry}
                                </h1>
                                <div className="flex flex-col md:flex-row md:justify-between mt-2 gap-y-2">
                                    <h1 className="">
                                        <MailOutlined />{" "}
                                        {CompanyProfile.data.payload.email}
                                    </h1>
                                    <h1>
                                        <PhoneOutlined />{" "}
                                        {CompanyProfile.data.payload.phone}
                                    </h1>
                                </div>
                                <div className="flex flex-col md:flex-row md:justify-between mt-2 gap-y-2">
                                    <h1>
                                        <LinkedinOutlined />{" "}
                                        {
                                            CompanyProfile.data.payload
                                                .linkedinUrl
                                        }
                                    </h1>
                                    <h1>
                                        <FacebookOutlined />{" "}
                                        {
                                            CompanyProfile.data.payload
                                                .facebookUrl
                                        }
                                    </h1>
                                </div>
                                <button className="text-center w-full p-3 my-2 border-1 rounded-xl bg-indigo-500 text-white font-normal hover:bg-indigo-700 duration-300 hover:cursor-pointer">
                                    Contact Company
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {actions === "DETAIL" && CompanyProfile.data && (
                    <Detail companyData={CompanyProfile.data.payload} />
                )}

                {actions === "JOBS" && CompanyJos.data && (
                    <Jobs
                        jobs={CompanyJos.data.payload}
                        companyAvatar={CompanyProfile.data.payload.imageUrl}
                    />
                )}
                {actions === "REVIEW" && <Review reviews={null} />}
            </div>
            <Footer />
        </>
    );
}

export default CompanyProfile;
