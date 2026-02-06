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

// Demo data
const demoUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1-555-0101",
    status: "Active",
    joinDate: "2024-01-15",
    location: "New York, USA",
    purchases: 24,
    totalSpent: "$5,420.00",
    avatar: "🧑",
    blocked: false,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1-555-0102",
    status: "Active",
    joinDate: "2024-02-20",
    location: "Los Angeles, USA",
    purchases: 18,
    totalSpent: "$3,890.00",
    avatar: "👩",
    blocked: false,
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael@example.com",
    phone: "+1-555-0103",
    status: "Inactive",
    joinDate: "2024-03-10",
    location: "San Francisco, USA",
    purchases: 8,
    totalSpent: "$1,250.00",
    avatar: "👨",
    blocked: true,
  },
  {
    id: 4,
    name: "Emma Wilson",
    email: "emma@example.com",
    phone: "+1-555-0104",
    status: "Active",
    joinDate: "2024-01-25",
    location: "Chicago, USA",
    purchases: 32,
    totalSpent: "$7,650.00",
    avatar: "👩",
    blocked: false,
  },
  {
    id: 5,
    name: "David Brown",
    email: "david@example.com",
    phone: "+1-555-0105",
    status: "Active",
    joinDate: "2024-04-05",
    location: "Miami, USA",
    purchases: 15,
    totalSpent: "$2,340.00",
    avatar: "🧑",
    blocked: false,
  },
  {
    id: 6,
    name: "Lisa Anderson",
    email: "lisa@example.com",
    phone: "+1-555-0106",
    status: "Inactive",
    joinDate: "2024-02-14",
    location: "Seattle, USA",
    purchases: 5,
    totalSpent: "$890.00",
    avatar: "👩",
    blocked: false,
  },
  {
    id: 7,
    name: "James Martinez",
    email: "james@example.com",
    phone: "+1-555-0107",
    status: "Active",
    joinDate: "2024-03-20",
    location: "Austin, USA",
    purchases: 28,
    totalSpent: "$6,120.00",
    avatar: "👨",
    blocked: false,
  },
  {
    id: 8,
    name: "Sophie Taylor",
    email: "sophie@example.com",
    phone: "+1-555-0108",
    status: "Active",
    joinDate: "2024-01-30",
    location: "Boston, USA",
    purchases: 21,
    totalSpent: "$4,560.00",
    avatar: "👩",
    blocked: false,
  },
];

const Users = () => {
  const [users, setUsers] = useState(demoUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showUserDetail, setShowUserDetail] = useState(null);
  const [showBlockConfirm, setShowBlockConfirm] = useState(null);

  const filteredUsers = users.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "All" || user.status === statusFilter),
  );

  const handleToggleBlock = (userId) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setShowBlockConfirm(user);
    }
  };

  const confirmToggleBlock = () => {
    if (showBlockConfirm) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === showBlockConfirm.id
            ? { ...user, blocked: !user.blocked }
            : user,
        ),
      );
      setShowBlockConfirm(null);
    }
  };

  const getStatusColor = (status) => {
    return status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";
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

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-sm text-slate-600">Total Users</div>
          <div className="mt-2 text-2xl font-bold text-slate-800">
            {users.length}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-sm text-slate-600">Active Users</div>
          <div className="mt-2 text-2xl font-bold text-green-600">
            {users.filter((u) => u.status === "Active").length}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-sm text-slate-600">Inactive Users</div>
          <div className="mt-2 text-2xl font-bold text-red-600">
            {users.filter((u) => u.status === "Inactive").length}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-sm text-slate-600">Total Revenue</div>
          <div className="mt-2 text-2xl font-bold text-brand-600">
            $
            {users
              .reduce((sum, u) => sum + parseInt(u.totalSpent.slice(1)), 0)
              .toLocaleString()}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by name or email..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Users</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-slate-200 bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead className="hidden lg:table-cell">Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Purchases</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{user.avatar}</div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">
                        {user.name}
                      </div>
                      <div className="text-xs text-slate-500">{user.phone}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden text-sm text-slate-600 sm:table-cell">
                  {user.email}
                </TableCell>
                <TableCell className="hidden text-sm text-slate-600 lg:table-cell">
                  {user.location}
                </TableCell>
                <TableCell>
                  <span
                    className={cn(
                      "inline-block rounded-full px-3 py-1 text-xs font-medium",
                      getStatusColor(user.status),
                    )}
                  >
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="text-sm font-semibold text-slate-800">
                  {user.purchases}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowUserDetail(user)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleBlock(user.id)}
                    >
                      {user.blocked ? (
                        <Unlock className="h-4 w-4" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* User Detail Modal */}
      <Dialog
        open={!!showUserDetail}
        onOpenChange={(open) => !open && setShowUserDetail(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <div className="text-4xl">{showUserDetail?.avatar}</div>
              <div>
                <DialogTitle>{showUserDetail?.name}</DialogTitle>
                <DialogDescription>{showUserDetail?.email}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-slate-400" />
              <div>
                <div className="text-xs text-slate-500">Email</div>
                <div className="text-sm text-slate-700">
                  {showUserDetail?.email}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-slate-400" />
              <div>
                <div className="text-xs text-slate-500">Phone</div>
                <div className="text-sm text-slate-700">
                  {showUserDetail?.phone}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-slate-400" />
              <div>
                <div className="text-xs text-slate-500">Location</div>
                <div className="text-sm text-slate-700">
                  {showUserDetail?.location}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-slate-400" />
              <div>
                <div className="text-xs text-slate-500">Join Date</div>
                <div className="text-sm text-slate-700">
                  {showUserDetail?.joinDate}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-200 pt-4">
            <div className="text-center">
              <div className="text-lg font-bold text-brand-600">
                {showUserDetail?.purchases}
              </div>
              <div className="text-xs text-slate-500">Purchases</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-brand-600">
                {showUserDetail?.totalSpent}
              </div>
              <div className="text-xs text-slate-500">Total Spent</div>
            </div>
            <div className="text-center">
              <span
                className={cn(
                  "inline-block rounded-full px-2 py-1 text-xs font-medium",
                  getStatusColor(showUserDetail?.status),
                )}
              >
                {showUserDetail?.status}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Block/Unblock Confirmation Modal */}
      <Dialog
        open={!!showBlockConfirm}
        onOpenChange={(open) => !open && setShowBlockConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {showBlockConfirm?.blocked ? "Unblock User?" : "Block User?"}
            </DialogTitle>
            <DialogDescription>
              {showBlockConfirm?.blocked
                ? `Are you sure you want to unblock ${showBlockConfirm?.name}? They will be able to access their account again.`
                : `Are you sure you want to block ${showBlockConfirm?.name}? They will not be able to access their account.`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowBlockConfirm(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={confirmToggleBlock}
              className="flex-1"
              variant={showBlockConfirm?.blocked ? "default" : "destructive"}
            >
              {showBlockConfirm?.blocked ? "Unblock" : "Block"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Users;
