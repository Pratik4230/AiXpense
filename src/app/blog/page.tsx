import { getAllPosts } from "@/lib/blog";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips, guides, and insights on expense tracking, budgeting, and personal finance management with AI.",
  alternates: { canonical: "https://aixpense.in/blog" },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-primary/10 blur-[120px] rounded-full opacity-40 pointer-events-none" />

      <div className="container mx-auto px-4 py-12 sm:py-20 relative z-10 max-w-4xl">
        <div className="mb-10 sm:mb-16">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 sm:mb-8 inline-block"
          >
            ← Back to home
          </Link>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-3 sm:mb-4">
            Blog
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl">
            Tips, guides, and insights on expense tracking, personal finance,
            and making the most of AI-powered tools.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts yet.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block p-5 sm:p-8 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm hover:border-primary/30 hover:bg-card/50 transition-all duration-300"
              >
                <div className="flex flex-wrap gap-2 mb-3 sm:mb-4">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs border-primary/20 text-primary bg-primary/5"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4 sm:mb-6">
                  {post.description}
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                  <div className="flex items-center gap-3 sm:gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      {new Date(post.publishedAt).toLocaleDateString("en", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      {post.readingTime}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read more <ArrowRight className="size-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
