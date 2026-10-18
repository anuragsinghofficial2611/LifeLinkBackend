import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

/**
 * Knowledge base for blood donation inquiries.
 */
const KNOWLEDGE_BASE = [
  {
    keywords: ['who can donate', 'eligibility', 'eligible', 'requirements', 'age'],
    response:
      'To donate blood, you must be between 18 and 65 years old (or at least 8 with guardian consent for special programs), weigh at least 50 kg, be in good general health, and have normal hemoglobin levels. You should not donate if you have active infections, severe chronic conditions, or recently got a tattoo/piercing within the last 6 months.'
  },
  {
    keywords: ['o-', 'o negative', 'universal donor'],
    response:
      'O-negative (O-) is the universal red blood cell donor! O- negative blood can be transfused to patients of any blood group (A+, A-, B+, B-, AB+, AB-, O+, O-), making it critical for trauma and emergency rooms.'
  },
  {
    keywords: ['ab+', 'ab positive', 'universal recipient'],
    response:
      'AB-positive (AB+) is the universal red blood cell recipient! Patients with AB+ blood can safely receive red blood cells from any blood type.'
  },
  {
    keywords: ['how often', 'frequency', 'interval', 'next donation'],
    response:
      'Healthy men can safely donate whole blood every 12 weeks (3 months), and women every 16 weeks (4 months). Platelet donation can be performed more frequently, up to every 2 weeks.'
  },
  {
    keywords: ['emergency', 'urgent', 'need blood', 'immediate'],
    response:
      'If you have an urgent blood requirement, please navigate to the Emergency Blood Request section or submit a request directly through Lifelink. Our system instantly broadcasts emergency alerts to all nearby registered hospitals and active donors.'
  },
  {
    keywords: ['prepare', 'before donating', 'after donating', 'eat', 'food'],
    response:
      'Before donating, drink plenty of water (500ml), eat a healthy iron-rich meal, and avoid fatty foods. Avoid alcohol 24 hours prior. After donating, rest for 10-15 minutes, keep hydrated, and avoid strenuous exercise for the rest of the day.'
  }
];

export const processChatMessage = async (message, history = []) => {
  const normalized = message.toLowerCase().trim();

  // If Gemini API is configured, attempt external call
  if (env.GEMINI_API_KEY) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `You are the Lifelink Blood Donation AI Assistant. Provide helpful, accurate, compassionate, and concise advice about blood donation, donor eligibility, blood types, and emergency blood requests. Question: ${message}`
                  }
                ]
              }
            ]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText) {
          return { reply: replyText.trim() };
        }
      }
    } catch (err) {
      logger.warn('External AI call failed, falling back to local expert system:', err.message);
    }
  }

  // Domain expert fallback response matcher
  for (const item of KNOWLEDGE_BASE) {
    if (item.keywords.some((kw) => normalized.includes(kw))) {
      return { reply: item.response };
    }
  }

  return {
    reply:
      "Hello! I am Lifelink's AI Assistant. I can help answer questions regarding blood donation eligibility, blood type compatibility (e.g., universal donors/recipients), donation frequency, preparation guidelines, or emergency blood requests. How can I assist you today?"
  };
};
