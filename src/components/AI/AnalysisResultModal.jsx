
import React from 'react';

const AnalysisResultModal = ({ isOpen, onClose, data, error, isLoading }) => {
    if (!isOpen) return null;

    const getRankColor = (rank) => {
        if (rank === 1) return 'bg-yellow-400 text-yellow-900';
        if (rank === 2) return 'bg-gray-300 text-gray-800';
        if (rank === 3) return 'bg-amber-500 text-amber-900';
        return 'bg-gray-200 text-gray-700';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">Kết quả Phân tích & Xếp hạng từ AI</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>
                
                {isLoading && <p>Đang phân tích, vui lòng chờ...</p>}
                {error && <p className="text-red-500">Lỗi: {error.message}</p>}
                {data && (
                    <div className="space-y-4">
                        {data.ranking?.sort((a, b) => a.rank - b.rank).map(item => (
                            <div key={item.applicantId} className="bg-gray-50 p-4 rounded-lg flex items-start gap-4">
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${getRankColor(item.rank)}`}>
                                    #{item.rank}
                                </div>
                                <div className="flex-grow">
                                    <p className="font-semibold text-gray-800">Applicant ID: {item.applicantId}</p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        <span className="font-semibold text-blue-600">Lý do xếp hạng:</span> {item.reason}
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
