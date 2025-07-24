import { Button } from "@/components/ui/button";
import HeaderJobseeker from "../components/Header/HeaderJobseeker";
import MidLanding1 from "../components/MidLanding/MidLanding1";
import Footer from "../components/Footer/Footer";
import { useAuth } from "../hooks/useAuth";
import HeaderCompany from "../components/Header/HeaderCompany";
// Assuming you have an image for the hero section in your public folder
// For example: /public/hero-image.png
// Replace 'hero-image.png' with the actual path to your image.

export default function LandingPage() {
    const { user } = useAuth();
    return (
        <>
            {user?.role === "JOBSEEKER" ? (
                <HeaderJobseeker />
            ) : (
                <HeaderCompany />
            )}
            <MidLanding1 />
            <Footer />
        </>
    );
}
