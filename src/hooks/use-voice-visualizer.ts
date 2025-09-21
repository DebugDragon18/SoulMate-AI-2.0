
"use client";

import { useState, useEffect, useRef } from "react";

export type VisualizerState = "idle" | "recording" | "speaking";

export const useVoiceVisualizer = () => {
    const [visualizerState, setVisualizerState] = useState<VisualizerState>("idle");
    const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(0));
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const dataArrayRef = useRef<Uint8Array | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const audioPlayerSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

    const cleanup = (source: 'recording' | 'speaking' | 'all' = 'all') => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        if (analyserRef.current) {
            analyserRef.current.disconnect();
        }
        if (source === 'recording' || source === 'all') {
            if (mediaStreamSourceRef.current) {
                mediaStreamSourceRef.current.disconnect();
                mediaStreamSourceRef.current = null;
            }
        }
        if (source === 'speaking' || source === 'all') {
            if (audioPlayerSourceRef.current) {
                audioPlayerSourceRef.current.disconnect();
                audioPlayerSourceRef.current = null;
            }
        }
    };

    const setupAudioContext = () => {
        if (window.AudioContext && (!audioContextRef.current || audioContextRef.current.state === 'closed')) {
            audioContextRef.current = new window.AudioContext();
        }
        if (audioContextRef.current && (!analyserRef.current || !dataArrayRef.current)) {
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
            const bufferLength = analyserRef.current.frequencyBinCount;
            dataArrayRef.current = new Uint8Array(bufferLength);
        }
    };

    const visualize = () => {
        if (!analyserRef.current || !dataArrayRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        setAudioData(new Uint8Array(dataArrayRef.current));
        animationFrameRef.current = requestAnimationFrame(visualize);
    };

    const startRecordingVisualization = async () => {
        cleanup('speaking');
        setupAudioContext();
        if (!audioContextRef.current || !analyserRef.current) {
            throw new Error("Audio context not initialized");
        };

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (!mediaStreamSourceRef.current) {
                mediaStreamSourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
                mediaStreamSourceRef.current.connect(analyserRef.current);
            }
            setVisualizerState("recording");
            visualize();
            return stream;
        } catch (error) {
            console.error("Microphone access error:", error);
            setVisualizerState("idle");
            throw error;
        }
    };
    
    const startSpeakingVisualization = (audioPlayer: HTMLAudioElement) => {
        cleanup('recording');
        setupAudioContext();
        if (!audioContextRef.current || !analyserRef.current) return;
        
        if (audioPlayerRef.current !== audioPlayer || !audioPlayerSourceRef.current) {
             if(audioPlayerSourceRef.current) {
                audioPlayerSourceRef.current.disconnect();
            }
            audioPlayerRef.current = audioPlayer;
            audioPlayerSourceRef.current = audioContextRef.current.createMediaElementSource(audioPlayer);
            audioPlayerSourceRef.current.connect(analyserRef.current);
            audioPlayerSourceRef.current.connect(audioContextRef.current.destination);
        }
        
        setVisualizerState("speaking");
        visualize();

        audioPlayer.onended = () => {
           stopVisualization();
        };
    };

    const stopVisualization = () => {
        cleanup('all');
        setAudioData(new Uint8Array(0));
        setVisualizerState("idle");
    };

    useEffect(() => {
        return () => {
            cleanup('all');
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, []);

    return {
        visualizerState,
        audioData,
        startRecordingVisualization,
        startSpeakingVisualization,
        stopVisualization,
    };
};
