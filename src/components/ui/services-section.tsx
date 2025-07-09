import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wrench,
  Building,
  MapPin,
  Users,
  Zap,
  Home,
  RefreshCw,
  Handshake,
  Settings,
  TrendingUp,
} from "lucide-react";

const ServicesSection = () => {
  const services = [
    {
      icon: <Home className="h-8 w-8" />,
      title: "Residential Solar",
      description:
        "Expert installation of residential solar systems on all roof types, designed to maximize energy savings for Florida homeowners.",
      highlights: [
        "Custom system design",
        "All roof types",
        "Energy savings",
      ],
    },
    {
      icon: <Building className="h-8 w-8" />,
      title: "Commercial Solar",
      description:
        "Specialized commercial installations, including rooftop and ground mount systems, leveraging our heavy equipment and expertise.",
      highlights: [
        "Rooftop & ground mount",
        "Heavy equipment",
        "Commercial expertise",
      ],
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Ground Mount Systems",
      description:
        "Our specialty. We utilize advanced drilling equipment and techniques for optimal stability and performance in Florida's terrain.",
      highlights: [
        "Advanced drilling",
        "Optimal stability",
        "Florida terrain expertise",
      ],
    },
    {
      icon: <RefreshCw className="h-8 w-8" />,
      title: "Detach & Reset",
      description:
        "Professional solar panel removal and reinstallation services to accommodate roof repairs or replacements.",
      highlights: [
        "Safe removal",
        "Expert reinstallation",
        "Warranty protection",
      ],
    },
  ];

  const coreStrengths = [
    {
      icon: <Settings className="h-6 w-6 text-secondary" />,
      title: "Specialized Equipment",
      description:
        "Advanced equipment for drilling and ground mount installations enables us to tackle complex commercial projects efficiently and safely.",
    },
    {
      icon: <MapPin className="h-6 w-6 text-secondary" />,
      title: "Local Market Knowledge",
      description:
        "We expertly navigate Florida's unique regulations, permitting, and utility requirements, streamlining the process for our partners.",
    },
    {
      icon: <Handshake className="h-6 w-6 text-secondary" />,
      title: "Partnership Focused",
      description:
        "Our flexible model allows partners to leverage our installation expertise while focusing on sales and customer acquisition.",
    },
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
            Comprehensive Solar Solutions for Florida
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            SunEdge Power offers comprehensive solar installation and related services for residential and commercial projects. With our specialized equipment and extensive experience since 2006, we provide high-quality, reliable solutions.
          </p>
        </div>

        {/* Main Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-20">
          {services.map((service, index) => (
            <Card
              key={index}
              className="group hover:shadow-elegant transition-all duration-300 border-2 hover:border-secondary/20"
            >
              <CardHeader>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-accent rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">{service.icon}</div>
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
