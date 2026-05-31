export default function ProtectedLoading() {
  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-50 w-full border-b border-border/50 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex h-15 items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2.5">
                <div className="size-7.5 rounded-lg bg-muted animate-pulse" />
                <div className="h-5 w-24 rounded bg-muted animate-pulse" />
              </div>
              <div className="hidden md:flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-20 rounded-lg bg-muted/60 animate-pulse"
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:block size-9 rounded-md bg-muted animate-pulse" />
              <div className="hidden sm:block h-9 w-32 rounded-full bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8 space-y-4">
          <div className="h-8 w-48 rounded bg-muted animate-pulse" />
          <div className="h-4 w-full max-w-xl rounded bg-muted/60 animate-pulse" />
          <div className="h-4 w-full max-w-lg rounded bg-muted/60 animate-pulse" />
          <div className="mt-8 h-64 w-full rounded-xl bg-muted/40 animate-pulse" />
        </div>
      </main>
    </div>
  );
}
