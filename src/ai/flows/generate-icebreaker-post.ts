'use server';

/**
 * @fileOverview A flow to generate an icebreaker post for a support forum.
 *
 * - generateIcebreakerPost - A function that generates a new icebreaker post.
 * - GenerateIcebreakerPostOutput - The return type for the generateIcebreakerPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateIcebreakerPostOutputSchema = z.object({
  title: z.string().describe('The engaging title of the icebreaker post.'),
  content: z.string().describe('The main content of the post, posing a question or a topic for discussion.'),
});
export type GenerateIcebreakerPostOutput = z.infer<typeof GenerateIcebreakerPostOutputSchema>;

export async function generateIcebreakerPost(): Promise<GenerateIcebreakerPostOutput> {
  return generateIcebreakerPostFlow();
}

const prompt = ai.definePrompt({
  name: 'generateIcebreakerPostPrompt',
  output: {schema: GenerateIcebreakerPostOutputSchema},
  prompt: `You are an AI assistant for a youth mental health app. 
  Your task is to generate an "icebreaker" post for an anonymous peer-support forum.
  The goal is to start a gentle, positive, and engaging conversation.
  
  The post should be a question or a topic that is easy for anyone to answer and encourages sharing of experiences.
  
  Examples of good topics:
  - What's a small thing that made you smile recently?
  - What's a song or movie that you turn to for comfort?
  - Share a simple self-care tip that works for you.
  
  Avoid anything too deep, controversial, or potentially triggering. Keep it light and supportive.
  
  Generate a title and content for the post.`,
});

const generateIcebreakerPostFlow = ai.defineFlow(
  {
    name: 'generateIcebreakerPostFlow',
    outputSchema: GenerateIcebreakerPostOutputSchema,
  },
  async () => {
    const {output} = await prompt();
    return output!;
  }
);
