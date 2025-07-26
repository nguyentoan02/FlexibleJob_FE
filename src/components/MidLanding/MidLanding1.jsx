import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ChevronLeft, ChevronRight } from "lucide-react"; // Import Star, ChevronLeft, ChevronRight icons

export default function MidLanding1() {
    return (
        <div className="bg-slate-50">
            {" "}
            {/* Removed min-h-screen to allow content to define height */}
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="flex flex-col md:flex-row items-center">
                    {/* Text Content */}
                    <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
                        <h2 className="text-4xl font-bold text-green-500 mb-4">
                            Workplex
                        </h2>
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6">
                            Create A{" "}
                            <span className="text-green-500">
                                Job finder Recruiters|
                            </span>
                        </h1>
                        <p className="text-lg text-slate-600 mb-8">
                            Start working with{" "}
                            <span className="font-semibold text-green-500">
                                Workplex
                            </span>{" "}
                            that can provide everything you need to create high
                            quality of Job Board Website.
                        </p>
                        <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 text-lg rounded-lg">
                            View Demos
                        </Button>
                    </div>

                    {/* Image Section */}
                    <div className="md:w-1/2 flex justify-center md:justify-end relative overflow-hidden">
                        {/* Updated green blur effect for a softer, fainter glow */}
                        <div className="absolute inset-0 bg-green-200 opacity-50 blur-[100px] transform scale-110 -translate-x-8 translate-y-8 md:-translate-x-12 md:translate-y-12"></div>
                        <img
                            src="/image.png" // Replace with your actual image path
                            alt="Person using laptop"
                            className="rounded-lg shadow-2xl max-w-md w-full z-10"
                        />
                    </div>
                </div>
            </div>
            {/* New "About Us" Section */}
            <div className="bg-white py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Text Content for About Us */}
                        <div className="lg:w-1/2 text-slate-700">
                            <span className="inline-block bg-green-100 text-green-600 text-sm font-semibold px-3 py-1 rounded-md mb-4">
                                About Us
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-6">
                                Create and Build Your Attractive Profile
                            </h2>
                            <p className="mb-4 text-slate-600">
                                Sed ut perspiciatis unde omnis iste natus error
                                sit voluptatem accusantium doloremque
                                laudantium, totam rem aperiam, eaque ipsa quae
                                ab illo inventore veritatis et quasi architecto
                                beatae vitae dicta sunt explicabo.
                            </p>
                            <p className="mb-8 text-slate-600">
                                At vero eos et accusamus et iusto odio
                                dignissimos ducimus qui blanditiis deleniti
                                atque corrupti quos dolores et quas molestias
                                excepturi sint occaecati cupiditate non
                                provident, similique sunt in culpa qui officia
                                deserunt mollitia animi, id est laborum et
                                dolorum fuga. Et harum quidem rerum facilis est
                                et expedita distinctio.
                            </p>
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-green-500">
                                        10k+
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Active Jobs
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-green-500">
                                        12k+
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Web Designers
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-3xl font-bold text-green-500">
                                        07k+
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Employers
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                className="bg-green-50 hover:bg-green-100 text-green-600 border-green-200 px-6 py-3 text-md rounded-lg"
                            >
                                See Details{" "}
                                <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </div>

                        {/* Image Section for About Us */}
                        <div className="lg:w-1/2 flex justify-center">
                            <img
                                src="/image1.png" // Replace with your actual image path for this section
                                alt="Woman on phone"
                                className="rounded-lg shadow-xl max-w-lg w-full object-cover h-[500px]" // Adjust height as needed
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* New "Success Stories" Section */}
            <div className="bg-slate-50 py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
                            Have A Look Our Success Stories
                        </h2>
                        <p className="text-slate-600 text-lg">
                            Jobest have changed thousands life!
                        </p>
                    </div>

                    <div className="relative">
                        {/* Testimonial Cards - For a real carousel, you'd map over data here and use a library */}
                        <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 scrollbar-hide">
                            {/* Testimonial Card 1 */}
                            <div className="snap-center shrink-0 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] bg-white p-6 md:p-8 rounded-xl shadow-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center">
                                        <Star
                                            className="text-green-500 fill-green-500 mr-2"
                                            size={24}
                                        />
                                        <span className="font-semibold text-slate-700 text-lg">
                                            Trustpilot
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-slate-700 font-semibold mr-1">
                                            5.0
                                        </span>
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="text-green-500 fill-green-500"
                                                size={16}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-slate-600 mb-6 leading-relaxed">
                                    "Lorem ipsum dolor sit amet consectetur.
                                    Felis diam vestibulum massa tincidunt sit
                                    pharetra. Dolor viverra justo massa
                                    facilisis tortor aliquet. Mauris neque dis
                                    et molestie. Elit et adipiscing feugiat
                                    adipiscing odio."
                                </p>
                                <div>
                                    <p className="font-semibold text-slate-800">
                                        Jenny Angela,
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        CEO at Medizo
                                    </p>
                                </div>
                            </div>

                            {/* Testimonial Card 2 */}
                            <div className="snap-center shrink-0 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] bg-white p-6 md:p-8 rounded-xl shadow-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center">
                                        <Star
                                            className="text-green-500 fill-green-500 mr-2"
                                            size={24}
                                        />
                                        <span className="font-semibold text-slate-700 text-lg">
                                            Trustpilot
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-slate-700 font-semibold mr-1">
                                            5.0
                                        </span>
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="text-green-500 fill-green-500"
                                                size={16}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-slate-600 mb-6 leading-relaxed">
                                    "When you want to create a business bigger
                                    than yourself, you need a lot of help. Thats
                                    what Jobest does for you tremendously."
                                </p>
                                <div>
                                    <p className="font-semibold text-slate-800">
                                        John Watson,
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Accounts Manager at Bistro IT
                                    </p>
                                </div>
                            </div>

                            {/* Add more cards as needed, or generate them from an array of data */}
                            {/* Testimonial Card 3 (Example) */}
                            <div className="snap-center shrink-0 w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] bg-white p-6 md:p-8 rounded-xl shadow-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center">
                                        <Star
                                            className="text-green-500 fill-green-500 mr-2"
                                            size={24}
                                        />
                                        <span className="font-semibold text-slate-700 text-lg">
                                            Trustpilot
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-slate-700 font-semibold mr-1">
                                            4.8
                                        </span>
                                        {[...Array(4)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="text-green-500 fill-green-500"
                                                size={16}
                                            />
                                        ))}
                                        <Star
                                            className="text-slate-300 fill-slate-300"
                                            size={16}
                                        />{" "}
                                        {/* Empty star example */}
                                    </div>
                                </div>
                                <p className="text-slate-600 mb-6 leading-relaxed">
                                    "A fantastic platform that connected us with
                                    amazing talent. Highly recommended for any
                                    growing business!"
                                </p>
                                <div>
                                    <p className="font-semibold text-slate-800">
                                        Alice Wonderland,
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        HR Director at Tech Solutions
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Arrows (Placeholder for actual carousel controls) */}
                        <button className="absolute top-1/2 -translate-y-1/2 left-0 md:-left-4 bg-white p-2 rounded-full shadow-md hover:bg-slate-100 transition-colors z-10">
                            <ChevronLeft size={24} className="text-slate-600" />
                        </button>
                        <button className="absolute top-1/2 -translate-y-1/2 right-0 md:-right-4 bg-white p-2 rounded-full shadow-md hover:bg-slate-100 transition-colors z-10">
                            <ChevronRight
                                size={24}
                                className="text-slate-600"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
