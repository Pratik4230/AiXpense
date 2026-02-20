"use client";

import { useState } from "react";
import { deleteAccount } from "@/actions/user";
import { signOut } from "@/lib/authClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";

const CONFIRM_TEXT = "DELETE";

export function DangerZoneCard() {
  const [open, setOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (confirmation !== CONFIRM_TEXT) return;
    setError("");
    setIsLoading(true);

    const result = await deleteAccount();

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    await signOut();
    window.location.href = "/login";
  };

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Delete account</p>
            <p className="text-xs text-muted-foreground">
              Permanently delete your account and all data
            </p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-1">
                <Trash2 className="size-3" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete your account?</DialogTitle>
                <DialogDescription>
                  This action is irreversible. All your data including expenses,
                  conversations, and account information will be permanently
                  deleted.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <Label>
                  Type <strong>{CONFIRM_TEXT}</strong> to confirm
                </Label>
                <Input
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  placeholder={CONFIRM_TEXT}
                  disabled={isLoading}
                />
                {error && <p className="text-xs text-destructive">{error}</p>}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={confirmation !== CONFIRM_TEXT || isLoading}
                >
                  {isLoading ? "Deleting..." : "Delete my account"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
