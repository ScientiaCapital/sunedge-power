import emailjs from '@emailjs/browser';
import { AI_CONFIG } from './ai-config';
import { chatWithAI } from './ai-services';

// Initialize EmailJS
if (AI_CONFIG.emailjs.publicKey) {
  emailjs.init(AI_CONFIG.emailjs.publicKey);
}

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  projectDetails: string;
}

// Generate AI-powered response
export const generateAutoResponse = async (formData: ContactFormData): Promise<string> => {
  const prompt = `Generate a professional, personalized email response for a solar energy inquiry.
    Customer: ${formData.firstName} ${formData.lastName}
    Company: ${formData.company}
    Project Details: ${formData.projectDetails}
    
    The response should:
    1. Thank them for their interest
    2. Acknowledge their specific project needs
    3. Mention our expertise in their area
    4. Promise a follow-up within 24 hours
    5. Be professional but friendly`;

  try {
    const response = await chatWithAI(prompt);
    return response;
  } catch (error) {
    // Fallback response
    return `Dear ${formData.firstName},

Thank you for your interest in SunEdge Power's commercial solar solutions. We've received your inquiry regarding solar installation for ${formData.company}.

Our team specializes in projects like yours, and we're excited to help you achieve your sustainability and cost-saving goals. One of our solar experts will review your project details and contact you within 24 hours with a customized proposal.

In the meantime, feel free to call us directly at 1-888-SUN-EDGE if you have any immediate questions.

Best regards,
The SunEdge Power Team`;
  }
};

// Send automated email response
export const sendAutoResponse = async (formData: ContactFormData): Promise<void> => {
  if (!AI_CONFIG.emailjs.serviceId || !AI_CONFIG.emailjs.templateId) {
    console.warn('EmailJS not configured');
    return;
  }

  try {
    // Generate personalized response
    const autoResponse = await generateAutoResponse(formData);

    // Send email via EmailJS
    await emailjs.send(AI_CONFIG.emailjs.serviceId, AI_CONFIG.emailjs.templateId, {
      to_email: formData.email,
      to_name: `${formData.firstName} ${formData.lastName}`,
      from_name: 'SunEdge Power',
      reply_to: 'info@sunedgepower.com',
      subject: 'Thank you for your solar inquiry - SunEdge Power',
      message: autoResponse,
      // Include form data for internal notification
      form_data: JSON.stringify(formData, null, 2),
    });
  } catch (error) {
    console.error('Failed to send auto-response:', error);
    // Don't throw - we don't want to block form submission
  }
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone format
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
};

// Format phone number
export const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phone;
};

// Main sendEmail function that the contact form uses
export const sendEmail = async (formData: ContactFormData): Promise<void> => {
  if (!AI_CONFIG.emailjs.serviceId || !AI_CONFIG.emailjs.templateId) {
    throw new Error('Email service not configured');
  }

  try {
    // Send the main notification email
    await emailjs.send(AI_CONFIG.emailjs.serviceId, AI_CONFIG.emailjs.templateId, {
      to_name: 'SunEdge Power Team',
      from_name: `${formData.firstName} ${formData.lastName}`,
      from_email: formData.email,
      company: formData.company,
      phone: formData.phone || 'Not provided',
      message: formData.projectDetails,
    });

    // Send auto-response if enabled
    if (AI_CONFIG.enableChat) {
      await sendAutoResponse(formData);
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};
