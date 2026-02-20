"use client";

import { useState } from "react";
import { updateName } from "@/actions/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Pencil, X } from "lucide-react";

interface ProfileInfoCardProps {
  name: string;
  email: string;
}

export function ProfileInfoCard({
  name: initialName,
  email,
}: ProfileInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const initials = initialName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSave = async () => {
    if (!name.trim()) return;
    setError("");
    setIsLoading(true);

    const result = await updateName(name);

    if (result.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    setIsEditing(false);
    setIsLoading(false);
  };

  const handleCancel = () => {
    setName(initialName);
    setIsEditing(false);
    setError("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xl shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-9"
                    disabled={isLoading}
                    autoFocus
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleSave}
                    disabled={isLoading}
                    className="shrink-0"
                  >
                    <Check className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="shrink-0"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                {error && <p className="text-xs text-destructive">{error}</p>}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{name}</p>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-7"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="size-3" />
                </Button>
              </div>
            )}
            <p className="text-sm text-muted-foreground truncate">{email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
