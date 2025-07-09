import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Phone, Mail } from 'lucide-react';
import { useState } from 'react';
import { Button } from './button';

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-40 h-16 w-16 rounded-full bg-solar-500 shadow-tesla flex items-center justify-center text-white hover:bg-solar-600 transition-colors"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle className="h-6 w-6" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Contact menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-28 right-8 z-40 w-80 bg-white rounded-2xl shadow-tesla-hover p-6"
          >
            <h3 className="text-xl font-display font-semibold mb-4">Let's Connect</h3>
            <p className="text-gray-600 mb-6">
              Ready to power your next solar project? Get in touch with our team.
            </p>

            <div className="space-y-3">
              <motion.a
                href="tel:1-888-SUN-EDGE"
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-solar-100 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-solar-600" />
                </div>
                <div>
                  <p className="font-medium">Call Us</p>
                  <p className="text-sm text-gray-600">1-888-SUN-EDGE</p>
                </div>
              </motion.a>

              <motion.a
                href="mailto:info@sunedgepower.com"
                whileHover={{ x: 5 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-solar-100 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-solar-600" />
                </div>
                <div>
                  <p className="font-medium">Email Us</p>
                  <p className="text-sm text-gray-600">info@sunedgepower.com</p>
                </div>
              </motion.a>
            </div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-6">
              <Button
                className="w-full bg-solar-500 hover:bg-solar-600 text-white"
                onClick={() => {
                  setIsOpen(false);
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Start Your Project
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingContact;
