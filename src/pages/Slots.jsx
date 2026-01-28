import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, Trash2, Edit, Plus, RefreshCw, AlertCircle } from 'lucide-react';

// API Client Class
class ReshaAPIClient {
  constructor(baseURL = 'https://api.houseofresha.com') {
    this.baseURL = baseURL;
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    const url = `${this.baseURL}${endpoint}`;
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && (method === 'POST' || method === 'PATCH')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    
    if (method === 'DELETE' && response.status === 204) {
      return { success: true, message: 'Resource deleted successfully' };
    }

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP Error: ${response.status}`);
    }

    return result;
  }

  // Appointments API
  async getAllAppointments() {
    return await this.makeRequest('/appointments', 'GET');
  }

  async updateAppointmentStatus(id, status) {
    return await this.makeRequest(`/appointment/${id}`, 'PATCH', { status });
  }

  // Slots API
  async getAllSlots() {
    return await this.makeRequest('/slots', 'GET');
  }

  async createSlots(date, slots) {
    return await this.makeRequest('/slots', 'POST', { date, slots });
  }

  async updateSlot(id, updates) {
    return await this.makeRequest(`/slots/${id}`, 'PATCH', updates);
  }

  async deleteSlot(id) {
    return await this.makeRequest(`/slots/${id}`, 'DELETE');
  }
}

// Initialize API client
const api = new ReshaAPIClient();

// Main App Component
export default function ReshaAPIApp() {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (activeTab === 'appointments') {
      fetchAppointments();
    } else if (activeTab === 'slots') {
      fetchSlots();
    }
  }, [activeTab]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await api.getAllAppointments();
      setAppointments(Array.isArray(data) ? data : data.appointments || []);
      showNotification('Appointments loaded successfully');
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const data = await api.getAllSlots();
      setSlots(Array.isArray(data) ? data : data.slots || []);
      showNotification('Slots loaded successfully');
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4 md:p-8">
      {/* Notification */}
      {notification && (
        <Notification message={notification.message} type={notification.type} />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Calendar className="text-purple-600" size={40} />
            House of Resha API Manager
          </h1>
          <p className="text-gray-600">Manage appointments and slots with ease</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-2xl mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`flex-1 py-4 px-6 font-semibold text-lg transition-all ${
                activeTab === 'appointments'
                  ? 'bg-purple-600 text-white border-b-4 border-purple-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              📋 Appointments
            </button>
            <button
              onClick={() => setActiveTab('slots')}
              className={`flex-1 py-4 px-6 font-semibold text-lg transition-all ${
                activeTab === 'slots'
                  ? 'bg-purple-600 text-white border-b-4 border-purple-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🕐 Slots
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-4 px-6 font-semibold text-lg transition-all ${
                activeTab === 'create'
                  ? 'bg-purple-600 text-white border-b-4 border-purple-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              ➕ Create Slots
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          {activeTab === 'appointments' && (
            <AppointmentsView
              appointments={appointments}
              loading={loading}
              onRefresh={fetchAppointments}
              onUpdateStatus={async (id, status) => {
                try {
                  await api.updateAppointmentStatus(id, status);
                  showNotification(`Appointment ${status} successfully`);
                  fetchAppointments();
                } catch (error) {
                  showNotification(error.message, 'error');
                }
              }}
            />
          )}

          {activeTab === 'slots' && (
            <SlotsView
              slots={slots}
              loading={loading}
              onRefresh={fetchSlots}
              onUpdate={async (id, updates) => {
                try {
                  await api.updateSlot(id, updates);
                  showNotification('Slot updated successfully');
                  fetchSlots();
                } catch (error) {
                  showNotification(error.message, 'error');
                }
              }}
              onDelete={async (id) => {
                try {
                  await api.deleteSlot(id);
                  showNotification('Slot deleted successfully');
                  fetchSlots();
                } catch (error) {
                  showNotification(error.message, 'error');
                }
              }}
            />
          )}

          {activeTab === 'create' && (
            <CreateSlotsView
              onCreateSuccess={() => {
                showNotification('Slots created successfully');
                setActiveTab('slots');
              }}
              onError={(error) => showNotification(error, 'error')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Notification Component
function Notification({ message, type }) {
  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
          type === 'success'
            ? 'bg-green-500 text-white'
            : 'bg-red-500 text-white'
        }`}
      >
        {type === 'success' ? (
          <CheckCircle size={24} />
        ) : (
          <AlertCircle size={24} />
        )}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}

// Appointments View Component
function AppointmentsView({ appointments, loading, onRefresh, onUpdateStatus }) {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleStatusChange = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const confirmStatusChange = (newStatus) => {
    if (selectedAppointment) {
      onUpdateStatus(selectedAppointment._id || selectedAppointment.id, newStatus);
      setShowModal(false);
      setSelectedAppointment(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <RefreshCw className="animate-spin text-purple-600" size={48} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Appointments</h2>
        <button
          onClick={onRefresh}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
        >
          <RefreshCw size={20} />
          Refresh
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Calendar size={64} className="mx-auto mb-4 text-gray-300" />
          <p className="text-xl">No appointments found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id || appointment.id}
              appointment={appointment}
              onStatusChange={() => handleStatusChange(appointment)}
            />
          ))}
        </div>
      )}

      {/* Status Change Modal */}
      {showModal && (
        <StatusModal
          appointment={selectedAppointment}
          onClose={() => setShowModal(false)}
          onConfirm={confirmStatusChange}
        />
      )}
    </div>
  );
}

