import Hero from "../components/dashboard/Hero";
// import Navigation from "@/components/dashboard/Navigation";
import Features from "../components/dashboard/Features";
import Gallery from "@/components/dashboard/Gallery";
import VideoSection from "@/components/dashboard/VideoSection";
import About from "@/components/dashboard/About";
import CTA from "../components/dashboard/CTA";
import Footer from "../components/dashboard/Footer";


const Dashboard = () => {
    return(
        <>
        {/* <Navigation /> */}
        <Hero />
        <Features />
        <Gallery />
        <VideoSection />
        <About />
        <CTA />
        <Footer />
        </>
    )
}

export default Dashboard;