import { useEffect, useMemo, useState } from "react";
import { Search, Plus, Trash2 } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
} from "@/store/apis/categoryApi";
import { categorySchema } from "@/lib/schema/categorySchema";
import { useDebounce } from "@/hooks/useDebounce";

const Category = () => {
  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // simple pagination state (optional)
  const [page, setPage] = useState(1);
  const limit = 10;
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Query
  const { data, isLoading, isError, refetch, isFetching } =
    useGetCategoriesQuery(
      { page, limit, searchTerm: debouncedSearchTerm },
      { refetchOnMountOrArgChange: true },
    );
  console.log({ data, isLoading, isError, isFetching });

  const categories = useMemo(() => {
    return data?.data?.categories ?? [];
  }, [data?.data?.categories]);

  const total = data?.data?.meta?.total ?? categories.length;

  // Mutations
  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  // RHF + Zod
  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { title: "", description: "" },
    mode: "onChange",
  });

  const { register, handleSubmit, reset, formState } = form;
  const { errors, isValid } = formState;

  // derived stats
  const totalProducts = useMemo(() => {
    return categories?.reduce((sum, c) => sum + (c.count ?? 0), 0);
  }, [categories]);

  // Create submit
  const onSubmit = async (values) => {
    await createCategory({
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
    }).unwrap();

    reset({ title: "", description: "" });
    setShowAddDialog(false);
    // refetch() not required if invalidation works, but harmless:
    // refetch();
  };

  // Delete confirm
  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await deleteCategory(deleteId).unwrap();
    setDeleteId(null);
  };

  // reset form when dialog closes
  useEffect(() => {
    if (!showAddDialog) reset({ title: "", description: "" });
  }, [showAddDialog, reset]);

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
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <Button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Total Categories</p>
          <p className="text-3xl font-bold text-slate-900">
            {isLoading ? "…" : total}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Total Products</p>
          <p className="text-3xl font-bold text-blue-600">
            {isLoading ? "…" : totalProducts}
          </p>
        </div>
      </div>

      {/* Table */}
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
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-slate-500"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-slate-500"
                  >
                    Failed to load categories.
                    <Button
                      variant="outline"
                      className="ml-3"
                      onClick={() => refetch()}
                    >
                      Retry
                    </Button>
                  </TableCell>
                </TableRow>
              ) : categories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-slate-500"
                  >
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((item, index) => (
                  <TableRow key={item._id} className="hover:bg-slate-50">
                    <TableCell className="font-medium text-slate-900">
                      {(page - 1) * limit + (index + 1)}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {item.title}
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {item.description || "—"}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {item.count ?? 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* তুমি চাইলে এখানে Edit button add করবে (update hook already আছে) */}
                        <button
                          onClick={() => setDeleteId(item._id)}
                          className="inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Simple pagination controls (optional, meta.total থাকলে কাজ করবে best) */}
        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-slate-600">
          <div>{isFetching ? "Updating..." : `Page ${page}`}</div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              disabled={categories.length < limit || isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>Create a new product category</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Category Name
              </label>
              <Input
                placeholder="Enter category name"
                className="mt-1"
                {...register("title")}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <Input
                placeholder="Enter description"
                className="mt-1"
                {...register("description")}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => setShowAddDialog(false)}
                className="flex-1 rounded-md border border-slate-300 bg-white py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                disabled={isCreating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
                disabled={!isValid || isCreating}
              >
                {isCreating ? "Creating..." : "Add Category"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <button
              onClick={() => setDeleteId(null)}
              className="flex-1 rounded-md border border-slate-300 bg-white py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="flex-1 rounded-md bg-red-600 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-60"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Category;
