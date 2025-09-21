
"use client";

import * as React from 'react';
import Link from 'next/link';
import { CornerDownLeft, Mic, X, Book, TrendingUp, Sparkles, Users, UserRound } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessage } from '@/components/chat-message';
import type { Message, Character } from '@/lib/types';
import { characters } from '@/lib/data';
import { personalizeResponse } from '@/ai/flows/personalize-responses-based-on-emotion';
import { provideSOSResourcesForDistress } from '@/ai/flows/provide-sos-resources-for-distress';
import { speechToText } from '@/ai/flows/speech-to-text';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { analyzeEmotion } from '@/ai/flows/analyze-emotion';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useVoiceVisualizer } from '@/hooks/use-voice-visualizer';
import { VoiceVisualizer } from '@/components/voice-visualizer';

const featureCards = [
    { href: '/journal', icon: Book, title: 'MindLog', description: 'Record your thoughts and feelings.' },
    { href: '/history', icon: TrendingUp, title: 'Mood History', description: 'Visualize your emotional journey.' },
    { href: '/activities', icon: Sparkles, title: 'VibeMatch', description: 'Music & tasks for every emotion' },
    { href: '/forum', icon: Users, title: 'SoulConnect', description: 'Connect with the community.' },
    { href: '/growth', icon: UserRound, title: 'ThriveTrack', description: 'Each step makes your avatar stronger'},
];

function FeatureCard({ href, icon: Icon, title, description }: typeof featureCards[0]) {
    return (
        <Link href={href}>
            <Card className="h-full hover:bg-card/90 transition-colors hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="p-2 bg-primary/20 text-primary rounded-lg">
                        <Icon className="size-6" />
                    </div>
                    <div>
                        <CardTitle>{title}</CardTitle>
                        <CardDescription>{description}</CardDescription>
                    </div>
                </CardHeader>
            </Card>
        </Link>
    )
}


