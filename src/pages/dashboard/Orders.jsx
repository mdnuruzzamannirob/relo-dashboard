import { useState } from "react";
import { Eye, MapPin, Package, AlertCircle } from "lucide-react";
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
import { useGetAllOrdersQuery } from "@/store/apis/adminApi";
import { useDebounce } from "@/hooks/useDebounce";
import { OrderGridSkeleton } from "@/components/skeletons/DashboardSkeletons";
import { FilterCard } from "@/components/common/FilterCard";
import { StatusBadge } from "@/components/common/StatusBadge";

const ORDER_STATUS_OPTIONS = [
  { label: "All Orders", value: "ALL" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Ready", value: "READY" },
  { label: "Completed", value: "COMPLETED" },
];

const SORT_OPTIONS = [
  { label: "Newest First", value: "desc" },
  { label: "Oldest First", value: "asc" },
];

const LIMIT = 8;

const Orders = () => {
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [showOrderDetail, setShowOrderDetail] = useState(null);

  const searchTerm = useDebounce(searchInput, 400);

  const { data, isLoading, isFetching, isError, error } = useGetAllOrdersQuery({
    page,
    limit: LIMIT,
    searchTerm: searchTerm || undefined,
    status: statusFilter,
    sortOrder,
  });

  const orders = data?.data?.result ?? [];
  const meta = data?.data?.meta ?? {};
  const totalPages = meta.totalPage ?? 1;

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchInput(val);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setPage(1);
  };

  const handleStatusChange = (val) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleSortChange = (val) => {
    setSortOrder(val);
    setPage(1);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          Orders
        </h1>
        <p className="text-slate-500 text-sm">
          Manage and track all customer orders
        </p>
      </div>

      {/* Error State */}
      {isError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-center gap-3">
          <AlertCircle className="text-red-600 shrink-0" size={20} />
          <p className="text-sm text-red-700">
            {error?.data?.message || "Failed to load orders. Please try again."}
          </p>
        </div>
      )}

      {/* Search with Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <FilterCard
            searchValue={searchInput}
            onSearchChange={handleSearchChange}
            onClearSearch={handleClearSearch}
            searchPlaceholder="Search by order ID or buyer name..."
            filterValue={statusFilter}
            onFilterChange={handleStatusChange}
            filterOptions={ORDER_STATUS_OPTIONS}
            filterLabel="Status"
          />
        </div>
        <div className="flex gap-2 items-center">
          <label className="text-sm font-medium text-slate-600 hidden sm:inline">
            Sort:
          </label>
          <select
            value={sortOrder}
            onChange={(e) => handleSortChange(e.target.value)}
            className="text-sm border border-slate-200 rounded-md px-3 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Grid */}
      {isLoading ? (
        <OrderGridSkeleton count={LIMIT} />
      ) : orders.length === 0 && !isError ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-12 text-center">
          <Package className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 text-sm">
            No orders found matching your search
          </p>
        </div>
      ) : (
        <div
          className={cn(
            "grid grid-cols-1 gap-4 md:grid-cols-2 transition-opacity",
            isFetching && "opacity-60",
          )}
        >
          {orders.map((order) => {
            const product = order.products?.[0];
            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white transition-all hover:shadow-lg hover:border-blue-300 group"
              >
                <div className="p-4">
                  <div className="flex gap-4">
                    {/* Product image */}
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-slate-50 to-slate-100 overflow-hidden">
                      {product?.photos?.[0] ? (
                        <img
                          src={product.photos[0]}
                          alt={product.title}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <Package className="h-8 w-8 text-slate-300" />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {product?.title ?? "—"}
                          </h3>
                          <p className="text-xs text-slate-500">
                            Order: {order.orderId}
                          </p>
                        </div>
                        <div className="text-right ml-2 shrink-0">
                          <p className="text-base font-bold text-slate-900">
                            ${order.amount}
                          </p>
                          <div className="mt-0.5">
                            <StatusBadge status={order.status} size="sm" />
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 text-xs">
                        <div>
                          <p className="text-slate-500">Buyer</p>
                          <p className="font-medium text-slate-800 line-clamp-1">
                            {order.buyer?.name ?? "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Seller</p>
                          <p className="font-medium text-slate-800 line-clamp-1">
                            {order.seller?.name ?? "—"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-1 grid grid-cols-2 gap-2 border-t border-slate-100 pt-2 text-xs">
                        <div>
                          <p className="text-slate-500">Deposit Code</p>
                          <p className="font-mono text-slate-800">
                            {order.depositCode ?? "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 flex items-center gap-1">
                            <MapPin className="h-3 w-3" /> Locker
                          </p>
                          <p className="text-slate-800 line-clamp-1">
                            {order.location?.title ?? order.lockerNumber ?? "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setShowOrderDetail(order)}
                    variant="outline"
                    size="sm"
                    className="w-full mt-4 gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                </div>
              </div>
            );
          })}
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

      {/* Order Detail Dialog */}
      <Dialog
        open={!!showOrderDetail}
        onOpenChange={() => setShowOrderDetail(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Order {showOrderDetail?.orderId}</DialogTitle>
            <DialogDescription>Full order details</DialogDescription>
          </DialogHeader>
          {showOrderDetail &&
            (() => {
              const p = showOrderDetail.products?.[0];
              return (
                <div className="space-y-4">
                  {p?.photos?.[0] && (
                    <div className="flex h-40 items-center justify-center rounded-lg bg-linear-to-br from-slate-50 to-slate-100 overflow-hidden">
                      <img
                        src={p.photos[0]}
                        alt={p.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Status */}
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                    <span className="text-sm font-medium text-slate-600">
                      Status
                    </span>
                    <StatusBadge status={showOrderDetail.status} />
                  </div>

                  {/* Product info */}
                  {p && (
                    <div className="rounded-lg bg-slate-50 p-3 space-y-1">
                      <p className="font-semibold text-slate-900">{p.title}</p>
                      <p className="text-xs text-slate-500">
                        Brand: {p.brandName ?? "—"} · Category:{" "}
                        {showOrderDetail.products?.[0]?.category?.title ?? "—"}
                      </p>
                    </div>
                  )}

                  {/* Buyer & Seller */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-xs text-slate-500">Buyer</p>
                      <p className="font-medium text-slate-900">
                        {showOrderDetail.buyer?.name ?? "—"}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-2">
                      <p className="text-xs text-slate-500">Seller</p>
                      <p className="font-medium text-slate-900">
                        {showOrderDetail.seller?.name ?? "—"}
                      </p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    {[
                      {
                        label: "Locker",
                        value:
                          showOrderDetail.location?.title ??
                          showOrderDetail.lockerNumber,
                      },
                      {
                        label: "Locker #",
                        value: showOrderDetail.lockerNumber,
                      },
                      {
                        label: "Deposit Code",
                        value: showOrderDetail.depositCode,
                      },
                      {
                        label: "Payment",
                        value: showOrderDetail.isPayment ? "Paid" : "Unpaid",
                      },
                    ].map(({ label, value }) =>
                      value ? (
                        <div
                          key={label}
                          className="flex justify-between border-b border-slate-100 pb-2"
                        >
                          <span className="text-slate-500">{label}</span>
                          <span className="font-medium text-slate-900">
                            {value}
                          </span>
                        </div>
                      ) : null,
                    )}
                  </div>

                  {/* Amount */}
                  <div className="rounded-lg bg-blue-50 p-3 flex items-center justify-between">
                    <span className="font-medium text-slate-700">
                      Total Amount
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      ${showOrderDetail.amount}
                    </span>
                  </div>
                </div>
              );
            })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
