import { useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
    const queryClient = useQueryClient();
    const token = localStorage.getItem("token");
    const user = token ? jwtDecode(token) : null;

    const login = (token) => {
        localStorage.setItem("token", token);
        queryClient.invalidateQueries(["auth"]);
    };

    const logout = () => {
        localStorage.removeItem("token");
        queryClient.invalidateQueries(["auth"]);
    };

    return { user, token, login, logout };
};
