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
          <div className="border-b border-gray-200 p-4 sm:p-5 md:p-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              Slot Creation Form
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Select a date and add time slots for appointments
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Date Selection */}
            <div className="space-y-2">
              <label className="block text-sm sm:text-base font-medium text-gray-700">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  Select Date
                </div>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                required
                min={new Date().toISOString().split("T")[0]}
              />
              <p className="text-xs sm:text-sm text-gray-500">
                Select a future date for the slots
              </p>
            </div>

            {/* Time Slots Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 sm:gap-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center gap-1.5 sm:gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden xs:inline">Time Slots</span>
                  <span className="xs:hidden">Slots</span>
                </h3>
                <button
                  type="button"
                  onClick={addSlot}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-xs sm:text-sm font-medium shadow-sm active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Add Slot</span>
                  <span className="xs:hidden">Add</span>
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 sm:p-4 rounded-lg sm:rounded-xl bg-red-50 border border-red-200 text-red-800">
                  <div className="flex items-start sm:items-center gap-2 sm:gap-3">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-0" />
                    <p className="font-medium text-sm sm:text-base">{error}</p>
                  </div>
                </div>
              )}

              {/* Slots List */}
              <div className="space-y-3 sm:space-y-4">
  {slots.map((slot, index) => (
    <div
      key={index}
      className="bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="flex-1">
          <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-1.5">
            Start Time
          </label>
          <input
            type="time"
            value={slot.startTime}
            onChange={(e) =>
              updateSlot(index, "startTime", e.target.value)
            }
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            required
          />
        </div>

        <div className="flex-1">
          <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-1.5">
            End Time
          </label>
          <input
            type="time"
            value={slot.endTime}
            onChange={(e) =>
              updateSlot(index, "endTime", e.target.value)
            }
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
            required
          />
        </div>

        <div className="flex sm:items-end justify-end sm:justify-start">
          <button
            type="button"
            onClick={() => removeSlot(index)}
            disabled={slots.length === 1}
            className="p-2 sm:p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            title="Remove slot"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Time Validation Message */}
      {slot.startTime &&
        slot.endTime &&
        !validateTimeSlot(slot.startTime, slot.endTime) && (
          <p className="text-red-500 text-xs sm:text-sm mt-2 sm:mt-2.5">
            End time must be after start time
          </p>
        )}
    </div>
  ))}
</div>

              {/* Quick Templates */}
              <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4 sm:p-5 shadow-sm">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/20 rounded-full -mr-10 -mt-10" />
                <div className="relative">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-purple-600"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Quick Templates
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        applyTemplate([
                          { startTime: "09:00", endTime: "10:00" },
                          { startTime: "10:00", endTime: "11:00" },
                          { startTime: "11:00", endTime: "12:00" },
                        ])
                      }
                      className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md active:scale-95"
                    >
                      <div className="flex flex-col items-center gap-0.5">
                        <span>Morning</span>
                        <span className="text-[10px] opacity-90">9AM-12PM</span>
                      </div>
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
                      className="px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md active:scale-95"
                    >
                      <div className="flex flex-col items-center gap-0.5">
                        <span>Afternoon</span>
                        <span className="text-[10px] opacity-90">2PM-5PM</span>
                      </div>
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
                      className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md active:scale-95"
                    >
                      <div className="flex flex-col items-center gap-0.5">
                        <span>Full Day</span>
                        <span className="text-[10px] opacity-90">9AM-5PM</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={clearAll}
                      className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md active:scale-95"
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span>Clear</span>
                      </div>
                    </button>
                  </div>
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
