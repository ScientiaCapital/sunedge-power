import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      <div className="relative">
        {/* Animated solar panel grid background */}
        <div className="absolute inset-0 -z-10">
          <div className="grid grid-cols-3 gap-2 opacity-10">
            {[...Array(9)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
                className="h-20 w-20 bg-solar-500 rounded"
              />
            ))}
          </div>
        </div>

        {/* Logo and text */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="mb-8"
          >
            <Zap className="h-16 w-16 text-solar-500" />
          </motion.div>

          <h1 className="text-4xl font-display font-bold text-white mb-2">SunEdge Power</h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-400"
          >
            Powering America's Future
          </motion.p>

          {/* Progress bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            className="mt-8 h-1 bg-solar-500 rounded-full w-48"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
