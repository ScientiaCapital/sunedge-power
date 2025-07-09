import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background with solar panel texture */}
      <div className="absolute inset-0 bg-gradient-hero">
        <div className="absolute inset-0 bg-black/40"></div>
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Hero Badge */}
          <div className="inline-flex items-center bg-secondary/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8 border border-secondary/30">
            <Zap className="h-5 w-5 text-secondary mr-2" />
            <span className="text-sm font-medium">
              Florida Solar Experts Since 2006
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            SunEdge Power
            <span className="bg-gradient-stats bg-clip-text text-transparent block">
              Leading Florida's Solar Industry
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Licensed, bonded, and insured Class "A" General Contractor. Decades of experience, specialized equipment, and unmatched expertise in residential and commercial solar installations across Florida.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-4 rounded-full shadow-glow hover:shadow-xl transition-all duration-300"
            >
              Explore Partnership Opportunities
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 rounded-full border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
            >
              Request a Free Consultation
            </Button>
          </div>

          {/* Mascot Integration */}
          <div className="mt-12 flex justify-center">
            <div className="relative">
              <img
                src="/lovable-uploads/33804a65-aead-4a38-bfd0-69852f8761a7.png"
                alt="Sunny - SunEdge Power Mascot"
                className="h-32 w-auto drop-shadow-2xl"
              />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-secondary/20 backdrop-blur-sm rounded-full px-4 py-2 border border-secondary/30">
                <span className="text-sm font-medium text-white">
                  Meet Sunny!
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-secondary rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
