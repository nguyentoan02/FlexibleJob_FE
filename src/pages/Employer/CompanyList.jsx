import React from "react";
import { useCompanyList } from "../../hooks/companyList";
import HeaderJobseeker from "../../components/Header/HeaderJobseeker";
import HeaderCompany from "../../components/Header/HeaderCompany";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const CompanyList = () => {
    const { companyList } = useCompanyList();
    const { user } = useAuth();
    const navigate = useNavigate();

    if (companyList.isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    if (companyList.isError) {
        return (
            <div className="text-center text-red-500 py-10">
                Failed to load companies.
            </div>
        );
    }

    const companies = companyList.data?.payload || [];

    return (
        <>
            {user?.role === "JOBSEEKER" ? (
                <HeaderJobseeker />
            ) : (
                <HeaderCompany />
            )}
            <div className="max-w-7xl mx-auto py-10 px-4">
                <h2 className="text-3xl font-bold mb-8 text-center text-indigo-700">
                    Companies
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {companies.map((company) => (
                        <div
                            key={company._id}
                            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center transition-transform duration-200 hover:-translate-y-2"
                            onClick={() => navigate(`/company/${company._id}`)}
                        >
                            {company.coverImage && (
                                <div className="w-full h-24 relative mb-[-48px]">
                                    <img
                                        src={company.coverImage}
                                        alt="cover"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            {/* Avatar */}
                            <img
                                src={company.imageUrl}
                                alt={company.companyName}
                                className="w-24 h-24 object-cover rounded-xl mb-4 border z-10 bg-white"
                                style={{
                                    marginTop: company.coverImage
                                        ? "-48px"
                                        : "0",
                                }}
                            />
                            <h3 className="text-xl font-bold mb-2 text-center">
                                {company.companyName}
                            </h3>
                            <div className="flex flex-wrap justify-center gap-2 mb-3">
                                {(Array.isArray(company.benefit)
                                    ? company.benefit
                                    : [company.benefit]
                                )
                                    .flat()
                                    .map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium"
                                        >
                                            {typeof tag === "string" &&
                                            tag.startsWith("[")
                                                ? JSON.parse(tag).join(", ")
                                                : tag}
                                        </span>
                                    ))}
                            </div>
                            <div className="text-gray-500 text-sm mb-2">
                                {company.location}
                            </div>
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <span className="font-semibold text-green-600">
                                    {company.companySize}
                                </span>
                                <span className="text-gray-400">|</span>
                                <span className="font-semibold text-indigo-600">
                                    {company.industry}
                                </span>
                            </div>
                            <div className="flex gap-2 mb-4">
                                {company.website && (
                                    <a
                                        href={
                                            company.website.startsWith("http")
                                                ? company.website
                                                : "#"
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 underline text-xs"
                                    >
                                        Website
                                    </a>
                                )}
                                {company.linkedinUrl && (
                                    <a
                                        href={
                                            company.linkedinUrl.startsWith(
                                                "http"
                                            )
                                                ? company.linkedinUrl
                                                : "#"
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline text-xs"
                                    >
                                        LinkedIn
                                    </a>
                                )}
                                {company.facebookUrl && (
                                    <a
                                        href={
                                            company.facebookUrl.startsWith(
                                                "http"
                                            )
                                                ? company.facebookUrl
                                                : "#"
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 underline text-xs"
                                    >
                                        Facebook
                                    </a>
                                )}
                            </div>
                            <div className="w-full flex flex-wrap gap-2 justify-center">
                                {company.identityImage &&
                                    company.identityImage.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`identity-${idx}`}
                                            className="w-8 h-8 rounded border object-cover"
                                        />
                                    ))}
                                {company.albumImage &&
                                    company.albumImage.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`album-${idx}`}
                                            className="w-8 h-8 rounded border object-cover"
                                        />
                                    ))}
                            </div>
                            <div className="mt-4 text-xs text-gray-400 text-center">
                                {company.aboutUs}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default CompanyList;
