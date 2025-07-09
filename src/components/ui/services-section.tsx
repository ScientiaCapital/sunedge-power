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
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import React from 'react';

const ServicesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const services = [
    {
      icon: <Building />,
      title: 'Commercial & Industrial Solar',
      description:
        'Large-scale installations for businesses, warehouses, and manufacturing facilities. We handle projects from 100kW to multi-megawatt systems nationwide.',
      highlights: ['100kW to MW+ systems', 'Turnkey installation', 'Maximum ROI focus'],
    },
    {
      icon: <Home />,
      title: 'Multi-Family & Apartments',
      description:
        'Specialized solar solutions for apartment complexes and multi-family properties. Reduce operating costs and increase property value.',
      highlights: ['Apartment complexes', 'Property value increase', 'Tenant savings programs'],
    },
    {
      icon: <MapPin />,
      title: 'Solar Farms & Ground Mounts',
      description:
        'Utility-scale solar farms and ground mount systems. Our heavy equipment and expertise handle projects across multiple states.',
      highlights: ['Utility-scale projects', 'Multi-state operations', 'Specialized equipment'],
    },
    {
      icon: <TrendingUp />,
      title: 'Amusement Parks & Venues',
      description:
        'Custom solar solutions for theme parks, stadiums, and large venues. We understand the unique power demands of entertainment facilities.',
      highlights: ['High-demand facilities', 'Custom engineering', 'Minimal disruption install'],
    },
  ];

  const coreStrengths = [
    {
      icon: <Settings />,
      title: 'Heavy Equipment Fleet',
      description:
        'Our specialized drilling rigs and ground mount equipment handle the largest commercial projects efficiently, from solar farms to industrial installations.',
    },
    {
      icon: <MapPin />,
      title: 'Multi-State Operations',
      description:
        'Licensed and operating across multiple states, we navigate complex regulations and utility requirements nationwide from our Florida headquarters.',
    },
    {
      icon: <Handshake />,
      title: 'Turnkey Solutions',
      description:
        'From engineering to installation, we deliver complete solar solutions that maximize ROI for commercial property owners and businesses.',
    },
  ];

  return (
    <section ref={ref} id="services" className="py-20 bg-gray-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isInView ? 0.05 : 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255, 193, 7, 0.15) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.9 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-block bg-solar-500/20 text-solar-400 px-6 py-3 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-solar-500/30"
          >
            Our Services
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
          >
            Commercial Solar Solutions
            <span className="block bg-gradient-to-r from-solar-400 to-solar-600 bg-clip-text text-transparent">
              Nationwide Coverage
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            From apartment complexes to amusement parks, we deliver turnkey solar solutions that
            maximize ROI. Our specialized equipment and expertise handle projects of any scale.
          </motion.p>
        </motion.div>

        {/* Main Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-20">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <Card className="group h-full bg-gray-900/80 border-gray-800 hover:border-solar-500/50 transition-all duration-300 backdrop-blur-sm shadow-tesla hover:shadow-tesla-hover">
                <CardHeader>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-solar-500 to-solar-600 rounded-2xl mb-4 shadow-lg"
                  >
                    <div className="text-white">
                      {React.cloneElement(service.icon, {
                        className: 'h-8 w-8',
                      })}
                    </div>
                  </motion.div>
                  <CardTitle className="text-2xl mb-4 text-white">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-2">
                    {service.highlights.map((highlight, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
                        transition={{ duration: 0.4, delay: 0.6 + idx * 0.05 }}
                        className="flex items-center text-sm text-gray-300 group"
                      >
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 360 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Zap className="h-4 w-4 text-solar-400 mr-2 flex-shrink-0" />
                        </motion.div>
                        <span className="group-hover:text-solar-400 transition-colors">
                          {highlight}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Core Strengths */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="relative"
        >
          <div className="bg-black/50 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-gray-800">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-3xl font-bold text-center mb-12 text-white"
            >
              Why Choose
              <span className="text-solar-400"> SunEdge Power</span>
            </motion.h3>
            <div className="grid md:grid-cols-3 gap-8">
              {coreStrengths.map((strength, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="text-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="inline-flex items-center justify-center w-12 h-12 bg-solar-500/20 rounded-full mb-4 group-hover:bg-solar-500/30 transition-colors border border-solar-500/30"
                  >
                    {React.cloneElement(strength.icon, {
                      className: 'h-6 w-6 text-solar-400',
                    })}
                  </motion.div>
                  <h4 className="text-xl font-semibold mb-3 text-white group-hover:text-solar-400 transition-colors">
                    {strength.title}
                  </h4>
                  <p className="text-gray-400 leading-relaxed">{strength.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
