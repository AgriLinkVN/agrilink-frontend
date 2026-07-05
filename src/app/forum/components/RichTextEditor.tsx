"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { useRef, useState } from "react";
import { Bold, Italic, List, ListOrdered, ImagePlus, Loader2 } from "lucide-react";
import { uploadToCloudinary } from "@/lib/api";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit, Image],
    content,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[200px] px-3.5 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editor) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, "forum");
      editor.chain().focus().setImage({ src: url }).run();
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-lg border border-border-strong bg-white overflow-hidden">
      <div className="flex items-center gap-1 border-b border-hairline p-2">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")}>
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")}>
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")}>
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")}>
          <ListOrdered size={15} />
        </ToolbarButton>
        <ToolbarButton onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? <Loader2 size={15} className="animate-spin" /> : <ImagePlus size={15} />}
        </ToolbarButton>
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  active,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 ${
        active ? "bg-surface-green text-primary" : "text-muted hover:bg-surface-soft"
      }`}
    >
      {children}
    </button>
  );
}
