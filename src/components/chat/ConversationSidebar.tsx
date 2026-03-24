"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  useConversations,
  useDeleteConversation,
} from "@/services/conversations";
import {
  MessageSquarePlus,
  MessageSquare,
  Trash2,
  Loader2,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConversationSidebarProps {
  currentConversationId: string | null;
  onSelectConversation: (id: string | null) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConversationSidebar({
  currentConversationId,
  onSelectConversation,
  open,
  onOpenChange,
}: ConversationSidebarProps) {
  const { data: conversations, isLoading } = useConversations(open);
  const deleteMutation = useDeleteConversation();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleNewChat = () => {
    onSelectConversation(null);
    onOpenChange(false);
  };

  const handleSelectConversation = (id: string) => {
    onSelectConversation(id);
    onOpenChange(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteMutation.mutateAsync(deleteId);
    if (currentConversationId === deleteId) {
      onSelectConversation(null);
    }
    setDeleteId(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  };

  const groupConversations = () => {
    if (!conversations) return {};

    const groups: Record<string, typeof conversations> = {};
    conversations.forEach((conv) => {
      const label = formatDate(conv.updatedAt);
      if (!groups[label]) groups[label] = [];
      groups[label].push(conv);
    });
    return groups;
  };

  const grouped = groupConversations();

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="left"
          className="w-72 p-0 flex flex-col overflow-y-hidden"
        >
          <SheetHeader className="p-4 pb-2 border-b">
            <SheetTitle className="text-base">Conversations</SheetTitle>
            <SheetDescription className="sr-only">
              Your chat conversation history
            </SheetDescription>
          </SheetHeader>

          <div className="p-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={handleNewChat}
            >
              <MessageSquarePlus className="size-4" />
              New Chat
            </Button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto w-full">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            ) : conversations?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No conversations yet
              </div>
            ) : (
              <div className="p-2 space-y-4">
                {Object.entries(grouped).map(([label, convs]) => (
                  <div key={label}>
                    <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {label}
                    </div>
                    <div className="space-y-1">
                      {convs.map((conv) => (
                        <div
                          key={conv._id}
                          className={cn(
                            "group flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-muted transition-colors w-full min-w-0",
                            currentConversationId === conv._id && "bg-muted",
                          )}
                          onClick={() => handleSelectConversation(conv._id)}
                        >
                          <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
                          <span className="flex-1 text-sm truncate min-w-0">
                            {conv.title}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-6 shrink-0 opacity-60 hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteId(conv._id);
                            }}
                          >
                            <Trash2 className="size-3.5 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              This conversation will be permanently deleted. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function SidebarTrigger({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick} className={className}>
      <PanelLeft className="size-5" />
    </Button>
  );
}
