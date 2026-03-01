import { useMemo, useState } from "react";
import {
  AlertCircle,
  Eye,
  Receipt,
  Search,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useDebounce } from "@/hooks/useDebounce";
import {
  PaymentTableSkeleton,
  StatsRowSkeleton,
} from "@/components/skeletons/DashboardSkeletons";
import { useGetAllPaymentHistoryQuery } from "@/store/apis/adminApi";

const SORT_OPTIONS = [
  { label: "Newest First", value: "desc" },
  { label: "Oldest First", value: "asc" },
];

const LIMIT = 8;

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString();
};

const formatCurrency = (value) => {
  const amount = Number(value || 0);
  if (Number.isNaN(amount)) return "$0";
  return `$${amount.toLocaleString()}`;
};

const Payments = () => {
  const [searchInput, setSearchInput] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [showPaymentDetail, setShowPaymentDetail] = useState(null);

  const searchTerm = useDebounce(searchInput, 400);

  const { data, isLoading, isFetching, isError, error } =
    useGetAllPaymentHistoryQuery({
      page,
      limit: LIMIT,
      searchTerm: searchTerm?.trim() ? searchTerm : undefined,
      sortOrder,
    });

  const payments = useMemo(() => data?.data?.result ?? [], [data]);
  const meta = data?.data?.meta ?? {};
  const totalPages = meta.totalPage ?? 1;
  const total = meta.total ?? 0;

  const totalAmountCurrentPage = useMemo(
    () => payments.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [payments],
  );

  const activeNowCount = useMemo(
    () =>
      payments.filter((item) => item?.buyer?.isOnline || item?.seller?.isOnline)
        .length,
    [payments],
  );

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setPage(1);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          Payment History
        </h1>
        <p className="text-slate-500 text-sm">
          Monitor all payment transactions across the platform
        </p>
      </div>

      {/* Stats */}
      {isLoading ? (
        <StatsRowSkeleton count={3} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Transactions</p>
                <p className="text-2xl font-bold text-slate-900">{total}</p>
              </div>
              <div className="rounded-lg bg-brand-100 p-3">
                <Receipt className="h-6 w-6 text-brand-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">This Page Amount</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {formatCurrency(totalAmountCurrentPage)}
                </p>
              </div>
              <div className="rounded-lg bg-emerald-100 p-3">
                <Wallet className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Active Users (Page)</p>
                <p className="text-2xl font-bold text-blue-600">
                  {activeNowCount}
                </p>
              </div>
              <div className="rounded-lg bg-blue-100 p-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-center gap-3">
          <AlertCircle className="text-red-600 shrink-0" size={20} />
          <p className="text-sm text-red-700">
            {error?.data?.message ||
              "Failed to load payment history. Please try again."}
          </p>
        </div>
      )}

      {/* Search + Sort */}
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Search by buyer, seller, order ID or product..."
              className="pl-10 pr-10"
              value={searchInput}
              onChange={handleSearchChange}
            />
            {searchInput && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            )}
          </div>

          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium text-slate-600 hidden sm:inline">
              Sort:
            </label>
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="text-sm border border-slate-200 rounded-md px-3 py-2 text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table / States */}
      {isLoading ? (
        <PaymentTableSkeleton rows={LIMIT} />
      ) : payments.length === 0 && !isError ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-slate-500 text-sm">No payment history found</p>
        </div>
      ) : (
        <div
          className={cn(
            "rounded-lg border border-slate-200 bg-white overflow-hidden transition-opacity shadow-sm hover:shadow-md",
            isFetching && "opacity-60",
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-230">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">
                    Transaction
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">
                    Order
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">
                    Product
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">
                    Amount
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">
                    Buyer / Seller
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">
                    Paid At
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">
                      <p className="line-clamp-1">
                        {payment.transaction ?? "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      {payment.orderId ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      <p className="font-medium text-slate-800 line-clamp-1">
                        {payment.product?.title ?? "—"}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {payment.product?.brandName ?? "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700">
                      <p className="line-clamp-1">
                        B: {payment.buyer?.name ?? "—"}
                      </p>
                      <p className="line-clamp-1 text-xs text-slate-500">
                        S: {payment.seller?.name ?? "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {formatDate(payment.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPaymentDetail(payment)}
                        className="gap-1.5 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {/* Detail Dialog */}
      <Dialog
        open={!!showPaymentDetail}
        onOpenChange={() => setShowPaymentDetail(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              Transaction information and participants
            </DialogDescription>
          </DialogHeader>

          {showPaymentDetail && (
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Product</p>
                <p className="text-base font-semibold text-slate-900">
                  {showPaymentDetail.product?.title ?? "—"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Brand: {showPaymentDetail.product?.brandName ?? "—"}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                {[
                  {
                    label: "Transaction ID",
                    value: showPaymentDetail.transaction,
                  },
                  { label: "Payment ID", value: showPaymentDetail.id },
                  { label: "Order ID", value: showPaymentDetail.orderId },
                  {
                    label: "Amount",
                    value: formatCurrency(showPaymentDetail.amount),
                  },
                  {
                    label: "Paid At",
                    value: formatDate(showPaymentDetail.createdAt),
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between border-b border-slate-100 pb-2 gap-3"
                  >
                    <span className="text-slate-500 shrink-0">{label}</span>
                    <span className="font-medium text-slate-900 text-right break-all">
                      {value || "—"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-slate-50 p-3 space-y-1">
                  <p className="text-xs text-slate-500">Buyer</p>
                  <p className="font-semibold text-slate-900">
                    {showPaymentDetail.buyer?.name ?? "—"}
                  </p>
                  <p className="text-xs text-slate-500 break-all">
                    {showPaymentDetail.buyer?.email ?? "—"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Status:{" "}
                    {showPaymentDetail.buyer?.isOnline ? "Online" : "Offline"}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3 space-y-1">
                  <p className="text-xs text-slate-500">Seller</p>
                  <p className="font-semibold text-slate-900">
                    {showPaymentDetail.seller?.name ?? "—"}
                  </p>
                  <p className="text-xs text-slate-500 break-all">
                    {showPaymentDetail.seller?.email ?? "—"}
                  </p>
                  <p className="text-xs text-slate-500">
                    Status:{" "}
                    {showPaymentDetail.seller?.isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payments;
