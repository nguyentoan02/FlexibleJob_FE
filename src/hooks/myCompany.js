import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchMyCompanyProfile,
    getAllPackage,
    getCompanyApproval,
    updateCompanyProfile,
    // createCompanyProfile as createCompanyProfileApi,
} from "../api/company";
import { getJobLimitation, getJobsByUserId } from "../api/job";

export const useMyCompany = () => {
    const token = localStorage.getItem("token");
    const queryClient = useQueryClient();

    const MyCompanyProfile = useQuery({
        queryKey: ["MyCompany"],
        queryFn: () => fetchMyCompanyProfile(token),
    });

    const updateCompanyProfileMutation = useMutation({
        mutationFn: (data) => {
            const formData = new FormData();

            // Handle basic company data
            Object.keys(data).forEach((key) => {
                if (
                    key !== "albumImage" &&
                    key !== "imageUrl" &&
                    key !== "coverImage" &&
                    key !== "removeImages" && // Thêm removeImages vào danh sách loại trừ
                    key !== "newAlbumImages" &&
                    key !== "newProfileImage" &&
                    key !== "newCoverImage"
                ) {
                    formData.append(key, data[key]);
                }
            });

            // Handle removed images - Sửa cách xử lý removeImages
            if (data.removeImages && data.removeImages.length > 0) {
                data.removeImages.forEach((url, index) => {
                    formData.append(`removeImages[${index}]`, url);
                });
            }

            // Handle new album images
            if (data.newAlbumImages && data.newAlbumImages.length > 0) {
                data.newAlbumImages.forEach((file) => {
                    formData.append("albumImage", file);
                });
            }

            // Handle profile image
            if (data.newProfileImage) {
                formData.append("imageUrl", data.newProfileImage);
            }

            // Handle cover image
            if (data.newCoverImage) {
                formData.append("coverImage", data.newCoverImage);
            }
            if (data.newIdentityImages && data.newIdentityImages.length > 0) {
                data.newIdentityImages.forEach((file) => {
                    formData.append("identityImage", file);
                });
            }

            // Log toàn bộ FormData để debug
            for (let pair of formData.entries()) {
                console.log(pair[0] + ": " + pair[1]);
            }

            return updateCompanyProfile(formData, token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["MyCompany"]);
        },
    });

    const JobsOfMyCompany = useQuery({
        queryKey: ["JobsMyCompany"],
        queryFn: () => getJobsByUserId(token),
    });

    const isCompanyApproved = useQuery({
        queryKey: ["isCompanyApproved"],
        queryFn: () => getCompanyApproval(token),
    });

    const createCompanyProfile = useMutation({
        mutationFn: (data) => {
            const formData = new FormData();
            // Append các trường cơ bản
            Object.keys(data).forEach((key) => {
                if (
                    key !== "albumImage" &&
                    key !== "identityImage" &&
                    key !== "imageUrl" &&
                    key !== "coverImage"
                ) {
                    formData.append(key, data[key]);
                }
            });
            // Ảnh đại diện
            if (data.imageUrl) formData.append("imageUrl", data.imageUrl);
            // Ảnh cover
            if (data.coverImage) formData.append("coverImage", data.coverImage);
            // Album ảnh
            if (data.albumImage && data.albumImage.length > 0) {
                data.albumImage.forEach((file) => {
                    formData.append("albumImage", file);
                });
            }
            // Ảnh giấy tờ
            if (data.identityImage && data.identityImage.length > 0) {
                data.identityImage.forEach((file) => {
                    formData.append("identityImage", file);
                });
            }
            return createCompanyProfileApi(token, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["MyCompany"]);
        },
    });

    const jobLimitation = useQuery({
        queryKey: ["JobLimitation"],
        queryFn: () => getJobLimitation(token),
    });

    const companyPackage = useQuery({
        queryKey: ["Package"],
        queryFn: () => getAllPackage(),
    });

    return {
        MyCompanyProfile,
        updateCompanyProfile: updateCompanyProfileMutation,
        JobsOfMyCompany,
        isCompanyApproved,
        createCompany: createCompanyProfile,
        jobLimitation,
        companyPackage,
    };
};
