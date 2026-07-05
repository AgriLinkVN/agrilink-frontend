"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "../components/RichTextEditor";
import { useAuthStore } from "@/store/authStore";
import { type CreateForumPostPayload, type ForumCategory, type ForumPost, FORUM_CATEGORY_LABEL } from "@/types/forum";

const CATEGORIES: ForumCategory[] = ["technical", "market", "experience"];

export default function NewForumPostPage() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<ForumCategory>("experience");
  const [error, setError] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post<ForumPost>("/forum/posts", { title, content, category } satisfies CreateForumPostPayload, accessToken),
    onSuccess: (post) => router.push(`/forum/${post.id}`),
    onError: (err: Error) => setError(err.message),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim().length < 5 || content.trim().length < 10) {
      setError("Tiêu đề tối thiểu 5 ký tự, nội dung tối thiểu 10 ký tự");
      return;
    }
    setError(null);
    mutate();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-ink mb-6">Đăng bài viết mới</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input label="Tiêu đề" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tiêu đề bài viết..." />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Danh mục</label>
          <div className="flex gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  category === c ? "bg-primary text-white" : "bg-white border border-hairline text-muted"
                }`}
              >
                {FORUM_CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-ink">Nội dung</label>
          <RichTextEditor content={content} onChange={setContent} />
        </div>

        {error && <p className="text-sm text-error">{error}</p>}

        <Button type="submit" loading={isPending} disabled={isPending}>
          Đăng bài
        </Button>
      </form>
    </div>
  );
}
