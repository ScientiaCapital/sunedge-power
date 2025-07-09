import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Users, Wrench, MapPin } from "lucide-react";

const AboutSection = () => {
  const features = [
    {
      icon: <CheckCircle className="h-6 w-6 text-secondary" />,
      text: "Licensed & Insured Nationwide"
    },
    {
      icon: <Users className="h-6 w-6 text-secondary" />,
      text: "Experienced Installation Teams"
    },
    {
      icon: <Wrench className="h-6 w-6 text-secondary" />,
      text: "Specialized Ground Mount Expertise"
    },
    {
      icon: <MapPin className="h-6 w-6 text-secondary" />,
      text: "All 50 States Coverage"
    }
  ];

  const quickStats = [
    { label: "Since 2006", value: "Solar Experience" },
    { label: "50 States", value: "Nationwide Coverage" },
    { label: "Class A", value: "Licensed Contractor" }
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div>
            <div className="inline-block bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
              About SunEdge Power
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              America's Solar Experts Since 2006
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              SunEdge Power has been a leader in America's solar industry since 2006. As a licensed, bonded, 
              and insured contractor operating nationwide, we bring decades of combined construction and solar 
              installation experience to every project across all 50 states.
            </p>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              What sets us apart is our early adoption of solar technology and our continued investment in 
              specialized equipment for drilling and ground mount installations. This, combined with our 
              deep understanding of diverse regional markets, allows us to handle complex residential and 
              commercial projects with unmatched expertise.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  {feature.icon}
                  <span className="text-foreground font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            <Button size="lg" className="rounded-full">
              Learn More About Our Team
            </Button>
          </div>

          {/* Image & Stats Side */}
          <div className="space-y-8">
            {/* Main Image with Sunny */}
            <Card className="relative overflow-hidden shadow-elegant">
              <div className="aspect-[4/3] bg-gradient-accent p-8 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/33804a65-aead-4a38-bfd0-69852f8761a7.png" 
                  alt="SunEdge Power Team with Sunny" 
                  className="h-full w-auto object-contain drop-shadow-2xl"
                />
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-4">
                <p className="text-sm font-medium text-foreground">
                  Our expert installation teams are ready to power your solar project nationwide
                </p>
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              {quickStats.map((stat, index) => (
                <Card key={index} className="p-4 text-center hover:shadow-md transition-shadow">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.value}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;