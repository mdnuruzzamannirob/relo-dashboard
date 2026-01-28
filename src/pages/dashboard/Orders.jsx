import { useState } from "react";
import { Search, Eye, TrendingUp, MapPin } from "lucide-react";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Demo data
const demoOrders = [
  {
    id: "ORD-001",
    productName: "Woman Bag",
    customer: "John Doe",
    seller: "Emma Wilson",
    email: "john@example.com",
    total: "$120.00",
    status: "Completed",
    date: "Jan 10, 2024",
    lockerLocation: "Locker A-12",
    image: "👜",
  },
  {
    id: "ORD-002",
    productName: "Woman t-shirt",
    customer: "Sarah Johnson",
    seller: "Emma Wilson",
    email: "sarah@example.com",
    total: "$58.00",
    status: "Ready to Pickup",
    date: "Jan 10, 2024",
    lockerLocation: "Locker A-12",
    image: "👕",
  },
  {
    id: "ORD-003",
    productName: "Man t-shirt",
    customer: "Mike Brown",
    seller: "Emma Wilson",
    email: "mike@example.com",
    total: "$45.00",
    status: "Processing",
    date: "Jan 10, 2024",
    lockerLocation: "Locker B-05",
    image: "👔",
  },
  {
    id: "ORD-004",
    productName: "Woman dress",
    customer: "Emma Wilson",
    seller: "John Smith",
    email: "emma@example.com",
    total: "$95.00",
    status: "Completed",
    date: "Jan 15, 2024",
    lockerLocation: "Locker C-08",
    image: "👗",
  },
  {
    id: "ORD-005",
    productName: "Winter Jacket",
    customer: "David Smith",
    seller: "Sarah Johnson",
    email: "david@example.com",
    total: "$150.00",
    status: "Ready to Pickup",
    date: "Jan 12, 2024",
    lockerLocation: "Locker B-10",
    image: "🧥",
  },
  {
    id: "ORD-006",
    productName: "Sports Shoes",
    customer: "Lisa Anderson",
    seller: "Mike Brown",
    email: "lisa@example.com",
    total: "$85.00",
    status: "Processing",
    date: "Jan 18, 2024",
    lockerLocation: "Locker D-03",
    image: "👟",
  },
  {
    id: "ORD-007",
    productName: "Casual Hat",
    customer: "James Taylor",
    seller: "Emma Wilson",
    email: "james@example.com",
    total: "$35.00",
    status: "Completed",
    date: "Jan 20, 2024",
    lockerLocation: "Locker A-15",
    image: "🎩",
  },
  {
    id: "ORD-008",
    productName: "Summer Shorts",
    customer: "Rachel Green",
    seller: "John Smith",
    email: "rachel@example.com",
    total: "$65.00",
    status: "Ready to Pickup",
    date: "Jan 22, 2024",
    lockerLocation: "Locker E-07",
    image: "👖",
  },
  {
    id: "ORD-009",
    productName: "Denim Jeans",
    customer: "Chris Martin",
    seller: "Sarah Johnson",
    email: "chris@example.com",
    total: "$75.00",
    status: "Processing",
    date: "Jan 25, 2024",
    lockerLocation: "Locker C-12",
    image: "👖",
  },
  {
    id: "ORD-010",
    productName: "Leather Wallet",
    customer: "Jenny White",
    seller: "Mike Brown",
    email: "jenny@example.com",
    total: "$45.00",
    status: "Completed",
    date: "Jan 26, 2024",
    lockerLocation: "Locker F-02",
    image: "👛",
  },
  {
    id: "ORD-011",
    productName: "Casual Shoes",
    customer: "Robert Clark",
    seller: "Emma Wilson",
    email: "robert@example.com",
    total: "$65.00",
    status: "Ready to Pickup",
    date: "Jan 28, 2024",
    lockerLocation: "Locker A-09",
    image: "👞",
  },
  {
    id: "ORD-012",
    productName: "T-Shirt Pack",
    customer: "Amanda Lee",
    seller: "John Smith",
    email: "amanda@example.com",
    total: "$85.00",
    status: "Processing",
    date: "Jan 29, 2024",
    lockerLocation: "Locker D-06",
    image: "👕",
  },
];

