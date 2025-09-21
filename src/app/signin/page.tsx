"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { HeartHandshake, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Nunito } from 'next/font/google';

const fontBody = Nunito({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    variable: '--font-body',
  })

export default function SignInPage() {
  const { signInWithGoogle, user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && user) {
        router.push('/chat');
    }
  }, [user, loading, router])

  return (
    <div className={`min-h-screen flex items-center justify-center bg-background p-4 ${fontBody.variable} font-body`}>
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <Card className="w-full max-w-md shadow-2xl bg-card/80 backdrop-blur-lg">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
                <HeartHandshake className="size-10 text-primary" />
                <h1 className="text-4xl font-headline font-bold tracking-wider">SoulMate AI</h1>
            </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to continue your journey of self-discovery.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            className="w-full" 
            onClick={signInWithGoogle}
            disabled={loading}
          >
            <LogIn className="mr-2" />
            {loading ? "Signing in..." : "Sign in with Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
