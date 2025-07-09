import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Wrench, 
  Building, 
  MapPin, 
  Users, 
  Zap, 
  ShieldCheck,
  Settings,
  TrendingUp
} from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Ground Mount Installations",
      description: "Specialized expertise in large-scale ground mount systems with advanced drilling equipment and proven installation techniques.",
      highlights: ["Advanced drilling equipment", "Proven installation methods", "Optimal site preparation"]
    },
    {
      icon: <Building className="h-8 w-8" />,
      title: "Commercial Projects", 
      description: "Comprehensive commercial solar solutions from design to completion, handling complex projects with precision and efficiency.",
      highlights: ["Design to completion", "Complex project management", "Commercial expertise"]
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Partnership Solutions",
      description: "Flexible partnership models allowing solar companies to expand nationwide while we handle expert installation services.",
      highlights: ["Flexible partnerships", "Nationwide expansion", "Expert installation teams"]
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Nationwide Coverage",
      description: "Operating across all 50 states with local knowledge and established processes to ensure successful project delivery.",
      highlights: ["All 50 states", "Local market knowledge", "Established processes"]
    }
  ];

  const coreStrengths = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-secondary" />,
      title: "Experience Since 2006",
      description: "Deep roots in America's solar industry with unmatched expertise and proven track record."
    },
    {
      icon: <Settings className="h-6 w-6 text-secondary" />,
      title: "Specialized Equipment",
      description: "Advanced drilling and installation equipment for complex ground mount projects."
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-secondary" />,
      title: "Proven Growth Partner",
      description: "Helping solar companies succeed nationwide with our installation expertise."
    }
  ];

  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6">
            Our Services
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Comprehensive Solar Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From ground mount installations to nationwide commercial projects, 
            we deliver expert solar solutions across America.
          </p>
        </div>

        {/* Main Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-20">
          {services.map((service, index) => (
            <Card key={index} className="group hover:shadow-elegant transition-all duration-300 border-2 hover:border-secondary/20">
              <CardHeader>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-accent rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">
                    {service.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl mb-4">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <Zap className="h-4 w-4 text-secondary mr-2 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Core Strengths */}
        <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
            Our Core Strengths
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {coreStrengths.map((strength, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary/10 rounded-full mb-4 group-hover:bg-secondary/20 transition-colors">
                  {strength.icon}
                </div>
                <h4 className="text-xl font-semibold mb-3 text-foreground">
                  {strength.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {strength.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;