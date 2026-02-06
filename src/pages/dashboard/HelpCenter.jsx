import { useState } from "react";
import { CheckCircle2, Edit3, X } from "lucide-react";
import TiptapEditor from "../../components/editor/TiptapEditor";
import TiptapViewer from "../../components/editor/TiptapViewer";
import { toast } from "sonner";

const HelpCenter = () => {
  const [content, setContent] = useState("");
  const [editContent, setEditContent] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setEditContent(content);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent("");
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // API call here
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setContent(editContent);
      setShowSuccess(true);
      setIsEditing(false);
      setTimeout(() => setShowSuccess(false), 3000);
      toast.success("Help Center updated successfully");
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Help Center
          </h1>
          <p className="text-gray-500 text-sm">
            Update the information displayed on your public Help Center page.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] text-white rounded-lg hover:bg-slate-800 transition-all whitespace-nowrap"
          >
            <Edit3 size={18} /> Edit
          </button>
        )}
      </div>

      {/* Status Message */}
      {showSuccess && (
        <div className="mb-4 flex justify-center">
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-6 py-2 rounded-full text-sm font-bold border border-emerald-100 animate-in fade-in slide-in-from-bottom-2">
            <CheckCircle2 size={16} /> Changes saved successfully
          </div>
        </div>
      )}

      {/* Content Area */}
      <div
        className={
          isEditing ? "" : "bg-white rounded-xl border border-brand-100 p-6"
        }
      >
        {!isEditing ? (
          <>
            <div className="min-h-96">
              {content ? (
                <TiptapViewer content={content} />
              ) : (
                <div className="text-gray-400 text-center py-16">
                  No content yet. Click Edit to add content.
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <TiptapEditor value={editContent} onChange={setEditContent} />
            <div className="flex gap-3 mt-6 justify-end">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-slate-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                <X size={18} /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`px-8 py-2 rounded-lg font-semibold transition-all ${
                  isSaving
                    ? "bg-slate-400 text-white cursor-not-allowed"
                    : "bg-[#1e293b] text-white hover:bg-slate-800"
                }`}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HelpCenter;
