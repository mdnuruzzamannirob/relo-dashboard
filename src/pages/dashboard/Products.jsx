import { useState } from "react";
import { Search, Eye, Package } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Pagination, PaginationContent, PaginationItem,
  PaginationLink, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetAllProductsQuery } from "@/store/apis/adminApi";
import { useDebounce } from "@/hooks/useDebounce";
import { ProductGridSkeleton } from "@/components/skeletons/DashboardSkeletons";

const AVAILABILITY_OPTIONS = [
  { label: "All Products",   value: "ALL"       },
  { label: "Available",      value: "AVAILABLE" },
  { label: "Sold",           value: "SOLD"      },
];

const ErrorBlock = ({ message }) => (
  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
    {message || "Failed to load products. Please try again."}
  </div>
);

const LIMIT = 8;

const Products = () => {
  const [searchInput, setSearchInput]           = useState("");
  const [availFilter, setAvailFilter]           = useState("ALL");
  const [page, setPage]                         = useState(1);
  const [showProductDetail, setShowProductDetail] = useState(null);

  const searchTerm = useDebounce(searchInput, 400);

  const queryParams = {
    page,
    limit: LIMIT,
    searchTerm: searchTerm || undefined,
    isAvailable: availFilter === "ALL" ? undefined : availFilter === "AVAILABLE",
    isSold: availFilter === "SOLD" ? true : availFilter === "AVAILABLE" ? false : undefined,
  };

  const { data, isLoading, isFetching, isError } = useGetAllProductsQuery(queryParams);

  const products   = data?.data?.result ?? [];
  const meta       = data?.data?.meta   ?? {};
  const totalPages = meta.totalPage     ?? 1;

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setPage(1);
  };

  const handleAvailChange = (val) => {
    setAvailFilter(val);
    setPage(1);
  };

  const getConditionBadge = (condition) => {
    const s = condition?.toLowerCase();
    if (s === "new")  return "bg-green-100 text-green-700";
    if (s === "used") return "bg-amber-100 text-amber-700";
    return "bg-slate-100 text-slate-600";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Products</h1>
        <p className="mt-1 text-slate-600">Manage and view all products</p>
      </div>

      {isError && <ErrorBlock />}

      {/* Search & Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by product name..."
            className="pl-10"
            value={searchInput}
            onChange={handleSearchChange}
          />
        </div>
        <Select value={availFilter} onValueChange={handleAvailChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AVAILABILITY_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      {isLoading ? (
        <ProductGridSkeleton count={LIMIT} />
      ) : products.length === 0 && !isError ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-slate-600">No products found matching your search</p>
        </div>
      ) : (
        <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 transition-opacity", isFetching && "opacity-60")}>
          {products.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-md"
            >
              {/* Image */}
              <div className="relative flex h-48 items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
                {product.photos?.[0] ? (
                  <img
                    src={product.photos[0]}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-12 w-12 text-slate-300" />
                )}
                <span className={cn("absolute top-2 right-2 rounded-full px-2 py-0.5 text-xs font-medium", getConditionBadge(product.condition))}>
                  {product.condition ?? "—"}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-2 p-4">
                <div>
                  <h3 className="font-semibold text-slate-900 line-clamp-1">{product.title}</h3>
                  <p className="text-xs text-slate-500">{product.brandName ?? "—"}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900">${product.price}</span>
                  <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", product.isSold ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700")}>
                    {product.isSold ? "Sold" : "Available"}
                  </span>
                </div>
                {product.createdAt && (
                  <p className="text-xs text-slate-400">
                    Listed: {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                )}
                <button
                  onClick={() => setShowProductDetail(product)}
                  className="w-full flex items-center justify-center gap-2 rounded-md bg-blue-50 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                >
                  <Eye className="h-4 w-4" />
                  View Details
                </button>
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
              {Array.from({ length: Math.min(totalPages, 10) }).map((_, i) => (
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
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  className={cn(page === totalPages && "pointer-events-none opacity-50")}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Product Detail Dialog */}
      <Dialog open={!!showProductDetail} onOpenChange={() => setShowProductDetail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="line-clamp-1">{showProductDetail?.title}</DialogTitle>
            <DialogDescription>Product Details</DialogDescription>
          </DialogHeader>
          {showProductDetail && (
            <div className="space-y-4">
              {/* Image carousel */}
              <div className="flex h-48 items-center justify-center rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
                {showProductDetail.photos?.[0] ? (
                  <img src={showProductDetail.photos[0]} alt={showProductDetail.title} className="h-full w-full object-cover" />
                ) : (
                  <Package className="h-12 w-12 text-slate-300" />
                )}
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  { label: "Brand",     value: showProductDetail.brandName },
                  { label: "Price",     value: `$${showProductDetail.price}` },
                  { label: "Condition", value: showProductDetail.condition },
                  { label: "Size",      value: showProductDetail.size },
                  { label: "Category",  value: showProductDetail.category?.title },
                  { label: "Locker",    value: showProductDetail.location?.title || showProductDetail.lockerSize },
                  { label: "Status",    value: showProductDetail.isSold ? "Sold" : "Available" },
                  { label: "Public",    value: showProductDetail.isPublic ? "Yes" : "No" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg bg-slate-50 p-2">
                    <div className="text-xs text-slate-500">{label}</div>
                    <div className="font-medium text-slate-900">{value ?? "—"}</div>
                  </div>
                ))}
              </div>

              {showProductDetail.description && (
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-xs text-slate-500 mb-1">Description</div>
                  <p className="text-sm text-slate-700 line-clamp-3">{showProductDetail.description}</p>
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
