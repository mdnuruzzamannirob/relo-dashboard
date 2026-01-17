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
  Calendar
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
  useGetCharactersQuery,
  useCreateCharacterMutation,
  useUpdateCharacterMutation,
  useDeleteCharacterMutation,
} from "../services/allApi";

export default function Characters() {
  // --- LOCAL STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [modalType, setModalType] = useState(null); // 'add', 'edit', 'delete'
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // --- API HOOKS ---
  const {
    data: charactersData,
    isLoading,
    refetch,
  } = useGetCharactersQuery({
    page: currentPage,
    limit: 10,
  });
  console.log(charactersData);
  const [createCharacter, { isLoading: isCreating }] =
    useCreateCharacterMutation();
  const [updateCharacter, { isLoading: isUpdating }] =
    useUpdateCharacterMutation();
  const [deleteCharacter, { isLoading: isDeleting }] =
    useDeleteCharacterMutation();

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
  const filteredCharacters = useMemo(() => {
    const list = charactersData?.result || charactersData?.data || [];
    if (!searchTerm) return list;
    return list.filter(
      (char) =>
        char.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [charactersData, searchTerm]);

  // --- HANDLERS ---
  const handleOpenAdd = () => {
    setSelectedCharacter({
      name: "",
      title: "",
      description: "",
      famousLine: "",
      isActive: true,
      photo: null,
    });
    setImageFile(null);
    setModalType("add");
  };

  const handleOpenEdit = (char) => {
    setSelectedCharacter({ ...char });
    setImageFile(null);
    setModalType("edit");
  };

  const handleSave = async () => {
    const formData = new FormData();
    const jsonData = {
      name: selectedCharacter.name,
      title: selectedCharacter.title,
      description: selectedCharacter.description,
      famousLine: selectedCharacter.famousLine,
      isActive: selectedCharacter.isActive ?? true,
    };

    formData.append("data", JSON.stringify(jsonData));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (modalType === "edit") {
        await updateCharacter({
          characterId: selectedCharacter.id,
          formData: formData,
        }).unwrap();
        toast.success("Character updated successfully");
      } else {
        await createCharacter(formData).unwrap();
        toast.success("Character added successfully");
      }
      setModalType(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Operation failed");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteCharacter(selectedCharacter.id).unwrap();
      toast.success("Character removed");
      setModalType(null);
      refetch();
    } catch (error) {
      toast.error("Failed to delete character");
    }
  };

  if (isLoading) return <BooksSkeleton />;

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans text-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Characters Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage character profiles and world-building
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center bg-[#1e293b] text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} className="mr-2" /> Add Character
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
          placeholder="Search by name or title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-slate-200 focus:bg-white rounded-2xl transition-all outline-none"
        />
      </div>

      {/* Characters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCharacters.length > 0 ? (
          filteredCharacters.map((char) => (
            <Card
              key={char.id}
              title={char.name}
              image={char.photo || ""} // Card component will display this image
              active={char.isActive}
              actions={
                <>
                  <button
                    onClick={() => handleOpenEdit(char)}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl text-sm font-bold transition-all"
                  >
                    <Edit3 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCharacter(char);
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
                {new Date(char.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
              <div className="mb-3">
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                  {char.title}
                </span>
              </div>
              <p className="text-gray-500 text-xs italic mb-4 line-clamp-2">
                "{char.famousLine}"
              </p>
              <div
                className="text-slate-600 text-xs line-clamp-3 bg-slate-50 p-3 rounded-xl border border-slate-100"
                dangerouslySetInnerHTML={{ __html: char.description }}
              />
              <div className="flex items-center gap-3 my-2">
                <div
                  className={`p-2.5 rounded-xl transition-colors ${
                    char.isActive
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {char.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 leading-none mb-1">
                    Status
                  </p>
                  <p
                    className={`text-xs font-bold ${
                      char.isActive ? "text-emerald-700" : "text-slate-500"
                    }`}
                  >
                    {char.isActive ? "Visible" : "Hidden"}
                  </p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
            <AlertCircle size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">No characters found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-12">
        <Pagination
          currentPage={currentPage}
          totalPages={
            charactersData?.meta?.total
              ? Math.ceil(charactersData.meta.total / 10)
              : 1
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
            modalType === "edit"
              ? "Modify Character Profile"
              : "Create New Character"
          }
          footer={
            <button
              onClick={handleSave}
              disabled={isCreating || isUpdating}
              className="px-20 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl hover:bg-black transition-all active:scale-95 disabled:bg-slate-400"
            >
              {isCreating || isUpdating ? "Saving..." : "Confirm & Save"}
            </button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <InputGroup label="Character Name">
              <Input
                placeholder="e.g. George Orwell"
                value={selectedCharacter?.name || ""}
                onChange={(e) =>
                  setSelectedCharacter({
                    ...selectedCharacter,
                    name: e.target.value,
                  })
                }
              />
            </InputGroup>

            <InputGroup label="Title / Role">
              <Input
                placeholder="e.g. Protagonist"
                value={selectedCharacter?.title || ""}
                onChange={(e) =>
                  setSelectedCharacter({
                    ...selectedCharacter,
                    title: e.target.value,
                  })
                }
              />
            </InputGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-end">
            <InputGroup label="Character Image">
              <div className="relative flex items-center border-2 border-slate-100 rounded-2xl p-2 bg-slate-50 overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
                <div className="bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap">
                  <ImageIcon size={16} />{" "}
                  {imageFile ? "Change Image" : "Upload Photo"}
                </div>
                <div className="px-3 text-xs text-slate-500 truncate font-medium">
                  {imageFile ? imageFile.name : "Select JPG or PNG"}
                </div>
              </div>
            </InputGroup>

            {/* PREVIEW BLOCK (Shows Previous or New) */}
            <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              {imagePreview ? (
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-white">
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
              ) : selectedCharacter?.photo ? (
                <div className="relative">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-sm bg-white">
                    <img
                      src={selectedCharacter.photo}
                      alt="current"
                      className="w-full h-full object-cover opacity-70"
                    />
                  </div>
                  <div className="absolute -top-2 -left-2 bg-slate-400 text-[8px] text-white px-1.5 py-0.5 rounded font-black">
                    EXISTING
                  </div>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl border-2 border-slate-200 flex items-center justify-center bg-white text-slate-300">
                  <ImageIcon size={20} />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Image Preview
                </span>
                <span className="text-[9px] text-slate-500">
                  {imagePreview
                    ? "Pending upload"
                    : selectedCharacter?.photo
                    ? "Stored on server"
                    : "No image set"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <InputGroup label="Famous Line">
              <Input
                placeholder="Enter a signature quote"
                value={selectedCharacter?.famousLine || ""}
                onChange={(e) =>
                  setSelectedCharacter({
                    ...selectedCharacter,
                    famousLine: e.target.value,
                  })
                }
              />
            </InputGroup>

            <InputGroup label="Status">
              <div className="flex gap-4 p-1 bg-slate-50 rounded-2xl w-full">
                {[true, false].map((val) => (
                  <button
                    key={val.toString()}
                    type="button"
                    onClick={() =>
                      setSelectedCharacter({
                        ...selectedCharacter,
                        isActive: val,
                      })
                    }
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                      selectedCharacter?.isActive === val
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {val ? "Active" : "InActive"}
                  </button>
                ))}
              </div>
            </InputGroup>
          </div>

          <InputGroup label="Character Background & Description">
            <TextEditor
              content={selectedCharacter?.description || ""}
              onChange={(html) =>
                setSelectedCharacter({
                  ...selectedCharacter,
                  description: html,
                })
              }
              placeholder="Describe the character's history..."
            />
          </InputGroup>
        </Modal>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={modalType === "delete"}
        onClose={() => setModalType(null)}
        onConfirm={handleConfirmDelete}
        itemName={selectedCharacter?.name}
        isLoading={isDeleting}
      />
    </div>
  );
}
