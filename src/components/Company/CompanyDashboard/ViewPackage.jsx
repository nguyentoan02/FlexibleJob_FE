import React from "react";
import { useMyCompany } from "../../../hooks/myCompany";
import { createPaymentLink } from "../../../api/payment";
import { useAuth } from "../../../hooks/useAuth";

const ViewPackage = () => {
    const { companyPackage } = useMyCompany();
    const { token } = useAuth();

    const handleBuyClick = async (pkgId) => {
        const result = await createPaymentLink(pkgId, token);
        window.location.replace(result.checkoutUrl);
    };

    if (companyPackage.isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[300px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    if (companyPackage.isError) {
        return (
            <div className="text-center text-red-500 py-10">
                Failed to load packages.
            </div>
        );
    }

    const packages = companyPackage.data?.payload || [];

    return (
        <div className="max-w-5xl mx-auto mt-12 mb-12 px-4">
            <h2 className="text-3xl font-extrabold text-center mb-3 text-indigo-700">
                Service Packages Pricing
            </h2>
            <p className="text-center mb-10 text-gray-500">
                Simple, transparent, no hidden fees
            </p>
            <div className="flex flex-wrap justify-center gap-8">
                {packages.map((pkg) => (
                    <div
                        key={pkg._id}
                        className={`flex flex-col items-center min-w-[270px] p-8 rounded-2xl shadow-lg transition-transform duration-200 hover:-translate-y-2 ${
                            pkg.isPopular
                                ? "bg-indigo-600 text-white border-0 scale-105 shadow-2xl"
                                : "bg-white text-gray-900 border border-indigo-100"
                        }`}
                    >
                        <h3 className="text-2xl font-bold mb-2 tracking-wide">
                            {pkg.name}
                        </h3>
                        <div className="mb-2 text-base italic opacity-80">
                            {pkg.description}
                        </div>
                        <div
                            className={`text-5xl font-extrabold mb-3 ${
                                pkg.isPopular ? "text-white" : "text-indigo-600"
                            }`}
                        >
                            {pkg.price.toLocaleString()}₫
                        </div>
                        <ul
                            className={`text-left mb-8 space-y-2 ${
                                pkg.isPopular
                                    ? "text-indigo-100"
                                    : "text-gray-800"
                            }`}
                        >
                            {pkg.benefits.map((f, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <span className="inline-block w-2 h-2 rounded-full bg-indigo-400" />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <button
                            className={`w-full py-2 rounded-lg font-semibold transition ${
                                pkg.isPopular
                                    ? "bg-white text-indigo-700 hover:bg-indigo-100"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                            }`}
                            onClick={() => handleBuyClick(pkg._id)}
                        >
                            Choose Plan
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewPackage;