export default function ChatPage() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const [selectedCharacter, setSelectedCharacter] = React.useState<Character>(characters[0]);
  const { toast } = useToast();
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const audioPlayerRef = React.useRef<HTMLAudioElement | null>(null);

  const {
      visualizerState,
      startRecordingVisualization,
      startSpeakingVisualization,
      stopVisualization
  } = useVoiceVisualizer();

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleCharacterChange = (id: string) => {
    const character = characters.find(c => c.id === id);
    if (character) {
      setSelectedCharacter(character);
      setMessages([]); // Reset chat on character change
    }
  };

  const playAudio = (audioDataUri: string) => {
    if (audioPlayerRef.current) {
        audioPlayerRef.current.src = audioDataUri;
        audioPlayerRef.current.load();
        const playPromise = audioPlayerRef.current.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                startSpeakingVisualization(audioPlayerRef.current!);
            }).catch(e => console.error("Audio play failed:", e));
        }
    }
  }

  const handleSendMessage = async (e: React.FormEvent, messageContent?: string) => {
    e.preventDefault();
    const content = messageContent || input;
    if (!content.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        // 1. Check for distress
        const distressCheck = await provideSOSResourcesForDistress({ userInput: content });
        if (distressCheck.isDistressed) {
            const sosMessage: Message = {
                id: uuidv4(),
                role: 'assistant',
                content: distressCheck.sosMessage,
                isSos: true,
            };
            setMessages(prev => [...prev, sosMessage]);
            setIsLoading(false);
            return;
        }

        // 2. Analyze emotion
        const emotionAnalysis = await analyzeEmotion({ text: content });

        // 3. Get AI response
        const recentContext = messages.slice(-4).map(m => `${m.role}: ${m.content}`).join('\n');
        
        const response = await personalizeResponse({
            message: content,
            emotion: emotionAnalysis.emotion,
            chatbotPersonality: selectedCharacter.personality,
            context: recentContext,
        });

        // 4. Convert response to speech
        const ttsResponse = await textToSpeech({ text: response.response, voice: selectedCharacter.voice });
        playAudio(ttsResponse.audioDataUri);

        const assistantMessage: Message = {
            id: uuidv4(),
            role: 'assistant',
            content: response.response,
            character: selectedCharacter,
        };
        setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
        console.error("AI Error:", error);
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem communicating with the AI. Please try again.",
        });
    } finally {
        setIsLoading(false);
        if (visualizerState !== 'speaking') {
            stopVisualization();
        }
    }
  };

    const stopAudioAndVisualization = () => {
        if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
            audioPlayerRef.current.currentTime = 0;
        }
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        stopVisualization();
        setIsRecording(false);
    }

  const handleMicClick = async () => {
    if (audioPlayerRef.current?.played && !audioPlayerRef.current.paused) {
        stopAudioAndVisualization();
        return;
    }
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      // onstop will handle the rest
      return;
    }

    try {
      const stream = await startRecordingVisualization();
      setIsRecording(true);

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        stopVisualization();
        setIsRecording(false);
        
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        audioChunksRef.current = []; // Clear chunks for next recording
        
        // Don't process if blob is empty
        if (audioBlob.size === 0) return;

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          setIsLoading(true);
          try {
            const {text} = await speechToText({audioDataUri: base64Audio});
            if (text) {
                // Creates a synthetic event to pass to handleSendMessage
                const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                await handleSendMessage(fakeEvent, text);
            }
          } catch (error) {
            console.error("Speech-to-text error:", error);
            toast({
              variant: "destructive",
              title: "Speech Recognition Error",
              description: "Could not understand the audio. Please try again.",
            });
          } finally {
            setIsLoading(false);
          }
        };
        // Clean up the stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("Microphone access error:", error);
      setIsRecording(false);
      stopVisualization();
      toast({
        variant: "destructive",
        title: "Microphone Error",
        description: "Could not access the microphone. Please check your browser permissions.",
      });
    }
  };


  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col max-w-4xl mx-auto w-full">
      <audio ref={audioPlayerRef} className="hidden" />
      
       {visualizerState !== 'idle' && (
           <VoiceVisualizer
                visualizerState={visualizerState}
                onMicClick={handleMicClick}
                onCloseClick={stopAudioAndVisualization}
                isLoading={isLoading}
                avatarUrl={selectedCharacter.avatar}
            />
       )}

      <div className={`flex-1 overflow-y-auto pr-4 custom-scrollbar ${visualizerState !== 'idle' ? 'hidden' : ''}`}>
        <div className="space-y-6">
            {messages.length === 0 && !isLoading && (
                 <div className="flex flex-col items-center text-center pt-8">
                    <img src={selectedCharacter.avatar} data-ai-hint="friendly robot" alt={selectedCharacter.name} className="w-24 h-24 rounded-full mb-4" />
                    <h2 className="text-3xl font-bold font-headline">How can I help you today?</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 w-full max-w-2xl">
                        {featureCards.map(card => <FeatureCard key={card.href} {...card} />)}
                    </div>
                </div>
            )}
            {messages.map(message => (
                <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && visualizerState !== 'speaking' && (
                <div className="flex items-start gap-3">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="w-full space-y-2">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>
            )}
            <div ref={bottomRef} />
        </div>
      </div>

      <div className={`mt-4 shrink-0 ${visualizerState !== 'idle' ? 'hidden' : ''}`}>
        <form onSubmit={(e) => handleSendMessage(e)} className="relative">
          <Textarea
            placeholder={`Message ${selectedCharacter.name}...`}
            className="min-h-14 resize-none pr-24 pl-6 py-4 rounded-2xl bg-card/80 backdrop-blur-sm border-white/10 shadow-lg"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    handleSendMessage(e);
                }
            }}
            disabled={isLoading || isRecording}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
            <Button type="button" size="icon" variant={"ghost"} onClick={handleMicClick} disabled={isLoading}>
              <Mic className="size-4" />
              <span className="sr-only">Use microphone</span>
            </Button>
            <Button type="submit" size="icon" disabled={isLoading || isRecording || !input.trim()}>
              <CornerDownLeft className="size-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </form>
        <div className="flex items-center justify-between pt-4">
            <Select onValueChange={handleCharacterChange} defaultValue={selectedCharacter.id} disabled={isLoading}>
                <SelectTrigger className="w-[180px] h-9 text-xs bg-transparent border-white/10">
                    <SelectValue placeholder="Select a character" />
                </SelectTrigger>
                <SelectContent>
                    {characters.map(char => (
                        <SelectItem key={char.id} value={char.id}>{char.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
                SoulMate AI may produce inaccurate information about people, places, or facts.
            </p>
        </div>
      </div>
       <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: hsl(var(--muted));
            border-radius: 10px;
            border: 2px solid hsl(var(--background));
        }
        .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: hsl(var(--muted)) hsl(var(--background));
        }
    `}</style>
    </div>
  );
}
