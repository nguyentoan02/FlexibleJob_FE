
import React from 'react';

const ScoreBadge = ({ score, justification }) => {
    if (score === null || score === undefined) {
        return <span className="italic text-gray-500 text-sm">Đang chấm điểm...</span>;
    }

    const getScoreColor = () => {
        if (score >= 85) return 'bg-green-500';
        if (score >= 70) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div title={justification} className="cursor-pointer flex items-center gap-2">
            <strong className="text-sm font-medium text-gray-700">Độ phù hợp (AI):</strong>
            <span className={`inline-block text-white font-bold text-sm px-3 py-1 rounded-full ${getScoreColor()}`}>
                {score}%
            </span>
        </div>
    );
};

export default ScoreBadge;
