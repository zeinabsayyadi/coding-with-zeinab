"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

type LikeButtonProps = {
  articleId: string;
};

export function LikeButton({ articleId }: LikeButtonProps) {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/articles/${articleId}/like`)
      .then((res) => res.json())
      .then((data: { count: number; liked: boolean }) => {
        if (cancelled) return;
        setCount(data.count);
        setLiked(data.liked);
      })
      .catch(() => {
        if (cancelled) return;
        setCount(0);
      });

    return () => {
      cancelled = true;
    };
  }, [articleId]);

  async function toggle() {
    if (pending || count === null) return;
    setPending(true);

    // Optimistic update
    const prevCount = count;
    const prevLiked = liked;
    setLiked(!prevLiked);
    setCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      const res = await fetch(`/api/articles/${articleId}/like`, {
        method: "POST",
      });
      const data: { count: number; liked: boolean } = await res.json();
      setCount(data.count);
      setLiked(data.liked);
    } catch {
      // Revert on failure
      setLiked(prevLiked);
      setCount(prevCount);
    } finally {
      setPending(false);
    }
  }

  return (
    <Button
      variant={liked ? "default" : "outline"}
      size="sm"
      onClick={toggle}
      disabled={pending || count === null}
      aria-pressed={liked}
      aria-label={liked ? "Unlike this article" : "Like this article"}
    >
      <Heart className={`mr-2 h-4 w-4 ${liked ? "fill-current" : ""}`} />
      {count ?? "—"}
    </Button>
  );
}
