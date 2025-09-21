'use server';
/**
 * @fileOverview A flow to generate a micro-action to improve wellness.
 *
 * - generateMicroAction - A function that suggests a small, actionable task.
 * - GenerateMicroActionInput - The input type for the generateMicroAction function.
 * - GenerateMicroActionOutput - The return type for the generateMicroAction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMicroActionInputSchema = z.object({
  wellnessState: z
    .enum(['flourishing', 'balanced', 'tired'])
    .describe("The current state of the user's wellness avatar."),
});
export type GenerateMicroActionInput = z.infer<
  typeof GenerateMicroActionInputSchema
>;

const GenerateMicroActionOutputSchema = z.object({
  action: z
    .string()
    .describe('A short, actionable suggestion to improve wellbeing.'),
  category: z
    .enum(['mindfulness', 'hydration', 'connection', 'movement', 'gratitude'])
    .describe('The category of the suggested action.'),
});
export type GenerateMicroActionOutput = z.infer<
  typeof GenerateMicroActionOutputSchema
>;

export async function generateMicroAction(
  input: GenerateMicroActionInput
): Promise<GenerateMicroActionOutput> {
  return generateMicroActionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMicroActionPrompt',
  input: {schema: GenerateMicroActionInputSchema},
  output: {schema: GenerateMicroActionOutputSchema},
  prompt: `You are a caring AI companion. The user's personal growth avatar is currently in a '{{{wellnessState}}}' state.
  
  Suggest one, and only one, very small, simple, and achievable "micro-action" that can help them improve their wellbeing.
  
  - If the state is 'tired', suggest a simple grounding or calming action. Examples: "Take 3 deep breaths", "Drink a glass of water", "Stretch your arms for 30 seconds".
  - If the state is 'balanced', suggest a small positive action to maintain momentum. Examples: "Think of one thing you're grateful for", "Send a kind message to a friend", "Step outside for a minute of fresh air".
  - If the state is 'flourishing', suggest an action to build on that positivity. Examples: "Jot down a happy memory", "Listen to your favorite upbeat song", "Plan a small thing to look forward to".
  
  The action should be something that can be done in under 2 minutes.
  
  Categorize the action into one of the following: 'mindfulness', 'hydration', 'connection', 'movement', 'gratitude'.`,
});

const generateMicroActionFlow = ai.defineFlow(
  {
    name: 'generateMicroActionFlow',
    inputSchema: GenerateMicroActionInputSchema,
    outputSchema: GenerateMicroActionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
