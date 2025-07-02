import React from "react";

const ImageUpload = ({ label, onFileSelect }) => {
    const handleChange = (e) => {
        onFileSelect(e.target.files[0]);
    };

    return (
        <div className="my-2">
            <label>{label}</label>
            <input type="file" onChange={handleChange} className="block mt-1" />
        </div>
    );
};

export default ImageUpload;