// Appointment Card Component
function AppointmentCard({ appointment, onStatusChange }) {
  const statusColors = {
    booked: 'bg-blue-100 text-blue-800 border-blue-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
    completed: 'bg-green-100 text-green-800 border-green-300',
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-5 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-gray-800">
          {appointment.customerName || 'Customer'}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${
            statusColors[appointment.status] || 'bg-gray-100 text-gray-800'
          }`}
        >
          {appointment.status?.toUpperCase()}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <Calendar size={16} />
          {appointment.date || 'N/A'}
        </p>
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <Clock size={16} />
          {appointment.time || appointment.slot?.startTime || 'N/A'}
        </p>
      </div>

      <button
        onClick={onStatusChange}
        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
      >
        <Edit size={16} />
        Update Status
      </button>
    </div>
  );
}

// Status Change Modal
function StatusModal({ appointment, onClose, onConfirm }) {
  const statuses = ['booked', 'cancelled', 'completed'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">
          Update Appointment Status
        </h3>
        <p className="text-gray-600 mb-6">
          Current Status: <span className="font-bold">{appointment.status}</span>
        </p>

        <div className="space-y-3 mb-6">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => onConfirm(status)}
              disabled={appointment.status === status}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                appointment.status === status
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            >
              {status.toUpperCase()}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// Slots View Component
function SlotsView({ slots, loading, onRefresh, onUpdate, onDelete }) {
  const [editingSlot, setEditingSlot] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = (slot) => {
    setEditingSlot(slot);
    setShowEditModal(true);
  };

  const handleDelete = async (slotId) => {
    if (window.confirm('Are you sure you want to delete this slot?')) {
      await onDelete(slotId);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <RefreshCw className="animate-spin text-purple-600" size={48} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Slots</h2>
        <button
          onClick={onRefresh}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
        >
          <RefreshCw size={20} />
          Refresh
        </button>
      </div>

      {slots.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Clock size={64} className="mx-auto mb-4 text-gray-300" />
          <p className="text-xl">No slots found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => (
            <SlotCard
              key={slot._id || slot.id}
              slot={slot}
              onEdit={() => handleEdit(slot)}
              onDelete={() => handleDelete(slot._id || slot.id)}
            />
          ))}
        </div>
      )}

      {/* Edit Slot Modal */}
      {showEditModal && editingSlot && (
        <EditSlotModal
          slot={editingSlot}
          onClose={() => {
            setShowEditModal(false);
            setEditingSlot(null);
          }}
          onSave={(updates) => {
            onUpdate(editingSlot._id || editingSlot.id, updates);
            setShowEditModal(false);
            setEditingSlot(null);
          }}
        />
      )}
    </div>
  );
}

// Slot Card Component
function SlotCard({ slot, onEdit, onDelete }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-5 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-gray-800">Slot</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            slot.isBooked
              ? 'bg-red-100 text-red-800'
              : 'bg-green-100 text-green-800'
          }`}
        >
          {slot.isBooked ? 'BOOKED' : 'AVAILABLE'}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <Calendar size={16} />
          {slot.date || 'N/A'}
        </p>
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <Clock size={16} />
          {slot.startTime} - {slot.endTime}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <Edit size={16} />
          Edit
        </button>
        <button
          onClick={onDelete}
          className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}

