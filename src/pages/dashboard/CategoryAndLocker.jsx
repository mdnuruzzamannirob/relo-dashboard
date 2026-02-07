import { useEffect, useMemo, useState } from "react";
import { Edit3, Plus, Search, Trash2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/store/apis/categoryApi";
import {
  useCreateLockerAddressMutation,
  useDeleteLockerAddressMutation,
  useGetLockerAddressesQuery,
  useUpdateLockerAddressMutation,
} from "@/store/apis/lockerAddressApi";
import { categorySchema } from "@/lib/schema/categorySchema";
import { useDebounce } from "@/hooks/useDebounce";
import {
  CategoryTableSkeleton,
  StatCardSkeleton,
} from "@/components/skeletons/CategorySkeletons";
import ButtonComp from "@/components/common/ButtonComp";

const TAB_CONFIG = {
  categories: {
    label: "Categories",
    addLabel: "Add Category",
    searchPlaceholder: "Search categories...",
    emptyMessage: "No categories found.",
    titleLabel: "Category Title",
    titlePlaceholder: "Enter category title",
  },
  lockers: {
    label: "Locker Addresses",
    addLabel: "Add Locker Address",
    searchPlaceholder: "Search locker addresses...",
    emptyMessage: "No locker addresses found.",
    titleLabel: "Locker Title",
    titlePlaceholder: "Enter locker title",
  },
};

const CategoryAndLocker = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const [categoryPage, setCategoryPage] = useState(1);
  const [lockerPage, setLockerPage] = useState(1);
  const limit = 10;
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const {
    data: categoryData,
    isLoading: isLoadingCategories,
    isError: isCategoryError,
    isFetching: isFetchingCategories,
    refetch: refetchCategories,
  } = useGetCategoriesQuery(
    { page: categoryPage, limit, searchTerm: debouncedSearchTerm },
    { refetchOnMountOrArgChange: true, skip: activeTab !== "categories" },
  );

  const {
    data: lockerData,
    isLoading: isLoadingLockers,
    isError: isLockerError,
    isFetching: isFetchingLockers,
    refetch: refetchLockers,
  } = useGetLockerAddressesQuery(
    { page: lockerPage, limit, searchTerm: debouncedSearchTerm },
    { refetchOnMountOrArgChange: true, skip: activeTab !== "lockers" },
  );

  const categories = useMemo(
    () => categoryData?.data?.categories ?? [],
    [categoryData],
  );
  const lockerAddresses = useMemo(
    () => lockerData?.data?.categories ?? [],
    [lockerData],
  );

  const categoryTotal = categoryData?.data?.meta?.total ?? categories.length;
  const lockerTotal = lockerData?.data?.meta?.total ?? lockerAddresses.length;

  const [createCategory, { isLoading: isCreatingCategory }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdatingCategory }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeletingCategory }] =
    useDeleteCategoryMutation();

  const [createLockerAddress, { isLoading: isCreatingLocker }] =
    useCreateLockerAddressMutation();
  const [updateLockerAddress, { isLoading: isUpdatingLocker }] =
    useUpdateLockerAddressMutation();
  const [deleteLockerAddress, { isLoading: isDeletingLocker }] =
    useDeleteLockerAddressMutation();

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: { title: "" },
    mode: "onChange",
  });

  const { register, handleSubmit, reset, formState, getValues } = form;
  const { errors, isValid } = formState;

  const tabStateMap = {
    categories: {
      items: categories,
      total: categoryTotal,
      page: categoryPage,
      setPage: setCategoryPage,
      isLoading: isLoadingCategories,
      isFetching: isFetchingCategories,
      isError: isCategoryError,
      refetch: refetchCategories,
    },
    lockers: {
      items: lockerAddresses,
      total: lockerTotal,
      page: lockerPage,
      setPage: setLockerPage,
      isLoading: isLoadingLockers,
      isFetching: isFetchingLockers,
      isError: isLockerError,
      refetch: refetchLockers,
    },
  };

  const currentTabState = tabStateMap[activeTab];
  const tabConfig = TAB_CONFIG[activeTab];
  const editConfig = editItem ? TAB_CONFIG[editItem.tab] : tabConfig;
  const deleteConfig = deleteItem ? TAB_CONFIG[deleteItem.tab] : tabConfig;

  const isCreating =
    activeTab === "categories" ? isCreatingCategory : isCreatingLocker;
  const isUpdating = editItem
    ? editItem.tab === "categories"
      ? isUpdatingCategory
      : isUpdatingLocker
    : false;
  const isDeleting = deleteItem
    ? deleteItem.tab === "categories"
      ? isDeletingCategory
      : isDeletingLocker
    : false;

  const isEditUnchanged =
    editItem && getValues("title")?.trim() === (editItem?.title || "").trim();
  const shouldDisableAdd = !isValid || isCreating;
  const shouldDisableEdit = !isValid || isUpdating || isEditUnchanged;

  const handleCreate = async (values) => {
    const payload = { title: values.title.trim() };
    try {
      if (activeTab === "categories") {
        await createCategory(payload).unwrap();
      } else {
        await createLockerAddress(payload).unwrap();
      }
      reset({ title: "" });
      setShowAddDialog(false);
    } catch {
      // handled by RTK Query toast
    }
  };

  const handleUpdate = async (values) => {
    if (!editItem?.id) return;
    const payload = { id: editItem.id, title: values.title.trim() };
    try {
      if (editItem.tab === "categories") {
        await updateCategory(payload).unwrap();
      } else {
        await updateLockerAddress(payload).unwrap();
      }
      reset({ title: "" });
      setEditItem(null);
    } catch {
      // handled by RTK Query toast
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem?.id) return;
    try {
      if (deleteItem.tab === "categories") {
        await deleteCategory(deleteItem.id).unwrap();
      } else {
        await deleteLockerAddress(deleteItem.id).unwrap();
      }
      setDeleteItem(null);
    } catch {
      // handled by RTK Query toast
    }
  };

  useEffect(() => {
    if (showAddDialog) {
      reset({ title: "" });
    }
  }, [showAddDialog, reset]);

  useEffect(() => {
    if (editItem) {
      reset({ title: editItem.title || "" });
    }
  }, [editItem, reset]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    currentTabState.setPage(1);
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const renderTable = (tabKey) => {
    const state = tabStateMap[tabKey];
    const config = TAB_CONFIG[tabKey];
    const items = state.items;
    const canGoNext = state.total
      ? state.page * limit < state.total
      : items.length === limit;

    if (state.isLoading) {
      return (
        <div className="px-4 py-6">
          <CategoryTableSkeleton rows={6} />
        </div>
      );
    }

    if (state.isError) {
      return (
        <div className="flex flex-col items-center gap-3 px-4 py-12 text-center text-slate-600">
          <p>Failed to load data.</p>
          <Button variant="outline" onClick={state.refetch}>
            Retry
          </Button>
        </div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="px-4 py-12 text-center text-slate-500">
          {config.emptyMessage}
        </div>
      );
    }

    return (
      <>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-slate-700">SL No</TableHead>
                <TableHead className="text-slate-700">Title</TableHead>
                <TableHead className="text-slate-700">Slug</TableHead>
                <TableHead className="text-right text-slate-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item._id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-900">
                    {(state.page - 1) * limit + (index + 1)}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">
                    {item.title}
                  </TableCell>
                  <TableCell>
                    {item.slug ? (
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                        {item.slug}
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          setEditItem({
                            id: item._id,
                            title: item.title,
                            tab: tabKey,
                          })
                        }
                        className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100 disabled:opacity-60"
                        disabled={state.isFetching || isDeleting}
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          setDeleteItem({
                            id: item._id,
                            title: item.title,
                            tab: tabKey,
                          })
                        }
                        className="inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-60"
                        disabled={state.isFetching || isDeleting}
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

        <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-slate-600">
          <div>{state.isFetching ? "Updating..." : `Page ${state.page}`}</div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={state.page <= 1 || state.isFetching}
              onClick={() => state.setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              disabled={!canGoNext || state.isFetching}
              onClick={() => state.setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Categories & Lockers
        </h1>
        <p className="mt-1 text-slate-600">
          Manage categories and locker addresses in one place
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-3"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <TabsList>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="lockers">Locker Addresses</TabsTrigger>
            </TabsList>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder={tabConfig.searchPlaceholder}
                className="pl-10 h-9"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                disabled={currentTabState.isLoading}
              />
            </div>
          </div>

          <Button
            onClick={() => setShowAddDialog(true)}
            className="flex items-center gap-2"
            disabled={currentTabState.isLoading || isCreating}
          >
            <Plus className="h-4 w-4" />
            {tabConfig.addLabel}
          </Button>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <TabsContent value="categories" className="mt-0">
            {renderTable("categories")}
          </TabsContent>
          <TabsContent value="lockers" className="mt-0">
            {renderTable("lockers")}
          </TabsContent>
        </div>
      </Tabs>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{tabConfig.addLabel}</DialogTitle>
            <DialogDescription>Add a new item to the list.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                {tabConfig.titleLabel}
              </label>
              <Input
                placeholder={tabConfig.titlePlaceholder}
                className="mt-1"
                {...register("title")}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <ButtonComp
                variant="outline"
                disabled={isCreating}
                className="flex-1"
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </ButtonComp>
              <ButtonComp
                type="submit"
                loading={isCreating}
                loadingText="Creating..."
                disabled={shouldDisableAdd}
                className="flex-1"
              >
                Create
              </ButtonComp>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {editConfig.label}</DialogTitle>
            <DialogDescription>Update the title and save.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                {editConfig.titleLabel}
              </label>
              <Input
                placeholder={editConfig.titlePlaceholder}
                className="mt-1"
                {...register("title")}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <ButtonComp
                variant={"outline"}
                disabled={isUpdating}
                className="flex-1"
                onClick={() => setEditItem(null)}
              >
                Cancel
              </ButtonComp>
              <ButtonComp
                type="submit"
                loading={isUpdating}
                loadingText="Saving..."
                disabled={shouldDisableEdit}
                className="flex-1"
              >
                Save Changes
              </ButtonComp>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {deleteConfig.label}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete
              <span className="font-semibold"> {deleteItem?.title}</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <ButtonComp
              variant={"outline"}
              disabled={isDeleting}
              className="flex-1"
              onClick={() => setDeleteItem(null)}
            >
              Cancel
            </ButtonComp>
            <ButtonComp
              type="submit"
              loading={isDeleting}
              loadingText="Deleting..."
              disabled={isDeleting}
              className="flex-1"
            >
              Delete
            </ButtonComp>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryAndLocker;
