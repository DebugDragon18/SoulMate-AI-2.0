'use server';
/**
 * @fileOverview A flow to personalize chatbot responses based on detected emotion.
 *
 * - personalizeResponse - A function that personalizes the chatbot response based on the user's emotion.
 * - PersonalizeResponseInput - The input type for the personalizeResponse function.
 * - PersonalizeResponseOutput - The return type for the personalizeResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizeResponseInputSchema = z.object({
  emotion: z
    .string()
    .describe("The user's detected emotion (e.g., Happy, Sad, Angry, Stressed, Neutral)."),
  message: z.string().describe('The user message to respond to.'),
  context: z.string().optional().describe('The recent chat history.'),
  chatbotPersonality: z.string().describe('The personality of the chatbot (e.g., friend, mentor, therapist).'),
});

export type PersonalizeResponseInput = z.infer<
  typeof PersonalizeResponseInputSchema
>;

const PersonalizeResponseOutputSchema = z.object({
  response: z.string().describe('The personalized chatbot response.'),
});

export type PersonalizeResponseOutput = z.infer<
  typeof PersonalizeResponseOutputSchema
>;

export async function personalizeResponse(
  input: PersonalizeResponseInput
): Promise<PersonalizeResponseOutput> {
  return personalizeResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizeResponsePrompt',
  input: {schema: PersonalizeResponseInputSchema},
  output: {schema: PersonalizeResponseOutputSchema},
  prompt: `You are a chatbot with a specific personality, designed for a mental wellness app.
  Your personality is: {{{chatbotPersonality}}}.
  The user's current detected emotion is: {{{emotion}}}.
  
  Recent conversation history for context:
  {{{context}}}

  Your task is to respond to the user's latest message. Your response should be context-aware, human-like, culturally sensitive, and align with your personality.

  - If your personality is 'friend', be warm, supportive, and informal. Use "we" and "us". Be a great listener. You can use gentle humor or reassurance.
  - If your personality is 'mentor', be encouraging, wise, and offer gentle guidance. Focus on perspective and growth. Share insights or analogies.
  - If your personality is 'therapist', be calm, professional, and insightful. Gently guide the user to explore their feelings without giving direct advice. Use reflective questions.

  Based on the conversation history and the user's current emotion, craft a thoughtful, empathetic response to the following user message:
  "{{{message}}}"
  
  Keep your responses concise and natural-sounding. Remember past parts of the conversation to create a feeling of continuity.`,
});

const personalizeResponseFlow = ai.defineFlow(
  {
    name: 'personalizeResponseFlow',
    inputSchema: PersonalizeResponseInputSchema,
    outputSchema: PersonalizeResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
