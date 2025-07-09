import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Wrench, MapPin, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: CheckCircle,
      text: 'Licensed & Insured in Multiple States',
    },
    {
      icon: Wrench,
      text: 'Specialized Equipment for Large-Scale Projects',
    },
    {
      icon: MapPin,
      text: 'Nationwide Coverage from Florida HQ',
    },
    {
      icon: Users,
      text: 'Trusted by Major Commercial Clients',
    },
  ];

  return (
    <section ref={ref} id="about" className="py-20 bg-black relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

      {/* Animated mesh pattern */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 0.1 : 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-tesla-mesh"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -50 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-block bg-solar-500/20 text-solar-400 px-6 py-3 rounded-full text-sm font-medium mb-6 backdrop-blur-sm border border-solar-500/30"
            >
              Our Story
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold mb-6 text-white"
            >
              Nationwide Leader in
              <span className="block bg-gradient-to-r from-solar-400 to-solar-600 bg-clip-text text-transparent">
                Commercial Solar
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-gray-300 mb-8 leading-relaxed"
            >
              From our Florida headquarters, we've expanded to serve clients across America. Our
              expertise spans massive commercial installations, multi-family housing complexes,
              industrial facilities, and utility-scale solar farms in multiple states.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-gray-300 mb-8 leading-relaxed"
            >
              We're not just installers - we're your complete solar partner. With specialized
              equipment for ground mounts and the experience to handle projects of any size, we
              deliver reliable solar solutions that maximize ROI for businesses and property owners
              nationwide.
            </motion.p>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isInView ? 1 : 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="flex items-center space-x-3 group"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="transition-transform"
                    >
                      <Icon className="h-6 w-6 text-solar-400" />
                    </motion.div>
                    <span className="text-white font-medium group-hover:text-solar-400 transition-colors">
                      {feature.text}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="rounded-full bg-solar-500 hover:bg-solar-600 text-white px-8 py-6 text-lg shadow-tesla tesla-hover"
              >
                Discuss Your Project
              </Button>
            </motion.div>
          </motion.div>

          {/* Image & Stats Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Main Image with Sunny */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="relative"
            >
              <Card className="relative overflow-hidden shadow-tesla bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <div className="aspect-[4/3] bg-gradient-to-br from-solar-500/20 to-solar-600/20 p-8 flex items-center justify-center">
                  <motion.img
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    src="/lovable-uploads/33804a65-aead-4a38-bfd0-69852f8761a7.png"
                    alt="SunEdge Power Team with Sunny"
                    className="h-full w-auto object-contain drop-shadow-2xl"
                  />
                </div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-md rounded-lg p-4 border border-solar-500/30"
                >
                  <p className="text-sm font-medium text-white">
                    Powering commercial properties and solar farms across America.
                  </p>
                </motion.div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
