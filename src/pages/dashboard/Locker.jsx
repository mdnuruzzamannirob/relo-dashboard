import { useState } from "react";
import { Search, Plus, Edit, Trash2, MapPin } from "lucide-react";
import { cn } from "@/utils/cn";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const demoLockers = [
  {
    id: 1,
    address: "123 Main Street, New York, NY 10001",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    capacity: 50,
    available: 12,
  },
  {
    id: 2,
    address: "456 Oak Avenue, Los Angeles, CA 90001",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90001",
    capacity: 75,
    available: 28,
  },
  {
    id: 3,
    address: "789 Elm Street, Chicago, IL 60601",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    capacity: 60,
    available: 15,
  },
  {
    id: 4,
    address: "321 Pine Road, Houston, TX 77001",
    city: "Houston",
    state: "TX",
    zipCode: "77001",
    capacity: 80,
    available: 35,
  },
  {
    id: 5,
    address: "654 Maple Drive, Phoenix, AZ 85001",
    city: "Phoenix",
    state: "AZ",
    zipCode: "85001",
    capacity: 40,
    available: 8,
  },
  {
    id: 6,
    address: "987 Cedar Lane, Miami, FL 33101",
    city: "Miami",
    state: "FL",
    zipCode: "33101",
    capacity: 55,
    available: 22,
  },
];

const Locker = () => {
  const [lockers, setLockers] = useState(demoLockers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    capacity: "",
  });

  const filteredLockers = lockers.filter(
    (item) =>
      item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.city.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleAddLocker = () => {
    if (formData.address.trim() && formData.city.trim()) {
      const newLocker = {
        id: Math.max(...lockers.map((l) => l.id), 0) + 1,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        capacity: parseInt(formData.capacity) || 0,
        available: parseInt(formData.capacity) || 0,
      };
      setLockers([...lockers, newLocker]);
      setFormData({
        address: "",
        city: "",
        state: "",
        zipCode: "",
        capacity: "",
      });
      setShowAddDialog(false);
    }
  };

  const handleDeleteLocker = (id) => {
    setLockers(lockers.filter((item) => item.id !== id));
    setShowDeleteConfirm(null);
  };

  const getCapacityColor = (used, capacity) => {
    const percentage = (used / capacity) * 100;
    if (percentage > 80) return "bg-red-100 text-red-800";
    if (percentage > 50) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Locker Management</h1>
        <p className="mt-1 text-slate-600">
          Manage locker locations and capacity
        </p>
      </div>

      {/* Search and Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by address or city..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Locker
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Total Lockers</p>
          <p className="text-3xl font-bold text-slate-900">{lockers.length}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Total Capacity</p>
          <p className="text-3xl font-bold text-blue-600">
            {lockers.reduce((sum, l) => sum + l.capacity, 0)}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-600">Available Slots</p>
          <p className="text-3xl font-bold text-green-600">
            {lockers.reduce((sum, l) => sum + l.available, 0)}
          </p>
        </div>
      </div>

      {/* Lockers Table */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-slate-700">SL No</TableHead>
                <TableHead className="text-slate-700">Locker Address</TableHead>
                <TableHead className="text-slate-700">City</TableHead>
                <TableHead className="text-slate-700">Capacity</TableHead>
                <TableHead className="text-slate-700">Available</TableHead>
                <TableHead className="text-slate-700">Status</TableHead>
                <TableHead className="text-right text-slate-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLockers.map((item, index) => {
                const used = item.capacity - item.available;
                const percentage = ((used / item.capacity) * 100).toFixed(0);
                return (
                  <TableRow key={item.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium text-slate-900">
                      {index + 1}
                    </TableCell>
                    <TableCell className="max-w-xs text-slate-700">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-1 shrink-0 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900">
                            {item.address}
                          </p>
                          <p className="text-xs text-slate-600">
                            {item.zipCode}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {item.city}, {item.state}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {item.capacity}
                    </TableCell>
                    <TableCell className="text-slate-700">
                      {item.available}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium",
                          getCapacityColor(used, item.capacity),
                        )}
                      >
                        {percentage}% Full
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button className="inline-flex items-center gap-2 rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100">
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(item.id)}
                          className="inline-flex items-center gap-2 rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Add Locker Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Locker</DialogTitle>
            <DialogDescription>Create a new locker location</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Address
              </label>
              <Input
                placeholder="Enter full address"
                className="mt-1"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  City
                </label>
                <Input
                  placeholder="City"
                  className="mt-1"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  State
                </label>
                <Input
                  placeholder="State"
                  className="mt-1"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  ZIP Code
                </label>
                <Input
                  placeholder="ZIP Code"
                  className="mt-1"
                  value={formData.zipCode}
                  onChange={(e) =>
                    setFormData({ ...formData, zipCode: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Capacity
                </label>
                <Input
                  type="number"
                  placeholder="Total slots"
                  className="mt-1"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setShowAddDialog(false)}
                className="flex-1 rounded-md border border-slate-300 bg-white py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddLocker}
                className="flex-1 rounded-md bg-blue-600 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Add Locker
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!showDeleteConfirm}
        onOpenChange={() => setShowDeleteConfirm(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Locker</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this locker?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteConfirm(null)}
              className="flex-1 rounded-md border border-slate-300 bg-white py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeleteLocker(showDeleteConfirm)}
              className="flex-1 rounded-md bg-red-600 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Locker;
