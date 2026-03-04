"use client";

import { useState, useMemo } from "react";
import { useSession } from "@/lib/authClient";
import { useRouter, useSearchParams } from "next/navigation";
import { ConversationSidebar, SidebarTrigger } from "@/components/chat";
import { TrialStatus } from "@/components/chat/TrialStatus";
import { ChatView } from "@/components/chat/ChatView";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, AlertTriangle, Sparkles, X } from "lucide-react";
import { useConversation } from "@/services/conversations";
import { MAX_MESSAGES_PER_CONVERSATION } from "@/constants/conversation";

const FREE_DAILY_LIMIT = 7;

interface UserWithTrial {
  isPremium?: boolean;
  freeTrials?: number;
  onboardingCompleted?: boolean;
}

export default function AiXpensePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("c");

  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [justCreatedConvId, setJustCreatedConvId] = useState<string | null>(
    null,
  );

  const { data: session, isPending: isSessionLoading } = useSession();
  const { data: conversationData, isLoading: isConversationLoading } =
    useConversation(conversationId);

  const user = session?.user as UserWithTrial | undefined;
  const isPremium = user?.isPremium ?? false;
  const serverFreeTrials = user?.freeTrials ?? 0;
  const onboardingCompleted = user?.onboardingCompleted ?? true;

  const [decrementOffset, setDecrementOffset] = useState(0);
  const displayTrials = Math.max(0, serverFreeTrials - decrementOffset);

  const decrementTrials = () => {
    if (!isPremium && displayTrials > 0) {
      setDecrementOffset((prev) => prev + 1);
    }
  };

  const initialMessages = useMemo(() => {
    if (!conversationData?.messages) return [];
    return conversationData.messages.map((msg) => ({
      id: msg.id,
      role: msg.role as "user" | "assistant",
      parts: msg.parts,
    }));
  }, [conversationData]);

  const handleUpgradeClick = () => {
    setShowUpgradeDialog(false);
    router.push("/premium");
  };

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

  const isJustCreated =
    !!justCreatedConvId && conversationId === justCreatedConvId;

  const chatKey =
    conversationId && !isJustCreated
      ? `conv-${conversationId}-${conversationData?.updatedAt || "loading"}`
      : `new-${newChatId}`;

  const showUpgradeBanner =
    !isPremium && !bannerDismissed && displayTrials <= 2 && displayTrials > 0;

  return (
    <div className="flex h-full overflow-hidden">
      {!isSessionLoading && <OnboardingModal open={!onboardingCompleted} />}
      <ConversationSidebar
        currentConversationId={conversationId}
        onSelectConversation={handleSelectConversation}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col relative min-w-0">
        {showUpgradeBanner && (
          <div className="relative z-20 flex items-center justify-between gap-3 px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/20 text-sm">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium">
              <Sparkles className="size-4 shrink-0" />
              <span>
                {displayTrials === 1
                  ? "Last free message today — "
                  : `${displayTrials} free messages left today — `}
                <button
                  onClick={() => router.push("/premium")}
                  className="underline underline-offset-2 hover:text-amber-500 transition-colors"
                >
                  Upgrade for unlimited
                </button>
              </span>
            </div>
            <button
              onClick={() => setBannerDismissed(true)}
              className="text-amber-600/60 hover:text-amber-600 transition-colors shrink-0"
              aria-label="Dismiss banner"
            >
              <X className="size-4" />
            </button>
          </div>
        )}

        {isConversationLoading && conversationId && !isJustCreated ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <ChatView
            key={chatKey}
            conversationId={conversationId}
            initialMessages={initialMessages}
            messageCount={conversationData?.messageCount || 0}
            isPremium={isPremium}
            freeTrials={displayTrials}
            onDecrementTrials={decrementTrials}
            onShowUpgradeDialog={() => setShowUpgradeDialog(true)}
            onShowLimitDialog={() => setShowLimitDialog(true)}
            onConversationCreated={handleConversationCreated}
          />
        )}

        <div className="absolute top-4 left-4 z-10">
          <SidebarTrigger onClick={() => setSidebarOpen(true)} />
        </div>

        <div className="absolute top-4 right-4 z-10">
          {!isSessionLoading && user && (
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
                Premium for unlimited access — resets every day.
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
              <Button
                variant="outline"
                onClick={() => setShowUpgradeDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpgradeClick}>Upgrade Now</Button>
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
              <Button
                variant="outline"
                onClick={() => setShowLimitDialog(false)}
              >
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
