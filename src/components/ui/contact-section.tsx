import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const ContactSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Call Us',
      content: '1-888-SUN-EDGE',
      subtitle: 'Mon-Fri 8AM-6PM EST',
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email Us',
      content: 'info@sunedgepower.com',
      subtitle: '24/7 Response Team',
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Service Area',
      content: 'Nationwide Coverage',
      subtitle: '12 States & Growing',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section id="contact" className="py-20 bg-black relative overflow-hidden" ref={sectionRef}>
      {/* Animated background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-solar-900/20 via-black to-solar-900/20"></div>
        <div className="absolute inset-0 bg-tesla-mesh opacity-5"></div>
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at center, rgba(255, 193, 7, 0.1) 0%, transparent 70%)',
            backgroundSize: '200% 200%',
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block bg-solar-500/10 text-solar-400 px-6 py-3 rounded-full text-sm font-medium mb-6 border border-solar-500/20 backdrop-blur-sm"
          >
            Get In Touch
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white"
          >
            Let's Power Your Next Solar Project
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-gray-400 max-w-3xl mx-auto"
          >
            From apartment complexes to amusement parks, we deliver commercial solar solutions
            nationwide. Get expert installation for projects of any size.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800 hover:border-solar-500/50 transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-solar-500/0 to-solar-600/0 group-hover:from-solar-500/5 group-hover:to-solar-600/5 transition-all duration-500"></div>
                    <div className="flex items-start space-x-4 relative z-10">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="flex-shrink-0 w-12 h-12 bg-solar-500/10 rounded-full flex items-center justify-center border border-solar-500/20 group-hover:bg-solar-500/20 transition-all duration-300"
                      >
                        <div className="text-solar-400">{info.icon}</div>
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1 text-white">{info.title}</h3>
                        <p className="text-solar-400 font-medium">{info.content}</p>
                        <p className="text-gray-500 text-sm">{info.subtitle}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Sunny Mascot */}
            <motion.div variants={itemVariants} className="text-center mt-8">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <motion.img
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  src="/lovable-uploads/33804a65-aead-4a38-bfd0-69852f8761a7.png"
                  alt="Sunny says hello"
                  className="h-32 w-auto mx-auto drop-shadow-2xl"
                />
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.5 }}
                className="text-gray-400 text-sm mt-4"
              >
                Sunny powers commercial projects across America!
              </motion.p>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className="lg:col-span-2"
          >
            <Card className="bg-gray-900/50 backdrop-blur-sm border-gray-800 hover:border-solar-500/50 transition-all duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-solar-500/0 to-solar-600/0 hover:from-solar-500/5 hover:to-solar-600/5 transition-all duration-500"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-2xl text-white flex items-center">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="mr-3"
                  >
                    <MessageSquare className="h-6 w-6 text-solar-400" />
                  </motion.div>
                  Start Your Commercial Solar Project
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div className="grid md:grid-cols-2 gap-4">
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      First Name *
                    </label>
                    <Input
                      placeholder="John"
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-solar-500 transition-colors"
                    />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Last Name *
                    </label>
                    <Input
                      placeholder="Doe"
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-solar-500 transition-colors"
                    />
                  </motion.div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Email *</label>
                    <Input
                      type="email"
                      placeholder="john@company.com"
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-solar-500 transition-colors"
                    />
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Phone</label>
                    <Input
                      type="tel"
                      placeholder="(555) 123-4567"
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-solar-500 transition-colors"
                    />
                  </motion.div>
                </div>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Company/Organization *
                  </label>
                  <Input
                    placeholder="Your Company Name"
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-solar-500 transition-colors"
                  />
                </motion.div>

                <motion.div whileHover={{ scale: 1.02 }}>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Project Details *
                  </label>
                  <Textarea
                    placeholder="Tell us about your project: type (apartment, commercial, solar farm), location, estimated size (kW/MW), and timeline..."
                    rows={4}
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 resize-none focus:border-solar-500 transition-colors"
                  />
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="w-full text-lg py-6 rounded-full bg-solar-500 hover:bg-solar-600 text-white shadow-glow hover:shadow-glow-lg transition-all duration-300"
                  >
                    Get Project Quote
                  </Button>
                </motion.div>

                <p className="text-gray-500 text-sm text-center">
                  * Required fields. We'll respond within 24 hours.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
