import { describe, it, expect } from 'vitest';
import {
  sanitizeInput,
  emailSchema,
  phoneSchema,
  nameSchema,
  companySchema,
  projectDetailsSchema,
  contactFormSchema,
  chatMessageSchema,
  isValidUrl,
  getSafeRedirectUrl,
} from '../validation';

describe('Validation Utilities', () => {
  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello';
      expect(sanitizeInput(input)).toBe('Hello');
    });

    it('should trim whitespace', () => {
      const input = '  Hello World  ';
      expect(sanitizeInput(input)).toBe('Hello World');
    });

    it('should handle empty strings', () => {
      expect(sanitizeInput('')).toBe('');
    });
  });

  describe('emailSchema', () => {
    it('should validate correct email formats', () => {
      const validEmails = ['test@example.com', 'user.name@company.co.uk', 'user+tag@example.org'];

      validEmails.forEach((email) => {
        expect(() => emailSchema.parse(email)).not.toThrow();
      });
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = ['notanemail', '@example.com', 'user@', 'user@@example.com', ''];

      invalidEmails.forEach((email) => {
        expect(() => emailSchema.parse(email)).toThrow();
      });
    });

    it('should sanitize email input', () => {
      const email = '<script>alert("xss")</script>test@example.com';
      const result = emailSchema.parse(email);
      expect(result).toBe('test@example.com');
    });
  });

  describe('phoneSchema', () => {
    it('should validate US phone formats', () => {
      const validPhones = ['123-456-7890', '(123) 456-7890', '+1 123 456 7890', '1234567890'];

      validPhones.forEach((phone) => {
        expect(() => phoneSchema.parse(phone)).not.toThrow();
      });
    });

    it('should allow empty phone (optional)', () => {
      expect(phoneSchema.parse(undefined)).toBeUndefined();
    });
  });

  describe('nameSchema', () => {
    it('should validate valid names', () => {
      const validNames = ['John', 'Mary-Jane', "O'Connor", 'Jean Paul'];

      validNames.forEach((name) => {
        expect(() => nameSchema.parse(name)).not.toThrow();
      });
    });

    it('should reject invalid names', () => {
      const invalidNames = [
        'J', // too short
        'John123', // contains numbers
        'John@Doe', // contains special chars
        '', // empty
      ];

      invalidNames.forEach((name) => {
        expect(() => nameSchema.parse(name)).toThrow();
      });
    });
  });

  describe('projectDetailsSchema', () => {
    it('should require minimum length', () => {
      const shortText = 'Too short';
      expect(() => projectDetailsSchema.parse(shortText)).toThrow();
    });

    it('should enforce maximum length', () => {
      const longText = 'a'.repeat(1001);
      expect(() => projectDetailsSchema.parse(longText)).toThrow();
    });

    it('should accept valid project details', () => {
      const validDetails = 'We need solar panels for our 50,000 sq ft warehouse in California.';
      expect(() => projectDetailsSchema.parse(validDetails)).not.toThrow();
    });
  });

  describe('contactFormSchema', () => {
    it('should validate complete form data', () => {
      const validForm = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@company.com',
        phone: '555-123-4567',
        company: 'ABC Corporation',
        projectDetails:
          'We need solar panels for our office building with 20,000 sq ft roof space.',
      };

      expect(() => contactFormSchema.parse(validForm)).not.toThrow();
    });

    it('should work without optional phone', () => {
      const validForm = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@company.com',
        company: 'ABC Corporation',
        projectDetails:
          'We need solar panels for our office building with 20,000 sq ft roof space.',
      };

      expect(() => contactFormSchema.parse(validForm)).not.toThrow();
    });
  });

  describe('chatMessageSchema', () => {
    it('should validate message length', () => {
      const shortMessage = 'Hi';
      const longMessage = 'a'.repeat(501);
      const validMessage = 'Can you tell me about solar panel efficiency?';

      expect(() => chatMessageSchema.parse(validMessage)).not.toThrow();
      expect(() => chatMessageSchema.parse(shortMessage)).not.toThrow();
      expect(() => chatMessageSchema.parse(longMessage)).toThrow();
    });

    it('should sanitize messages', () => {
      const unsafeMessage = '<img src=x onerror=alert("xss")>Hello';
      const result = chatMessageSchema.parse(unsafeMessage);
      expect(result).toBe('Hello');
    });
  });

  describe('URL validation', () => {
    describe('isValidUrl', () => {
      it('should validate correct URLs', () => {
        expect(isValidUrl('https://example.com')).toBe(true);
        expect(isValidUrl('http://localhost:3000')).toBe(true);
        expect(isValidUrl('https://sub.domain.com/path')).toBe(true);
      });

      it('should reject invalid URLs', () => {
        expect(isValidUrl('javascript:alert("xss")')).toBe(false);
        expect(isValidUrl('not a url')).toBe(false);
        expect(isValidUrl('')).toBe(false);
      });
    });

    describe('getSafeRedirectUrl', () => {
      beforeEach(() => {
        // Mock window.location.host
        Object.defineProperty(window, 'location', {
          value: { host: 'example.com' },
          writable: true,
        });
      });

      it('should allow relative URLs', () => {
        expect(getSafeRedirectUrl('/dashboard')).toBe('/dashboard');
        expect(getSafeRedirectUrl('/user/profile')).toBe('/user/profile');
      });

      it('should block double-slash URLs', () => {
        expect(getSafeRedirectUrl('//evil.com')).toBe('/');
      });

      it('should allow same-host absolute URLs', () => {
        expect(getSafeRedirectUrl('https://example.com/page')).toBe('https://example.com/page');
      });

      it('should block different-host URLs', () => {
        expect(getSafeRedirectUrl('https://evil.com/phishing')).toBe('/');
      });

      it('should use default URL for invalid input', () => {
        expect(getSafeRedirectUrl('')).toBe('/');
        expect(getSafeRedirectUrl('invalid')).toBe('/');
      });
    });
  });
});
