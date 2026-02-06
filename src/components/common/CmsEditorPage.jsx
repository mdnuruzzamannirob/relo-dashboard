import { useState } from "react";
import { Edit3, RotateCw, X } from "lucide-react";
import { toast } from "sonner";
import TiptapEditor from "@/components/editor/TiptapEditor";
import TiptapViewer from "@/components/editor/TiptapViewer";
import { Skeleton } from "../ui/skeleton";
import CmsEditorSkeletons from "../skeletons/CmsEditorSkeletons";

const CmsEditorPage = ({
  title,
  description,
  emptyMessage,
  successMessage,
  useGetQuery,
  useUpdateMutation,
}) => {
  const { data, isLoading, isError, refetch } = useGetQuery();
  const [updateContent, { isLoading: isSaving }] = useUpdateMutation();

  const [editContent, setEditContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const content = data?.data?.content ?? data?.content ?? "";

  const handleEdit = () => {
    setEditContent(content);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent("");
  };

  const handleSave = async () => {
    try {
      await updateContent({ content: editContent }).unwrap();
      await refetch();
      setIsEditing(false);
      toast.success(successMessage);
    } catch (error) {
      const errorMessage = error?.data?.message || "Failed to save changes";
      toast.error(errorMessage);
    }
  };

  // Check if content has changed
  const hasContentChanged = editContent !== content;
  const isSaveDisabled = isSaving || !hasContentChanged || !editContent.trim();

  if (isLoading) {
    return <CmsEditorSkeletons />;
  }

  if (isError) {
    return (
      <div className="bg-white rounded-xl border border-brand-100 p-6">
        <div className="flex flex-col items-center text-center gap-3 py-12">
          <p className="text-slate-600">Failed to load content.</p>
          <button
            onClick={refetch}
            className="flex items-center gap-2 px-4 py-2 bg-[#1e293b] text-white rounded-lg hover:bg-slate-800 transition-all"
          >
            <RotateCw size={16} /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{title}</h1>
          <p className="text-gray-500 text-sm">{description}</p>
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

      {/* Content Area */}
      <div
        className={
          isEditing ? "" : "bg-white rounded-xl border border-brand-100 p-6"
        }
      >
        {!isEditing ? (
          <div className="min-h-96">
            {content ? (
              <TiptapViewer content={content} />
            ) : (
              <div className="text-gray-400 text-center py-16">
                {emptyMessage}
              </div>
            )}
          </div>
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
                disabled={isSaveDisabled}
                className={`px-8 py-2 rounded-lg font-semibold transition-all ${
                  isSaveDisabled
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

export default CmsEditorPage;
