export type ForumCategory = "technical" | "market" | "experience";

export interface ForumAuthor {
  id: string;
  fullName: string;
  avatarUrl?: string;
}

export interface ForumPost {
  id: string;
  authorId: string;
  author?: ForumAuthor;
  title: string;
  content: string;
  category: ForumCategory;
  imageUrls: string[] | null;
  likeCount: number;
  commentCount: number;
  viewCount: number;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ForumComment {
  id: string;
  postId: string;
  authorId: string;
  author?: ForumAuthor;
  content: string;
  isHidden: boolean;
  createdAt: string;
}

export interface ForumPostsResponse {
  data: ForumPost[];
  total: number;
}

export interface ForumCommentsResponse {
  data: ForumComment[];
  total: number;
}

export interface CreateForumPostPayload {
  title: string;
  content: string;
  category: ForumCategory;
  imageUrls?: string[];
}

export const FORUM_CATEGORY_LABEL: Record<ForumCategory, string> = {
  technical: "Kỹ thuật",
  market: "Thị trường",
  experience: "Kinh nghiệm",
};
