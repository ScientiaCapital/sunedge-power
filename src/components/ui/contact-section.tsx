import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import ContactForm from '@/components/ui/contact-form';

const ContactSection = () => {
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

  return (
    <section id="contact" className="py-20 bg-gradient-hero relative overflow-hidden">
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block bg-secondary/20 text-secondary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-secondary/30">
            Get In Touch
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Let's Power Your Next Solar Project
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            From apartment complexes to amusement parks, we deliver commercial solar solutions
            nationwide. Get expert installation for projects of any size.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center border border-secondary/30">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{info.title}</h3>
                      <p className="text-secondary font-medium">{info.content}</p>
                      <p className="text-white/70 text-sm">{info.subtitle}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Sunny Mascot */}
            <div className="text-center mt-8">
              <img
                src="/lovable-uploads/33804a65-aead-4a38-bfd0-69852f8761a7.png"
                alt="Sunny says hello"
                className="h-32 w-auto mx-auto drop-shadow-2xl"
              />
              <p className="text-white/80 text-sm mt-4">
                Sunny powers commercial projects across America!
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="lg:col-span-2 bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center">
                <MessageSquare className="h-6 w-6 mr-3 text-secondary" />
                Start Your Commercial Solar Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
