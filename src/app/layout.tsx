import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Lilita_One, Nunito } from 'next/font/google';
import { AuthProvider } from '@/hooks/use-auth';

export const metadata: Metadata = {
  title: 'SoulMate AI',
  description: 'Your AI-powered emotional companion.',
};

const fontHeadline = Lilita_One({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-headline',
});

const fontBody = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        'font-body antialiased min-h-screen bg-background',
        fontHeadline.variable,
        fontBody.variable
        )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
