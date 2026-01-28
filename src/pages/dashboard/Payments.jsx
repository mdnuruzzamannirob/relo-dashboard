import { useState } from "react";
import { Search, Eye, TrendingUp } from "lucide-react";
import { cn } from "@/utils/cn";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Demo data
const demoPayments = [
  {
    id: "PAY-001",
    orderID: "ORD-001",
    productName: "Woman Bag",
    amount: "$120.00",
    paymentMethod: "Credit Card",
    status: "Completed",
    date: "Jan 10, 2024",
    paymentDate: "Jan 10, 2024",
    buyerName: "John Doe",
    sellerName: "Emma Wilson",
    image: "👜",
  },
  {
    id: "PAY-002",
    orderID: "ORD-002",
    productName: "Woman t-shirt",
    amount: "$58.00",
    paymentMethod: "PayPal",
    status: "Completed",
    date: "Jan 10, 2024",
    paymentDate: "Jan 10, 2024",
    buyerName: "Sarah Johnson",
    sellerName: "Emma Wilson",
    image: "👕",
  },
  {
    id: "PAY-003",
    orderID: "ORD-003",
    productName: "Man t-shirt",
    amount: "$45.00",
    paymentMethod: "Debit Card",
    status: "Pending",
    date: "Jan 10, 2024",
    paymentDate: "Jan 10, 2024",
    buyerName: "Mike Brown",
    sellerName: "Emma Wilson",
    image: "👔",
  },
  {
    id: "PAY-004",
    orderID: "ORD-004",
    productName: "Woman dress",
    amount: "$95.00",
    paymentMethod: "Bank Transfer",
    status: "Completed",
    date: "Jan 15, 2024",
    paymentDate: "Jan 15, 2024",
    buyerName: "Emma Wilson",
    sellerName: "John Smith",
    image: "👗",
  },
  {
    id: "PAY-005",
    orderID: "ORD-005",
    productName: "Winter Jacket",
    amount: "$150.00",
    paymentMethod: "Credit Card",
    status: "Completed",
    date: "Jan 12, 2024",
    paymentDate: "Jan 12, 2024",
    buyerName: "David Smith",
    sellerName: "Sarah Johnson",
    image: "🧥",
  },
  {
    id: "PAY-006",
    orderID: "ORD-006",
    productName: "Sports Shoes",
    amount: "$85.00",
    paymentMethod: "PayPal",
    status: "Failed",
    date: "Jan 18, 2024",
    paymentDate: "Jan 18, 2024",
    buyerName: "Lisa Anderson",
    sellerName: "Mike Brown",
    image: "👟",
  },
  {
    id: "PAY-007",
    orderID: "ORD-007",
    productName: "Casual Hat",
    amount: "$35.00",
    paymentMethod: "Debit Card",
    status: "Completed",
    date: "Jan 20, 2024",
    paymentDate: "Jan 20, 2024",
    buyerName: "James Taylor",
    sellerName: "Emma Wilson",
    image: "🎩",
  },
  {
    id: "PAY-008",
    orderID: "ORD-008",
    productName: "Summer Shorts",
    amount: "$65.00",
    paymentMethod: "Credit Card",
    status: "Pending",
    date: "Jan 22, 2024",
    paymentDate: "Jan 22, 2024",
    buyerName: "Rachel Green",
    sellerName: "John Smith",
    image: "👖",
  },
  {
    id: "PAY-009",
    orderID: "ORD-009",
    productName: "Denim Jeans",
    amount: "$75.00",
    paymentMethod: "Bank Transfer",
    status: "Completed",
    date: "Jan 25, 2024",
    paymentDate: "Jan 25, 2024",
    buyerName: "Chris Martin",
    sellerName: "Sarah Johnson",
    image: "👖",
  },
  {
    id: "PAY-010",
    orderID: "ORD-010",
    productName: "Leather Wallet",
    amount: "$45.00",
    paymentMethod: "PayPal",
    status: "Completed",
    date: "Jan 26, 2024",
    paymentDate: "Jan 26, 2024",
    buyerName: "Jenny White",
    sellerName: "Mike Brown",
    image: "👛",
  },
  {
    id: "PAY-011",
    orderID: "ORD-011",
    productName: "Casual Shoes",
    amount: "$65.00",
    paymentMethod: "Credit Card",
    status: "Completed",
    date: "Jan 28, 2024",
    paymentDate: "Jan 28, 2024",
    buyerName: "Robert Clark",
    sellerName: "Emma Wilson",
    image: "👞",
  },
  {
    id: "PAY-012",
    orderID: "ORD-012",
    productName: "T-Shirt Pack",
    amount: "$85.00",
    paymentMethod: "Debit Card",
    status: "Pending",
    date: "Jan 29, 2024",
    paymentDate: "Jan 29, 2024",
    buyerName: "Amanda Lee",
    sellerName: "John Smith",
    image: "👕",
  },
];

