import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { useAuth } from '@/hooks/use-auth';

type ChatMessageProps = {
  message: Message;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const { user } = useAuth();
  const isAssistant = message.role === 'assistant';

  if (message.isSos) {
    return (
        <Card className="bg-destructive/10 border-destructive/50 text-destructive-foreground">
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                    <AlertTriangle className="size-6 text-destructive mt-1" />
                    <div>
                        <p className="font-bold">Important</p>
                        <p className="text-sm">{message.content}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3',
        !isAssistant && 'flex-row-reverse'
      )}
    >
      <Avatar className="shadow">
        <AvatarImage
          src={isAssistant ? message.character?.avatar : user?.photoURL ?? ''}
          alt={isAssistant ? message.character?.name : user?.displayName ?? 'User'}
        />
        <AvatarFallback>
          {isAssistant ? message.character?.name?.charAt(0) : user?.displayName?.charAt(0) ?? 'U'}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-3 shadow-sm',
          isAssistant
            ? 'bg-card rounded-bl-none'
            : 'bg-primary/80 text-primary-foreground rounded-br-none'
        )}
      >
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
}
