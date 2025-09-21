'use server';
/**
 * @fileOverview A flow to generate a short musical piece based on an emotion.
 *
 * - generateMusicFromEmotion - A function that generates music from an emotion.
 * - GenerateMusicFromEmotionInput - The input type for the generateMusicFromEmotion function.
 * - GenerateMusicFromEmotionOutput - The return type for the generateMusicFromEmotion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateMusicFromEmotionInputSchema = z.object({
  emotion: z
    .string()
    .describe('The emotion to base the music on (e.g., Happy, Sad, Anxious).'),
});
export type GenerateMusicFromEmotionInput = z.infer<
  typeof GenerateMusicFromEmotionInputSchema
>;

const GenerateMusicFromEmotionOutputSchema = z.object({
  song: z.string().describe('The title of the Bollywood song.'),
  artist: z.string().describe('The artist(s) of the song.'),
  reason: z.string().describe('A short reason why this song fits the emotion.'),
  youtubeSearchUrl: z.string().url().describe('A YouTube search URL for the song.')
});
export type GenerateMusicFromEmotionOutput = z.infer<
  typeof GenerateMusicFromEmotionOutputSchema
>;

export async function generateMusicFromEmotion(
  input: GenerateMusicFromEmotionInput
): Promise<GenerateMusicFromEmotionOutput> {
  return generateMusicFromEmotionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMusicFromEmotionPrompt',
  input: {schema: GenerateMusicFromEmotionInputSchema},
  output: {schema: GenerateMusicFromEmotionOutputSchema},
  prompt: `You are an AI assistant with a deep knowledge of Bollywood music. Your task is to suggest a Bollywood song that matches the user's emotion: {{{emotion}}}.

  - If the emotion is "Happy," suggest an upbeat, celebratory song.
  - If the emotion is "Sad," suggest a comforting, soulful, or melancholic song.
  - If the emotion is "Anxious" or "Stressed," suggest a calming and soothing song.
  - If the emotion is "Angry," suggest a powerful, energetic song that can be a healthy outlet.
  - If the emotion is "Neutral," suggest a pleasant, easy-listening song.

  Provide the following:
  1.  'song': The song title.
  2.  'artist': The name of the primary singer(s).
  3.  'reason': A brief, one-sentence explanation of why this song is a good fit for the mood.
  4.  'youtubeSearchUrl': A valid YouTube search URL for the song and artist. For example: https://www.youtube.com/results?search_query=Song+Title+Artist+Name
  `,
});

const generateMusicFromEmotionFlow = ai.defineFlow(
  {
    name: 'generateMusicFromEmotionFlow',
    inputSchema: GenerateMusicFromEmotionInputSchema,
    outputSchema: GenerateMusicFromEmotionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
