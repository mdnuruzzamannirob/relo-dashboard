import { useState } from "react";
import { Eye, Package, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetAllProductsQuery } from "@/store/apis/adminApi";
import { useDebounce } from "@/hooks/useDebounce";
import { ProductGridSkeleton } from "@/components/skeletons/DashboardSkeletons";
import { FilterCard } from "@/components/common/FilterCard";
import { StatusBadge } from "@/components/common/StatusBadge";

const AVAILABILITY_OPTIONS = [
  { label: "All Products", value: "ALL" },
  { label: "Available", value: "AVAILABLE" },
  { label: "Sold", value: "SOLD" },
];

const LIMIT = 8;

const Products = () => {
  const [searchInput, setSearchInput] = useState("");
  const [availFilter, setAvailFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [showProductDetail, setShowProductDetail] = useState(null);

  const searchTerm = useDebounce(searchInput, 400);

  const queryParams = {
    page,
    limit: LIMIT,
    searchTerm: searchTerm?.trim() ? searchTerm : undefined,
    isAvailable:
      availFilter === "ALL" ? undefined : availFilter === "AVAILABLE",
    isSold:
      availFilter === "SOLD"
        ? true
        : availFilter === "AVAILABLE"
          ? false
          : undefined,
  };

  const { data, isLoading, isFetching, isError, error } =
    useGetAllProductsQuery(queryParams);

  const products = data?.data?.result ?? [];
  const meta = data?.data?.meta ?? {};
  const totalPages = meta.totalPage ?? 1;

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setPage(1);
  };

  const handleAvailChange = (val) => {
    setAvailFilter(val);
    setPage(1);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          Products
        </h1>
        <p className="text-slate-500 text-sm">
          Manage and view all products in your catalog
        </p>
      </div>

      {/* Error State */}
      {isError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-center gap-3">
          <AlertCircle className="text-red-600 shrink-0" size={20} />
          <p className="text-sm text-red-700">
            {error?.data?.message ||
              "Failed to load products. Please try again."}
          </p>
        </div>
      )}

      {/* Filter Bar */}
      <FilterCard
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        searchPlaceholder="Search by product name..."
        filterValue={availFilter}
        onFilterChange={handleAvailChange}
        filterOptions={AVAILABILITY_OPTIONS}
        filterLabel="Availability"
      />

      {/* Grid */}
      {isLoading ? (
        <ProductGridSkeleton count={LIMIT} />
      ) : products.length === 0 && !isError ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-12 text-center">
          <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 text-sm">
            No products found matching your search
          </p>
        </div>
      ) : (
        <div
          className={cn(
            "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-opacity",
            isFetching && "opacity-60",
          )}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white group"
            >
              {/* Image */}
              <div className="relative flex h-48 items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 overflow-hidden">
                {product.photos?.[0] ? (
                  <img
                    src={product.photos[0]}
                    alt={product.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <Package className="h-12 w-12 text-slate-300" />
                )}
                <span className="absolute top-2 right-2 rounded-full px-2.5 py-1 text-xs font-semibold bg-linear-to-r from-slate-800 to-slate-700 text-white">
                  {product.condition ?? "—"}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-3 p-4">
                <div>
                  <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {product.brandName ?? "—"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900">
                    ${product.price}
                  </span>
                  <StatusBadge
                    status={product.isSold ? "SOLD" : "AVAILABLE"}
                    size="sm"
                  />
                </div>
                {product.createdAt && (
                  <p className="text-xs text-slate-400">
                    Listed: {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                )}
                <Button
                  onClick={() => setShowProductDetail(product)}
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className={cn(page === 1 && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    isActive={page === i + 1}
                    onClick={() => setPage(i + 1)}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {totalPages > 5 && (
                <span className="text-slate-500 text-sm px-2">...</span>
              )}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  className={cn(
                    page === totalPages && "pointer-events-none opacity-50",
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Product Detail Dialog */}
      <Dialog
        open={!!showProductDetail}
        onOpenChange={() => setShowProductDetail(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="line-clamp-1">
              {showProductDetail?.title}
            </DialogTitle>
            <DialogDescription>Product Details</DialogDescription>
          </DialogHeader>
          {showProductDetail && (
            <div className="space-y-4">
              {/* Image carousel */}
              <div className="flex h-48 items-center justify-center rounded-lg bg-linear-to-br from-slate-50 to-slate-100 overflow-hidden">
                {showProductDetail.photos?.[0] ? (
                  <img
                    src={showProductDetail.photos[0]}
                    alt={showProductDetail.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-12 w-12 text-slate-300" />
                )}
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  { label: "Brand", value: showProductDetail.brandName },
                  { label: "Price", value: `$${showProductDetail.price}` },
                  { label: "Condition", value: showProductDetail.condition },
                  { label: "Size", value: showProductDetail.size },
                  {
                    label: "Category",
                    value: showProductDetail.category?.title,
                  },
                  {
                    label: "Locker",
                    value:
                      showProductDetail.location?.title ||
                      showProductDetail.lockerSize,
                  },
                  {
                    label: "Status",
                    value: showProductDetail.isSold ? "Sold" : "Available",
                  },
                  {
                    label: "Public",
                    value: showProductDetail.isPublic ? "Yes" : "No",
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg bg-slate-50 p-2.5">
                    <div className="text-xs font-medium text-slate-500">
                      {label}
                    </div>
                    <div className="font-semibold text-slate-900">
                      {value ?? "—"}
                    </div>
                  </div>
                ))}
              </div>

              {showProductDetail.description && (
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-xs font-medium text-slate-500 mb-1">
                    Description
                  </div>
                  <p className="text-sm text-slate-700 line-clamp-4">
                    {showProductDetail.description}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
