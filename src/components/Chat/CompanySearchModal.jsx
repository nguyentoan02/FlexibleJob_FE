import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Building, MessageCircle } from "lucide-react";
import {
    useSearchEmployers,
    useGetAllEmployers,
    useCreateChatWithCompany,
} from "@/hooks/useChat";
import { useDebounce } from "@/hooks/useDebounce";

const CompanySearchModal = ({ isOpen, onClose, onChatCreated }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const { data: searchResults } = useSearchEmployers(debouncedSearchTerm);
    const { data: allEmployers, isLoading } = useGetAllEmployers();
    const createChatMutation = useCreateChatWithCompany();

    const companies = searchTerm
        ? searchResults?.payload || []
        : allEmployers?.payload || [];

    const handleStartChat = async (companyId) => {
        try {
            const result = await createChatMutation.mutateAsync(companyId);
            if (result.payload?._id) {
                onChatCreated(result.payload._id);
            }
        } catch (error) {
            console.error("Failed to create chat:", error);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Start a Conversation
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Search companies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Companies List */}
                    <ScrollArea className="h-96">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : companies.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Building className="mx-auto h-12 w-12 mb-3 text-gray-300" />
                                <p>No companies found</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {companies.map((company) => (
                                    <div
                                        key={company._id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <Avatar className="h-12 w-12">
                                                <AvatarImage
                                                    src={company.imageUrl}
                                                    alt={company.companyName}
                                                />
                                                <AvatarFallback>
                                                    <Building className="h-6 w-6" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-sm truncate">
                                                    {company.companyName}
                                                </h3>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {company.companyDescription}
                                                </p>
                                                {company.location && (
                                                    <div className="flex items-center gap-1 mt-1">
                                                        <MapPin className="h-3 w-3 text-gray-400" />
                                                        <span className="text-xs text-gray-500">
                                                            {company.location}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs"
                                                    >
                                                        Employer
                                                    </Badge>
                                                    {company.user && (
                                                        <span className="text-xs text-gray-500">
                                                            {
                                                                company.user
                                                                    .firstName
                                                            }{" "}
                                                            {
                                                                company.user
                                                                    .lastName
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                handleStartChat(company._id)
                                            }
                                            disabled={
                                                createChatMutation.isLoading
                                            }
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            {createChatMutation.isLoading
                                                ? "Starting..."
                                                : "Chat"}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CompanySearchModal;
