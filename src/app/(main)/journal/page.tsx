"use client";

import * as React from 'react';
import { CornerDownLeft, Mic, Square, Sparkles, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { speechToText } from '@/ai/flows/speech-to-text';
import { analyzeEmotion } from '@/ai/flows/analyze-emotion';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function JournalPage() {
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [analysis, setAnalysis] = React.useState<{ emotion: string; summary: string } | null>(null);
  const { toast } = useToast();
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

  const handleMicClick = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          setIsLoading(true);
          setInput('Transcribing audio...');
          try {
            const { text } = await speechToText({ audioDataUri: base64Audio });
            setInput(text);
          } catch (error) {
            console.error("Speech-to-text error:", error);
            toast({
              variant: "destructive",
              title: "Speech Recognition Error",
              description: "Could not understand the audio. Please try again.",
            });
            setInput('');
          } finally {
            setIsLoading(false);
          }
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setInput('Recording... Click the mic again to stop.');
      setAnalysis(null);
    } catch (error) {
      console.error("Microphone access error:", error);
      toast({
        variant: "destructive",
        title: "Microphone Error",
        description: "Could not access the microphone. Please check your browser permissions.",
      });
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isRecording) return;

    setIsLoading(true);
    setAnalysis(null);

    try {
      const result = await analyzeEmotion({ text: input });
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis Error:", error);
      toast({
          variant: "destructive",
          title: "Analysis Failed",
          description: "There was a problem analyzing your thoughts. Please try again.",
      });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold font-headline">MindLog</h1>
        <p className="text-muted-foreground">Record your thoughts and feelings, and let your AI companion offer some insight.</p>
        
        <Card>
            <CardHeader>
                <CardTitle>New Entry</CardTitle>
                <CardDescription>How are you feeling today? What's on your mind?</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleAnalyze} className="space-y-4">
                <Textarea
                    placeholder="Write about your day, your feelings, or anything on your mind..."
                    className="min-h-48 resize-y"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    disabled={isLoading || isRecording}
                />
                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <Button type="submit" disabled={isLoading || isRecording || !input.trim()}>
                            <Sparkles className="mr-2" />
                            Analyze
                        </Button>
                        <Button type="button" size="icon" variant={isRecording ? "destructive" : "outline"} onClick={handleMicClick} disabled={isLoading}>
                            {isRecording ? <Square className="size-4" /> : <Mic className="size-4" />}
                            <span className="sr-only">{isRecording ? "Stop recording" : "Use microphone"}</span>
                        </Button>
                    </div>
                     <p className="text-xs text-muted-foreground">
                        Your journal entries are private and secure.
                    </p>
                </div>
                </form>
            </CardContent>
        </Card>

        {isLoading && (
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                    </div>
                </CardContent>
            </Card>
        )}

        {analysis && (
            <Card>
                <CardHeader>
                    <CardTitle>AI Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                    <Alert>
                        <AlertTitle className="flex items-center gap-2">
                           <Sparkles className="h-4 w-4" /> Detected Emotion: {analysis.emotion}
                        </AlertTitle>
                        <AlertDescription>
                           {analysis.summary}
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
