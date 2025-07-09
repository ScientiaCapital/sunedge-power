import { Mail, Phone, MapPin, Zap, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: '#', label: 'Facebook' },
    { icon: <Twitter className="h-5 w-5" />, href: '#', label: 'Twitter' },
    { icon: <Linkedin className="h-5 w-5" />, href: '#', label: 'LinkedIn' },
    { icon: <Instagram className="h-5 w-5" />, href: '#', label: 'Instagram' },
  ];

  const footerLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                <Zap className="h-8 w-8 text-solar-400" />
              </motion.div>
              <span className="text-white font-bold text-xl">SunEdge Power</span>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              America&apos;s premier solar installation partner since 2006. Specializing in
              large-scale commercial projects and solar farms nationwide.
            </p>
            <div className="text-sm text-gray-500">Licensed • Bonded • Insured</div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="h-10 w-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-solar-500/20 hover:text-solar-400 transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5 }}
                    className="hover:text-solar-400 transition-all duration-200 inline-block"
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    {link.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg mb-4 text-white">Contact Us</h3>
            <div className="space-y-3">
              <motion.div whileHover={{ x: 5 }} className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-solar-400 flex-shrink-0" />
                <span>1-888-SUN-EDGE</span>
              </motion.div>
              <motion.div whileHover={{ x: 5 }} className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-solar-400 flex-shrink-0" />
                <span>info@sunedgepower.com</span>
              </motion.div>
              <motion.div whileHover={{ x: 5 }} className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-solar-400 flex-shrink-0 mt-0.5" />
                <span>
                  Serving 12 States & Growing
                  <br />
                  Headquarters: Florida
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-500 text-sm">
              © {currentYear} SunEdge Power LLC. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-gray-500">
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                className="hover:text-solar-400 transition-colors"
              >
                Privacy Policy
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                className="hover:text-solar-400 transition-colors"
              >
                Terms of Service
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                className="hover:text-solar-400 transition-colors"
              >
                Licensing
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
