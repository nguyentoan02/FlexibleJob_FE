import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
    Building,
    MapPin,
    Users,
    ArrowRight,
    Search,
    Filter,
} from "lucide-react";
import HeaderJobseeker from "@/components/Header/HeaderJobseeker";

export default function CompanyList() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCompanies, setFilteredCompanies] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/company/public`)
            .then((res) => res.json())
            .then((data) => {
                setCompanies(data.payload || []);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (searchTerm) {
            const results = companies.filter((company) =>
                company.companyName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
            setFilteredCompanies(results);
        } else {
            setFilteredCompanies(companies);
        }
    }, [searchTerm, companies]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <>
            <HeaderJobseeker />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="container mx-auto py-16 px-4">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                            Explore Top Companies
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                            Find the perfect company to match your career
                            aspirations. Discover opportunities with leading
                            organizations across various industries.
                        </p>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div className="relative w-full md:w-1/2">
                            <input
                                type="text"
                                placeholder="Search by company name..."
                                className="w-full px-4 py-3 pl-12 rounded-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            <Filter className="h-5 w-5" />
                            Filter Options
                        </Button>
                    </div>

                    {/* Companies Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCompanies.map((company) => (
                            <Card
                                key={company._id}
                                className="group bg-white/95 backdrop-blur-sm border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden"
                            >
                                <Link to={`/company-public/${company._id}`}>
                                    {/* Company Image */}
                                    <div className="relative overflow-hidden h-56 bg-gray-100">
                                        <img
                                            src={
                                                company.imageUrl || "/image.png"
                                            }
                                            alt={company.companyName}
                                            className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 bg-white"
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
                                        <div className="absolute top-4 right-4 bg-indigo-500 text-white font-semibold px-3 py-1 rounded-full text-sm shadow-md">
                                            {company.jobCount}{" "}
                                            {company.jobCount === 1
                                                ? "position"
                                                : "positions"}
                                        </div>
                                    </div>

                                    <CardContent className="p-6">
                                        {/* Company Name */}
                                        <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300">
                                            {company.companyName}
                                        </h2>

                                        {/* Company Details */}
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-gray-600">
                                                <Building className="mr-2 h-4 w-4 text-indigo-500" />
                                                <span className="text-sm font-medium">
                                                    {company.industry}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <MapPin className="mr-2 h-4 w-4 text-emerald-500" />
                                                <span className="text-sm font-medium">
                                                    {company.location}
                                                </span>
                                            </div>
                                            {company.companySize && (
                                                <div className="flex items-center text-gray-600">
                                                    <Users className="mr-2 h-4 w-4 text-purple-500" />
                                                    <span className="text-sm font-medium">
                                                        {company.companySize}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* View Details Button */}
                                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-full shadow-sm hover:shadow-md transition-all duration-200">
                                            <span className="flex items-center justify-center">
                                                View Details
                                                <ArrowRight className="ml-2 h-4 w-4 transition-transform" />
                                            </span>
                                        </Button>
                                    </CardContent>
                                </Link>
                            </Card>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredCompanies.length === 0 && (
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
        </>
    );
}