// Edit Slot Modal
function EditSlotModal({ slot, onClose, onSave }) {
  const [formData, setFormData] = useState({
    startTime: slot.startTime || '',
    endTime: slot.endTime || '',
    isBooked: slot.isBooked || false,
    date: slot.date || '',
    product: slot.product || '',
    bookedBy: slot.bookedBy || null,
    appointment: slot.appointment || null,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl my-8">
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Edit Slot</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
          </div>

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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            />
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
              className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            />
            <label htmlFor="isBooked" className="text-sm font-medium text-gray-700">
              Is Booked
            </label>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Create Slots View Component
function CreateSlotsView({ onCreateSuccess, onError }) {
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([{ startTime: '', endTime: '' }]);
  const [loading, setLoading] = useState(false);

  const addSlot = () => {
    setSlots([...slots, { startTime: '', endTime: '' }]);
  };

  const removeSlot = (index) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const updateSlot = (index, field, value) => {
    const newSlots = [...slots];
    newSlots[index][field] = value;
    setSlots(newSlots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!date) {
      onError('Please select a date');
      return;
    }

    const validSlots = slots.filter(
      (slot) => slot.startTime && slot.endTime
    );

    if (validSlots.length === 0) {
      onError('Please add at least one valid slot');
      return;
    }

    setLoading(true);
    try {
      await api.createSlots(date, validSlots);
      onCreateSuccess();
      setDate('');
      setSlots([{ startTime: '', endTime: '' }]);
    } catch (error) {
      onError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Slots</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Select Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-lg"
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-700">Time Slots</h3>
            <button
              type="button"
              onClick={addSlot}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <Plus size={20} />
              Add Slot
            </button>
          </div>

          {slots.map((slot, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition"
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
                      updateSlot(index, 'startTime', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
                      updateSlot(index, 'endTime', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    required
                  />
                </div>

                {slots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSlot(index)}
                    className="mt-5 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-4 rounded-xl hover:bg-purple-700 transition text-lg font-bold flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <RefreshCw className="animate-spin" size={24} />
              Creating Slots...
            </>
          ) : (
            <>
              <CheckCircle size={24} />
              Create Slots
            </>
          )}
        </button>
      </form>

      {/* Quick Templates */}
      <div className="mt-8 bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Quick Templates</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={() => {
              setSlots([
                { startTime: '09:00', endTime: '10:00' },
                { startTime: '10:00', endTime: '11:00' },
                { startTime: '11:00', endTime: '12:00' },
              ]);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Morning Slots (9 AM - 12 PM)
          </button>
          <button
            type="button"
            onClick={() => {
              setSlots([
                { startTime: '14:00', endTime: '15:00' },
                { startTime: '15:00', endTime: '16:00' },
                { startTime: '16:00', endTime: '17:00' },
              ]);
            }}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Afternoon Slots (2 PM - 5 PM)
          </button>
          <button
            type="button"
            onClick={() => {
              setSlots([
                { startTime: '09:00', endTime: '10:00' },
                { startTime: '10:00', endTime: '11:00' },
                { startTime: '11:00', endTime: '12:00' },
                { startTime: '14:00', endTime: '15:00' },
                { startTime: '15:00', endTime: '16:00' },
                { startTime: '16:00', endTime: '17:00' },
              ]);
            }}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
          >
            Full Day (9 AM - 5 PM)
          </button>
          <button
            type="button"
            onClick={() => {
              setSlots([{ startTime: '', endTime: '' }]);
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}