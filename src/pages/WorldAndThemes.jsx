import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
  Eye,
  EyeOff,
  X,
  Calendar,
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

// API Hooks
import {
  useCreateThemeMutation,
  useDeleteThemeMutation,
  useGetThemesQuery,
  useUpdateThemeMutation,
} from "../services/allApi";

export default function WorldThemes() {
  // --- LOCAL STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [modalType, setModalType] = useState(null); // 'add', 'edit', 'delete'
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // --- API HOOKS ---
  const {
    data: themesData,
    isLoading,
    refetch,
  } = useGetThemesQuery({
    page: currentPage,
    limit: 10,
  });

  const [createTheme, { isLoading: isCreating }] = useCreateThemeMutation();
  const [updateTheme, { isLoading: isUpdating }] = useUpdateThemeMutation();
  const [deleteTheme, { isLoading: isDeleting }] = useDeleteThemeMutation();

  // --- IMAGE PREVIEW LOGIC ---
  const imagePreview = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return null;
  }, [imageFile]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // --- FILTERING ---
  const filteredThemes = useMemo(() => {
    // Accessing results from data.result based on API response structure
    const list = themesData?.result || [];
    if (!searchTerm) return list;
    return list.filter((theme) =>
      theme.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [themesData, searchTerm]);

  // --- HANDLERS ---
  const handleOpenAdd = () => {
    setSelectedTheme({
      title: "",
      description: "",
      isActive: true,
      image: null,
    });
    setImageFile(null);
    setModalType("add");
  };

  const handleOpenEdit = (theme) => {
    setSelectedTheme({ ...theme });
    setImageFile(null);
    setModalType("edit");
  };

  const handleSave = async () => {
    // Preparing form-data as required by the POST /blog/create endpoint
    const formData = new FormData();
    const jsonData = {
      title: selectedTheme.title,
      description: selectedTheme.description,
      isActive: selectedTheme.isActive ?? true,
    };

    formData.append("data", JSON.stringify(jsonData));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (modalType === "edit") {
        await updateTheme({
          themeId: selectedTheme.id,
          formData: formData,
        }).unwrap();
        toast.success("Theme updated successfully");
      } else {
        await createTheme(formData).unwrap();
        toast.success("Theme created successfully");
      }
      setModalType(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Operation failed");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteTheme(selectedTheme.id).unwrap();
      toast.success("Theme deleted successfully");
      setModalType(null);
      refetch();
    } catch (error) {
      toast.error("Failed to delete theme");
    }
  };

  if (isLoading) return <BooksSkeleton />;

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans text-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            World & Themes Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your application aesthetics and layouts
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} className="mr-2" /> New Theme
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
          placeholder="Search themes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-slate-200 focus:bg-white rounded-2xl transition-all outline-none"
        />
      </div>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredThemes.length > 0 ? (
          filteredThemes.map((theme) => (
            <Card
              key={theme.id}
              title={theme.title}
              image={theme.image || ""}
              active={theme.isActive}
              actions={
                <>
                  <button
                    onClick={() => handleOpenEdit(theme)}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-sm font-bold transition-all"
                  >
                    <Edit3 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTheme(theme);
                      setModalType("delete");
                    }}
                    className="w-12 flex items-center justify-center bg-rose-50 hover:bg-rose-100 text-rose-500 py-3 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              }
            >
              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold mb-3 uppercase tracking-tighter">
                <Calendar size={12} />
                {new Date(theme.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div
                className="text-slate-600 text-xs line-clamp-3 bg-slate-50 p-3 rounded-xl border border-slate-100"
                dangerouslySetInnerHTML={{ __html: theme.description }}
              />
              <div className="flex items-center gap-3 my-2">
                <div
                  className={`p-2.5 rounded-xl transition-colors ${
                    theme.isActive
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {theme.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 leading-none mb-1">
                    Status
                  </p>
                  <p
                    className={`text-xs font-bold ${
                      theme.isActive ? "text-emerald-700" : "text-slate-500"
                    }`}
                  >
                    {theme.isActive ? "Visible" : "Hidden"}
                  </p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
            <AlertCircle size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">No themes found</p>
          </div>
        )}
      </div>

      {/* Pagination using meta from API */}
      <div className="mt-12">
        <Pagination
          currentPage={currentPage}
          totalPages={
            themesData?.meta?.total ? Math.ceil(themesData.meta.total / 10) : 1
          }
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add/Edit Modal */}
      {(modalType === "add" || modalType === "edit") && (
        <Modal
          isOpen={true}
          onClose={() => setModalType(null)}
          title={
            modalType === "edit" ? "Edit Theme Details" : "Create New Theme"
          }
          footer={
            <button
              onClick={handleSave}
              disabled={isCreating || isUpdating}
              className="px-20 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl hover:bg-black transition-all disabled:bg-slate-400"
            >
              {isCreating || isUpdating ? "Processing..." : "Save Changes"}
            </button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <InputGroup label="Theme Title">
              <Input
                placeholder="e.g. Modern Minimal"
                value={selectedTheme?.title || ""}
                onChange={(e) =>
                  setSelectedTheme({ ...selectedTheme, title: e.target.value })
                }
              />
            </InputGroup>

            <InputGroup label="Cover Image">
              <div className="relative flex items-center border-2 border-slate-100 rounded-2xl p-2 bg-slate-50">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
                <div className="bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                  <ImageIcon size={16} /> {imageFile ? "Change" : "Upload"}
                </div>
                <div className="px-3 text-xs text-slate-500 truncate font-medium">
                  {imageFile ? imageFile.name : "Choose file..."}
                </div>
              </div>
            </InputGroup>
          </div>

          <div className="mb-8 p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center gap-4">
            {imagePreview ? (
              <div className="relative">
                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-white">
                  <img
                    src={imagePreview}
                    alt="new"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -left-2 bg-blue-500 text-[8px] text-white px-1.5 py-0.5 rounded font-black">
                  NEW
                </div>
                <button
                  onClick={() => setImageFile(null)}
                  className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full shadow-md"
                >
                  <X size={10} />
                </button>
              </div>
            ) : selectedTheme?.image ? (
              <div className="relative">
                <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-white">
                  <img
                    src={selectedTheme.image}
                    alt="current"
                    className="w-full h-full object-cover opacity-70"
                  />
                </div>
                <div className="absolute -top-2 -left-2 bg-slate-400 text-[8px] text-white px-1.5 py-0.5 rounded font-black">
                  CURRENT
                </div>
              </div>
            ) : (
              <div className="w-20 h-20 rounded-xl border-2 border-slate-200 flex items-center justify-center bg-white text-slate-300">
                <ImageIcon size={24} />
              </div>
            )}
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Image Status
              </p>
              <p className="text-xs text-slate-500">
                {imagePreview
                  ? "Replacing current image"
                  : selectedTheme?.image
                  ? "Using stored file"
                  : "No image uploaded"}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <InputGroup label="Visibility Status">
              <div className="flex gap-4 p-1 bg-slate-50 rounded-2xl w-fit">
                {[true, false].map((val) => (
                  <button
                    key={val.toString()}
                    type="button"
                    onClick={() =>
                      setSelectedTheme({ ...selectedTheme, isActive: val })
                    }
                    className={`px-10 py-3 rounded-xl text-xs font-bold transition-all ${
                      selectedTheme?.isActive === val
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-400"
                    }`}
                  >
                    {val ? "Active" : "Inactive"}
                  </button>
                ))}
              </div>
            </InputGroup>
          </div>

          <InputGroup label="Description">
            <TextEditor
              content={selectedTheme?.description || ""}
              onChange={(html) =>
                setSelectedTheme({ ...selectedTheme, description: html })
              }
              placeholder="Describe this theme's layout and style..."
            />
          </InputGroup>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={modalType === "delete"}
        onClose={() => setModalType(null)}
        onConfirm={handleConfirmDelete}
        itemName={selectedTheme?.title}
        isLoading={isDeleting}
      />
    </div>
  );
}
