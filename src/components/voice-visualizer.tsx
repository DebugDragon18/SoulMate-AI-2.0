
"use client";

import * as React from "react";
import { Mic, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { type VisualizerState } from "@/hooks/use-voice-visualizer";

interface VoiceVisualizerProps {
  visualizerState: VisualizerState;
  onMicClick: () => void;
  onCloseClick: () => void;
  isLoading: boolean;
  avatarUrl?: string;
}

export function VoiceVisualizer({ visualizerState, onMicClick, onCloseClick, isLoading, avatarUrl }: VoiceVisualizerProps) {
    const isRecording = visualizerState === 'recording';
    const isSpeaking = visualizerState === 'speaking';

    return (
        <div className="absolute inset-0 z-50 bg-background/90 backdrop-blur-md flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full flex items-center justify-center">
                 {/* Base circle with avatar */}
                <div 
                    className={cn(
                        "absolute inset-0 rounded-full bg-cover bg-center transition-transform duration-500",
                        isSpeaking ? 'animate-pulse-slow' : 'scale-75'
                    )}
                    style={{ backgroundImage: `url(${avatarUrl})` }}
                />

                {/* Animated blobs for speaking effect */}
                {isSpeaking && (
                    <>
                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-blob animation-delay-0"></div>
                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-blob animation-delay-2000"></div>
                        <div className="absolute inset-0 rounded-full bg-primary/20 animate-blob animation-delay-4000"></div>
                    </>
                )}

                 {/* Recording ring */}
                {isRecording && (
                    <div className="absolute inset-[-1rem] border-2 border-primary rounded-full animate-pulse-border"></div>
                )}
            </div>
            
            <div className="absolute bottom-16 flex items-center gap-8">
                <button
                    onClick={onMicClick}
                    disabled={isLoading}
                    className={cn(
                        "group z-10 flex h-16 w-16 items-center justify-center rounded-full bg-card/80 border-2 border-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
                        isRecording ? "bg-destructive/80 border-destructive" : ""
                    )}
                >
                    <Mic className="h-8 w-8 text-foreground" />
                </button>
                 <button
                    onClick={onCloseClick}
                    className="z-10 flex h-16 w-16 items-center justify-center rounded-full bg-card/80 border-2 border-white/10 transition-all duration-300"
                >
                    <X className="h-8 w-8 text-foreground" />
                </button>
            </div>
            <style jsx>{`
                @keyframes blob {
                    0% { transform: scale(1); opacity: 0.7; }
                    50% { transform: scale(1.3); opacity: 0.3; }
                    100% { transform: scale(1); opacity: 0.7; }
                }
                .animate-blob {
                    animation: blob 6s infinite ease-in-out;
                }
                .animation-delay-2000 {
                    animation-delay: -2s;
                }
                .animation-delay-4000 {
                    animation-delay: -4s;
                }

                @keyframes pulse-slow {
                    0%, 100% { transform: scale(0.75); }
                    50% { transform: scale(0.8); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s infinite ease-in-out;
                }
                
                @keyframes pulse-border {
                     0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.7; }
                }
                .animate-pulse-border {
                     animation: pulse-border 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
                }
            `}</style>
        </div>
    );
}
