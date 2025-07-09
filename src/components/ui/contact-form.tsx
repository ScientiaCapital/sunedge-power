import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { contactFormSchema, ContactFormData } from '@/lib/validation';
import { sendEmail } from '@/lib/email-service';
import { useToast } from '@/hooks/use-toast';

interface ContactFormProps {
  onSuccess?: () => void;
}

const ContactForm = ({ onSuccess }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Send email
      await sendEmail(data);

      setSubmitStatus('success');
      toast({
        title: 'Message sent successfully!',
        description: "We'll get back to you within 24 hours.",
      });

      reset();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to send email:', error);
      setSubmitStatus('error');
      toast({
        title: 'Failed to send message',
        description: 'Please try again or call us at 1-888-SUN-EDGE',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {submitStatus === 'success' && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Your message has been sent successfully! We'll contact you soon.
          </AlertDescription>
        </Alert>
      )}

      {submitStatus === 'error' && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Failed to send your message. Please try again or call us directly.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="block text-white/90 text-sm font-medium mb-2">
            First Name{' '}
            <span className="text-red-500" aria-label="required">
              *
            </span>
          </label>
          <Input
            {...register('firstName')}
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            aria-invalid={!!errors.firstName}
            aria-describedby={errors.firstName ? 'firstName-error' : undefined}
            placeholder="John"
            className="bg-white/30 border-white/40 text-white placeholder:text-white/60 focus:bg-white/40"
          />
          {errors.firstName && (
            <p id="firstName-error" className="mt-1 text-sm text-red-400" role="alert">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-white/90 text-sm font-medium mb-2">
            Last Name{' '}
            <span className="text-red-500" aria-label="required">
              *
            </span>
          </label>
          <Input
            {...register('lastName')}
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            aria-invalid={!!errors.lastName}
            aria-describedby={errors.lastName ? 'lastName-error' : undefined}
            placeholder="Doe"
            className="bg-white/30 border-white/40 text-white placeholder:text-white/60 focus:bg-white/40"
          />
          {errors.lastName && (
            <p id="lastName-error" className="mt-1 text-sm text-red-400" role="alert">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-white/90 text-sm font-medium mb-2">
            Email{' '}
            <span className="text-red-500" aria-label="required">
              *
            </span>
          </label>
          <Input
            {...register('email')}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            placeholder="john@company.com"
            className="bg-white/30 border-white/40 text-white placeholder:text-white/60 focus:bg-white/40"
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-400" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-white/90 text-sm font-medium mb-2">
            Phone <span className="text-white/60 text-xs">(optional)</span>
          </label>
          <Input
            {...register('phone')}
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            placeholder="(555) 123-4567"
            className="bg-white/30 border-white/40 text-white placeholder:text-white/60 focus:bg-white/40"
          />
          {errors.phone && (
            <p id="phone-error" className="mt-1 text-sm text-red-400" role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="company" className="block text-white/90 text-sm font-medium mb-2">
          Company/Organization{' '}
          <span className="text-red-500" aria-label="required">
            *
          </span>
        </label>
        <Input
          {...register('company')}
          id="company"
          name="company"
          type="text"
          autoComplete="organization"
          aria-invalid={!!errors.company}
          aria-describedby={errors.company ? 'company-error' : undefined}
          placeholder="Your Company Name"
          className="bg-white/30 border-white/40 text-white placeholder:text-white/60 focus:bg-white/40"
        />
        {errors.company && (
          <p id="company-error" className="mt-1 text-sm text-red-400" role="alert">
            {errors.company.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="projectDetails" className="block text-white/90 text-sm font-medium mb-2">
          Project Details{' '}
          <span className="text-red-500" aria-label="required">
            *
          </span>
        </label>
        <Textarea
          {...register('projectDetails')}
          id="projectDetails"
          name="projectDetails"
          rows={4}
          aria-invalid={!!errors.projectDetails}
          aria-describedby={errors.projectDetails ? 'projectDetails-error' : undefined}
          placeholder="Tell us about your project: type (apartment, commercial, solar farm), location, estimated size (kW/MW), and timeline..."
          className="bg-white/30 border-white/40 text-white placeholder:text-white/60 focus:bg-white/40 resize-none"
        />
        {errors.projectDetails && (
          <p id="projectDetails-error" className="mt-1 text-sm text-red-400" role="alert">
            {errors.projectDetails.message}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          variant="secondary"
          className="w-full text-lg py-4 rounded-full shadow-glow hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
              <span>Sending...</span>
            </>
          ) : (
            'Get Project Quote'
          )}
        </Button>

        <p className="text-white/60 text-sm text-center">
          <span className="text-red-500" aria-hidden="true">
            *
          </span>{' '}
          Required fields. We'll respond within 24 hours.
        </p>
      </div>
    </form>
  );
};

export default ContactForm;
