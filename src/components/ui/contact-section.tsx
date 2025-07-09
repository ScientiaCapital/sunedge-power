import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";

const ContactSection = () => {
  const contactInfo = [
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      content: "(555) 123-SOLAR",
      subtitle: "Mon-Fri 8AM-6PM EST"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us", 
      content: "info@sunedgepower.com",
      subtitle: "24/7 Response Team"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Service Area",
      content: "All 50 United States",
      subtitle: "Nationwide Coverage"
    }
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
            Ready to Power Your Project?
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Partner with America&apos;s premier solar installation experts. 
            Let&apos;s discuss how we can help you succeed nationwide.
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
                Sunny is excited to help with your solar project!
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="lg:col-span-2 bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center">
                <MessageSquare className="h-6 w-6 mr-3 text-secondary" />
                Request Free Consultation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    First Name *
                  </label>
                  <Input 
                    placeholder="John"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Last Name *
                  </label>
                  <Input 
                    placeholder="Doe"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Email *
                  </label>
                  <Input 
                    type="email"
                    placeholder="john@company.com"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                  />
                </div>
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Phone
                  </label>
                  <Input 
                    type="tel"
                    placeholder="(555) 123-4567"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Company
                </label>
                <Input 
                  placeholder="Your Solar Company"
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Project Details *
                </label>
                <Textarea 
                  placeholder="Tell us about your solar installation project, location, and timeline..."
                  rows={4}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50 resize-none"
                />
              </div>

              <Button 
                size="lg" 
                variant="secondary"
                className="w-full text-lg py-4 rounded-full shadow-glow hover:shadow-xl transition-all duration-300"
              >
                Send Message
              </Button>

              <p className="text-white/60 text-sm text-center">
                * Required fields. We&apos;ll respond within 24 hours.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;