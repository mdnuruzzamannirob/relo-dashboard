import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Link as LinkIcon,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const btnClass = (active) => `
    p-2 rounded-md transition-all duration-200
    ${
      active
        ? "bg-blue-600 text-white shadow-sm"
        : "hover:bg-gray-100 text-gray-600"
    }
  `;

  const Divider = () => (
    <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
  );

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-white sticky top-0 z-10">
      {/* History */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        className={btnClass()}
        title="Undo"
      >
        <Undo size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        className={btnClass()}
        title="Redo"
      >
        <Redo size={18} />
      </button>
      <Divider />

      {/* Formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={btnClass(editor.isActive("bold"))}
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={btnClass(editor.isActive("italic"))}
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={btnClass(editor.isActive("code"))}
      >
        <Code size={18} />
      </button>
      <Divider />

      {/* Headings */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={btnClass(editor.isActive("heading", { level: 1 }))}
      >
        <Heading1 size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={btnClass(editor.isActive("heading", { level: 2 }))}
      >
        <Heading2 size={18} />
      </button>
      <Divider />

      {/* Lists & Alignment */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={btnClass(editor.isActive("bulletList"))}
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={btnClass(editor.isActive({ textAlign: "left" }))}
      >
        <AlignLeft size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={btnClass(editor.isActive({ textAlign: "center" }))}
      >
        <AlignCenter size={18} />
      </button>
      <Divider />

      {/* Misc */}
      <button onClick={setLink} className={btnClass(editor.isActive("link"))}>
        <LinkIcon size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={btnClass(editor.isActive("blockquote"))}
      >
        <Quote size={18} />
      </button>
    </div>
  );
};

export const TextEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-600 underline cursor-pointer" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-blue focus:outline-none min-h-[300px] p-6 max-w-none transition-all",
      },
    },
  });

  // Keep content in sync if changed from outside
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="w-full border rounded-xl shadow-sm bg-white overflow-hidden border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
      <MenuBar editor={editor} />
      <div className="max-h-150 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
      <div className="px-4 py-2 border-t bg-gray-50 text-[10px] text-gray-400 flex justify-between">
        <span>Press Cmd+B for Bold</span>
        <span>{editor?.storage.characterCount?.words?.() || 0} words</span>
      </div>
    </div>
  );
};
export default TextEditor;
