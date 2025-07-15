import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../api/users";
import { useAuth } from "../hooks/useAuth";

export default function AdminUsers() {
    const { token } = useAuth();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["users"],
        queryFn: () => fetchUsers(token),
        enabled: !!token,
    });

    if (isLoading) return <p>Loading...</p>;
    if (isError) return <p>Error loading users</p>;

    return (
        <div className="max-w-2xl mx-auto mt-10">
            <h2 className="text-xl font-semibold mb-4">User List</h2>
            <ul className="space-y-2">
                {data.map((u) => (
                    <li key={u._id} className="border p-2 rounded shadow-sm">
                        {u.email} - {u.role}
                    </li>
                ))}
            </ul>
        </div>
    );
}
