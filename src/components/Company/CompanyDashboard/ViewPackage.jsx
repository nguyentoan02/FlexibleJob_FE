import React from "react";

const packages = [
    {
        name: "Basic",
        price: 10,
        features: ["Post 10 jobs", "Boost 1 job to priority page"],
    },
    {
        name: "Pro",
        price: 30,
        features: [
            "Post 30 jobs",
            "Boost 3 jobs to priority page",
            "Priority posting support",
        ],
    },
    {
        name: "Premium",
        price: 60,
        features: [
            "Post 100 jobs",
            "Boost 10 jobs to priority page",
            "Priority posting support",
            "Dedicated recruitment consulting",
        ],
    },
];

const ViewPackage = () => (
    <div className="max-w-5xl mx-auto mt-12 mb-12 px-4">
        <h2 className="text-3xl font-extrabold text-center mb-3 text-indigo-700">
            Service Packages Pricing
        </h2>
        <p className="text-center mb-10 text-gray-500">
            Simple, transparent, no hidden fees
        </p>
        <div className="flex flex-wrap justify-center gap-8">
            {packages.map((pkg, idx) => (
                <div
                    key={pkg.name}
                    className={`flex flex-col items-center min-w-[270px] p-8 rounded-2xl shadow-lg transition-transform duration-200 hover:-translate-y-2 ${
                        idx === 1
                            ? "bg-indigo-600 text-white border-0 scale-105 shadow-2xl"
                            : "bg-white text-gray-900 border border-indigo-100"
                    }`}
                >
                    <h3 className="text-2xl font-bold mb-3 tracking-wide">
                        {pkg.name}
                    </h3>
                    <div
                        className={`text-5xl font-extrabold mb-3 ${
                            idx === 1 ? "text-white" : "text-indigo-600"
                        }`}
                    >
                        ${pkg.price}
                    </div>
                    <ul
                        className={`text-left mb-8 space-y-2 ${
                            idx === 1 ? "text-indigo-100" : "text-gray-800"
                        }`}
                    >
                        {pkg.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-2">
                                <span className="inline-block w-2 h-2 rounded-full bg-indigo-400" />
                                {f}
                            </li>
                        ))}
                    </ul>
                    <button
                        className={`w-full py-2 rounded-lg font-semibold transition ${
                            idx === 1
                                ? "bg-white text-indigo-700 hover:bg-indigo-100"
                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                    >
                        Choose Plan
                    </button>
                </div>
            ))}
        </div>
    </div>
);

export default ViewPackage;
