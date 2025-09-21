"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, RadialBarChart, RadialBar, Legend, PolarAngleAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { mockMoodHistory } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { summarizeMoodHistory } from "@/ai/flows/summarize-mood-history"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Lightbulb, Smile } from "lucide-react"

const chartConfig = {
  Happy: { label: "Happy", color: "hsl(var(--chart-1))", icon: Smile },
  Sad: { label: "Sad", color: "hsl(var(--chart-2))", icon: Smile },
  Angry: { label: "Angry", color: "hsl(var(--chart-3))", icon: Smile },
  Stressed: { label: "Stressed", color: "hsl(var(--chart-4))", icon: Smile },
  Neutral: { label: "Neutral", color: "hsl(var(--chart-5))", icon: Smile },
  Anxious: { label: "Anxious", color: "hsl(var(--chart-2))", icon: Smile },
} satisfies ChartConfig

export default function MoodHistoryPage() {
    const [summary, setSummary] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const data = Object.entries(
        mockMoodHistory.reduce((acc, entry) => {
            acc[entry.mood] = (acc[entry.mood] || 0) + 1;
            return acc;
        }, {} as Record<string, number>)
    ).map(([mood, count]) => ({
        name: mood,
        value: count,
        fill: chartConfig[mood as keyof typeof chartConfig]?.color
    }));


    const handleGetSummary = async () => {
        setIsLoading(true);
        setSummary(null);
        try {
            const historyString = mockMoodHistory.map(e => `${e.date}: ${e.mood}`).join('\n');
            const result = await summarizeMoodHistory({ moodHistory: historyString });
            setSummary(result.summary);
        } catch (error) {
            console.error("Failed to get summary:", error);
            setSummary("Sorry, I couldn't generate a summary right now. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-4xl font-bold font-headline tracking-wide">Your Mood History</h1>
            <p className="text-muted-foreground mt-1">A gentle look at your emotional journey over time.</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-card/80 backdrop-blur-sm border-white/5 shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl tracking-wide">Mood Constellation</CardTitle>
                    <CardDescription>How your feelings have been distributed recently.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                        <RadialBarChart 
                            data={data} 
                            innerRadius="30%" 
                            outerRadius="100%" 
                            startAngle={90}
                            endAngle={-270}
                        >
                            <PolarAngleAxis type="number" domain={[0, 10]} angleAxisId={0} tick={false} />
                            <RadialBar background dataKey="value" cornerRadius={8} />
                            <Legend
                                iconSize={10}
                                iconType="circle"
                                layout="vertical"
                                verticalAlign="middle"
                                align="right"
                                wrapperStyle={{
                                    fontSize: '0.8rem',
                                    fontWeight: 500,
                                }}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                        </RadialBarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm border-white/5 shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl tracking-wide">AI-Powered Reflection</CardTitle>
                    <CardDescription>A personalized summary of your mood trends from your AI companion.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Button onClick={handleGetSummary} disabled={isLoading}>
                            {isLoading ? "Generating..." : "Generate My Reflection"}
                        </Button>
                        {isLoading && <Skeleton className="h-24 w-full bg-background/50" />}
                        {summary && (
                            <Alert className="bg-background/50 border-primary/20">
                                <Lightbulb className="h-5 w-5 text-primary" />
                                <AlertTitle className="font-headline tracking-wide text-primary">Your Reflection</AlertTitle>
                                <AlertDescription className="text-foreground/80 mt-2">
                                {summary}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
