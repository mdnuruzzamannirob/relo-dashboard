import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Tag,
  Calendar,
  Edit3,
  Trash2,
  UploadCloud,
  Image as ImageIcon,
  ExternalLink,
  AlertCircle,
  Eye,
  EyeOff, // Added for status icons
} from "lucide-react";
import { toast } from "react-toastify";

// Reusable Component Imports
import { Modal } from "../components/Modal";
import { Card } from "../components/Card";
import { Input, InputGroup, Textarea } from "../components/Form";
import { DeleteConfirmModal } from "../components/DeleteConfirmModal";
import { Pagination } from "../components/Pagination";
import { FileUploader } from "../components/FileUploader";
import TextEditor from "../components/TextEditor";
import BooksSkeleton from "../components/shimmer/ContentsSkeleton";
import {
  useGetBooksQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} from "../services/allApi";

export default function BooksManagement() {
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalType, setModalType] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // --- API HOOKS ---
  const { data, isLoading, refetch } = useGetBooksQuery({
    page: currentPage,
    limit: 10,
    searchTerm: debouncedSearch,
  });

  const [createBook, { isLoading: isCreating }] = useCreateBookMutation();
  const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

  // --- EFFECTS ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // --- HANDLERS ---
  const handleOpenAdd = () => {
    setImagePreview(null);
    setSelectedBook({
      title: "",
      writerName: "",
      description: "",
      featuredRelease: false,
      isActive: true,
      isAvailable: true, // ADDED DEFAULT VALUE
      aboutBook: "",
      imageFile: null,
      pdfFile: null,
    });
    setModalType("add");
  };

  const handleOpenEdit = (book) => {
    setImagePreview(book.thumbnail);
    setSelectedBook({
      ...book,
      imageFile: null,
      pdfFile: null,
    });
    setModalType("edit");
  };

  const handleImageSelect = (file) => {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    setSelectedBook({ ...selectedBook, imageFile: file });
  };

  const handleSave = async () => {
    const formData = new FormData();

    const payload = {
      title: selectedBook.title,
      writerName: selectedBook.writerName,
      description: selectedBook.description,
      aboutBook: selectedBook.aboutBook,
      featuredRelease: selectedBook.featuredRelease,
      isActive: selectedBook.isActive,
      isAvailable: selectedBook.isAvailable,
    };

    formData.append("data", JSON.stringify(payload));

    if (selectedBook.imageFile) {
      formData.append("thumbnail", selectedBook.imageFile);
    }
    if (selectedBook.pdfFile) {
      formData.append("bookPdf", selectedBook.pdfFile);
    }

    try {
      if (modalType === "edit") {
        const res = await updateBook({
          bookId: selectedBook.id,
          formData,
        }).unwrap();

        toast.success("Book updated successfully");
      } else {
        await createBook(formData).unwrap();
        toast.success("Book published successfully");
      }
      setModalType(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Operation failed.");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteBook(selectedBook.id).unwrap();
      toast.success("Book deleted");
      setModalType(null);
      refetch();
    } catch (err) {
      toast.error("Failed to delete book");
    }
  };

  if (isLoading) return <BooksSkeleton />;

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans text-slate-800">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Books Management
          </h1>
          <p className="text-gray-500 mt-1">
            Add, edit, or remove books from the library
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center bg-[#1e293b] text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} className="mr-2" /> Add New Book
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-10 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search
            size={20}
            className="text-gray-400 group-focus-within:text-slate-600 transition-colors"
          />
        </div>
        <input
          type="text"
          placeholder="Search by title or author name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent focus:border-slate-200 focus:bg-white rounded-2xl transition-all outline-none"
        />
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data?.result?.length > 0 ? (
          data.result.map((book) => (
            <Card
              key={book.id}
              title={book.title}
              image={book.thumbnail}
              active={book.isActive}
              availabe={book.isAvailable}
              latestUpdate={
                book.updatedAt
                  ? new Date(book.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "Never"
              }
              actions={
                <>
                  <button
                    onClick={() => handleOpenEdit(book)}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-xl text-sm font-bold transition-all"
                  >
                    <Edit3 size={16} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedBook(book);
                      setModalType("delete");
                    }}
                    className="w-14 flex items-center justify-center bg-rose-50 hover:bg-rose-100 text-rose-500 py-3.5 rounded-xl border border-rose-100 transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </>
              }
            >
              <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 italic">
                "{book.description}"
              </p>

              {/* Main Container: Stacked Rows */}
              <div className="flex flex-col gap-5 mb-2">
                {/* ROW 1: Writer (Left) | Updated (Right) */}
                <div className="grid grid-cols-2 gap-4">
                  <MetaItem icon={Tag} label="Writer" value={book.writerName} />

                  <MetaItem
                    icon={Calendar}
                    label="Updated"
                    value={
                      book.updatedAt
                        ? new Date(book.updatedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"
                    }
                  />
                </div>

                {/* ROW 2: Status (Left) | Availability (Right) */}
                <div className="grid grid-cols-2 gap-4">
                  {/* 1. VISIBILITY STATUS (LEFT) */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl transition-colors ${
                        book.isActive
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {book.isActive ? <Eye size={18} /> : <EyeOff size={18} />}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 leading-none mb-1">
                        Status
                      </p>
                      <p
                        className={`text-xs font-bold ${
                          book.isActive ? "text-emerald-700" : "text-slate-500"
                        }`}
                      >
                        {book.isActive ? "Visible" : "Hidden"}
                      </p>
                    </div>
                  </div>

                  {/* 2. AVAILABILITY (RIGHT) */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl transition-colors ${
                        book.isAvailable
                          ? "bg-blue-50 text-blue-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      <Tag size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 leading-none mb-1">
                        Availability
                      </p>
                      <p
                        className={`text-xs font-bold ${
                          book.isAvailable ? "text-blue-700" : "text-amber-700"
                        }`}
                      >
                        {book.isAvailable ? "Available" : "Out of Stock"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
            <AlertCircle size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-medium">
              No books found matching your search
            </p>
          </div>
        )}
      </div>

      <div className="mt-12">
        <Pagination
          currentPage={currentPage}
          totalPages={data?.meta?.total ? Math.ceil(data.meta.total / 10) : 1}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* Main Form Modal */}
      {(modalType === "add" || modalType === "edit") && (
        <Modal
          isOpen={true}
          onClose={() => setModalType(null)}
          title={
            modalType === "edit" ? "Edit Book Details" : "Publish New Book"
          }
          footer={
            <button
              onClick={handleSave}
              disabled={isCreating || isUpdating}
              className="px-20 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl hover:bg-black transition-all active:scale-95 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isCreating || isUpdating
                ? "Uploading Data..."
                : "Confirm & Publish"}
            </button>
          }
        >
          {/* Visual Preview */}
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
              Cover Preview
            </p>
            <div className="w-full h-72 bg-slate-50 rounded-4xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex flex-col items-center text-slate-300">
                  <ImageIcon size={64} strokeWidth={1} />
                  <p className="text-sm mt-2 font-medium">
                    No cover image uploaded
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields: Title and Author */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputGroup label="Book Title">
              <Input
                placeholder="Enter title"
                value={selectedBook?.title || ""}
                onChange={(e) =>
                  setSelectedBook({ ...selectedBook, title: e.target.value })
                }
              />
            </InputGroup>
            <InputGroup label="Author / Writer">
              <Input
                placeholder="Author name"
                value={selectedBook?.writerName || ""}
                onChange={(e) =>
                  setSelectedBook({
                    ...selectedBook,
                    writerName: e.target.value,
                  })
                }
              />
            </InputGroup>
          </div>

          <div className="mt-6">
            <InputGroup label="Card Description (Short)">
              <Textarea
                placeholder="Briefly describe the book..."
                value={selectedBook?.description || ""}
                onChange={(e) =>
                  setSelectedBook({
                    ...selectedBook,
                    description: e.target.value,
                  })
                }
              />
            </InputGroup>
          </div>

          {/* TOGGLES: Featured and Visibility Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
            <InputGroup label="Set as Featured?">
              <div className="flex gap-4 p-1 bg-slate-50 rounded-2xl">
                {[true, false].map((val) => (
                  <button
                    key={val.toString()}
                    type="button"
                    onClick={() =>
                      setSelectedBook({ ...selectedBook, featuredRelease: val })
                    }
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                      selectedBook?.featuredRelease === val
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {val ? "Featured" : "Regular"}
                  </button>
                ))}
              </div>
            </InputGroup>

            <InputGroup label="Visibility Status">
              <div className="flex gap-4 p-1 bg-slate-50 rounded-2xl">
                {[true, false].map((val) => (
                  <button
                    key={val.toString()}
                    type="button"
                    onClick={() =>
                      setSelectedBook({ ...selectedBook, isActive: val })
                    }
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                      selectedBook?.isActive === val
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {val ? "Active" : "Inactive"}
                  </button>
                ))}
              </div>
            </InputGroup>
            <InputGroup label="Availability">
              <div className="flex gap-4 p-1 bg-slate-50 rounded-2xl">
                {[true, false].map((val) => (
                  <button
                    key={val.toString()}
                    type="button"
                    onClick={() =>
                      setSelectedBook({ ...selectedBook, isAvailable: val })
                    }
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${
                      selectedBook?.isAvailable === val
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    {val ? "In Stock" : "Out of Stock"}
                  </button>
                ))}
              </div>
            </InputGroup>
          </div>

          {/* Thumbnail Upload */}
          <div className="mt-6">
            <InputGroup label="Update Thumbnail">
              <div className="flex items-center gap-4 bg-white border-2 border-slate-100 p-2 rounded-2xl">
                <FileUploader onFileSelect={handleImageSelect} accept="image/*">
                  <div className="bg-slate-800 text-white px-5 py-3 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer hover:bg-slate-700 transition-colors">
                    <ImageIcon size={16} /> Choose Image
                  </div>
                </FileUploader>
                <span className="text-xs text-slate-400 truncate max-w-37.5">
                  {selectedBook?.imageFile
                    ? selectedBook.imageFile.name
                    : "jpeg, png supported"}
                </span>
              </div>
            </InputGroup>
          </div>

          {/* PDF Management: Upload and Restore Preview Link */}
          <div className="mt-10">
            <InputGroup label="Book Document (PDF)">
              <div className="flex flex-col gap-4">
                <FileUploader
                  onFileSelect={(file) =>
                    setSelectedBook({ ...selectedBook, pdfFile: file })
                  }
                  accept=".pdf"
                  className="border-2 border-dashed border-slate-200 rounded-4xl p-12 flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-400 mb-4 shadow-sm">
                    <UploadCloud size={32} />
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    {selectedBook?.pdfFile
                      ? selectedBook.pdfFile.name
                      : "Click or drag to upload PDF"}
                  </p>
                </FileUploader>

                {/* Restored Preview Link */}
                {(selectedBook?.bookPdf || selectedBook?.pdfFile) && (
                  <button
                    type="button"
                    onClick={() => {
                      const url = selectedBook.pdfFile
                        ? URL.createObjectURL(selectedBook.pdfFile)
                        : selectedBook.bookPdf;
                      window.open(url, "_blank");
                    }}
                    className="flex items-center justify-center gap-2 text-indigo-600 font-bold text-sm bg-indigo-50 border border-indigo-100 py-4 rounded-2xl hover:bg-indigo-100 transition-all"
                  >
                    <ExternalLink size={18} /> Review Document Content
                  </button>
                )}
              </div>
            </InputGroup>
          </div>

          {/* Detailed Editor */}
          <div className="mt-10">
            <InputGroup label="About Book (Detailed Metadata)">
              <TextEditor
                content={selectedBook?.aboutBook || ""}
                onChange={(html) =>
                  setSelectedBook({ ...selectedBook, aboutBook: html })
                }
                placeholder="Enter full synopsis and metadata..."
              />
            </InputGroup>
          </div>
        </Modal>
      )}

      <DeleteConfirmModal
        isOpen={modalType === "delete"}
        onClose={() => setModalType(null)}
        onConfirm={handleConfirmDelete}
        itemName={selectedBook?.title}
        isLoading={isDeleting}
      />
    </div>
  );
}

function MetaItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-slate-100 rounded-xl text-slate-600">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 leading-none mb-1">
          {label}
        </p>
        <p className="text-xs font-bold text-slate-800 truncate max-w-30">
          {value}
        </p>
      </div>
    </div>
  );
}
