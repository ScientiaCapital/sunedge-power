import Navigation from "@/components/ui/navigation";
import HeroSection from "@/components/ui/hero-section";
import StatsSection from "@/components/ui/stats-section";
import AboutSection from "@/components/ui/about-section";
import ServicesSection from "@/components/ui/services-section";
import ContactSection from "@/components/ui/contact-section";
import Footer from "@/components/ui/footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
