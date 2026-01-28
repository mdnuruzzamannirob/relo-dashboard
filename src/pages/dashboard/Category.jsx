import { useState } from "react";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const demoCatalog = [
  {
    id: 1,
    name: "Electronics",
    description: "Electronic devices and gadgets",
    count: 45,
  },
  {
    id: 2,
    name: "Fashion",
    description: "Clothing and accessories",
    count: 128,
  },
  {
    id: 3,
    name: "Home & Garden",
    description: "Home and garden items",
    count: 67,
  },
  {
    id: 4,
    name: "Sports & Outdoors",
    description: "Sports and outdoor equipment",
    count: 89,
  },
  {
    id: 5,
    name: "Books & Media",
    description: "Books, movies, and media",
    count: 234,
  },
  {
    id: 6,
    name: "Toys & Games",
    description: "Toys and board games",
    count: 56,
  },
];

const Category = () => {
  const [catalog, setCatalog] = useState(demoCatalog);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const filteredCatalog = catalog.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddCategory = () => {
    if (formData.name.trim()) {
      const newCategory = {
        id: Math.max(...catalog.map((c) => c.id), 0) + 1,
        name: formData.name,
        description: formData.description,
        count: 0,
      };
      setCatalog([...catalog, newCategory]);
      setFormData({ name: "", description: "" });
      setShowAddDialog(false);
    }
  };

  const handleDeleteCategory = (id) => {
    setCatalog(catalog.filter((item) => item.id !== id));
    setShowDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Catalog</h1>
        <p className="mt-1 text-slate-600">
          Manage product categories and inventory
        </p>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search categories..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Total Categories</p>
          <p className="text-3xl font-bold text-slate-900">{catalog.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Total Products</p>
          <p className="text-3xl font-bold text-blue-600">
            {catalog.reduce((sum, cat) => sum + cat.count, 0)}
          </p>
        </div>
      </div>

      {/* Categories Table */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-slate-700">SL No</TableHead>
                <TableHead className="text-slate-700">Category Name</TableHead>
                <TableHead className="text-slate-700">Description</TableHead>
                <TableHead className="text-slate-700">Products</TableHead>
                <TableHead className="text-right text-slate-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCatalog.map((item, index) => (
                <TableRow key={item.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-900">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">
                    {item.name}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {item.description}
                  </TableCell>
                  <TableCell className="text-slate-700">{item.count}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100">
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(item.id)}
                        className="inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>Create a new product category</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Category Name
              </label>
              <Input
                placeholder="Enter category name"
                className="mt-1"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <Input
                placeholder="Enter description"
                className="mt-1"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowAddDialog(false)}
                className="flex-1 rounded-md border border-slate-300 bg-white py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Add Category
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!showDeleteConfirm}
        onOpenChange={() => setShowDeleteConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className="flex-1 rounded-md border border-slate-300 bg-white py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeleteCategory(showDeleteConfirm)}
              className="flex-1 rounded-md bg-red-600 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Category;
