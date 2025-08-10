
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhyChooseUsSection from "@/components/WhyChooseUsSection";
import FeaturesSection from "@/components/FeaturesSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import GoToTop from "@/components/GoToTop";
import ParallaxBackground from "@/components/ParallaxBackground";


const Index = () => {
  return (
    <div className="min-h-screen animated-gradient relative">
      <ParallaxBackground>
        <div className="pointer-events-none fixed inset-0 z-0" />
      </ParallaxBackground>
      <div className="relative z-10">
        <Navbar />
        <Reveal y={32}><HeroSection /></Reveal>
        <Reveal y={24} delay={0.05}><WhyChooseUsSection /></Reveal>
        <Reveal y={24} delay={0.1}><FeaturesSection /></Reveal>
        <Reveal y={24} delay={0.15}><CaseStudiesSection /></Reveal>
        <Reveal y={24} delay={0.2}><TestimonialsSection /></Reveal>
        <Reveal y={24} delay={0.25}><CTASection /></Reveal>
        <Footer />
        <GoToTop />
      </div>
    </div>
  );
};

export default Index;
