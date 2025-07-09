import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, Briefcase, Calendar, MapPin } from 'lucide-react';

const Team = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const teamMembers = [
    {
      name: 'Kyle',
      role: 'Co-Founder & CEO',
      bio: `Kyle brings over 15 years of experience in renewable energy and commercial construction to SunEdge Power. His journey in solar began with residential installations, where he quickly recognized the massive potential for commercial solar applications. Under his leadership, SunEdge Power has completed over 500 commercial solar projects across 12 states, ranging from warehouse rooftops to utility-scale solar farms.`,
      experience: [
        'Former VP of Operations at a leading solar contractor',
        'Certified NABCEP PV Installation Professional',
        'MS in Renewable Energy Engineering from Stanford University',
        'Pioneered innovative ground-mount solutions for challenging terrains',
      ],
      achievements: [
        'Led the development of a 50MW solar farm in Georgia',
        'Reduced installation costs by 30% through process optimization',
        'Established partnerships with Fortune 500 companies',
        'Speaker at Solar Power International conferences',
      ],
    },
    {
      name: 'Ron',
      role: 'Co-Founder & COO',
      bio: `Ron is the operational backbone of SunEdge Power, with a background in industrial engineering and project management. His expertise in logistics and supply chain management has been instrumental in scaling SunEdge Power from a regional player to a nationwide leader. Ron's data-driven approach and commitment to safety have resulted in zero safety incidents across all major projects.`,
      experience: [
        'Former Director of Operations at a major electrical contractor',
        'Professional Engineer (PE) license in 8 states',
        'MBA from Wharton School of Business',
        'Expert in utility interconnection and permitting processes',
      ],
      achievements: [
        'Implemented ISO 9001 quality management systems',
        'Developed proprietary project management software',
        'Reduced project completion times by 40%',
        'Manages a network of 200+ certified installers nationwide',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-tesla-mesh"
        />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Meet Our
              <span className="block bg-gradient-to-r from-solar-400 to-solar-600 bg-clip-text text-transparent">
                Leadership Team
              </span>
            </h1>
            <p className="text-xl text-gray-300">
              Driven by innovation, powered by experience. Our founders bring decades of expertise
              in commercial solar to deliver unmatched value for our clients.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Members Section */}
      <section ref={ref} className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-24">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm overflow-hidden">
                  <div className="grid lg:grid-cols-2 gap-12 p-8 md:p-12">
                    {/* Left Side - Basic Info */}
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-4xl font-bold text-white mb-2">{member.name}</h2>
                        <p className="text-xl text-solar-400 font-medium">{member.role}</p>
                      </div>

                      <p className="text-lg text-gray-300 leading-relaxed">{member.bio}</p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 pt-6">
                        <div className="bg-black/50 rounded-lg p-4 border border-solar-500/30">
                          <Calendar className="h-6 w-6 text-solar-400 mb-2" />
                          <p className="text-2xl font-bold text-white">15+</p>
                          <p className="text-sm text-gray-400">Years Experience</p>
                        </div>
                        <div className="bg-black/50 rounded-lg p-4 border border-solar-500/30">
                          <MapPin className="h-6 w-6 text-solar-400 mb-2" />
                          <p className="text-2xl font-bold text-white">12</p>
                          <p className="text-sm text-gray-400">States Served</p>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Experience & Achievements */}
                    <div className="space-y-8">
                      {/* Experience */}
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <Briefcase className="h-6 w-6 text-solar-400" />
                          <h3 className="text-2xl font-bold text-white">Professional Experience</h3>
                        </div>
                        <ul className="space-y-3">
                          {member.experience.map((exp, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
                              transition={{ duration: 0.6, delay: index * 0.2 + idx * 0.1 }}
                              className="flex items-start"
                            >
                              <span className="block w-2 h-2 bg-solar-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                              <span className="text-gray-300">{exp}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>

                      {/* Achievements */}
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <Award className="h-6 w-6 text-solar-400" />
                          <h3 className="text-2xl font-bold text-white">Key Achievements</h3>
                        </div>
                        <ul className="space-y-3">
                          {member.achievements.map((achievement, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -20 }}
                              transition={{ duration: 0.6, delay: index * 0.2 + idx * 0.1 + 0.4 }}
                              className="flex items-start"
                            >
                              <span className="block w-2 h-2 bg-solar-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                              <span className="text-gray-300">{achievement}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Company Vision */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-24 text-center max-w-4xl mx-auto"
          >
            <h3 className="text-3xl font-bold mb-6 text-white">Our Vision</h3>
            <p className="text-lg text-gray-300 leading-relaxed">
              Kyle and Ron founded SunEdge Power with a simple mission: to make commercial solar
              accessible, profitable, and hassle-free for businesses across America. Their combined
              expertise in engineering, operations, and business development has positioned SunEdge
              Power as the trusted partner for companies looking to reduce energy costs and achieve
              sustainability goals.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Team;
