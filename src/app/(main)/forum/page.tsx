"use client";

import * as React from 'react';
import { Plus, Bot, Heart, Zap, MessageSquareHeart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mockForumPosts, mockForumReplies } from '@/lib/data';
import type { ForumPost, ForumPostReply } from '@/lib/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { generateIcebreakerPost } from '@/ai/flows/generate-icebreaker-post';

function ReactionButton({ icon: Icon, label, count }: { icon: React.ElementType, label: string, count: number }) {
    const [isClicked, setIsClicked] = React.useState(false);
    const [localCount, setLocalCount] = React.useState(count);

    const handleClick = () => {
        if (isClicked) {
            setLocalCount(localCount - 1);
        } else {
            setLocalCount(localCount + 1);
        }
        setIsClicked(!isClicked);
    };

    return (
        <Button variant="ghost" size="sm" className={`flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors ${isClicked ? 'text-primary' : ''}`} onClick={handleClick}>
            <Icon className={`size-4 transition-transform ${isClicked ? 'scale-110' : ''}`} />
            <span className="text-xs font-semibold">{localCount}</span>
            <span className="sr-only">{label}</span>
        </Button>
    )
}

export default function ForumPage() {
    const [posts, setPosts] = React.useState<ForumPost[]>(mockForumPosts);
    const [newPostTitle, setNewPostTitle] = React.useState('');
    const [newPostContent, setNewPostContent] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isGenerating, setIsGenerating] = React.useState(false);
    const { toast } = useToast();

    const handleCreatePost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPostTitle.trim() || !newPostContent.trim()) {
            toast({
                variant: "destructive",
                title: "Incomplete Post",
                description: "Please provide both a title and content for your post.",
            });
            return;
        }

        setIsSubmitting(true);
        const newPost: ForumPost = {
            id: uuidv4(),
            title: newPostTitle,
            content: newPostContent,
            author: 'Anonymous',
            timestamp: new Date().toISOString(),
            reactions: { hug: 0, strength: 0, relatable: 0 },
        };

        // Simulate network delay
        setTimeout(() => {
            setPosts(prev => [newPost, ...prev]);
            setNewPostTitle('');
            setNewPostContent('');
            setIsSubmitting(false);
            toast({
                title: "Post Created",
                description: "Your post has been shared with the community.",
            });
            // We would close the dialog here, but DialogClose is used instead.
        }, 500);
    };

    const handleGenerateIcebreaker = async () => {
        setIsGenerating(true);
        try {
            const icebreaker = await generateIcebreakerPost();
            const newPost: ForumPost = {
                id: uuidv4(),
                ...icebreaker,
                author: 'AI Icebreaker',
                timestamp: new Date().toISOString(),
                reactions: { hug: 0, strength: 0, relatable: 0 },
            };
            setPosts(prev => [newPost, ...prev]);
            toast({
                title: "AI Icebreaker Posted",
                description: "A new conversation has been started.",
            });
        } catch (error) {
            console.error("Failed to generate icebreaker:", error);
            toast({
                variant: "destructive",
                title: "AI Error",
                description: "Could not generate an icebreaker post right now.",
            });
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold font-headline tracking-wide">SoulConnect</h1>
                    <p className="text-muted-foreground mt-1">Share your experiences and connect with peers anonymously.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleGenerateIcebreaker} disabled={isGenerating} variant="outline" size="sm">
                        <Bot className="mr-2" />
                        {isGenerating ? "Generating..." : "AI Icebreaker"}
                    </Button>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button size="sm">
                                <Plus className="mr-2" />
                                New Post
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create a new post</DialogTitle>
                                <DialogDescription>
                                    Share what's on your mind. Your post will be anonymous.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleCreatePost}>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="title" className="text-right">
                                            Title
                                        </Label>
                                        <Input
                                            id="title"
                                            value={newPostTitle}
                                            onChange={(e) => setNewPostTitle(e.target.value)}
                                            className="col-span-3"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-start gap-4">
                                        <Label htmlFor="content" className="text-right pt-2">
                                            Content
                                        </Label>
                                        <Textarea
                                            id="content"
                                            value={newPostContent}
                                            onChange={(e) => setNewPostContent(e.target.value)}
                                            className="col-span-3 min-h-32"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                     <DialogClose asChild>
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? 'Posting...' : 'Post'}
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="space-y-4">
                {posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}


function PostCard({ post }: { post: ForumPost }) {
    const replies = mockForumReplies.filter(r => r.postId === post.id);

    return (
        <Card className="bg-card/80 backdrop-blur-sm border-white/5 shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-2xl tracking-wide">{post.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 pt-1">
                    {post.author === 'AI Icebreaker' ? (
                        <Avatar className="h-6 w-6 border-2 border-primary/50">
                            <AvatarFallback><Bot className="size-4" /></AvatarFallback>
                        </Avatar>
                    ) : (
                         <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white">A</AvatarFallback>
                        </Avatar>
                    )}
                    <span className="font-semibold">By {post.author}</span>
                    <span className="text-xs text-muted-foreground/80">
                        • {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
                    </span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="mb-6 text-foreground/90 leading-relaxed">{post.content}</p>
                
                <div className="flex items-center gap-2 mb-6">
                    <ReactionButton icon={Heart} label="Hug" count={post.reactions.hug} />
                    <ReactionButton icon={Zap} label="Strength" count={post.reactions.strength} />
                    <ReactionButton icon={MessageSquareHeart} label="Relatable" count={post.reactions.relatable} />
                </div>
                
                {replies.length > 0 && (
                    <div className="space-y-4 mt-4 pt-4 border-t border-white/10">
                         {replies.map(reply => (
                            <div key={reply.id} className="flex gap-3">
                                 <Avatar className="h-8 w-8">
                                    <AvatarFallback className="bg-gradient-to-br from-teal-400 to-blue-500 text-white text-xs">A</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-sm">Anonymous</span>
                                        <span className="text-xs text-muted-foreground">
                                            • {formatDistanceToNow(new Date(reply.timestamp), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-foreground/80">{reply.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                 <div className="mt-6 flex gap-2">
                    <Input placeholder="Write a supportive reply..." className="flex-1 h-9 bg-background/50 border-white/10" />
                    <Button size="sm">Reply</Button>
                </div>
            </CardContent>
        </Card>
    );
}

    