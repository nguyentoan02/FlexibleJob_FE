import React from "react";

const LimitTationJobPost = ({ data }) => {
    const remainingPosts = data.limit - data.posted;
    return (
        <div className="inline-block px-4 py-4 border-2 border-blue-700 rounded-lg min-w-[80px] text-center bg-blue-50 text-blue-700 font-bold text-2xl">
            {remainingPosts}
            <div className="text-base text-gray-600 mt-1 font-normal">
                Remaining post
            </div>
            <div className="text-sm text-gray-500 mt-2 font-normal">
                Posted: {data.posted}/{data.limit}
            </div>
        </div>
    );
};

export default LimitTationJobPost;
