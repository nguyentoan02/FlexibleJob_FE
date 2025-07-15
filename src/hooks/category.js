import { useQuery } from "@tanstack/react-query";
import { fetchCategory } from "../api/category";

export const useCategory = () => {
    const AllCategory = useQuery({
        queryKey: ["AllCategory"],
        queryFn: () => fetchCategory(),
    });
    return { AllCategory };
};
