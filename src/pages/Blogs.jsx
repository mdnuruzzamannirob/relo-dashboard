import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Calendar,
  Image as ImageIcon,
  AlertCircle,
  Eye,
  EyeOff,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

// Reusable Component Imports
import TextEditor from "../components/TextEditor";
import { Modal } from "../components/Modal";
import { Card } from "../components/Card";
import { Input, InputGroup } from "../components/Form";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { Pagination } from "../components/Pagination";
import BooksSkeleton from "../components/shimmer/ContentsSkeleton";
import {
  useGetBlogsQuery,
  useCreateBlogMutation,
  useDeleteBlogMutation,
  useUpdateBlogMutation,
} from "../services/allApi";

export default function Blogs() {
  // --- LOCAL STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [modalType, setModalType] = useState(null); // 'add', 'edit', 'delete'
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [imageFiles, setImageFiles] = useState([]); // Array for new file selections
  const [currentPage, setCurrentPage] = useState(1);

  // --- API HOOKS ---
  const {
    data: blogsData,
    isLoading,
    refetch,
  } = useGetBlogsQuery({
    page: currentPage,
    limit: 10,
  });

  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  // --- IMAGE PREVIEW LOGIC (Local Files) ---
  const imagePreviews = useMemo(() => {
    return imageFiles.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
  }, [imageFiles]);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [imagePreviews]);

  // --- FILTERING ---
  const filteredBlogs = useMemo(() => {
    const list = blogsData?.result || [];
    if (!searchTerm) return list;
    return list.filter((blog) =>
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [blogsData, searchTerm]);

  // --- HANDLERS ---
  const handleOpenAdd = () => {
    setSelectedBlog({ title: "", description: "", isActive: true, images: [] });
    setImageFiles([]);
    setModalType("add");
  };

  const handleOpenEdit = (blog) => {
    setSelectedBlog({ ...blog });
    setImageFiles([]); // Reset new selections
    setModalType("edit");
  };

  const removeNewImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const formData = new FormData();

    const jsonData = {
      title: selectedBlog.title,
      description: selectedBlog.description,
      isActive: selectedBlog.isActive ?? true,
    };

    formData.append("data", JSON.stringify(jsonData));

    // Append new images to 'images' key
    if (imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    try {
      if (modalType === "edit") {
        await updateBlog({
          blogId: selectedBlog.id,
          formData: formData,
        }).unwrap();
        toast.success("Blog updated successfully");
      } else {
        await createBlog(formData).unwrap();
        toast.success("Blog created successfully");
      }
      setModalType(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Operation failed");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteBlog(selectedBlog.id).unwrap();
      toast.success("Blog deleted successfully");
      setModalType(null);
      refetch();
    } catch (error) {
      toast.error("Failed to delete blog");
    }
  };

  if (isLoading) return <BooksSkeleton />;

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans text-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Blog Management
          </h1>
          <p className="text-gray-500 mt-1">Manage your stories and updates</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center bg-[#1e293b] text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} className="mr-2" /> New Blog Post
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-10">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-slate-200 focus:bg-white rounded-2xl transition-all outline-none"
        />
      </div>

      {/* Blogs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <Card
              key={blog.id}
              title={blog.title}
              image={blog.images?.[0] || ""}
              active={blog.isActive}
              latestUpdate={new Date(blog.updatedAt).toLocaleDateString()}
              actions={
                <>
                  <button
                    onClick={() => handleOpenEdit(blog)}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-sm font-bold transition-all"
                  >
                    <Edit3 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBlog(blog);
                      setModalType("delete");
                    }}
                    className="w-12 flex items-center justify-center bg-rose-50 hover:bg-rose-100 text-rose-500 py-3 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              }
            >
              <div
                className="text-gray-500 text-sm line-clamp-2 mb-4 italic"
                dangerouslySetInnerHTML={{ __html: blog.description }}
              />
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-50">
                       <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold mb-3 uppercase tracking-tighter">
                             <Calendar size={12} />
                             {new Date(blog.createdAt).toLocaleDateString("en-US", {
                               month: "long",
                               day: "numeric",
                               year: "numeric",
                             })}
                           </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl transition-colors ${
                      blog.isActive
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {blog.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 leading-none mb-1">
                      Status
                    </p>
                    <p
                      className={`text-xs font-bold ${
                        blog.isActive ? "text-emerald-700" : "text-slate-500"
                      }`}
                    >
                      {blog.isActive ? "Visible" : "Hidden"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
            <AlertCircle size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">No blog posts found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-12">
        <Pagination
          currentPage={currentPage}
          totalPages={
            blogsData?.meta?.total ? Math.ceil(blogsData.meta.total / 10) : 1
          }
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Add/Edit Modal */}
      {(modalType === "add" || modalType === "edit") && (
        <Modal
          isOpen={true}
          onClose={() => setModalType(null)}
          title={
            modalType === "edit" ? "Edit Blog Details" : "Publish New Blog"
          }
          footer={
            <button
              onClick={handleSave}
              disabled={isCreating || isUpdating}
              className="px-20 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl hover:bg-black transition-all active:scale-95 disabled:bg-slate-400"
            >
              {isCreating || isUpdating ? "Uploading..." : "Confirm & Publish"}
            </button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <InputGroup label="Blog Title">
              <Input
                placeholder="Enter blog title"
                value={selectedBlog?.title || ""}
                onChange={(e) =>
                  setSelectedBlog({ ...selectedBlog, title: e.target.value })
                }
              />
            </InputGroup>

            <InputGroup label="Upload Images (Multiple)">
              <div className="relative flex items-center border-2 border-slate-100 rounded-2xl p-2 bg-slate-50 overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={(e) => setImageFiles(Array.from(e.target.files))}
                />
                <div className="bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap">
                  <ImageIcon size={16} /> Choose Images
                </div>
                <div className="px-3 text-xs text-slate-500 truncate font-medium">
                  {imageFiles.length > 0
                    ? `${imageFiles.length} new selected`
                    : "Select JPG or PNG"}
                </div>
              </div>
            </InputGroup>
          </div>

          {/* Unified Preview Section (Existing + New) */}
          {(imagePreviews.length > 0 ||
            (selectedBlog?.images && selectedBlog.images.length > 0)) && (
            <div className="mb-8 p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                {modalType === "edit"
                  ? "Current & New Images"
                  : "Selected Previews"}
              </p>
              <div className="flex flex-wrap gap-3">
                {/* 1. Render Existing Images from Server */}
                {modalType === "edit" &&
                  selectedBlog?.images?.map((url, idx) => (
                    <div
                      key={`old-${idx}`}
                      className="relative w-20 h-20 rounded-lg overflow-hidden border border-white shadow-sm bg-white"
                    >
                      <img
                        src={url}
                        alt="server-img"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-0 left-0 bg-emerald-500 text-[8px] text-white px-1 font-bold">
                        SAVED
                      </div>
                    </div>
                  ))}

                {/* 2. Render New Previews (Local Files) */}
                {imagePreviews.map((preview, idx) => (
                  <div
                    key={`new-${idx}`}
                    className="relative w-20 h-20 rounded-lg overflow-hidden border border-white shadow-sm group"
                  >
                    <img
                      src={preview.url}
                      alt="new-preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 left-0 bg-blue-500 text-[8px] text-white px-1 font-bold">
                      NEW
                    </div>
                    <button
                      type="button"
                      onClick={() => removeNewImage(idx)}
                      className="absolute top-1 right-1 bg-rose-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 mb-8">
            <InputGroup label="Visibility Status">
              <div className="flex gap-4 p-1 bg-slate-50 rounded-2xl max-w-xs">
                {[true, false].map((val) => (
                  <button
                    key={val.toString()}
                    type="button"
                    onClick={() =>
                      setSelectedBlog({ ...selectedBlog, isActive: val })
                    }
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                      selectedBlog?.isActive === val
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {val ? "Active" : "Inactive"}
                  </button>
                ))}
              </div>
            </InputGroup>
          </div>

          <InputGroup label="Blog Content">
            <TextEditor
              content={selectedBlog?.description || ""}
              onChange={(html) =>
                setSelectedBlog({ ...selectedBlog, description: html })
              }
              placeholder="Start writing your story..."
            />
          </InputGroup>
        </Modal>
      )}

      {/* Delete Modal */}
      <DeleteConfirmModal
        isOpen={modalType === "delete"}
        onClose={() => setModalType(null)}
        onConfirm={handleConfirmDelete}
        itemName={selectedBlog?.title}
        isLoading={isDeleting}
      />
    </div>
  );
}
