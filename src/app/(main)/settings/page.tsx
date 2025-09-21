"use client"

import * as React from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { characters } from "@/lib/data"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

export default function SettingsPage() {
    const { toast } = useToast();
    const [selectedAvatar, setSelectedAvatar] = React.useState(characters[0].id);

    const handleDeleteHistory = () => {
        toast({
            title: "History Cleared",
            description: "Your chat history and memory has been deleted.",
        })
    }
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of your companion.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="theme">Theme</Label>
            <ThemeToggle />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Character</CardTitle>
          <CardDescription>Change your AI companion's voice and avatar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label>Avatar</Label>
                <div className="flex gap-4 flex-wrap">
                    {characters.map(character => (
                        <button key={character.id} onClick={() => setSelectedAvatar(character.id)} className={cn("rounded-full ring-2 ring-offset-2 ring-offset-background", selectedAvatar === character.id ? 'ring-primary' : 'ring-transparent')}>
                            <Avatar className="h-16 w-16 border-2 border-muted">
                                <AvatarImage src={character.avatar} alt={character.name} />
                                <AvatarFallback>{character.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                        </button>
                    ))}
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="voice">Voice</Label>
                <Select defaultValue="voice-1">
                <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="voice-1">Aura (Friendly, Female)</SelectItem>
                    <SelectItem value="voice-2">Leo (Calm, Male)</SelectItem>
                    <SelectItem value="voice-3">Zara (Warm, Female)</SelectItem>
                </SelectContent>
                </Select>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Privacy & Safety</CardTitle>
          <CardDescription>Manage your data and privacy settings.</CardDescription>
        </CardHeader>
        <CardContent>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive">Delete Chat History</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your chat history and remove all contextual memory from your AI companion.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteHistory}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
