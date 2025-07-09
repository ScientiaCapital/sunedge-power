import React from 'react';

const stats = [
  { label: 'MW Installed', value: '500+' },
  { label: 'States Served', value: '50' },
  { label: 'Commercial Projects', value: '1,200+' },
  { label: 'Years Experience', value: '18' },
];

const StatsSection = () => (
  <section className="py-16 bg-background">
    <div className="container mx-auto flex flex-col items-center">
      <h2 className="text-2xl md:text-4xl font-bold text-primary text-center mb-8 animate-fade-in">
        Proven Commercial Solar Experience
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center bg-secondary rounded-lg shadow p-6 animate-fade-in"
          >
            <span className="text-3xl md:text-5xl font-bold text-accent mb-2">{stat.value}</span>
            <span className="text-primary/70 text-lg">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
