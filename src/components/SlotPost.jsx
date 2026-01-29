import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Calendar,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

// API Client
class SlotsAPI {
  constructor(baseURL = "https://api.houseofresha.com") {
    this.baseURL = baseURL;
  }

  async createSlots(date, slots) {
    const response = await fetch(`${this.baseURL}/slots`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date, slots }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP Error: ${response.status}`);
    }

    return response.json();
  }
}

const api = new SlotsAPI();

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

// Main SlotPost Component
const SlotPost = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([{ startTime: "", endTime: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const addSlot = () => {
    setSlots([...slots, { startTime: "", endTime: "" }]);
  };

  const removeSlot = (index) => {
    if (slots.length > 1) {
      setSlots(slots.filter((_, i) => i !== index));
    }
  };

  const updateSlot = (index, field, value) => {
    const newSlots = [...slots];
    newSlots[index][field] = value;
    setSlots(newSlots);
  };

  const validateTimeSlot = (startTime, endTime) => {
    if (!startTime || !endTime) return false;

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;

    return endTotal > startTotal;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!date) {
      setError("Please select a date");
      showNotification("Please select a date", "error");
      return;
    }

    const validSlots = slots.filter(
      (slot) =>
        slot.startTime &&
        slot.endTime &&
        validateTimeSlot(slot.startTime, slot.endTime),
    );

    if (validSlots.length === 0) {
      setError("Please add at least one valid time slot");
      showNotification("Please add valid time slots", "error");
      return;
    }

    // Check for overlapping slots
    const sortedSlots = [...validSlots].sort((a, b) =>
      a.startTime.localeCompare(b.startTime),
    );
    for (let i = 0; i < sortedSlots.length - 1; i++) {
      if (sortedSlots[i].endTime > sortedSlots[i + 1].startTime) {
        setError("Time slots cannot overlap");
        showNotification("Time slots cannot overlap", "error");
        return;
      }
    }

    setLoading(true);
    try {
      await api.createSlots(date, validSlots);
      showNotification("Slots created successfully!");

      // Reset form
      setDate("");
      setSlots([{ startTime: "", endTime: "" }]);
      setError(null);

      // Redirect after delay
      // 🚀 Instant redirect
      navigate("/slots/manage");
    } catch (error) {
      console.error("Error creating slots:", error);
      setError(error.message || "Failed to create slots. Please try again.");
      showNotification(error.message || "Failed to create slots", "error");
    } finally {
      setLoading(false);
    }
  };

  const applyTemplate = (templateSlots) => {
    setSlots(templateSlots);
  };

  const clearAll = () => {
    setSlots([{ startTime: "", endTime: "" }]);
    setError(null);
  };

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
        <div className="max-w-7xl mx-auto py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            {/* Left Section */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                onClick={() => navigate("/slots")}
                className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Back to slots"
              ></button>
              <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0">
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                  Create New Slots
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 truncate">
                  Add new appointment time slots
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          {/* Form Header */}
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900">
              Slot Creation Form
            </h2>
            <p className="text-gray-600 mt-1">
              Select a date and add time slots for appointments
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Date Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4" />
                  Select Date
                </div>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                required
                min={new Date().toISOString().split("T")[0]}
              />
              <p className="text-xs text-gray-500">
                Select a future date for the slots
              </p>
            </div>

            {/* Time Slots Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Time Slots
                </h3>
                <button
                  type="button"
                  onClick={addSlot}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Slot
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <p className="font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Slots List */}
              <div className="space-y-4">
                {slots.map((slot, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={slot.startTime}
                          onChange={(e) =>
                            updateSlot(index, "startTime", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                          required
                        />
                      </div>

                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={slot.endTime}
                          onChange={(e) =>
                            updateSlot(index, "endTime", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                          required
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => removeSlot(index)}
                          disabled={slots.length === 1}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Remove slot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Time Validation Message */}
                    {slot.startTime &&
                      slot.endTime &&
                      !validateTimeSlot(slot.startTime, slot.endTime) && (
                        <p className="text-red-500 text-xs mt-2">
                          End time must be after start time
                        </p>
                      )}
                  </div>
                ))}
              </div>

              {/* Quick Templates */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Quick Templates
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      applyTemplate([
                        { startTime: "09:00", endTime: "10:00" },
                        { startTime: "10:00", endTime: "11:00" },
                        { startTime: "11:00", endTime: "12:00" },
                      ])
                    }
                    className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                  >
                    Morning (9AM-12PM)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      applyTemplate([
                        { startTime: "14:00", endTime: "15:00" },
                        { startTime: "15:00", endTime: "16:00" },
                        { startTime: "16:00", endTime: "17:00" },
                      ])
                    }
                    className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm"
                  >
                    Afternoon (2PM-5PM)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      applyTemplate([
                        { startTime: "09:00", endTime: "10:00" },
                        { startTime: "10:00", endTime: "11:00" },
                        { startTime: "11:00", endTime: "12:00" },
                        { startTime: "14:00", endTime: "15:00" },
                        { startTime: "15:00", endTime: "16:00" },
                        { startTime: "16:00", endTime: "17:00" },
                      ])
                    }
                    className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
                  >
                    Full Day
                  </button>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Creating Slots...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Create Slots
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate("/slots")}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Information Card */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">
            💡 Tips for creating slots
          </h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Ensure time slots do not overlap</li>
            <li>• End time must be later than start time</li>
            <li>• Leave appropriate gaps between appointments</li>
            <li>• Consider typical appointment durations</li>
            <li>
              • You can edit or delete slots later from the Manage Slots page
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SlotPost;
