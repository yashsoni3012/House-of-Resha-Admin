import React, { useState, useEffect } from "react";
import {
  Clock,
  Calendar,
  Trash2,
  Edit2,
  AlertCircle,
  X,
  Search,
  Filter,
  ChevronDown,
  RefreshCw,
  CheckCircle,
  XCircle,
  Eye,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-lg font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
    </div>
  </div>
);

// Notification Component
function Notification({ message, type, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
          type === "success"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
        }`}
      >
        {type === "success" ? (
          <CheckCircle size={24} />
        ) : (
          <AlertCircle size={24} />
        )}
        <span className="font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// API Client
class SlotsAPI {
  constructor(baseURL = "https://api.houseofresha.com") {
    this.baseURL = baseURL;
  }

  async getAllSlots() {
    const response = await fetch(`${this.baseURL}/slots`);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    return response.json();
  }

  async updateSlot(id, updates) {
    const response = await fetch(`${this.baseURL}/slots/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP Error: ${response.status}`);
    }

    return response.json();
  }

  async deleteSlot(id) {
    const response = await fetch(`${this.baseURL}/slots/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP Error: ${response.status}`);
    }

    return response.json();
  }
}

const api = new SlotsAPI();

// Edit Slot Modal
function EditSlotModal({ slot, isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    startTime: slot?.startTime || "",
    endTime: slot?.endTime || "",
    isBooked: slot?.isBooked || false,
    date: slot?.date || "",
    product: slot?.product || "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (slot) {
      setFormData({
        startTime: slot.startTime || "",
        endTime: slot.endTime || "",
        isBooked: slot.isBooked || false,
        date: slot.date || "",
        product: slot.product || "",
      });
    }
  }, [slot]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-gray-900">Edit Slot</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product ID
            </label>
            <input
              type="text"
              value={formData.product}
              onChange={(e) =>
                setFormData({ ...formData, product: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="Optional"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isBooked"
              checked={formData.isBooked}
              onChange={(e) =>
                setFormData({ ...formData, isBooked: e.target.checked })
              }
              className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500"
            />
            <label
              htmlFor="isBooked"
              className="text-sm font-medium text-gray-700"
            >
              Mark as Booked
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  slot,
  loading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Delete Slot</h3>
            <p className="text-sm text-gray-600">
              This action cannot be undone
            </p>
          </div>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete the slot on{" "}
          <span className="font-semibold text-gray-800">{slot?.date}</span> from{" "}
          <span className="font-semibold text-gray-800">
            {slot?.startTime} - {slot?.endTime}
          </span>
          ?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 font-medium"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Main ManageSlots Component
const ManageSlots = () => {
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [dates, setDates] = useState(["All"]);
  const [showFilters, setShowFilters] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  const statuses = ["All", "Available", "Booked"];

  useEffect(() => {
    fetchSlots();
  }, []);

  useEffect(() => {
    filterSlots();
  }, [slots, searchQuery, selectedDate, selectedStatus]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchSlots = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAllSlots();

      // Transform data
      const slotsArray = Array.isArray(data) ? data : data.slots || [];
      const transformedSlots = slotsArray.map((slot) => ({
        id: slot._id || slot.id,
        date: slot.date || "No Date",
        startTime: slot.startTime || "",
        endTime: slot.endTime || "",
        isBooked: slot.isBooked || false,
        product: slot.product || "",
        bookedBy: slot.bookedBy || null,
        appointment: slot.appointment || null,
        createdAt: slot.createdAt,
        updatedAt: slot.updatedAt,
      }));

      setSlots(transformedSlots);

      // Extract unique dates
      const uniqueDates = [
        "All",
        ...new Set(transformedSlots.map((s) => s.date).filter(Boolean)),
      ];
      setDates(uniqueDates);
      // showNotification("Slots loaded successfully");
    } catch (error) {
      console.error("Error fetching slots:", error);
      setError("Failed to load slots. Please try again.");
      showNotification("Failed to load slots", "error");
    } finally {
      setLoading(false);
    }
  };

  const filterSlots = () => {
    let filtered = slots;

    // Filter by date
    if (selectedDate !== "All") {
      filtered = filtered.filter((s) => s.date === selectedDate);
    }

    // Filter by status
    if (selectedStatus !== "All") {
      if (selectedStatus === "Available") {
        filtered = filtered.filter((s) => !s.isBooked);
      } else if (selectedStatus === "Booked") {
        filtered = filtered.filter((s) => s.isBooked);
      }
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.date?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.startTime?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.endTime?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.product?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredSlots(filtered);
  };

  const handleEdit = (slot) => {
    setEditingSlot(slot);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updates) => {
    try {
      await api.updateSlot(editingSlot.id, updates);

      // Update local state
      setSlots((prev) =>
        prev.map((slot) =>
          slot.id === editingSlot.id ? { ...slot, ...updates } : slot,
        ),
      );

      setShowEditModal(false);
      setEditingSlot(null);
      showNotification("Slot updated successfully");
    } catch (error) {
      showNotification(error.message, "error");
    }
  };

  const handleDeleteClick = (slot) => {
    setSlotToDelete(slot);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!slotToDelete) return;

    try {
      setDeleteLoading(true);
      await api.deleteSlot(slotToDelete.id);

      // Update local state
      setSlots((prev) => prev.filter((s) => s.id !== slotToDelete.id));

      setShowDeleteModal(false);
      setSlotToDelete(null);
      showNotification("Slot deleted successfully");
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  // Calculate stats
  const totalSlots = slots.length;
  const bookedSlots = slots.filter((s) => s.isBooked).length;
  const availableSlots = totalSlots - bookedSlots;
  const uniqueDatesCount = dates.length - 1;

  // Get slots to display
  const slotsToDisplay = filteredSlots.slice(0, visibleCount);
  const hasMoreSlots = visibleCount < filteredSlots.length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            {/* Left Section */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                  Manage Slots
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 truncate">
                  Edit and delete appointment time slots
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0 w-full sm:w-auto">
              {/* <button
                onClick={fetchSlots}
                disabled={loading}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 hover:text-gray-900 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm sm:text-base whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw
                  className={`w-4 h-4 flex-shrink-0 ${loading ? "animate-spin" : ""}`}
                />
                <span className="hidden xs:inline">Refresh</span>
              </button> */}

              <button
                onClick={() => navigate("/slots/create")}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 active:bg-purple-800 transition-colors font-medium shadow-sm hover:shadow-md text-sm sm:text-base whitespace-nowrap w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 flex-shrink-0" />
                <span className="hidden xs:inline sm:inline">Create Slots</span>
                <span className="xs:hidden sm:hidden">Create</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            icon={Clock}
            label="Total Slots"
            value={totalSlots}
            color="bg-blue-500"
          />
          <StatsCard
            icon={CheckCircle}
            label="Available Slots"
            value={availableSlots}
            color="bg-green-500"
          />
          <StatsCard
            icon={XCircle}
            label="Booked Slots"
            value={bookedSlots}
            color="bg-red-500"
          />
          <StatsCard
            icon={Calendar}
            label="Unique Dates"
            value={uniqueDatesCount}
            color="bg-purple-500"
          />
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search Input */}
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search slots by date, time, or product..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Date Filters */}
              <div className="w-full">
                <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500 font-medium mb-2">
                  <Filter className="w-4 h-4" />
                  Filter by Date:
                </div>
                <div className="flex flex-wrap gap-2">
                  {dates.slice(0, 5).map((date) => (
                    <button
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`px-3 py-1.5 rounded-md font-medium transition-colors text-sm ${
                        selectedDate === date
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {date}
                    </button>
                  ))}
                  {dates.length > 5 && (
                    <span className="text-xs text-gray-500 self-center">
                      +{dates.length - 5} more
                    </span>
                  )}
                </div>
              </div>

              {/* Status Filters */}
              <div className="w-full">
                <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500 font-medium mb-2">
                  <Filter className="w-4 h-4" />
                  Filter by Status:
                </div>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`px-3 py-1.5 rounded-md font-medium transition-colors text-sm ${
                        selectedStatus === status
                          ? "bg-purple-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-xs sm:text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-purple-600">
              {slotsToDisplay.length}
            </span>{" "}
            of <span className="font-semibold">{filteredSlots.length}</span>{" "}
            slots
            {hasMoreSlots && (
              <span className="block sm:inline sm:ml-2 mt-1 sm:mt-0">
                • {filteredSlots.length - visibleCount} more available
              </span>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Slots Grid */}
        {loading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-purple-600"></div>
            <p className="mt-4 text-gray-600">Loading slots...</p>
          </div>
        ) : filteredSlots.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No slots found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || selectedDate !== "All" || selectedStatus !== "All"
                ? "Try adjusting your search or filters"
                : "Create your first slot to get started"}
            </p>
            <button
              onClick={() => navigate("/slots/create")}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Create First Slot
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {slotsToDisplay.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
                >
                  {/* Slot Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base sm:text-lg line-clamp-1">
                          {slot.date}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {slot.startTime} - {slot.endTime}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          slot.isBooked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {slot.isBooked ? "BOOKED" : "AVAILABLE"}
                      </span>
                    </div>
                  </div>

                  {/* Slot Details */}
                  <div className="p-4 flex-1">
                    <div className="space-y-3">
                      {slot.product && (
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Product ID
                          </p>
                          <p className="text-sm text-gray-800 font-mono truncate">
                            {slot.product}
                          </p>
                        </div>
                      )}

                      {slot.bookedBy && (
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Booked By
                          </p>
                          <p className="text-sm text-gray-800 truncate">
                            {typeof slot.bookedBy === "object"
                              ? slot.bookedBy.name ||
                                slot.bookedBy.email ||
                                "Unknown"
                              : slot.bookedBy}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(slot)}
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-xs sm:text-sm"
                        title="Edit slot"
                      >
                        <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(slot)}
                        className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-xs sm:text-sm"
                        title="Delete slot"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreSlots && (
              <div className="mt-8 text-center">
                <button
                  onClick={handleLoadMore}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  <ChevronDown className="w-4 h-4" />
                  Load More ({filteredSlots.length - visibleCount} remaining)
                </button>
              </div>
            )}

            {/* Completion Message */}
            {filteredSlots.length > 0 && !hasMoreSlots && (
              <div className="mt-8 text-center">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg inline-flex items-center gap-2">
                  <span className="text-lg">🎉</span>
                  <span className="font-medium">
                    All {filteredSlots.length} slots are displayed!
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Edit Slot Modal */}
      <EditSlotModal
        slot={editingSlot}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingSlot(null);
        }}
        onSave={handleSaveEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSlotToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        slot={slotToDelete}
        loading={deleteLoading}
      />
    </div>
  );
};

export default ManageSlots;
