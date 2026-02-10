import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  IMessage,
  ConversationSummary,
  ConversationFull,
} from "@/types/conversation";

async function fetchConversations(): Promise<ConversationSummary[]> {
  const res = await fetch("/api/conversations");
  if (!res.ok) throw new Error("Failed to fetch conversations");
  const data = await res.json();
  return data.conversations;
}

async function fetchConversation(id: string): Promise<ConversationFull> {
  const res = await fetch(`/api/conversations/${id}`);
  if (!res.ok) throw new Error("Failed to fetch conversation");
  const data = await res.json();
  return data.conversation;
}

async function createConversation(
  title?: string,
): Promise<ConversationSummary> {
  const res = await fetch("/api/conversations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to create conversation");
  const data = await res.json();
  return data.conversation;
}

async function updateConversation(params: {
  id: string;
  title?: string;
  messages?: IMessage[];
}): Promise<ConversationSummary> {
  const res = await fetch(`/api/conversations/${params.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: params.title,
      messages: params.messages,
    }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update conversation");
  }
  const data = await res.json();
  return data.conversation;
}

async function deleteConversation(id: string): Promise<void> {
  const res = await fetch(`/api/conversations/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete conversation");
}

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useConversation(id: string | null) {
  return useQuery({
    queryKey: ["conversation", id],
    queryFn: () => fetchConversation(id!),
    enabled: !!id,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useUpdateConversation() {
  return useMutation({
    mutationFn: updateConversation,
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
