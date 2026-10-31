"use client";

import { useState, useMemo, useSyncExternalStore, lazy, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatViewSkeleton } from "@/components/chat/ChatViewSkeleton";
import { SidebarTrigger } from "@/components/chat";
import { useConversation } from "@/services/conversations";
import { useEntitlement } from "@/services/entitlement";

const ChatView = lazy(() =>
  import("@/components/chat/ChatView").then((m) => ({ default: m.ChatView })),
);

const ConversationSidebar = lazy(() =>
  import("@/components/chat/ConversationSidebar").then((m) => ({
    default: m.ConversationSidebar,
  })),
);

const AiXpenseDialogs = lazy(() =>
  import("./AiXpenseDialogs").then((m) => ({ default: m.AiXpenseDialogs })),
);

const emptySubscribe = () => () => {};

export function AiXpenseClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("c");

  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [justCreatedConvId, setJustCreatedConvId] = useState<string | null>(
    null,
  );

  const { data: conversationData, isLoading: isConversationLoading } =
    useConversation(conversationId);

  const { data: entitlement, isFetching: isEntitlementFetching } = useEntitlement(true);

  const isPremium = entitlement?.isPremium ?? false;

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

  const isJustCreated =
    !!justCreatedConvId && conversationId === justCreatedConvId;

  const chatKey =
    conversationId && !isJustCreated
      ? `conv-${conversationId}-${conversationData?.updatedAt || "loading"}`
      : `new-${newChatId}`;

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const showDialogs = showUpgradeDialog || showLimitDialog;

  return (
    <div className="flex h-full overflow-hidden">
      <Suspense fallback={null}>
        <ConversationSidebar
          currentConversationId={conversationId}
          onSelectConversation={handleSelectConversation}
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
        />
      </Suspense>

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
              isEntitlementFetching={isEntitlementFetching}
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
            <button type="button" onClick={() => router.push("/premium")} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${isPremium ? "border-amber-500/40 bg-amber-500/10 text-amber-500" : "border-primary/30 bg-primary/10 text-primary"}`}>
              {isPremium ? "Premium" : "Premium required"}
            </button>
          )}
        </div>

        {showDialogs && (
          <Suspense fallback={null}>
            <AiXpenseDialogs
              showUpgradeDialog={showUpgradeDialog}
              onUpgradeDialogChange={setShowUpgradeDialog}
              onUpgrade={() => router.push("/premium")}
              showLimitDialog={showLimitDialog}
              onLimitDialogChange={setShowLimitDialog}
              onStartNewChat={handleNewChat}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
}
