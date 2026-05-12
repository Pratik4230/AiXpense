"use client";

import { useState, useMemo, useSyncExternalStore, lazy, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ConversationSidebar, SidebarTrigger } from "@/components/chat";
import { TrialStatus } from "@/components/chat/TrialStatus";
import { ChatViewSkeleton } from "@/components/chat/ChatViewSkeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, AlertTriangle } from "lucide-react";
import { useConversation } from "@/services/conversations";
import { useTrials } from "@/services/trials";
import { MAX_MESSAGES_PER_CONVERSATION } from "@/constants/conversation";

const ChatView = lazy(() =>
  import("@/components/chat/ChatView").then((m) => ({ default: m.ChatView })),
);

const FREE_DAILY_LIMIT = 7;

const emptySubscribe = () => () => {};

interface AiXpenseClientProps {
  initialIsPremium: boolean;
}

export function AiXpenseClient({ initialIsPremium }: AiXpenseClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("c");

  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [justCreatedConvId, setJustCreatedConvId] = useState<string | null>(null);

  const { data: conversationData, isLoading: isConversationLoading } =
    useConversation(conversationId);

  const { data: trialsData, isFetching: isTrialsFetching } = useTrials(!initialIsPremium);

  const isPremium = initialIsPremium || (trialsData?.isPremium ?? false);
  const displayTrials = trialsData?.freeTrials ?? 0;

  const initialMessages = useMemo(() => {
    if (!conversationData?.messages) return [];
    return conversationData.messages.map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      parts: msg.parts,
    }));
  }, [conversationData]);

  const [newChatId, setNewChatId] = useState(() => Date.now().toString());

  const handleNewChat = () => {
    setJustCreatedConvId(null);
    setNewChatId(Date.now().toString());
    router.push("/aixpense");
  };

  const handleConversationCreated = (id: string) => {
    setJustCreatedConvId(id);
    window.history.replaceState(null, "", `/aixpense?c=${id}`);
  };

  const handleSelectConversation = (id: string | null) => {
    setJustCreatedConvId(null);
    if (id) {
      router.push(`/aixpense?c=${id}`);
    } else {
      handleNewChat();
    }
  };

  const isJustCreated = !!justCreatedConvId && conversationId === justCreatedConvId;

  const chatKey =
    conversationId && !isJustCreated
      ? `conv-${conversationId}-${conversationData?.updatedAt || "loading"}`
      : `new-${newChatId}`;

  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  return (
    <div className="flex h-full overflow-hidden">
      <ConversationSidebar
        currentConversationId={conversationId}
        onSelectConversation={handleSelectConversation}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col relative min-w-0">
        {isConversationLoading && conversationId && !isJustCreated ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : (
          <Suspense fallback={<ChatViewSkeleton />}>
            <ChatView
              key={chatKey}
              conversationId={conversationId}
              initialMessages={initialMessages}
              messageCount={conversationData?.messageCount || 0}
              isPremium={isPremium}
              freeTrials={displayTrials}
              isTrialsFetching={isTrialsFetching}
              onShowUpgradeDialog={() => setShowUpgradeDialog(true)}
              onShowLimitDialog={() => setShowLimitDialog(true)}
              onConversationCreated={handleConversationCreated}
            />
          </Suspense>
        )}

        <div className="absolute top-4 left-4 z-10">
          <SidebarTrigger onClick={() => setSidebarOpen(true)} />
        </div>

        <div className="absolute top-4 right-4 z-10">
          {mounted && (
            <TrialStatus
              isPremium={isPremium}
              freeTrials={displayTrials}
              onUpgradeClick={() => router.push("/premium")}
            />
          )}
        </div>

        <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Crown className="size-5 text-amber-500" />
                Upgrade to Premium
              </DialogTitle>
              <DialogDescription>
                You&apos;ve used all your free messages for today. Upgrade to
                Premium for unlimited access  resets every day.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="rounded-lg bg-muted p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Free Plan</span>
                  <span className="text-muted-foreground">
                    {FREE_DAILY_LIMIT} messages / day
                  </span>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span>Premium Plan</span>
                  <span className="text-primary">Unlimited</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUpgradeDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => { setShowUpgradeDialog(false); router.push("/premium"); }}>
                Upgrade Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="size-5 text-amber-500" />
                Conversation Limit Reached
              </DialogTitle>
              <DialogDescription>
                This conversation has reached the maximum of{" "}
                {MAX_MESSAGES_PER_CONVERSATION} messages. Please start a new
                conversation to continue.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowLimitDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowLimitDialog(false);
                  handleNewChat();
                }}
              >
                Start New Chat
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
