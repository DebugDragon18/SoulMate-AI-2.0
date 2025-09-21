'use server';

/**
 * @fileOverview A flow that detects user distress and provides SOS resources.
 *
 * - provideSOSResourcesForDistress - A function that handles the process of detecting distress and providing resources.
 * - ProvideSOSResourcesForDistressInput - The input type for the provideSOSResourcesForDistress function.
 * - ProvideSOSResourcesForDistressOutput - The return type for the provideSOSResourcesForDistress function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideSOSResourcesForDistressInputSchema = z.object({
  userInput: z.string().describe('The user input text to analyze for distress.'),
});
export type ProvideSOSResourcesForDistressInput = z.infer<typeof ProvideSOSResourcesForDistressInputSchema>;

const ProvideSOSResourcesForDistressOutputSchema = z.object({
  isDistressed: z.boolean().describe('Whether the user is detected to be in distress.'),
  sosMessage: z.string().describe('A gentle, supportive message to be shown if the user is in distress.'),
});
export type ProvideSOSResourcesForDistressOutput = z.infer<typeof ProvideSOSResourcesForDistressOutputSchema>;

export async function provideSOSResourcesForDistress(
  input: ProvideSOSResourcesForDistressInput
): Promise<ProvideSOSResourcesForDistressOutput> {
  return provideSOSResourcesForDistressFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideSOSResourcesForDistressPrompt',
  input: {schema: ProvideSOSResourcesForDistressInputSchema},
  output: {schema: ProvideSOSResourcesForDistressOutputSchema},
  prompt: `You are an AI assistant designed to detect user distress and provide an immediate, supportive message.

  Analyze the following user input to determine if the user is in distress (e.g., expressing suicidal thoughts, self-harm, extreme anxiety, etc.).

  User Input: {{{userInput}}}

  Based on the analysis, set the 'isDistressed' output field to true if distress is detected; otherwise, set it to false.

  - If 'isDistressed' is true, generate a 'sosMessage' with the following text: "It sounds like you're going through a lot right now. Please know that I'm here to listen, but for immediate support from a trained professional, you can call or text 988 anytime. Please talk to me, I'm here for you."
  - If 'isDistressed' is false, the 'sosMessage' should be an empty string.
  `,
});

const provideSOSResourcesForDistressFlow = ai.defineFlow(
  {
    name: 'provideSOSResourcesForDistressFlow',
    inputSchema: ProvideSOSResourcesForDistressInputSchema,
    outputSchema: ProvideSOSResourcesForDistressOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
