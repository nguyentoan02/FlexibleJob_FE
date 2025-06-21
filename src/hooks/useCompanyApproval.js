// src/hooks/useCompanyApproval.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMyCompany } from "./myCompany";

export const useCompanyApproval = () => {
    const navigate = useNavigate();
    const { MyCompanyProfile } = useMyCompany();

    useEffect(() => {
        if (MyCompanyProfile.data) {
            const isApproved = MyCompanyProfile.data.payload?.isApproved;

            // If not approved, redirect to company profile
            if (
                !isApproved &&
                window.location.pathname !== "/company/dashboard/profile"
            ) {
                navigate("/company/dashboard/profile");
            }
        }
    }, [MyCompanyProfile.data, navigate]);

    return {
        isApproved: MyCompanyProfile.data?.payload?.isApproved || false,
        isLoading: MyCompanyProfile.isLoading,
    };
};
