import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Eye,
  Lock,
  Unlock,
  UserCheck,
  AlertCircle,
} from "lucide-react";
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
import {
  useGetAllUsersQuery,
  useUpdateUserActionMutation,
} from "@/store/apis/adminApi";
import { useDebounce } from "@/hooks/useDebounce";
import { getInitials } from "@/lib/utils/getInitials";
import { UserTableSkeleton } from "@/components/skeletons/DashboardSkeletons";
import { FilterCard } from "@/components/common/FilterCard";
import { StatusBadge } from "@/components/common/StatusBadge";

const STATUS_OPTIONS = [
  { label: "All Users", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
  { label: "Blocked", value: "BLOCKED" },
];

const ACTION_MAP = {
  ACTIVE: { next: "INACTIVE", label: "Deactivate", icon: Lock },
  INACTIVE: { next: "ACTIVE", label: "Activate", icon: Unlock },
  SUSPENDED: { next: "ACTIVE", label: "Activate", icon: Unlock },
  BLOCKED: { next: "INACTIVE", label: "Deactivate", icon: Lock },
};

const UserAvatar = ({ name, src }) => {
  if (src)
    return (
      <img src={src} alt={name} className="h-9 w-9 rounded-full object-cover" />
    );
  return (
    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700">
      {getInitials(name)}
    </div>
  );
};

const LIMIT = 10;

const Users = () => {
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [showUserDetail, setShowUserDetail] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const searchTerm = useDebounce(searchInput, 400);

  const { data, isLoading, isFetching, isError, error } = useGetAllUsersQuery({
    page,
    limit: LIMIT,
    status: statusFilter,
    searchTerm: searchTerm || undefined,
  });

  const [updateUserAction, { isLoading: actionLoading }] =
    useUpdateUserActionMutation();

  const users = data?.data?.result ?? [];
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

  const handleStatusFilter = (val) => {
    setStatusFilter(val);
    setPage(1);
  };

  const openActionConfirm = (user) => {
    const action = ACTION_MAP[user.status?.toUpperCase()];
    if (!action) return;
    setPendingAction({ user, nextStatus: action.next, label: action.label });
  };

  const confirmAction = async () => {
    if (!pendingAction) return;
    try {
      await updateUserAction({
        userId: pendingAction.user.id,
        status: pendingAction.nextStatus,
      }).unwrap();
      toast.success(`User ${pendingAction.label.toLowerCase()}d successfully`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update user status");
    }
    setPendingAction(null);
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          User Management
        </h1>
        <p className="text-slate-500 text-sm">
          Manage and monitor all users in your platform
        </p>
      </div>

      {/* Error State */}
      {isError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-center gap-3">
          <AlertCircle className="text-red-600 shrink-0" size={20} />
          <p className="text-sm text-red-700">
            {error?.data?.message || "Failed to load users. Please try again."}
          </p>
        </div>
      )}

      {/* Filter Bar */}
      <FilterCard
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        searchPlaceholder="Search by name or email..."
        filterValue={statusFilter}
        onFilterChange={handleStatusFilter}
        filterOptions={STATUS_OPTIONS}
        filterLabel="Status"
      />

      {/* Table */}
      {isLoading ? (
        <UserTableSkeleton rows={LIMIT} />
      ) : users.length === 0 && !isError ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-slate-500 text-sm">No users found</p>
        </div>
      ) : (
        <div
          className={cn(
            "rounded-lg border border-slate-200 bg-white overflow-hidden",
            isFetching && "opacity-60",
          )}
        >
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-xs font-semibold">User</TableHead>
                <TableHead className="hidden sm:table-cell text-xs font-semibold">
                  Email
                </TableHead>
                <TableHead className="hidden lg:table-cell text-xs font-semibold">
                  Location
                </TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="hidden md:table-cell text-xs font-semibold">
                  Joined
                </TableHead>
                <TableHead className="text-right text-xs font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const action = ACTION_MAP[user.status?.toUpperCase()];
                const ActionIcon = action?.icon ?? Lock;
                return (
                  <TableRow
                    key={user.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <UserAvatar name={user.name} src={user.profileImage} />
                        <div>
                          <div className="text-sm font-semibold text-slate-900">
                            {user.name}
                          </div>
                          <div className="text-xs text-slate-500">
                            {user.phone ?? "—"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-sm text-slate-600 sm:table-cell">
                      {user.email}
                    </TableCell>
                    <TableCell className="hidden text-sm text-slate-600 lg:table-cell truncate">
                      {user.location ?? "—"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={user.status} size="sm" />
                    </TableCell>
                    <TableCell className="hidden text-xs text-slate-500 md:table-cell whitespace-nowrap">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowUserDetail(user)}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {action && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openActionConfirm(user)}
                            className="hover:bg-amber-50 hover:text-amber-600"
                          >
                            <ActionIcon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
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

      {/* User Detail Dialog */}
      <Dialog
        open={!!showUserDetail}
        onOpenChange={(open) => !open && setShowUserDetail(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-4 mb-4">
              <UserAvatar
                name={showUserDetail?.name}
                src={showUserDetail?.profileImage}
              />
              <div>
                <DialogTitle className="text-lg">
                  {showUserDetail?.name}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {showUserDetail?.email}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            {[
              { Icon: Mail, label: "Email", value: showUserDetail?.email },
              { Icon: Phone, label: "Phone", value: showUserDetail?.phone },
              {
                Icon: MapPin,
                label: "Location",
                value: showUserDetail?.location,
              },
              {
                Icon: Clock,
                label: "Joined",
                value: showUserDetail?.createdAt
                  ? new Date(showUserDetail.createdAt).toLocaleDateString()
                  : undefined,
              },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div>
                  <div className="text-xs font-medium text-slate-500">
                    {label}
                  </div>
                  <div className="text-sm text-slate-700 font-medium">
                    {value ?? "—"}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
            <div>
              <div className="text-xs text-slate-500">Role</div>
              <div className="text-sm font-semibold text-slate-900">
                {showUserDetail?.role ?? "—"}
              </div>
            </div>
            <StatusBadge status={showUserDetail?.status} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Action Confirm Dialog */}
      <Dialog
        open={!!pendingAction}
        onOpenChange={(open) => !open && setPendingAction(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-amber-600" />
              {pendingAction?.label} User?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {pendingAction?.label?.toLowerCase()}{" "}
              <strong className="text-slate-900">
                {pendingAction?.user?.name}
              </strong>
              ? Their status will change to{" "}
              <strong className="text-slate-900">
                {pendingAction?.nextStatus}
              </strong>
              .
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setPendingAction(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              disabled={actionLoading}
              className="flex-1 bg-amber-600 hover:bg-amber-700"
            >
              {actionLoading ? "Updating..." : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
