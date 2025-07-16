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
            {toast.message && (
                <Toast message={toast.message} type={toast.type} />
            )}

            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100 py-10">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-extrabold text-indigo-700 mb-8 text-center drop-shadow">
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
                            My Favorite Jobs
                        </span>
                    </h1>

                    <div className="space-y-6">
                        {favoritesQuery.data?.payload?.length === 0 ? (
                            <div className="text-center py-16">
                                <img
                                    src="/image1.png"
                                    alt="No favorites"
                                    className="mx-auto mb-6 w-32 h-32 opacity-80"
                                />
                                <p className="text-lg text-gray-500 font-medium">
                                    No favorite jobs yet. Start exploring and
                                    save jobs you love!
                                </p>
                            </div>
                        ) : (
                            favoritesQuery.data?.payload?.map((favorite) => (
                                <Card
                                    key={favorite._id}
                                    className="relative overflow-hidden border-0 shadow-lg group hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-2xl"
                                >
                                    {/* Ribbon HOT nếu job là hot */}
                                    {favorite.job?.isHot && (
                                        <span className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-yellow-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10 animate-pulse">
                                            HOT
                                        </span>
                                    )}
                                    <CardContent className="p-8 flex gap-6 items-center">
                                        {/* Chỉ hiển thị logo công ty nếu có */}
                                        {favorite.job?.company?.imageUrl && (
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={
                                                        favorite.job.company
                                                            .imageUrl
                                                    }
                                                    alt="Company Logo"
                                                    className="w-16 h-16 rounded-full border-2 border-indigo-200 shadow object-cover bg-white"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h3
                                                className="text-2xl font-bold text-indigo-700 hover:underline cursor-pointer transition"
                                                onClick={() =>
                                                    navigate(
                                                        `/jobs/${favorite.job._id}`
                                                    )
                                                }
                                            >
                                                {favorite.job?.title}
                                            </h3>
                                            <div className="mt-3 flex flex-wrap gap-4 text-gray-600">
                                                <div className="flex items-center">
                                                    <Building className="h-5 w-5 mr-2 text-blue-400" />
                                                    <span className="font-medium">
                                                        {
                                                            favorite.job
                                                                ?.company
                                                                ?.companyName
                                                        }
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <MapPin className="h-5 w-5 mr-2 text-indigo-400" />
                                                    {favorite.job?.location}
                                                </div>
                                                <div className="flex items-center">
                                                    <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                                                    <span className="font-semibold">
                                                        {formatSalary(
                                                            favorite.job?.salary
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="text-red-600 hover:bg-red-100 hover:text-red-700 border-2 border-red-200 rounded-full shadow transition-all"
                                            onClick={() =>
                                                handleRemoveFromFavorites(
                                                    favorite.job._id
                                                )
                                            }
                                            disabled={
                                                removeFromFavorites.isLoading
                                            }
                                            title="Remove from favorites"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
