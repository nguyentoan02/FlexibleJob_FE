import React from "react";

const AnalysisResultModal = ({ isOpen, onClose, data, error, isLoading }) => {
    if (!isOpen) return null;

    const getRankColor = (rank) => {
        if (rank === 1)
            return "bg-gradient-to-tr from-yellow-300 to-yellow-500 text-yellow-900 border-yellow-400";
        if (rank === 2)
            return "bg-gradient-to-tr from-gray-200 to-gray-400 text-gray-800 border-gray-300";
        if (rank === 3)
            return "bg-gradient-to-tr from-amber-300 to-amber-500 text-amber-900 border-amber-400";
        return "bg-gradient-to-tr from-gray-100 to-gray-200 text-gray-700 border-gray-300";
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-blue-100 relative animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h3 className="text-2xl font-extrabold text-blue-700 tracking-tight">
                        Kết quả Phân tích & Xếp hạng từ AI
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-blue-600 text-3xl font-bold transition"
                        aria-label="Đóng"
                    >
                        &times;
                    </button>
                </div>

                {isLoading && (
                    <div className="flex items-center gap-2 text-blue-600 font-medium">
                        <svg
                            className="animate-spin h-5 w-5 text-blue-400"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8z"
                            ></path>
                        </svg>
                        Đang phân tích, vui lòng chờ...
                    </div>
                )}
                {error && (
                    <p className="text-red-500 font-semibold">
                        Lỗi: {error.message}
                    </p>
                )}
                {data && (
                    <div className="space-y-6">
                        {data.ranking
                            ?.sort((a, b) => a.rank - b.rank)
                            .map((item) => (
                                <div
                                    key={item.applicantId}
                                    className="bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-lg border border-blue-100 hover:shadow-xl transition"
                                >
                                    <div className="relative flex flex-col items-center md:items-start w-full md:w-1/4">
                                        <img
                                            src={item.imageUrl}
                                            alt={`${item.firstName} ${item.lastName}`}
                                            className="w-24 h-24 object-cover rounded-full border-4 border-blue-200 shadow-lg"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src =
                                                    "https://ui-avatars.com/api/?name=" +
                                                    encodeURIComponent(
                                                        `${
                                                            item.firstName || ""
                                                        } ${
                                                            item.lastName || ""
                                                        }`
                                                    );
                                            }}
                                        />
                                        <div
                                            className="absolute -bottom-2 left-1/2 -translate-x-1/2"
                                            style={{ pointerEvents: "none" }}
                                        >
                                            <div
                                                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow border-4 ${getRankColor(
                                                    item.rank
                                                )} bg-opacity-90 backdrop-blur`}
                                                style={{
                                                    opacity: 0.92,
                                                    mixBlendMode: "lighten",
                                                }}
                                            >
                                                #{item.rank}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-grow text-center md:text-left">
                                        <p className="font-bold text-xl text-blue-800 mb-1">
                                            {item.firstName} {item.lastName}
                                        </p>
                                        <p className="text-xs text-gray-400 mb-2">
                                            Applicant ID:{" "}
                                            <span className="font-medium">
                                                {item.applicantId}
                                            </span>
                                        </p>
                                        <p className="text-base text-gray-700 mt-1">
                                            <span className="font-semibold text-blue-600">
                                                Lý do xếp hạng:
                                            </span>{" "}
                                            {item.reason}
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnalysisResultModal;
