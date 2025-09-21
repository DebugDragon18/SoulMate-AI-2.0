export type Character = {
  id: string;
  name: string;
  avatar: string;
  personality: 'friend' | 'mentor' | 'therapist';
  description: string;
  voice: string;
};

export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  character?: Character;
  isSos?: boolean;
};

export type Emotion = 'Happy' | 'Sad' | 'Angry' | 'Stressed' | 'Neutral' | 'Anxious';

export type MoodEntry = {
  date: string;
  mood: Emotion;
};

export type ForumPost = {
  id: string;
  title: string;
  content: string;
  author: string; // "Anonymous" or "AI Icebreaker"
  timestamp: string;
  reactions: {
    hug: number;
    strength: number;
    relatable: number;
  }
};

export type ForumPostReply = {
  id: string;
  postId: string;
  author: string;
  content: string;
  timestamp: string;
};

export type TextToSpeechResponse = {
  audioDataUri: string;
};
