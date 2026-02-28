import { useState } from "react";
import {
  Search,
  Mail,
  Phone,
  MapPin,
  Clock,
  Eye,
  Lock,
  Unlock,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
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
import {
  useGetAllUsersQuery,
  useUpdateUserActionMutation,
} from "@/store/apis/adminApi";
import { useDebounce } from "@/hooks/useDebounce";
import { getInitials } from "@/lib/utils/getInitials";
import { UserTableSkeleton } from "@/components/skeletons/DashboardSkeletons";

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

const statusColour = (status) => {
  const s = status?.toUpperCase();
  if (s === "ACTIVE") return "bg-green-100 text-green-700";
  if (s === "INACTIVE") return "bg-slate-100 text-slate-600";
  if (s === "SUSPENDED" || s === "BLOCKED") return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-600";
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

const ErrorBlock = ({ message }) => (
  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
    {message || "Failed to load users. Please try again."}
  </div>
);

const LIMIT = 10;

const Users = () => {
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [showUserDetail, setShowUserDetail] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  const searchTerm = useDebounce(searchInput, 400);

  const { data, isLoading, isFetching, isError } = useGetAllUsersQuery({
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
    setSearchInput(e.target.value);
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
    await updateUserAction({
      userId: pendingAction.user.id,
      status: pendingAction.nextStatus,
    });
    setPendingAction(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">User Management</h1>
        <p className="mt-2 text-slate-600">
          Manage and monitor all users in your platform
        </p>
      </div>

      {isError && <ErrorBlock />}

      {/* Controls */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search by name or email..."
              className="pl-10"
              value={searchInput}
              onChange={handleSearchChange}
            />
          </div>
          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <UserTableSkeleton rows={LIMIT} />
      ) : users.length === 0 && !isError ? (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-slate-500">No users found.</p>
        </div>
      ) : (
        <div
          className={cn(
            "rounded-lg border border-slate-200 bg-white transition-opacity",
            isFetching && "opacity-60",
          )}
        >
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const action = ACTION_MAP[user.status?.toUpperCase()];
                const ActionIcon = action?.icon ?? Lock;
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <UserAvatar name={user.name} src={user.profileImage} />
                        <div>
                          <div className="text-sm font-semibold text-slate-800">
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
                    <TableCell className="hidden text-sm text-slate-600 lg:table-cell">
                      {user.location ?? "—"}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-block rounded-full px-2.5 py-1 text-xs font-medium",
                          statusColour(user.status),
                        )}
                      >
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="hidden text-xs text-slate-500 md:table-cell">
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
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {action && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openActionConfirm(user)}
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
              {Array.from({ length: totalPages }).map((_, i) => (
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

      {/* User Detail Dialog */}
      <Dialog
        open={!!showUserDetail}
        onOpenChange={(open) => !open && setShowUserDetail(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <UserAvatar
                name={showUserDetail?.name}
                src={showUserDetail?.profileImage}
              />
              <div>
                <DialogTitle>{showUserDetail?.name}</DialogTitle>
                <DialogDescription>{showUserDetail?.email}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-3">
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
              <div key={label} className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500">{label}</div>
                  <div className="text-sm text-slate-700">{value ?? "—"}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
            <div>
              <div className="text-xs text-slate-500">Role</div>
              <div className="text-sm font-medium text-slate-900">
                {showUserDetail?.role ?? "—"}
              </div>
            </div>
            <span
              className={cn(
                "inline-block rounded-full px-2.5 py-1 text-xs font-medium",
                statusColour(showUserDetail?.status),
              )}
            >
              {showUserDetail?.status}
            </span>
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
              <UserCheck className="h-5 w-5" />
              {pendingAction?.label} User?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {pendingAction?.label?.toLowerCase()}{" "}
              <strong>{pendingAction?.user?.name}</strong>? Their status will
              change to <strong>{pendingAction?.nextStatus}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 pt-2">
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
              className="flex-1"
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
