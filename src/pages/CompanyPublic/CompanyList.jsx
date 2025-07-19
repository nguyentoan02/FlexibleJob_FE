import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Building, MapPin, Users, ArrowRight } from "lucide-react";

export default function CompanyList() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/company/public`)
            .then((res) => res.json())
            .then((data) => {
                setCompanies(data.payload || []);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto py-16 px-4">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Discover Amazing Companies
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Explore opportunities with top companies across various
                        industries
                    </p>
                </div>

                {/* Companies Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {companies.map((company) => (
                        <Card
                            key={company._id}
                            className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 rounded-3xl overflow-hidden hover:-translate-y-2"
                        >
                            <Link to={`/company-public/${company._id}`}>
                                {/* Company Image */}
                                <div className="relative overflow-hidden h-56 bg-gray-100">
                                    <img
                                        src={company.imageUrl || "/image.png"}
                                        alt={company.companyName}
                                        className="w-full h-full object-contain object-center group-hover:scale-110 transition-transform duration-700 bg-white"
                                        style={{
                                            objectFit: "contain",
                                            objectPosition: "center",
                                        }}
                                        onError={(e) => {
                                            e.target.src = "/image.png";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                    {/* Job Count Badge */}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-indigo-600 font-semibold px-3 py-1 rounded-full text-sm shadow-lg">
                                        {company.jobCount}{" "}
                                        {company.jobCount === 1
                                            ? "position"
                                            : "positions"}
                                    </div>
                                </div>

                                <CardContent className="p-8">
                                    {/* Company Name */}
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">
                                        {company.companyName}
                                    </h2>

                                    {/* Company Details */}
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center text-gray-600">
                                            <Building className="mr-3 h-5 w-5 text-indigo-500" />
                                            <span className="font-medium">
                                                {company.industry}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <MapPin className="mr-3 h-5 w-5 text-emerald-500" />
                                            <span>{company.location}</span>
                                        </div>
                                        {company.companySize && (
                                            <div className="flex items-center text-gray-600">
                                                <Users className="mr-3 h-5 w-5 text-purple-500" />
                                                <span>
                                                    {company.companySize}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* View Details Button */}
                                    <Button
                                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                                        variant="default"
                                    >
                                        <span className="flex items-center justify-center">
                                            View Details
                                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </Button>
                                </CardContent>
                            </Link>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {companies.length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <Building className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No companies found
                        </h3>
                        <p className="text-gray-600">
                            Check back later for new opportunities
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
