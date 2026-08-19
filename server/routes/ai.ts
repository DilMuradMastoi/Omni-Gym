import { Router, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { AuthRequest, verifyToken } from '../middleware/auth.js';

const router = Router();

// POST /api/ai/fitness-advice
router.post('/fitness-advice', verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const { prompt, goal, experienceLevel, age, weightKg } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback smart response when API key is not configured
      return res.json({
        advice: `### Personalized Fitness Recommendation for ${goal || 'Fitness Optimization'}
* **Goal:** ${goal || 'Strength & Conditioning'}
* **Level:** ${experienceLevel || 'Intermediate'}

#### 🏋️ Recommended Protocol:
1. **Progressive Overload:** Increase resistance by 2.5-5% every 2 weeks.
2. **Frequency:** 4 days per week (Upper/Lower Split).
3. **Nutrition:** Target 1.8g - 2.2g of protein per kg of bodyweight.
4. **Hydration & Recovery:** Minimum 3 Liters water daily and 8 hours sleep for optimal muscle repair.

*(To enable real-time Gemini AI Custom Generation, set your GEMINI_API_KEY in secrets).*`
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const userPrompt = prompt || `Create a customized workout recommendation and diet advice for a person with goal "${goal || 'Fat Loss and Muscle Gain'}" at experience level "${experienceLevel || 'Intermediate'}". Include key exercises, sets/reps, and nutrition guidelines.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: `You are an expert AI Gym Master Coach. ${userPrompt}` }]
        }
      ]
    });

    return res.json({ advice: response.text });
  } catch (err: any) {
    console.error('Gemini AI error:', err);
    return res.status(500).json({
      error: 'Failed to generate AI advice.',
      fallback: 'Stay consistent with compound movements (Squat, Bench, Deadlift, Overhead Press) and maintain a balanced caloric intake.'
    });
  }
});

export default router;
