"use client"

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Settings, MessageCircle, Book, TrendingUp, Sparkles, Users, UserRound, HeartHandshake, LogOut, LogIn } from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';

const navItems = [
    { href: '/chat', icon: MessageCircle, label: 'Chat' },
    { href: '/journal', icon: Book, label: 'MindLog' },
    { href: '/history', icon: TrendingUp, label: 'History' },
    { href: '/activities', icon: Sparkles, label: 'VibeMatch' },
    { href: '/forum', icon: Users, label: 'SoulConnect' },
    { href: '/growth', icon: UserRound, label: 'ThriveTrack' },
];

const settingsNav =  { href: '/settings', icon: Settings, label: 'Settings' };


export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, signOut, signInWithGoogle } = useAuth();
  const router = useRouter();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant='floating' className="bg-card/95 backdrop-blur-sm">
        <SidebarHeader className="p-4">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10">
                    <HeartHandshake className="size-6" />
                </Button>
                <h1 className="text-xl font-headline font-bold tracking-wider group-data-[collapsible=icon]:opacity-0 transition-opacity duration-200">SoulMate AI</h1>
              </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
            <div className="p-2 flex flex-col gap-2">
                 <Button>New Chat</Button>
            </div>
          <SidebarMenu>
            {navItems.map((item) => (
                 <SidebarMenuItem key={item.href}>
                    <Link href={item.href} className="w-full">
                        <SidebarMenuButton
                        isActive={pathname.startsWith(item.href)}
                        tooltip={item.label}
                        className="justify-start"
                        >
                        <item.icon className="size-5" />
                        <span className="group-data-[collapsible=icon]:opacity-0 transition-opacity duration-200">{item.label}</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="mt-auto">
            <SidebarMenu>
                 <SidebarMenuItem>
                    <Link href={settingsNav.href} className="w-full">
                    <SidebarMenuButton
                        isActive={pathname.startsWith(settingsNav.href)}
                        tooltip={settingsNav.label}
                        className="justify-start"
                    >
                        <settingsNav.icon className="size-5" />
                        <span className="group-data-[collapsible=icon]:opacity-0 transition-opacity duration-200">{settingsNav.label}</span>
                    </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                    <SidebarMenuButton
                        onClick={signOut}
                        tooltip="Sign Out"
                        className="justify-start"
                        variant="ghost"
                    >
                        <LogOut className="size-5" />
                        <span className="group-data-[collapsible=icon]:opacity-0 transition-opacity duration-200">Sign Out</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
            <Separator className="my-2" />
             <div className="p-4 flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={user?.photoURL ?? ''} alt={user?.displayName ?? 'User'} />
                    <AvatarFallback>{user?.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col group-data-[collapsible=icon]:opacity-0 transition-opacity duration-200">
                    <span className="font-semibold text-sm">{user?.displayName}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-transparent px-4 sm:px-6">
          <SidebarTrigger className="md:hidden"/>
          <div className="flex-1">
            {/* Can add breadcrumbs or page title here */}
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