const ITEMS_PER_PAGE = 6;

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showOrderDetail, setShowOrderDetail] = useState(null);

  // Filter orders
  const filteredOrders = demoOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const getStatusColor = (status) => {
    const statusColors = {
      Completed: "bg-green-100 text-green-800",
      "Ready to Pickup": "bg-blue-100 text-blue-800",
      Processing: "bg-yellow-100 text-yellow-800",
      Pending: "bg-orange-100 text-orange-800",
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
        <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
        <p className="mt-1 text-slate-600">
          Manage and track all customer orders
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Orders</p>
              <p className="text-2xl font-bold text-slate-900">
                {demoOrders.length}
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
              <p className="text-sm text-slate-600">Delivered</p>
              <p className="text-2xl font-bold text-green-600">
                {demoOrders.filter((o) => o.status === "Delivered").length}
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
              <p className="text-2xl font-bold text-orange-600">
                {demoOrders.filter((o) => o.status === "Pending").length}
              </p>
            </div>
            <div className="rounded-lg bg-orange-100 p-3">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by order ID or customer name..."
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
            <SelectItem value="All">All Orders</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Ready to Pickup">Ready to Pickup</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {paginatedOrders.map((order) => (
          <div
            key={order.id}
            className="overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-md"
          >
            {/* Order Card with Image and Details */}
            <div className="p-4">
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-slate-50 to-slate-100 text-4xl">
                  {order.image}
                </div>

                {/* Main Content */}
                <div className="flex flex-1 flex-col justify-between">
                  {/* Header with Name and Price */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {order.productName}
                      </h3>
                      <p className="text-xs text-slate-600">
                        Order ID: {order.id}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-slate-900">
                        {order.total}
                      </p>
                      <span
                        className={cn(
                          "inline-block rounded-full px-2 py-0.5 text-xs font-medium",
                          getStatusColor(order.status),
                        )}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Buyer and Seller Info */}
                  <div className="mt-2 grid grid-cols-2 gap-3 border-t border-slate-200 pt-2">
                    <div className="text-xs">
                      <p className="text-slate-600">Buyer</p>
                      <p className="font-medium text-slate-900">
                        {order.customer}
                      </p>
                    </div>
                    <div className="text-xs">
                      <p className="text-slate-600">Seller</p>
                      <p className="font-medium text-slate-900">
                        {order.seller}
                      </p>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="mt-2 grid grid-cols-2 gap-3 border-t border-slate-200 pt-2 text-xs">
                    <div className="text-slate-600">
                      <p className="text-slate-600">Order Date</p>
                      <p className="text-slate-900">{order.date}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> Locker Location
                      </p>
                      <p className="text-slate-900">{order.lockerLocation}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* View Button */}
              <button
                onClick={() => setShowOrderDetail(order)}
                className="mt-4 w-full flex items-center justify-center gap-2 rounded-md bg-blue-50 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
              >
                <Eye className="h-4 w-4" />
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {paginatedOrders.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-slate-600">No orders found matching your search</p>
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

      {/* Order Detail Modal */}
      <Dialog
        open={!!showOrderDetail}
        onOpenChange={() => setShowOrderDetail(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order {showOrderDetail?.id}</DialogTitle>
            <DialogDescription>Order Details</DialogDescription>
          </DialogHeader>

          {showOrderDetail && (
            <div className="space-y-4">
              {/* Product Image */}
              <div className="flex h-40 items-center justify-center rounded-lg bg-linear-to-br from-slate-50 to-slate-100 text-5xl">
                {showOrderDetail.image}
              </div>

              {/* Status */}
              <div className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                <span className="text-sm font-medium text-slate-600">
                  Status:
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

              {/* Product Info */}
              <div className="space-y-2 text-sm border-b border-slate-200 pb-3">
                <p className="font-semibold text-slate-900">
                  {showOrderDetail.productName}
                </p>
                <p className="text-xs text-slate-600">
                  Order ID: {showOrderDetail.id}
                </p>
              </div>

              {/* Buyer and Seller */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg bg-slate-50 p-2">
                  <p className="text-xs text-slate-600">Buyer</p>
                  <p className="font-medium text-slate-900">
                    {showOrderDetail.customer}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-2">
                  <p className="text-xs text-slate-600">Seller</p>
                  <p className="font-medium text-slate-900">
                    {showOrderDetail.seller}
                  </p>
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-600">Order Date:</span>
                  <span className="font-medium text-slate-900">
                    {showOrderDetail.date}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-600 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Locker Location:
                  </span>
                  <span className="font-medium text-slate-900">
                    {showOrderDetail.lockerLocation}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Email:</span>
                  <span className="font-medium text-slate-900">
                    {showOrderDetail.email}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="rounded-lg bg-blue-50 p-3">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-700">
                    Total Amount:
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {showOrderDetail.total}
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

export default Orders;
