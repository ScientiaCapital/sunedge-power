import { Zap, Building, MapPin, Award, Wrench, Users } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: <Zap className="h-8 w-8" />,
      value: '500MW+',
      label: 'Solar Installed',
      description: 'Powering businesses nationwide',
    },
    {
      icon: <Building className="h-8 w-8" />,
      value: '1,000+',
      label: 'Commercial Projects',
      description: 'From 100kW to multi-MW systems',
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      value: '12 States',
      label: 'Nationwide Coverage',
      description: 'Licensed across America',
    },
    {
      icon: <Award className="h-8 w-8" />,
      value: '18+ Years',
      label: 'Industry Experience',
      description: 'Trusted since 2006',
    },
  ];

  return (
    <section className="relative py-20 bg-gradient-stats overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center text-white transform hover:scale-105 transition-transform duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4 border border-white/30">
                {stat.icon}
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-xl font-semibold mb-2">{stat.label}</div>
              <div className="text-white/80 text-sm">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-20 h-20 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 border border-white/20 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 border border-white/20 rounded-full"></div>
      </div>
    </section>
  );
};

export default StatsSection;
