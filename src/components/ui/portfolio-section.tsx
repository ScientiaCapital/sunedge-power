import React from 'react';

const projects = [
  {
    name: 'Logistics Center, TX',
    img: '/portfolio1.jpg',
    desc: '2.5MW rooftop solar for a major logistics provider.',
  },
  {
    name: 'Manufacturing Plant, CA',
    img: '/portfolio2.jpg',
    desc: 'Ground-mount C&I solar powering 100% of operations.',
  },
  {
    name: 'Retail HQ, FL',
    img: '/portfolio3.jpg',
    desc: '1MW carport solar for a Fortune 500 retailer.',
  },
];

const PortfolioSection = () => (
  <section className="py-16 bg-secondary-light" id="portfolio">
    <div className="container mx-auto">
      <h2 className="text-2xl md:text-4xl font-bold text-primary text-center mb-12 animate-fade-in">
        Project Portfolio
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project.name}
            className="bg-background rounded-lg shadow-lg overflow-hidden animate-fade-in"
          >
            <img
              src={project.img}
              alt={project.name}
              className="w-full h-48 object-cover"
              loading="lazy"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-primary mb-2">{project.name}</h3>
              <p className="text-primary/70">{project.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PortfolioSection;
