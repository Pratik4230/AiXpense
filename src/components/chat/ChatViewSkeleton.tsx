export function ChatViewSkeleton() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1" />
      <div className="border-t border-border bg-background px-3 pt-2 pb-3 sm:px-4 sm:pb-4">
        <div className="sm:max-w-3xl sm:mx-auto">
          <div className="rounded-2xl border border-border bg-background h-18 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
