import React from "react";
import HeaderJobseeker from "../../components/Header/HeaderJobseeker";
import { MapPin, Globe, Users, Clock, Building2, Flag } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CompanyDetailPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <HeaderJobseeker />

            {/* Hero Section */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Company Logo */}
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 bg-purple-600 rounded-xl flex items-center justify-center">
                                <img
                                    src="/images/eh-logo.svg"
                                    alt="Employment Hero"
                                    className="w-24 h-24"
                                />
                            </div>
                        </div>

                        {/* Company Info */}
                        <div className="flex-grow">
                            <h1 className="text-3xl font-bold mb-4">
                                Employment Hero
                            </h1>
                            <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>Quận 10, TP Hồ Chí Minh</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4" />
                                    <span>
                                        SaaS All-in-one Cloud-based HR Platform
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>1000+ nhân viên</span>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <Button className="bg-green-500 hover:bg-green-600">
                                    Theo dõi công ty
                                </Button>
                                <Button variant="outline">Chia sẻ</Button>
                            </div>
                        </div>

                        {/* Rating Card */}
                        <div className="flex-shrink-0">
                            <Card className="w-[300px]">
                                <CardHeader className="text-center">
                                    <CardTitle className="text-4xl font-bold text-green-500">
                                        4.9
                                    </CardTitle>
                                    <CardDescription>
                                        106 đánh giá
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-2xl font-semibold">
                                        99%
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Khuyến khích làm việc tại đây
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                        <TabsTrigger value="jobs">Việc làm (3)</TabsTrigger>
                        <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview">
                        <Card>
                            <CardHeader>
                                <CardTitle>Giới thiệu công ty</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-700">
                                            Thông tin chung
                                        </h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Mô hình
                                                    </p>
                                                    <p>Sản phẩm</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Lĩnh vực
                                                    </p>
                                                    <p>
                                                        Phần Mềm & Dịch Vụ Web
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Flag className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Quốc gia
                                                    </p>
                                                    <p>Australia</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Giờ làm việc
                                                    </p>
                                                    <p>Thứ 2 - Thứ 6</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold text-gray-700">
                                            Lý do nên gia nhập
                                        </h3>
                                        <ul className="list-disc list-inside space-y-2 text-gray-600">
                                            <li>Remote-first working</li>
                                            <li>
                                                Top-tier remuneration & premium
                                                healthcare package
                                            </li>
                                            <li>
                                                Join one of the fastest-growing
                                                SaaS unicorns
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-700">
                                        Mô tả
                                    </h3>
                                    <p className="text-gray-600">
                                        At Employment Hero, we're an ambitious
                                        bunch of people on a mission to make
                                        employment easier and more valuable for
                                        everyone.
                                    </p>
                                    <p className="text-gray-600">
                                        Since our inception in 2014, we've had
                                        some pretty impressive growth (100%
                                        YoY), reached unicorn status in 2022,
                                        and now serve 400,000 businesses
                                        globally, with 2.9 million+ users on the
                                        platform. We have no plans to slow down.
                                    </p>
                                    <p className="text-gray-600">
                                        There's never been a more exciting time
                                        to join one of the fastest-growing SaaS
                                        unicorns, so let's see if we could be a
                                        match!
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-700">
                                        Phúc lợi
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Card>
                                            <CardContent className="pt-6">
                                                <p className="font-medium">
                                                    Remote First & 100% Salary
                                                    During Probation
                                                </p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="pt-6">
                                                <p className="font-medium">
                                                    20 Annual Leave Days & 1
                                                    Leisure Day
                                                </p>
                                            </CardContent>
                                        </Card>
                                        <Card>
                                            <CardContent className="pt-6">
                                                <p className="font-medium">
                                                    Top-tier Remuneration &
                                                    Premium Healthcare Package
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>

                                {/* Add Location Section */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-700">
                                        Địa điểm
                                    </h3>

                                    {/* Map Container */}
                                    <div className="relative w-full h-[400px] rounded-lg overflow-hidden">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241667490997!2d106.66455067596376!3d10.777838959029449!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752ed23c80767d%3A0x5a981a5efee9fd7d!2zxJAuIEPDoWNoIE3huqFuZyBUaMOhbmcgVMOhbSwgUXXhuq1uIDEwLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmg!5e0!3m2!1svi!2s!4v1711005824659!5m2!1svi!2s"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            allowFullScreen=""
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        ></iframe>
                                    </div>

                                    {/* Address Details */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    Văn phòng chính
                                                </h4>
                                                <p className="text-gray-600 mt-1">
                                                    Cach Mang Thang 8, District
                                                    10, Ho Chi Minh City
                                                </p>
                                                <div className="flex gap-4 mt-3">
                                                    <a
                                                        href="https://maps.google.com/?q=Cach+Mang+Thang+8,+District+10,+Ho+Chi+Minh+City"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                                    >
                                                        <Globe className="w-4 h-4" />
                                                        Chỉ đường
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="jobs">
                        <Card>
                            <CardHeader>
                                <CardTitle>Vị trí đang tuyển</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[
                                        {
                                            title: "Mid/Senior Backend Engineer (Python)",
                                            tags: [
                                                "Python",
                                                "Django",
                                                "English",
                                            ],
                                            location: "TP Hồ Chí Minh",
                                            remote: true,
                                        },
                                        {
                                            title: "Mid/Senior Frontend Engineer (ReactJS)",
                                            tags: [
                                                "ReactJS",
                                                "TypeScript",
                                                "English",
                                            ],
                                            location: "TP Hồ Chí Minh",
                                            remote: true,
                                        },
                                    ].map((job, index) => (
                                        <Card key={index}>
                                            <CardContent className="pt-6">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold mb-2">
                                                            {job.title}
                                                        </h3>
                                                        <div className="flex gap-2 mb-2">
                                                            {job.tags.map(
                                                                (tag, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                                                                    >
                                                                        {tag}
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            <div className="flex items-center gap-1">
                                                                <MapPin className="w-4 h-4" />
                                                                {job.location}
                                                            </div>
                                                            {job.remote && (
                                                                <div className="flex items-center gap-1">
                                                                    <Globe className="w-4 h-4" />
                                                                    Làm từ xa
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Button>
                                                        Ứng tuyển ngay
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="reviews">
                        <Card>
                            <CardHeader>
                                <CardTitle>Đánh giá từ nhân viên</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <p className="text-gray-600">
                                        Chưa có đánh giá nào
                                    </p>
                                    <Button className="mt-4">
                                        Viết đánh giá
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
