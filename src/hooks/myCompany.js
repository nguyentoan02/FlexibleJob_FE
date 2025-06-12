import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchMyCompanyProfile, updateCompanyProfile } from "../api/company";

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
            if (data.newAlbumImages) {
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

    return {
        MyCompanyProfile,
        updateCompanyProfile: updateCompanyProfileMutation,
    };
};
