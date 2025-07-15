import React from "react";

const MultiImageUpload = ({ label, onFilesSelect }) => {
    const handleChange = (e) => {
        onFilesSelect(Array.from(e.target.files));
    };

    return (
        <div className="my-2">
            <label>{label}</label>
            <input
                type="file"
                multiple
                onChange={handleChange}
                className="block mt-1"
            />
        </div>
    );
};

export default MultiImageUpload;
