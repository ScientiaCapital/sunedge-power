import React from 'react';

const reasons = [
  {
    title: 'Lower Operating Costs',
    desc: 'Reduce your energy bills and improve your bottom line with commercial solar.',
    icon: '💡',
  },
  {
    title: 'Sustainability Leadership',
    desc: 'Meet ESG goals and show your commitment to a cleaner future.',
    icon: '🌎',
  },
  {
    title: 'Energy Independence',
    desc: 'Protect your business from rising utility rates and grid outages.',
    icon: '🔋',
  },
];

const WhySolarSection = () => (
  <section className="py-16 bg-background" id="why">
    <div className="container mx-auto">
      <h2 className="text-2xl md:text-4xl font-bold text-primary text-center mb-12 animate-fade-in">
        Why Solar for Your Business?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {reasons.map((reason) => (
          <div
            key={reason.title}
            className="bg-secondary rounded-lg shadow-md p-8 flex flex-col items-center text-center animate-fade-in"
          >
            <span className="text-4xl mb-4">{reason.icon}</span>
            <h3 className="text-xl font-semibold text-primary mb-2">{reason.title}</h3>
            <p className="text-primary/70">{reason.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default WhySolarSection;
