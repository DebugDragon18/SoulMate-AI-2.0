"use client";

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Droplet, Users, Move, HeartHandshake, Lightbulb, Loader2, Award, TrendingUp, Sun } from 'lucide-react';
import { generateMicroAction, GenerateMicroActionOutput } from '@/ai/flows/generate-micro-action';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type WellnessState = 'flourishing' | 'balanced' | 'tired';

const FlowerPetal = ({ rotation, score, state }: { rotation: number, score: number, state: WellnessState }) => {
    const scale = state === 'flourishing' ? 1.1 : state === 'balanced' ? 1 : 0.8;
    const opacity = state === 'flourishing' ? 1 : state === 'balanced' ? 0.9 : 0.7;
    
    return (
        <ellipse
            cx="50"
            cy="20"
            rx={state === 'tired' ? "12" : "15"}
            ry="25"
            className="origin-bottom transition-all duration-1000"
            transform={`rotate(${rotation} 50 50) scale(${scale})`}
            opacity={opacity}
        />
    )
}

const WellnessAvatar = ({ score }: { score: number }) => {
    const state: WellnessState = score > 75 ? 'flourishing' : score > 40 ? 'balanced' : 'tired';
    
    const colors = {
        flourishing: { fill: 'url(#flourishing-gradient)', stroke: 'stroke-teal-300' },
        balanced: { fill: 'url(#balanced-gradient)', stroke: 'stroke-indigo-300' },
        tired: { fill: 'url(#tired-gradient)', stroke: 'stroke-slate-500' },
    };

    const currentStateColors = colors[state];
    const numPetals = 8;

    return (
        <div className={`relative flex h-64 w-64 items-center justify-center`}>
             <svg viewBox="0 0 100 100" className={`h-full w-full`}>
                <defs>
                    <radialGradient id="flourishing-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#a7f3d0" />
                        <stop offset="100%" stopColor="#34d399" />
                    </radialGradient>
                    <radialGradient id="balanced-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#a5b4fc" />
                        <stop offset="100%" stopColor="#818cf8" />
                    </radialGradient>
                     <radialGradient id="tired-gradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#94a3b8" />
                        <stop offset="100%" stopColor="#64748b" />
                    </radialGradient>
                </defs>
                 <g className={`${currentStateColors.fill} ${currentStateColors.stroke}`} strokeWidth="0.5">
                    {[...Array(numPetals)].map((_, i) => (
                        <FlowerPetal key={i} rotation={(360 / numPetals) * i} score={score} state={state} />
                    ))}
                </g>
                <circle cx="50" cy="50" r="18" fill="white" className="opacity-20" />
                <circle cx="50" cy="50" r="15" className="fill-yellow-300" />
            </svg>
        </div>
    );
};

const ActionIcon = ({ category }: { category: GenerateMicroActionOutput['category'] }) => {
    switch (category) {
        case 'mindfulness': return <Flame className="h-5 w-5" />;
        case 'hydration': return <Droplet className="h-5 w-5" />;
        case 'connection': return <Users className="h-5 w-5" />;
        case 'movement': return <Move className="h-5 w-5" />;
        case 'gratitude': return <HeartHandshake className="h-5 w-5" />;
        default: return <Lightbulb className="h-5 w-5" />;
    }
};

const progressBadges = [
    { id: 'streak', icon: Award, title: 'Consistency Streak', description: 'Complete an action 3 days in a row.'},
    { id: 'resilience', icon: TrendingUp, title: 'Resilience Builder', description: 'Turn a "tired" day into a "balanced" one.'},
    { id: 'calm', icon: Sun, title: 'Calm Master', description: 'Complete 5 mindfulness activities.'},
]

export default function GrowthPage() {
    const [wellnessScore, setWellnessScore] = React.useState(65); 
    const [action, setAction] = React.useState<GenerateMicroActionOutput | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    
    const wellnessState: WellnessState = wellnessScore > 75 ? 'flourishing' : wellnessScore > 40 ? 'balanced' : 'tired';

    const handleGetAction = async () => {
        setIsLoading(true);
        setError(null);
        setAction(null);
        try {
            const result = await generateMicroAction({ wellnessState });
            setAction(result);
        } catch (e) {
            console.error(e);
            setError("Sorry, I couldn't generate an action right now. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCompleteAction = () => {
        setWellnessScore(score => Math.min(100, score + 10));
        setAction(null);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold font-headline tracking-wide">ThriveTrack</h1>
                <p className="text-muted-foreground mt-1">This flower is your wellness twin. Watch it bloom as you nurture your mind.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-2 space-y-8">
                    <Card className="bg-card/80 backdrop-blur-sm border-white/5 shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl tracking-wide">Your Flower's Current State: <span className="capitalize text-primary">{wellnessState}</span></CardTitle>
                            <CardDescription>Your flower reflects your recent mood and activities.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-6">
                            <WellnessAvatar score={wellnessScore} />
                             <div className="w-full max-w-md space-y-2 text-center">
                                <p className="text-sm font-medium text-muted-foreground">Wellness Score: {wellnessScore}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card/80 backdrop-blur-sm border-white/5 shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl tracking-wide">Nurture Your Flower</CardTitle>
                            <CardDescription>Complete small actions to help your flower (and you) flourish.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <Button onClick={handleGetAction} disabled={isLoading}>
                                    {isLoading ? <><Loader2 className="mr-2 animate-spin" /> Suggesting...</> : 'Suggest a Micro-Action'}
                                </Button>

                                {error && (
                                    <Alert variant="destructive">
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
                                
                                {action && (
                                    <Alert className="bg-background/50 border-primary/20">
                                        <AlertTitle className="flex items-center gap-2 text-primary">
                                            <ActionIcon category={action.category} />
                                            <span>{action.category.charAt(0).toUpperCase() + action.category.slice(1)} Boost</span>
                                        </AlertTitle>
                                        <AlertDescription className="mt-2 space-y-4 text-foreground/80">
                                            <p>{action.action}</p>
                                            <Button size="sm" onClick={handleCompleteAction}>I did it! (+10)</Button>
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
                 <div className="md:col-span-1 space-y-6">
                     <Card className="bg-card/80 backdrop-blur-sm border-white/5 shadow-lg">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl tracking-wide">Achievements</CardTitle>
                             <CardDescription>Earn badges for your progress.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {progressBadges.map(badge => (
                                <div key={badge.id} className="flex items-center gap-4 p-3 bg-background/50 rounded-lg">
                                    <div className="p-2 bg-primary/20 text-primary rounded-md">
                                         <badge.icon className="size-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm">{badge.title}</h4>
                                        <p className="text-xs text-muted-foreground">{badge.description}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                     </Card>
                </div>
            </div>

        </div>
    );
}

    