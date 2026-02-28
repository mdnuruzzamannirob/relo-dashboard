import { useState } from "react";
import { Search, Eye, TrendingUp, MapPin, Package } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  OrderGridSkeleton,
  StatsRowSkeleton,
} from "@/components/skeletons/DashboardSkeletons";

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

const getStatusColor = (status) => {
  const s = status?.toUpperCase();
  if (s === "COMPLETED" || s === "COMPLETE")
    return "bg-green-100 text-green-800";
  if (s === "READY") return "bg-blue-100 text-blue-800";
  if (s === "PROCESSING") return "bg-yellow-100 text-yellow-800";
  return "bg-slate-100 text-slate-800";
};

const ErrorBlock = ({ message }) => (
  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
    {message || "Failed to load orders. Please try again."}
  </div>
);

const LIMIT = 8;

const Orders = () => {
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [showOrderDetail, setShowOrderDetail] = useState(null);

  const searchTerm = useDebounce(searchInput, 400);

  const { data, isLoading, isFetching, isError } = useGetAllOrdersQuery({
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
    setSearchInput(e.target.value);
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
        <p className="mt-1 text-slate-600">
          Manage and track all customer orders
        </p>
      </div>

      {isError && <ErrorBlock />}

      {/* Search & Filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by order ID or buyer name..."
            className="pl-10"
            value={searchInput}
            onChange={handleSearchChange}
          />
        </div>
        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ORDER_STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortOrder} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Grid */}
      {isLoading ? (
        <OrderGridSkeleton count={LIMIT} />
      ) : orders.length === 0 && !isError ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-slate-600">No orders found matching your search</p>
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
                className="overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-md"
              >
                <div className="p-4">
                  <div className="flex gap-4">
                    {/* Product image */}
                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-slate-50 to-slate-100 overflow-hidden">
                      {product?.photos?.[0] ? (
                        <img
                          src={product.photos[0]}
                          alt={product.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-8 w-8 text-slate-300" />
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-900 line-clamp-1">
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
                          <span
                            className={cn(
                              "inline-block rounded-full px-2 py-0.5 text-xs font-medium mt-0.5",
                              getStatusColor(order.status),
                            )}
                          >
                            {order.status}
                          </span>
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

                  <button
                    onClick={() => setShowOrderDetail(order)}
                    className="mt-4 w-full flex items-center justify-center gap-2 rounded-md bg-blue-50 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
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
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium",
                        getStatusColor(showOrderDetail.status),
                      )}
                    >
                      {showOrderDetail.status}
                    </span>
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
