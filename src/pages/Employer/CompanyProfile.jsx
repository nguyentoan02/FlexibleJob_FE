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

function CompanyProfile() {
    const { companyId } = useParams();
    const { CompanyProfile } = useCompany(companyId);

    if (CompanyProfile.isError)
        return <div>Error: {CompanyProfile.error.message}</div>;

    return (
        <>
            <HeaderJobseeker />
            <div className="bg-gray-200 w-full h-56 flex items-center">
                <div className="flex flex-col gap-4 ms-52 ">
                    <h1 className="text-3xl font-semibold">Employer Detail</h1>
                    <div className="flex gap-2 font-light">
                        <h1>Home / Employer / </h1>
                        <a className="text-indigo-700 hover:cursor-pointer">
                            {" "}
                            {CompanyProfile.isLoading ? (
                                <LoadingOutlined />
                            ) : (
                                <h1>
                                    {CompanyProfile.data.payload.companyName}
                                </h1>
                            )}
                        </a>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-5 mx-52 my-15 gap-10">
                {CompanyProfile.isLoading ? (
                    <>
                        <div className="border-1 rounded-2xl p-5 col-span-2 bg-white shadow-sm">
                            <div className="items-center flex flex-col relative">
                                <div className="w-full h-40 bg-gray-200 animate-pulse rounded-lg"></div>
                                <div className="w-32 h-32 bg-gray-200 animate-pulse rounded-2xl mt-4 absolute"></div>
                                <div className="h-6 w-48 bg-gray-200 animate-pulse rounded mt-2"></div>
                                <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mt-2"></div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-5 w-32 bg-gray-200 animate-pulse rounded"></div>
                                <div className="flex justify-between">
                                    <div className="h-4 w-40 bg-gray-200 animate-pulse rounded"></div>
                                    <div className="h-4 w-40 bg-gray-200 animate-pulse rounded"></div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="h-4 w-40 bg-gray-200 animate-pulse rounded"></div>
                                    <div className="h-4 w-40 bg-gray-200 animate-pulse rounded"></div>
                                </div>
                                <div className="h-10 w-full bg-gray-200 animate-pulse rounded-xl mt-4"></div>
                            </div>
                        </div>
                        <div className="col-span-3 space-y-6">
                            <div>
                                <div className="h-6 w-48 bg-gray-200 animate-pulse rounded mb-4"></div>
                                <div className="h-32 bg-gray-200 animate-pulse rounded"></div>
                            </div>
                            <div>
                                <div className="h-6 w-36 bg-gray-200 animate-pulse rounded mb-4"></div>
                                <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="col-span-2">
                            <div className="border-1 rounded-2xl p-5 ">
                                <div className="items-center flex flex-col relative">
                                    <img
                                        src={
                                            CompanyProfile.data.payload
                                                .coverImage
                                        }
                                        className="absolute h-40 w-full object-cover opacity-100"
                                    />
                                    <img
                                        className="w-32 h-32 p-2 border-1 rounded-2xl object-cover z-10 mt-4 ring-1 ring-black/5 shadow-lg isolate aspect-video bg-white/20"
                                        src={
                                            CompanyProfile.data.payload.imageUrl
                                        }
                                    />
                                    <h1 className="font-semibold text-xl mt-4">
                                        {
                                            CompanyProfile.data.payload
                                                .companyName
                                        }
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
                                    <div className="flex justify-between mt-2">
                                        <h1 className="">
                                            <MailOutlined />{" "}
                                            {CompanyProfile.data.payload.email}
                                        </h1>
                                        <h1>
                                            <PhoneOutlined />{" "}
                                            {CompanyProfile.data.payload.phone}
                                        </h1>
                                    </div>
                                    <div className="flex justify-between mt-2">
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
                        <div className="col-span-3">
                            <div className="font-light">
                                <h1 className="font-semibold">
                                    About{" "}
                                    {CompanyProfile.data.payload.companyName}
                                </h1>
                                <h1 className="text-justify">
                                    {CompanyProfile.data.payload.aboutUs}
                                </h1>
                            </div>
                            <div className="font-light mt-5">
                                <h1 className="font-semibold">Company Size</h1>
                                <h1>
                                    {CompanyProfile.data.payload.companySize}{" "}
                                    Members
                                </h1>
                            </div>
                            <div>
                                <div className="overflow-auto w-full">
                                    <div className="flex ease">
                                        {CompanyProfile.data.payload.albumImage.map(
                                            (img, index) => (
                                                <div
                                                    key={index}
                                                    className="w-1/3 p-2 flex-shrink-0"
                                                >
                                                    <img
                                                        src={img}
                                                        alt={`Image ${index}`}
                                                        className="w-full h-48 object-cover rounded-xl shadow"
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
            <Footer />
        </>
    );
}

export default CompanyProfile;
