import type { Character, MoodEntry, ForumPost, ForumPostReply } from '@/lib/types';

export const characters: Character[] = [
  {
    id: 'friend-ira',
    name: 'Ira',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxGZW1hbGV8ZW58MHx8fHwxNzU4MzA1NzkxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    personality: 'friend',
    description: 'A warm and supportive friend who is always there to listen.',
    voice: 'vindemiatrix' // A warm and friendly female voice
  },
  {
    id: 'mentor-ariv',
    name: 'Ariv',
    avatar: 'https://images.unsplash.com/photo-1524666041070-9d87656c25bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMXx8bWFsZSUyMHxlbnwwfHx8fDE3NTgzNjM4Mjd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    personality: 'mentor',
    description: 'A wise mentor offering guidance and perspective.',
    voice: 'zubenelgenubi' // A calm and deep male voice
  },
  {
    id: 'therapist-dr-aarav',
    name: 'Dr. Aarav',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxEb2N0b3J8ZW58MHx8fHwxNzU4MzA1ODU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    personality: 'therapist',
    description: 'A professional and empathetic therapist.',
    voice: 'sadachbia' // A professional and soothing male voice
  },
];

export const mockMoodHistory: MoodEntry[] = [
    { date: "2024-07-01", mood: "Happy" },
    { date: "2024-07-02", mood: "Neutral" },
    { date: "2024-07-03", mood: "Stressed" },
    { date: "2024-07-04", mood: "Sad" },
    { date: "2024-07-05", mood: "Happy" },
    { date: "2024-07-06", mood: "Stressed" },
    { date: "2024-07-07", mood: "Angry" },
    { date: "2024-07-08", mood: "Neutral" },
    { date: "2024-07-09", mood: "Happy" },
    { date: "2024-07-10", mood: "Anxious" },
];

export const mockForumPosts: ForumPost[] = [
  {
    id: '1',
    title: 'What small victories have you celebrated this week?',
    content: 'It could be anything from getting out of bed to finishing a project. Let\'s share some positivity!',
    author: 'AI Icebreaker',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reactions: { hug: 12, strength: 5, relatable: 23 },
  },
  {
    id: '2',
    title: 'Feeling overwhelmed with school lately',
    content: 'It feels like there\'s a mountain of assignments and exams. How do you all cope with academic stress? Any tips would be appreciated.',
    author: 'Anonymous',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    reactions: { hug: 30, strength: 18, relatable: 45 },
  },
  {
    id: '3',
    title: 'How do you practice self-care on a budget?',
    content: 'A lot of self-care ideas I see online cost money. What are some free or cheap ways you take care of your mental health?',
    author: 'Anonymous',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: { hug: 42, strength: 15, relatable: 60 },
  }
];

export const mockForumReplies: ForumPostReply[] = [
    {
        id: 'r1',
        postId: '2',
        author: 'Anonymous',
        content: 'I feel you. I try to break things down into smaller tasks and just focus on one at a time. It makes it feel less daunting.',
        timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'r2',
        postId: '2',
        author: 'Anonymous',
        content: 'Taking short breaks to walk or listen to music really helps me reset.',
        timestamp: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'r3',
        postId: '3',
        author: 'Anonymous',
        content: 'Going for a walk in a park is my go-to! Nature is so calming.',
        timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    }
];
