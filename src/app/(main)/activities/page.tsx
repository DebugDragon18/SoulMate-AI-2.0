"use client";

import * as React from 'react';
import Link from 'next/link';
import { BrainCircuit, Loader2, Music, Sparkles, Wind, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockMoodHistory } from '@/lib/data';
import type { Emotion } from '@/lib/types';
import { generateActivity, GenerateActivityOutput } from '@/ai/flows/generate-activity.ts';
import { generateMusicFromEmotion, GenerateMusicFromEmotionOutput } from '@/ai/flows/generate-music-from-emotion.ts';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const emotions: Emotion[] = ["Happy", "Sad", "Angry", "Stressed", "Anxious", "Neutral"];

function BreathingExercise() {
    const [breathingState, setBreathingState] = React.useState('Breathe In');
    const [key, setKey] = React.useState(0); // Used to restart the animation

    React.useEffect(() => {
        const sequence = ['Breathe In', 'Hold', 'Breathe Out', 'Hold'];
        let currentIndex = 0;

        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % sequence.length;
            setBreathingState(sequence[currentIndex]);
        }, 4000); // 4 seconds for each state

        return () => clearInterval(interval);
    }, [key]);

    const handleRestart = () => {
        setKey(prevKey => prevKey + 1);
    };

    return (
        <div className="flex flex-col items-center gap-6 text-center">
            <div
                className="relative flex h-64 w-64 items-center justify-center rounded-full bg-primary/20"
                style={{ animation: `${breathingState.replace(' ', '-').toLowerCase()} 4s ease-in-out infinite` }}
            >
                <div className="absolute h-full w-full rounded-full bg-primary/30" style={{ animation: `${breathingState.replace(' ', '-').toLowerCase()}-inner 4s ease-in-out infinite` }} />
                <span className="z-10 text-2xl font-semibold text-primary-foreground">{breathingState}</span>
            </div>
             <Button onClick={handleRestart} variant="outline">
                Restart Exercise
            </Button>
            <style jsx>{`
                @keyframes breathe-in {
                    0% { transform: scale(0.8); }
                    100% { transform: scale(1); }
                }
                @keyframes breathe-in-inner {
                    0% { transform: scale(0.7); }
                    100% { transform: scale(1); }
                }
                @keyframes breathe-out {
                    0% { transform: scale(1); }
                    100% { transform: scale(0.8); }
                }
                @keyframes breathe-out-inner {
                     0% { transform: scale(1); }
                    100% { transform: scale(0.7); }
                }
                @keyframes hold {
                    0% { transform: scale(1); }
                    100% { transform: scale(1); }
                }
                @keyframes hold-inner {
                    0% { transform: scale(1); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
}

function MusicDisplay({ music }: { music: GenerateMusicFromEmotionOutput }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Music /> Song Suggestion</CardTitle>
                <CardDescription>A Bollywood song to match your mood.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h3 className="text-xl font-semibold font-headline">{music.song}</h3>
                    <p className="text-muted-foreground">by {music.artist}</p>
                </div>
                <p className="italic">"{music.reason}"</p>
                <Button asChild>
                    <Link href={music.youtubeSearchUrl} target="_blank" rel="noopener noreferrer">
                        <Youtube className="mr-2"/>
                        Listen on YouTube
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}


function ActivityDisplay({ activity }: { activity: GenerateActivityOutput }) {
    switch (activity.activityType) {
        case 'breathing':
            return (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Wind /> {activity.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground whitespace-pre-wrap">{activity.content}</p>
                        <BreathingExercise />
                    </CardContent>
                </Card>
            );
        case 'story':
        case 'exercise':
            return (
                <Card>
                    <CardHeader>
                         <CardTitle className="flex items-center gap-2">
                            {activity.activityType === 'story' ? <BrainCircuit/> : <Sparkles />}
                            {activity.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-wrap">{activity.content}</p>
                    </CardContent>
                </Card>
            )
        default:
            return null;
    }
}


export default function ActivitiesPage() {
    const [selectedEmotion, setSelectedEmotion] = React.useState<Emotion | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isMusicLoading, setIsMusicLoading] = React.useState(false);
    const [activity, setActivity] = React.useState<GenerateActivityOutput | null>(null);
    const [music, setMusic] = React.useState<GenerateMusicFromEmotionOutput | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        // Suggest an emotion based on recent mood history
        const lastMood = mockMoodHistory[mockMoodHistory.length - 1]?.mood;
        if (lastMood && emotions.includes(lastMood)) {
            setSelectedEmotion(lastMood);
        }
    }, []);

    const handleGenerateActivity = async () => {
        if (!selectedEmotion) return;
        setIsLoading(true);
        setError(null);
        setActivity(null);
        setMusic(null);
        try {
            const result = await generateActivity({ emotion: selectedEmotion });
            setActivity(result);
        } catch (e) {
            console.error(e);
            setError("Sorry, I couldn't generate an activity right now. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGenerateMusic = async () => {
        if (!selectedEmotion) return;
        setIsMusicLoading(true);
        setError(null);
        setActivity(null);
        setMusic(null);
        try {
            const result = await generateMusicFromEmotion({ emotion: selectedEmotion });
            setMusic(result);
        } catch (e) {
            console.error(e);
            setError("Sorry, I couldn't generate music right now. Please try again.");
        } finally {
            setIsMusicLoading(false);
        }
    }


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-headline">VibeMatch</h1>
            <p className="text-muted-foreground">Discover activities and music tailored to your current mood.</p>
            
            <Card>
                <CardHeader>
                    <CardTitle>How are you feeling?</CardTitle>
                    <CardDescription>Select your current emotion to get a personalized activity or a musical piece.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <Select
                        onValueChange={(val) => setSelectedEmotion(val as Emotion)}
                        value={selectedEmotion ?? ''}
                    >
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Select an emotion" />
                        </SelectTrigger>
                        <SelectContent>
                            {emotions.map(emotion => (
                                <SelectItem key={emotion} value={emotion}>{emotion}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                        <Button onClick={handleGenerateActivity} disabled={!selectedEmotion || isLoading || isMusicLoading}>
                            {isLoading ? <><Loader2 className="mr-2 animate-spin" /> Generating...</> : 'Get My Activity'}
                        </Button>
                        <Button onClick={handleGenerateMusic} disabled={!selectedEmotion || isLoading || isMusicLoading} variant="outline">
                            {isMusicLoading ? <><Loader2 className="mr-2 animate-spin" /> Composing...</> : <><Music className="mr-2" />Suggest a Song</>}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {(isLoading || isMusicLoading) && (
                 <Card>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-1/3" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                            {isLoading && <Skeleton className="h-64 w-64 rounded-full mx-auto" />}
                             {isMusicLoading && (
                                <div className="space-y-4 pt-4">
                                    <Skeleton className="h-8 w-1/4" />
                                    <Skeleton className="h-10 w-full" />
                                     <Skeleton className="h-8 w-1/4" />
                                    <Skeleton className="h-10 w-full" />
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {error && (
                 <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {activity && (
                <ActivityDisplay activity={activity} />
            )}
            
            {music && (
                <MusicDisplay music={music} />
            )}

        </div>
    );
}
