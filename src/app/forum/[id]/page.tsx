"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, apiGet } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Heart, MessageSquare, Eye, Loader2, Send } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { FORUM_CATEGORY_LABEL, type ForumCommentsResponse, type ForumPost } from "@/types/forum";

export default function ForumPostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");

  const { data: post, isLoading } = useQuery({
    queryKey: ["forum-post", id],
    queryFn: () => apiGet<ForumPost>(`/forum/posts/${id}`),
  });

  const { data: comments } = useQuery({
    queryKey: ["forum-comments", id],
    queryFn: () => apiGet<ForumCommentsResponse>(`/forum/posts/${id}/comments`),
  });

  const likeMutation = useMutation({
    mutationFn: () => api.post<{ liked: boolean; likeCount: number }>(`/forum/posts/${id}/like`, {}, accessToken),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["forum-post", id] }),
  });

  const commentMutation = useMutation({
    mutationFn: () => api.post(`/forum/posts/${id}/comments`, { content: comment }, accessToken),
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["forum-comments", id] });
      queryClient.invalidateQueries({ queryKey: ["forum-post", id] });
    },
  });

  if (isLoading || !post) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl border border-hairline card-shadow p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant={post.category === "technical" ? "vietgap" : post.category === "market" ? "traditional" : "organic"}>
            {FORUM_CATEGORY_LABEL[post.category]}
          </Badge>
          <span className="text-xs text-muted">{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
        </div>
        <h1 className="text-xl font-bold text-ink mb-4">{post.title}</h1>
        <div className="prose prose-sm max-w-none text-ink mb-5" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="flex items-center gap-4 pt-4 border-t border-hairline">
          <button
            onClick={() => user && likeMutation.mutate()}
            disabled={!user || likeMutation.isPending}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-primary transition-colors disabled:opacity-60"
          >
            <Heart size={16} /> {post.likeCount}
          </button>
          <span className="flex items-center gap-1.5 text-sm text-muted"><MessageSquare size={16} /> {post.commentCount}</span>
          <span className="flex items-center gap-1.5 text-sm text-muted"><Eye size={16} /> {post.viewCount}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-hairline card-shadow p-6">
        <h2 className="font-semibold text-ink mb-4">Bình luận ({comments?.total ?? 0})</h2>

        {user && (
          <div className="flex gap-2 mb-5">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Viết bình luận..."
              className="min-h-[60px]"
            />
            <Button
              size="sm"
              onClick={() => comment.trim() && commentMutation.mutate()}
              disabled={!comment.trim() || commentMutation.isPending}
            >
              <Send size={14} />
            </Button>
          </div>
        )}

        {!comments || comments.data.length === 0 ? (
          <div className="text-center text-muted text-sm py-8">Chưa có bình luận nào</div>
        ) : (
          <div className="flex flex-col gap-4">
            {comments.data.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-green flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                  {(c.author?.fullName ?? "?").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-ink">{c.author?.fullName ?? "Người dùng"}</p>
                  <p className="text-sm text-ink">{c.content}</p>
                  <p className="text-xs text-muted mt-0.5">{new Date(c.createdAt).toLocaleString("vi-VN")}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
