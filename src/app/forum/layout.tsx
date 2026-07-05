import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forum tri thức nông nghiệp",
  description: "Chia sẻ kỹ thuật canh tác, thông tin thị trường và kinh nghiệm nông nghiệp giữa nông dân Việt Nam",
  openGraph: {
    title: "Forum tri thức nông nghiệp | AgriLink Vietnam",
    description: "Chia sẻ kỹ thuật canh tác, thông tin thị trường và kinh nghiệm nông nghiệp giữa nông dân Việt Nam",
  },
};

export default function ForumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
