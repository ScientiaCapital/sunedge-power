import { embedAndInsertQA } from '../lib/knowledgeBase';

async function main() {
  const entries = [
    {
      question: 'How do I get a commercial solar quote?',
      answer: 'You can get a quote by providing your facility address, type, and recent electric bill. Our team will prepare a custom proposal for you.',
      tags: ['commercial', 'quote']
    },
    {
      question: 'What is the typical payback period for a commercial solar project?',
      answer: 'Most commercial solar projects have a payback period of 3-7 years, depending on location, incentives, and energy usage.',
      tags: ['commercial', 'payback', 'roi']
    },
    {
      question: 'Do you offer residential solar services?',
      answer: 'While SunEdge Power specializes in commercial solar, we may be able to help or refer you to a trusted residential installer in your area.',
      tags: ['residential', 'referral']
    },
    {
      question: 'What warranties do you provide?',
      answer: 'We offer up to 25 years of performance and equipment warranties on all systems.',
      tags: ['warranty', 'equipment']
    },
    {
      question: 'How does solar benefit my business financially?',
      answer: 'Solar can reduce your operating costs, provide tax incentives, and improve your sustainability profile, often resulting in significant long-term savings.',
      tags: ['financial', 'benefit', 'business']
    }
    // Add more Q&A pairs as needed!
  ];

  for (const entry of entries) {
    try {
      await embedAndInsertQA(entry.question, entry.answer, entry.tags);
      console.log(`Inserted: ${entry.question}`);
    } catch (err) {
      console.error(`Failed to insert: ${entry.question}`, err);
    }
  }
}

main(); 