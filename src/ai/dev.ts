import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-mood-history.ts';
import '@/ai/flows/personalize-responses-based-on-emotion.ts';
import '@/ai/flows/provide-sos-resources-for-distress.ts';
import '@/ai/flows/speech-to-text.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/analyze-emotion.ts';
import '@/ai/flows/generate-icebreaker-post.ts';
import '@/ai/flows/generate-activity.ts';
import '@/ai/flows/generate-micro-action.ts';
import '@/ai/flows/generate-music-from-emotion.ts';
