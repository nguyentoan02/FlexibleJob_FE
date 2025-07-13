import React from "react";
import { Link } from "react-router-dom";

const PaymentCancel = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-red-50 to-white">
            <div className="bg-white rounded-2xl shadow-xl px-8 py-10 max-w-md w-full flex flex-col items-center">
                <div className="mb-4">
                    <svg
                        className="w-16 h-16 text-red-500 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="#fee2e2"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 9l6 6M15 9l-6 6"
                            stroke="#ef4444"
                            strokeWidth="2"
                            fill="none"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-red-600 mb-2">
                    Payment Cancelled
                </h2>
                <p className="text-gray-600 mb-6">
                    Your payment was not completed.
                    <br />
                    Please try again or choose another package.
                </p>
                <Link
                    to="/company/dashboard/viewCompanyPackage"
                    className="inline-block px-6 py-2 rounded-lg bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition"
                >
                    View Packages
                </Link>
            </div>
        </div>
    );
};

export default PaymentCancel;
