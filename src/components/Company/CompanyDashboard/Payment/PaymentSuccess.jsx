import React from "react";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-indigo-50 to-white">
            <div className="bg-white rounded-2xl shadow-xl px-8 py-10 max-w-md w-full flex flex-col items-center">
                <div className="mb-4">
                    <svg
                        className="w-16 h-16 text-green-500 mx-auto"
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
                            fill="#dcfce7"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12l2 2 4-4"
                            stroke="#22c55e"
                            strokeWidth="2"
                            fill="none"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-green-600 mb-2">
                    Payment Successful!
                </h2>
                <p className="text-gray-600 mb-6">
                    Thank you for your purchase.
                    <br />
                    Your package has been activated.
                </p>
                <Link
                    to="/company/dashboard"
                    className="inline-block px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold shadow hover:bg-indigo-700 transition"
                >
                    Go to Dash Board
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;