const ITEMS_PER_PAGE = 6;

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPaymentDetail, setShowPaymentDetail] = useState(null);

  // Filter payments
  const filteredPayments = demoPayments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPayments = filteredPayments.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const getStatusColor = (status) => {
    const statusColors = {
      Completed: "bg-green-100 text-green-800",
      Pending: "bg-yellow-100 text-yellow-800",
      Failed: "bg-red-100 text-red-800",
    };
    return statusColors[status] || "bg-slate-100 text-slate-800";
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Payments</h1>
        <p className="mt-1 text-slate-600">
          Manage and track all payment transactions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Payments</p>
              <p className="text-2xl font-bold text-slate-900">
                {demoPayments.length}
              </p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {demoPayments.filter((p) => p.status === "Completed").length}
              </p>
            </div>
            <div className="rounded-lg bg-green-100 p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {demoPayments.filter((p) => p.status === "Pending").length}
              </p>
            </div>
            <div className="rounded-lg bg-yellow-100 p-3">
              <TrendingUp className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by payment ID or order ID..."
            className="pl-10"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Payments</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payments Table */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-slate-700">Payment ID</TableHead>
                <TableHead className="text-slate-700">Order ID</TableHead>
                <TableHead className="text-slate-700">Product</TableHead>
                <TableHead className="text-slate-700">Amount</TableHead>
                <TableHead className="text-slate-700">Method</TableHead>
                <TableHead className="text-slate-700">Status</TableHead>
                <TableHead className="text-slate-700">Date</TableHead>
                <TableHead className="text-right text-slate-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPayments.map((payment) => (
                <TableRow key={payment.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium text-slate-900">
                    {payment.id}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {payment.orderID}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {payment.productName}
                  </TableCell>
                  <TableCell className="font-semibold text-slate-900">
                    {payment.amount}
                  </TableCell>
                  <TableCell className="text-slate-700">
                    {payment.paymentMethod}
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium",
                        getStatusColor(payment.status),
                      )}
                    >
                      {payment.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {payment.paymentDate}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      onClick={() => setShowPaymentDetail(payment)}
                      className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* No Results */}
      {paginatedPayments.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-slate-600">
            No payments found matching your search
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  className={cn(
                    currentPage === 1 && "pointer-events-none opacity-50",
                  )}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, index) => (
                <PaginationItem key={index + 1}>
                  <PaginationLink
                    isActive={currentPage === index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className="cursor-pointer"
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  className={cn(
                    currentPage === totalPages &&
                      "pointer-events-none opacity-50",
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Payment Detail Modal */}
      <Dialog
        open={!!showPaymentDetail}
        onOpenChange={() => setShowPaymentDetail(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Payment {showPaymentDetail?.id}</DialogTitle>
            <DialogDescription>Payment Details</DialogDescription>
          </DialogHeader>

          {showPaymentDetail && (
            <div className="space-y-4">
              {/* Product Image */}
              <div className="flex h-40 items-center justify-center rounded-lg bg-linear-to-br from-slate-50 to-slate-100 text-5xl">
                {showPaymentDetail.image}
              </div>

              {/* Status */}
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                <span className="text-sm font-medium text-slate-600">
                  Status:
                </span>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    getStatusColor(showPaymentDetail.status),
                  )}
                >
                  {showPaymentDetail.status}
                </span>
              </div>

              {/* Product Info */}
              <div className="space-y-2 text-sm border-b border-slate-200 pb-3">
                <p className="font-semibold text-slate-900">
                  {showPaymentDetail.productName}
                </p>
                <p className="text-xs text-slate-600">
                  Order ID: {showPaymentDetail.orderID}
                </p>
              </div>

              {/* Buyer and Seller */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-slate-50 p-2">
                  <p className="text-xs text-slate-600">Buyer</p>
                  <p className="font-medium text-slate-900">
                    {showPaymentDetail.buyerName}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <p className="text-xs text-slate-600">Seller</p>
                  <p className="font-medium text-slate-900">
                    {showPaymentDetail.sellerName}
                  </p>
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-600">Payment Date:</span>
                  <span className="font-medium text-slate-900">
                    {showPaymentDetail.paymentDate}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-600">Payment Method:</span>
                  <span className="font-medium text-slate-900">
                    {showPaymentDetail.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Email:</span>
                  <span className="font-medium text-slate-900">
                    john@example.com
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="rounded-lg bg-blue-50 p-3">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-700">
                    Payment Amount:
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {showPaymentDetail.amount}
                  </span>
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
