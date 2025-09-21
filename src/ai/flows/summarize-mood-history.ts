'use server';
/**
 * @fileOverview Summarizes the user's mood history.
 *
 * - summarizeMoodHistory - A function that summarizes the user's mood history.
 * - SummarizeMoodHistoryInput - The input type for the summarizeMoodHistory function.
 * - SummarizeMoodHistoryOutput - The return type for the summarizeMoodHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMoodHistoryInputSchema = z.object({
  moodHistory: z
    .string()
    .describe('A string containing the user\'s mood history data.'),
});
export type SummarizeMoodHistoryInput = z.infer<typeof SummarizeMoodHistoryInputSchema>;

const SummarizeMoodHistoryOutputSchema = z.object({
  summary: z
    .string()
    .describe('A summary of the user\'s mood history, highlighting trends and changes over time.'),
});
export type SummarizeMoodHistoryOutput = z.infer<typeof SummarizeMoodHistoryOutputSchema>;

export async function summarizeMoodHistory(input: SummarizeMoodHistoryInput): Promise<SummarizeMoodHistoryOutput> {
  return summarizeMoodHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMoodHistoryPrompt',
  input: {schema: SummarizeMoodHistoryInputSchema},
  output: {schema: SummarizeMoodHistoryOutputSchema},
  prompt: `You are an AI assistant designed to summarize a user's mood history.

  Given the following mood history, provide a concise summary of the user's mood trends and how they have changed over time.

  Mood History: {{{moodHistory}}}
  `,
});

const summarizeMoodHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeMoodHistoryFlow',
    inputSchema: SummarizeMoodHistoryInputSchema,
    outputSchema: SummarizeMoodHistoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
