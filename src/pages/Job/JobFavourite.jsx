// src/pages/Job/JobFavorite.jsx
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useFavoriteJobs } from "@/hooks/favoriteJob";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import HeaderJobseeker from "@/components/Header/HeaderJobseeker";
import { Building, MapPin, DollarSign, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Toast from "@/components/Toast/Toast";

export default function JobFavorite() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { favoritesQuery, removeFromFavorites } = useFavoriteJobs();
    const [toast, setToast] = useState({ message: "", type: "" });

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleRemoveFromFavorites = async (jobId) => {
        try {
            await removeFromFavorites.mutateAsync(jobId);
            setToast({
                message: "Job removed from favorites",
                type: "success",
            });
        } catch (error) {
            setToast({
                message: "Failed to remove job from favorites",
                type: "error",
            });
        }
    };

    const formatSalary = (salary) => {
        if (!salary) return "Negotiable";
        const { min, max, currency } = salary;
        return `${currency} ${min / 1000}k - ${max / 1000}k`;
    };

    if (favoritesQuery.isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <>
            <HeaderJobseeker />
            {toast.message && (
                <Toast message={toast.message} type={toast.type} />
            )}

            <div className="container mx-auto py-8 px-4">
                <h1 className="text-2xl font-bold mb-6">My Favorite Jobs</h1>

                <div className="space-y-4">
                    {favoritesQuery.data?.payload?.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500">
                                No favorite jobs yet
                            </p>
                        </div>
                    ) : (
                        favoritesQuery.data?.payload?.map((favorite) => (
                            <Card
                                key={favorite._id}
                                className="hover:shadow-md transition-shadow"
                            >
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1">
                                            <h3
                                                className="text-xl font-semibold text-blue-600 hover:underline cursor-pointer"
                                                onClick={() =>
                                                    navigate(
                                                        `/jobs/${favorite.job._id}`
                                                    )
                                                }
                                            >
                                                {favorite.job.title}
                                            </h3>

                                            <div className="mt-2 space-y-2">
                                                <div className="flex items-center text-gray-600">
                                                    <Building className="h-4 w-4 mr-2" />
                                                    {
                                                        favorite.job.company
                                                            .companyName
                                                    }
                                                </div>

                                                <div className="flex items-center text-gray-600">
                                                    <MapPin className="h-4 w-4 mr-2" />
                                                    {favorite.job.location}
                                                </div>

                                                <div className="flex items-center text-gray-600">
                                                    <DollarSign className="h-4 w-4 mr-2" />
                                                    {formatSalary(
                                                        favorite.job.salary
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="text-red-600 hover:text-red-700"
                                            onClick={() =>
                                                handleRemoveFromFavorites(
                                                    favorite.job._id
                                                )
                                            }
                                            disabled={
                                                removeFromFavorites.isLoading
                                            }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </>
    );
}
