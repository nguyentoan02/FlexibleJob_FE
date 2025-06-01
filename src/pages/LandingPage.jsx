import { Button } from "@/components/ui/button";
import HeaderJobseeker from "../components/Header/HeaderJobseeker";
import MidLanding1 from "../components/MidLanding/MidLanding1";
import Footer from "../components/Footer/Footer";
// Assuming you have an image for the hero section in your public folder
// For example: /public/hero-image.png
// Replace 'hero-image.png' with the actual path to your image.

export default function LandingPage() {
    return (
        <>
            <HeaderJobseeker />
            <MidLanding1 />
            <Footer />
        </>
    );
}
