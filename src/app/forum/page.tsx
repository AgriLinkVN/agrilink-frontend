"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { apiGet } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MessageSquare, Heart, Eye, PlusCircle, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { FORUM_CATEGORY_LABEL, type ForumCategory, type ForumPostsResponse } from "@/types/forum";

const CATEGORY_TABS: { value: ForumCategory | "all"; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "technical", label: "Kỹ thuật" },
  { value: "market", label: "Thị trường" },
  { value: "experience", label: "Kinh nghiệm" },
];

export default function ForumPage() {
  const user = useAuthStore((s) => s.user);
  const [category, setCategory] = useState<ForumCategory | "all">("all");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["forum-posts", category, search],
    queryFn: () =>
      apiGet<ForumPostsResponse>("/forum/posts", {
        category: category === "all" ? undefined : category,
        search: search || undefined,
        limit: 20,
      }),
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">Forum tri thức nông nghiệp</h1>
          <p className="text-sm text-muted mt-1">Chia sẻ kỹ thuật, thị trường và kinh nghiệm canh tác</p>
        </div>
        {user && (
          <Link href="/forum/new">
            <Button size="sm">
              <PlusCircle size={16} /> Đăng bài
            </Button>
          </Link>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setCategory(tab.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              category === tab.value ? "bg-primary text-white" : "bg-white border border-hairline text-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <div className="flex-1 min-w-[200px] max-w-xs ml-auto">
          <Input placeholder="Tìm bài viết..." leftIcon={<Search size={14} />} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={28} className="animate-spin text-primary" />
        </div>
      ) : !data || data.data.length === 0 ? (
        <div className="text-center text-muted text-sm py-16">Chưa có bài viết nào</div>
      ) : (
        <div className="flex flex-col gap-3">
          {data.data.map((post) => (
            <Link
              key={post.id}
              href={`/forum/${post.id}`}
              className="bg-white rounded-xl border border-hairline card-shadow p-5 hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={post.category === "technical" ? "vietgap" : post.category === "market" ? "traditional" : "organic"}>
                  {FORUM_CATEGORY_LABEL[post.category]}
                </Badge>
                <span className="text-xs text-muted">{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
              </div>
              <h2 className="font-semibold text-ink mb-1 line-clamp-1">{post.title}</h2>
              <p
                className="text-sm text-muted line-clamp-2 mb-3"
                dangerouslySetInnerHTML={{ __html: post.content.replace(/<[^>]*>/g, " ") }}
              />
              <div className="flex items-center gap-4 text-xs text-muted">
                <span className="flex items-center gap-1"><Heart size={13} /> {post.likeCount}</span>
                <span className="flex items-center gap-1"><MessageSquare size={13} /> {post.commentCount}</span>
                <span className="flex items-center gap-1"><Eye size={13} /> {post.viewCount}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
