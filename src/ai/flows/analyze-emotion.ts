'use server';
/**
 * @fileOverview A flow to analyze the user's text for emotions and patterns.
 *
 * - analyzeEmotion - A function that analyzes text to determine the underlying emotion and identify patterns.
 * - AnalyzeEmotionInput - The input type for the analyzeEmotion function.
 * - AnalyzeEmotionOutput - The return type for the analyzeEmotion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeEmotionInputSchema = z.object({
  text: z.string().describe("The user's text entry to be analyzed."),
});
export type AnalyzeEmotionInput = z.infer<typeof AnalyzeEmotionInputSchema>;

const AnalyzeEmotionOutputSchema = z.object({
  emotion: z
    .string()
    .describe(
      'The primary emotion detected in the text (e.g., Happy, Sad, Angry, Stressed, Anxious, Neutral).'
    ),
  summary: z
    .string()
    .describe(
      'A brief summary of the content, including potential stress triggers and behavioral patterns.'
    ),
});
export type AnalyzeEmotionOutput = z.infer<typeof AnalyzeEmotionOutputSchema>;

export async function analyzeEmotion(
  input: AnalyzeEmotionInput
): Promise<AnalyzeEmotionOutput> {
  return analyzeEmotionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeEmotionPrompt',
  input: {schema: AnalyzeEmotionInputSchema},
  output: {schema: AnalyzeEmotionOutputSchema},
  prompt: `You are an expert in psychological analysis and emotion detection.
  Analyze the following text from a user's journal entry.

  1.  Determine the primary emotion conveyed in the text. Choose from: Happy, Sad, Angry, Stressed, Anxious, Neutral.
  2.  Provide a concise summary of the key themes.
  3.  Identify any potential stress triggers or recurring negative thought patterns mentioned.
  4.  Phrase the summary gently and empathetically, as if you are a caring friend.

  User's text:
  "{{{text}}}"
  `,
});

const analyzeEmotionFlow = ai.defineFlow(
  {
    name: 'analyzeEmotionFlow',
    inputSchema: AnalyzeEmotionInputSchema,
    outputSchema: AnalyzeEmotionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      return {
        emotion: 'Neutral',
        summary: "I couldn't analyze the emotion in that message.",
      };
    }
    return output;
  }
);
