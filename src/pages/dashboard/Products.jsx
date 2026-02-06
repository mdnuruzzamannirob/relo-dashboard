import { useState } from "react";
import { Search, Eye, Trash2 } from "lucide-react";
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Demo data
const demoProducts = [
  {
    id: 1,
    name: "Woman Bag",
    seller: "Emma Wilson",
    price: "$85.00",
    status: "Active",
    listedDate: "Jan 18, 2024",
    image: "👜",
  },
  {
    id: 2,
    name: "Woman t-shirt",
    seller: "Emma Wilson",
    price: "$20.00",
    status: "Pending",
    listedDate: "Jan 15, 2024",
    image: "👕",
  },
  {
    id: 3,
    name: "Man t-shirt",
    seller: "Emma Wilson",
    price: "$60.00",
    status: "Pending",
    listedDate: "Jan 15, 2024",
    image: "👔",
  },
  {
    id: 4,
    name: "Woman dress",
    seller: "Emma Wilson",
    price: "$120.00",
    status: "Active",
    listedDate: "Jan 15, 2024",
    image: "👗",
  },
  {
    id: 5,
    name: "Woman Close",
    seller: "Emma Wilson",
    price: "$24.00",
    status: "Active",
    listedDate: "Jan 15, 2024",
    image: "👞",
  },
  {
    id: 6,
    name: "Woman t-shirt",
    seller: "Emma Wilson",
    price: "$50.00",
    status: "Pending",
    listedDate: "Jun 15, 2024",
    image: "👚",
  },
  {
    id: 7,
    name: "Sports Shoes",
    seller: "John Smith",
    price: "$95.00",
    status: "Active",
    listedDate: "Jan 10, 2024",
    image: "👟",
  },
  {
    id: 8,
    name: "Winter Jacket",
    seller: "Sarah Johnson",
    price: "$150.00",
    status: "Active",
    listedDate: "Jan 20, 2024",
    image: "🧥",
  },
  {
    id: 9,
    name: "Casual Hat",
    seller: "Mike Brown",
    price: "$35.00",
    status: "Pending",
    listedDate: "Jan 22, 2024",
    image: "🎩",
  },
  {
    id: 10,
    name: "Summer Shorts",
    seller: "Emma Wilson",
    price: "$45.00",
    status: "Active",
    listedDate: "Jan 25, 2024",
    image: "👖",
  },
  {
    id: 11,
    name: "Casual Shoes",
    seller: "John Smith",
    price: "$65.00",
    status: "Active",
    listedDate: "Jan 12, 2024",
    image: "👞",
  },
  {
    id: 12,
    name: "Denim Jeans",
    seller: "Sarah Johnson",
    price: "$55.00",
    status: "Pending",
    listedDate: "Jan 23, 2024",
    image: "👖",
  },
];

const ITEMS_PER_PAGE = 6;

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showProductDetail, setShowProductDetail] = useState(null);

  // Filter products
  const filteredProducts = demoProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.seller.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const getStatusColor = (status) => {
    return status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-orange-100 text-orange-800";
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
        <h1 className="text-3xl font-bold text-slate-900">Products</h1>
        <p className="mt-1 text-slate-600">Manage and view all products</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by product name or seller..."
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
            <SelectItem value="All">All Products</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedProducts.map((product) => (
          <div
            key={product.id}
            className="overflow-hidden rounded-lg border border-slate-200 bg-white transition-shadow hover:shadow-md"
          >
            {/* Product Image/Icon */}
            <div className="flex h-48 items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 text-6xl">
              {product.image}
            </div>

            {/* Product Info */}
            <div className="space-y-3 p-4">
              <div>
                <h3 className="font-semibold text-slate-900">{product.name}</h3>
                <p className="text-sm text-slate-600">by {product.seller}</p>
              </div>

              {/* Price and Status */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900">
                  {product.price}
                </span>
                <span
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    getStatusColor(product.status),
                  )}
                >
                  {product.status}
                </span>
              </div>

              {/* Listed Date */}
              <p className="text-xs text-slate-500">
                Listed: {product.listedDate}
              </p>

              {/* Actions */}
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

      {/* No Results */}
      {paginatedProducts.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-slate-600">
            No products found matching your search
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

      {/* Product Detail Modal */}
      <Dialog
        open={!!showProductDetail}
        onOpenChange={() => setShowProductDetail(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{showProductDetail?.name}</DialogTitle>
            <DialogDescription>Product Details</DialogDescription>
          </DialogHeader>

          {showProductDetail && (
            <div className="space-y-4">
              {/* Product Image */}
              <div className="flex h-40 items-center justify-center rounded-lg bg-linear-to-br from-slate-50 to-slate-100 text-5xl">
                {showProductDetail.image}
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Seller:</span>
                  <span className="font-medium text-slate-900">
                    {showProductDetail.seller}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Price:</span>
                  <span className="font-bold text-slate-900">
                    {showProductDetail.price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Status:</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-1 text-xs font-medium",
                      getStatusColor(showProductDetail.status),
                    )}
                  >
                    {showProductDetail.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Listed Date:</span>
                  <span className="font-medium text-slate-900">
                    {showProductDetail.listedDate}
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

export default Products;
