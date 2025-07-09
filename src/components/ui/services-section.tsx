import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
} from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: <Building className="h-8 w-8" />,
      title: 'Commercial & Industrial Solar',
      description:
        'Large-scale installations for businesses, warehouses, and manufacturing facilities. We handle projects from 100kW to multi-megawatt systems nationwide.',
      highlights: ['100kW to MW+ systems', 'Turnkey installation', 'Maximum ROI focus'],
    },
    {
      icon: <Home className="h-8 w-8" />,
      title: 'Multi-Family & Apartments',
      description:
        'Specialized solar solutions for apartment complexes and multi-family properties. Reduce operating costs and increase property value.',
      highlights: ['Apartment complexes', 'Property value increase', 'Tenant savings programs'],
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: 'Solar Farms & Ground Mounts',
      description:
        'Utility-scale solar farms and ground mount systems. Our heavy equipment and expertise handle projects across multiple states.',
      highlights: ['Utility-scale projects', 'Multi-state operations', 'Specialized equipment'],
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: 'Amusement Parks & Venues',
      description:
        'Custom solar solutions for theme parks, stadiums, and large venues. We understand the unique power demands of entertainment facilities.',
      highlights: ['High-demand facilities', 'Custom engineering', 'Minimal disruption install'],
    },
  ];

  const coreStrengths = [
    {
      icon: <Settings className="h-6 w-6 text-secondary" />,
      title: 'Heavy Equipment Fleet',
      description:
        'Our specialized drilling rigs and ground mount equipment handle the largest commercial projects efficiently, from solar farms to industrial installations.',
    },
    {
      icon: <MapPin className="h-6 w-6 text-secondary" />,
      title: 'Multi-State Operations',
      description:
        'Licensed and operating across multiple states, we navigate complex regulations and utility requirements nationwide from our Florida headquarters.',
    },
    {
      icon: <Handshake className="h-6 w-6 text-secondary" />,
      title: 'Turnkey Solutions',
      description:
        'From engineering to installation, we deliver complete solar solutions that maximize ROI for commercial property owners and businesses.',
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
            Solar Solutions That Save You Money
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you're a homeowner looking to cut energy costs or a business wanting to go
            green, we make solar simple. Our expert team handles everything from start to finish.
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
                <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
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
                <h4 className="text-xl font-semibold mb-3 text-foreground">{strength.title}</h4>
                <p className="text-muted-foreground leading-relaxed">{strength.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
