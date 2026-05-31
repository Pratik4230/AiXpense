"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, AlertTriangle } from "lucide-react";
import { MAX_MESSAGES_PER_CONVERSATION } from "@/constants/conversation";

const FREE_DAILY_LIMIT = 7;

interface AiXpenseDialogsProps {
  showUpgradeDialog: boolean;
  onUpgradeDialogChange: (open: boolean) => void;
  onUpgrade: () => void;
  showLimitDialog: boolean;
  onLimitDialogChange: (open: boolean) => void;
  onStartNewChat: () => void;
}

export function AiXpenseDialogs({
  showUpgradeDialog,
  onUpgradeDialogChange,
  onUpgrade,
  showLimitDialog,
  onLimitDialogChange,
  onStartNewChat,
}: AiXpenseDialogsProps) {
  return (
    <>
      <Dialog open={showUpgradeDialog} onOpenChange={onUpgradeDialogChange}>
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
              onClick={() => onUpgradeDialogChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onUpgradeDialogChange(false);
                onUpgrade();
              }}
            >
              Upgrade Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showLimitDialog} onOpenChange={onLimitDialogChange}>
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
              onClick={() => onLimitDialogChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onLimitDialogChange(false);
                onStartNewChat();
              }}
            >
              Start New Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
