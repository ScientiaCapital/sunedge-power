import { Zap, Building, MapPin, Award, Wrench, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

const StatsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const stats = [
    {
      icon: <Zap className="h-8 w-8" />,
      value: 500,
      suffix: 'MW+',
      label: 'Solar Installed',
      description: 'Powering businesses nationwide',
    },
    {
      icon: <Building className="h-8 w-8" />,
      value: 1000,
      suffix: '+',
      label: 'Commercial Projects',
      description: 'From 100kW to multi-MW systems',
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      value: 12,
      suffix: ' States',
      label: 'Nationwide Coverage',
      description: 'Licensed across America',
    },
    {
      icon: <Award className="h-8 w-8" />,
      value: 18,
      suffix: '+ Years',
      label: 'Industry Experience',
      description: 'Trusted since 2006',
    },
  ];

  // Counter animation component
  const Counter = ({
    value,
    suffix,
    duration = 2,
  }: {
    value: number;
    suffix: string;
    duration?: number;
  }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isInView) return;

      const endValue = value;
      const increment = endValue / (duration * 60); // 60fps
      let currentValue = 0;

      const timer = setInterval(() => {
        currentValue += increment;
        if (currentValue >= endValue) {
          setCount(endValue);
          clearInterval(timer);
        } else {
          setCount(Math.floor(currentValue));
        }
      }, 1000 / 60);

      return () => clearInterval(timer);
    }, [isInView, value, duration]);

    return (
      <span>
        {count}
        {suffix}
      </span>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section
      className="relative py-20 bg-gradient-to-br from-solar-500 via-solar-600 to-solar-700 overflow-hidden"
      ref={sectionRef}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-tesla-mesh opacity-10"></div>
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            backgroundSize: '100% 100%',
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="text-center text-white group cursor-pointer"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4 border border-white/30 group-hover:bg-white/30 group-hover:border-white/50 transition-all duration-300 shadow-glow-sm"
              >
                {stat.icon}
              </motion.div>
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                {isInView && <Counter value={stat.value} suffix={stat.suffix} />}
              </motion.div>
              <div className="text-xl font-semibold mb-2">{stat.label}</div>
              <div className="text-white/80 text-sm">{stat.description}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Floating solar particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
            }}
            animate={{
              y: -50,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 3,
              ease: 'linear',
            }}
            style={{
              filter: 'blur(1px)',
            }}
          />
        ))}
      </div>

      {/* Decorative elements with animation */}
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute top-10 right-10 w-20 h-20 border-2 border-white/20 rounded-full"
      />
      <motion.div
        animate={{
          rotate: -360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
          scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="absolute bottom-10 left-10 w-16 h-16 border-2 border-white/20 rounded-full"
      />
      <motion.div
        animate={{
          rotate: 360,
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute top-1/2 left-1/4 w-12 h-12 border-2 border-white/20 rounded-full"
      />
    </section>
  );
};

export default StatsSection;
