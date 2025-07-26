import {
    Facebook,
    Twitter,
    Youtube,
    Instagram,
    Linkedin,
    ArrowUp,
} from "lucide-react";

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const footerSections = [
        {
            title: "For Employers",
            links: [
                { text: "Explore Candidates", href: "#" },
                { text: "Job Pricing", href: "#" },
                { text: "Submit Job", href: "#" },
                { text: "Shortlisted", href: "#" },
                { text: "Dashboard", href: "#" },
            ],
        },
        {
            title: "For Candidates",
            links: [
                { text: "Explore All Jobs", href: "#" },
                { text: "Browse Categories", href: "#" },
                { text: "Saved Jobs", href: "#" },
                { text: "Dashboard", href: "#" },
            ],
        },
        {
            title: "About Company",
            links: [
                { text: "Who We'r?", href: "#" },
                { text: "Our Mission", href: "#" },
                { text: "Our team", href: "#" },
                { text: "Packages", href: "#" },
                { text: "Dashboard", href: "#" },
            ],
        },
    ];

    const socialLinks = [
        { href: "#", icon: <Facebook size={20} />, label: "Facebook" },
        { href: "#", icon: <Twitter size={20} />, label: "Twitter" },
        { href: "#", icon: <Youtube size={20} />, label: "Youtube" },
        { href: "#", icon: <Instagram size={20} />, label: "Instagram" },
        { href: "#", icon: <Linkedin size={20} />, label: "LinkedIn" },
    ];

    return (
        <footer className="bg-slate-900 text-slate-400 pt-20 pb-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
                    {/* Column 1: Logo and Contact Info */}
                    <div className="lg:col-span-2 pr-8">
                        <div className="flex items-center mb-6">
                            <img
                                src="/vite.svg"
                                alt="WorkPlex Logo"
                                className="h-12 w-12 mr-3 bg-white rounded-full p-1.5"
                            />
                            <span className="text-3xl font-bold text-white">
                                WorkPlex
                            </span>
                        </div>
                        <p className="text-sm mb-3 leading-relaxed">
                            3298 Grant Street Longview, New Texox, United
                            Kingdom 75601
                        </p>
                        <p className="text-sm mb-3">
                            <a
                                href="tel:1-202-555-0106"
                                className="hover:text-green-400 transition-colors"
                            >
                                1-202-555-0106
                            </a>
                        </p>
                        <p className="text-sm mb-8">
                            <a
                                href="mailto:support@workplex.com"
                                className="hover:text-green-400 transition-colors"
                            >
                                support@workplex.com
                            </a>
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="text-green-500 hover:text-green-400 transition-colors"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic Footer Sections */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h5 className="font-semibold text-white mb-5 text-lg">
                                {section.title}
                            </h5>
                            <ul className="space-y-3 text-sm">
                                {section.links.map((link) => (
                                    <li key={link.text}>
                                        <a
                                            href={link.href}
                                            className="hover:text-green-400 transition-colors"
                                        >
                                            {link.text}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Copyright and Scroll to Top */}
                <div className="border-t border-slate-700 pt-10 text-center text-sm relative">
                    <p>
                        © {new Date().getFullYear()} Workplex. Designed By
                        Themezhub.
                    </p>
                    <button
                        onClick={scrollToTop}
                        className="absolute -top-6 right-0 transform translate-y-1/2 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp size={22} />
                    </button>
                </div>
            </div>
        </footer>
    );
}
