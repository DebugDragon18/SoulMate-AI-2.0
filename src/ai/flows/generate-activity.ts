'use server';
/**
 * @fileOverview A flow to generate personalized activities based on mood.
 *
 * - generateActivity - A function that generates an activity suggestion.
 * - GenerateActivityInput - The input type for the generateActivity function.
 * - GenerateActivityOutput - The return type for the generateActivity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateActivityInputSchema = z.object({
  emotion: z
    .string()
    .describe('The user\'s current emotion (e.g., Happy, Sad, Stressed, Anxious).'),
});
export type GenerateActivityInput = z.infer<
  typeof GenerateActivityInputSchema
>;

const GenerateActivityOutputSchema = z.object({
  activityType: z
    .enum(['breathing', 'story', 'exercise', 'music'])
    .describe(
      'The type of activity generated: "breathing" for guided breathing, "story" for a short motivational story, "exercise" for a creative or mindfulness exercise, or "music" for a generated musical piece.'
    ),
  title: z.string().describe('The title of the activity.'),
  content: z.string().describe('The detailed content or instructions for the activity.'),
});
export type GenerateActivityOutput = z.infer<
  typeof GenerateActivityOutputSchema
>;

export async function generateActivity(
  input: GenerateActivityInput
): Promise<GenerateActivityOutput> {
  return generateActivityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateActivityPrompt',
  input: {schema: GenerateActivityInputSchema},
  output: {schema: GenerateActivityOutputSchema},
  prompt: `You are an AI assistant creating therapeutic activities for a mental health app.
  The user is feeling {{{emotion}}}. 
  
  Based on their emotion, generate a suitable activity.
  
  - If the emotion is "Stressed" or "Anxious", the activityType should be "breathing". Provide a title and content for a simple guided breathing exercise. The content should guide them through a few cycles of breathing.
  - If the emotion is "Sad", the activityType should be "story". Write a short, uplifting story (2-3 paragraphs) with a gentle, hopeful message.
  - If the emotion is "Angry", "Happy", or "Neutral", the activityType should be "exercise". Create a simple mindfulness or creative exercise. For example, a "5 senses" grounding exercise, a short doodling prompt, or a gratitude journaling prompt.
  - If the emotion is "Happy" or "Anxious", you can also suggest "music". Create a title for a piece of music and set the content to a description of the music that would be generated.
  
  Generate a concise title and content for the chosen activity.`,
});

const generateActivityFlow = ai.defineFlow(
  {
    name: 'generateActivityFlow',
    inputSchema: GenerateActivityInputSchema,
    outputSchema: GenerateActivityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
