// // import React, { useState, useEffect } from 'react';
// // import { Calendar, Clock, CheckCircle, XCircle, Trash2, Edit, Plus, RefreshCw, AlertCircle } from 'lucide-react';

// // // API Client Class
// // class ReshaAPIClient {
// //   constructor(baseURL = 'https://api.houseofresha.com') {
// //     this.baseURL = baseURL;
// //   }

// //   async makeRequest(endpoint, method = 'GET', data = null) {
// //     const url = `${this.baseURL}${endpoint}`;
// //     const options = {
// //       method: method,
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //     };

// //     if (data && (method === 'POST' || method === 'PATCH')) {
// //       options.body = JSON.stringify(data);
// //     }

// //     const response = await fetch(url, options);

// //     if (method === 'DELETE' && response.status === 204) {
// //       return { success: true, message: 'Resource deleted successfully' };
// //     }

// //     const result = await response.json();

// //     if (!response.ok) {
// //       throw new Error(result.message || `HTTP Error: ${response.status}`);
// //     }

// //     return result;
// //   }

// //   // Appointments API
// //   async getAllAppointments() {
// //     return await this.makeRequest('/appointments', 'GET');
// //   }

// //   async updateAppointmentStatus(id, status) {
// //     return await this.makeRequest(`/appointment/${id}`, 'PATCH', { status });
// //   }

// //   // Slots API
// //   async getAllSlots() {
// //     return await this.makeRequest('/slots', 'GET');
// //   }

// //   async createSlots(date, slots) {
// //     return await this.makeRequest('/slots', 'POST', { date, slots });
// //   }

// //   async updateSlot(id, updates) {
// //     return await this.makeRequest(`/slots/${id}`, 'PATCH', updates);
// //   }

// //   async deleteSlot(id) {
// //     return await this.makeRequest(`/slots/${id}`, 'DELETE');
// //   }
// // }

// // // Initialize API client
// // const api = new ReshaAPIClient();

// // // Main App Component
// // export default function ReshaAPIApp() {
// //   const [activeTab, setActiveTab] = useState('appointments');
// //   const [appointments, setAppointments] = useState([]);
// //   const [slots, setSlots] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [notification, setNotification] = useState(null);

// //   useEffect(() => {
// //     if (activeTab === 'appointments') {
// //       fetchAppointments();
// //     } else if (activeTab === 'slots') {
// //       fetchSlots();
// //     }
// //   }, [activeTab]);

// //   const showNotification = (message, type = 'success') => {
// //     setNotification({ message, type });
// //     setTimeout(() => setNotification(null), 4000);
// //   };

// //   const fetchAppointments = async () => {
// //     setLoading(true);
// //     try {
// //       const data = await api.getAllAppointments();
// //       setAppointments(Array.isArray(data) ? data : data.appointments || []);
// //       showNotification('Appointments loaded successfully');
// //     } catch (error) {
// //       showNotification(error.message, 'error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const fetchSlots = async () => {
// //     setLoading(true);
// //     try {
// //       const data = await api.getAllSlots();
// //       setSlots(Array.isArray(data) ? data : data.slots || []);
// //       showNotification('Slots loaded successfully');
// //     } catch (error) {
// //       showNotification(error.message, 'error');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 p-4 md:p-8">
// //       {/* Notification */}
// //       {notification && (
// //         <Notification message={notification.message} type={notification.type} />
// //       )}

// //       <div className="max-w-7xl mx-auto">
// //         {/* Header */}
// //         <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6">
// //           <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
// //             <Calendar className="text-purple-600" size={40} />
// //             House of Resha API Manager
// //           </h1>
// //           <p className="text-gray-600">Manage appointments and slots with ease</p>
// //         </div>

// //         {/* Tab Navigation */}
// //         <div className="bg-white rounded-2xl shadow-2xl mb-6">
// //           <div className="flex border-b border-gray-200">
// //             <button
// //               onClick={() => setActiveTab('appointments')}
// //               className={`flex-1 py-4 px-6 font-semibold text-lg transition-all ${
// //                 activeTab === 'appointments'
// //                   ? 'bg-purple-600 text-white border-b-4 border-purple-800'
// //                   : 'text-gray-600 hover:bg-gray-100'
// //               }`}
// //             >
// //               📋 Appointments
// //             </button>
// //             <button
// //               onClick={() => setActiveTab('slots')}
// //               className={`flex-1 py-4 px-6 font-semibold text-lg transition-all ${
// //                 activeTab === 'slots'
// //                   ? 'bg-purple-600 text-white border-b-4 border-purple-800'
// //                   : 'text-gray-600 hover:bg-gray-100'
// //               }`}
// //             >
// //               🕐 Slots
// //             </button>
// //             <button
// //               onClick={() => setActiveTab('create')}
// //               className={`flex-1 py-4 px-6 font-semibold text-lg transition-all ${
// //                 activeTab === 'create'
// //                   ? 'bg-purple-600 text-white border-b-4 border-purple-800'
// //                   : 'text-gray-600 hover:bg-gray-100'
// //               }`}
// //             >
// //               ➕ Create Slots
// //             </button>
// //           </div>
// //         </div>

// //         {/* Content Area */}
// //         <div className="bg-white rounded-2xl shadow-2xl p-6">
// //           {activeTab === 'appointments' && (
// //             <AppointmentsView
// //               appointments={appointments}
// //               loading={loading}
// //               onRefresh={fetchAppointments}
// //               onUpdateStatus={async (id, status) => {
// //                 try {
// //                   await api.updateAppointmentStatus(id, status);
// //                   showNotification(`Appointment ${status} successfully`);
// //                   fetchAppointments();
// //                 } catch (error) {
// //                   showNotification(error.message, 'error');
// //                 }
// //               }}
// //             />
// //           )}

// //           {activeTab === 'slots' && (
// //             <SlotsView
// //               slots={slots}
// //               loading={loading}
// //               onRefresh={fetchSlots}
// //               onUpdate={async (id, updates) => {
// //                 try {
// //                   await api.updateSlot(id, updates);
// //                   showNotification('Slot updated successfully');
// //                   fetchSlots();
// //                 } catch (error) {
// //                   showNotification(error.message, 'error');
// //                 }
// //               }}
// //               onDelete={async (id) => {
// //                 try {
// //                   await api.deleteSlot(id);
// //                   showNotification('Slot deleted successfully');
// //                   fetchSlots();
// //                 } catch (error) {
// //                   showNotification(error.message, 'error');
// //                 }
// //               }}
// //             />
// //           )}

// //           {activeTab === 'create' && (
// //             <CreateSlotsView
// //               onCreateSuccess={() => {
// //                 showNotification('Slots created successfully');
// //                 setActiveTab('slots');
// //               }}
// //               onError={(error) => showNotification(error, 'error')}
// //             />
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // // Notification Component
// // function Notification({ message, type }) {
// //   return (
// //     <div className="fixed top-4 right-4 z-50 animate-slide-in">
// //       <div
// //         className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
// //           type === 'success'
// //             ? 'bg-green-500 text-white'
// //             : 'bg-red-500 text-white'
// //         }`}
// //       >
// //         {type === 'success' ? (
// //           <CheckCircle size={24} />
// //         ) : (
// //           <AlertCircle size={24} />
// //         )}
// //         <span className="font-medium">{message}</span>
// //       </div>
// //     </div>
// //   );
// // }

// // // Appointments View Component
// // function AppointmentsView({ appointments, loading, onRefresh, onUpdateStatus }) {
// //   const [selectedAppointment, setSelectedAppointment] = useState(null);
// //   const [showModal, setShowModal] = useState(false);

// //   const handleStatusChange = (appointment) => {
// //     setSelectedAppointment(appointment);
// //     setShowModal(true);
// //   };

// //   const confirmStatusChange = (newStatus) => {
// //     if (selectedAppointment) {
// //       onUpdateStatus(selectedAppointment._id || selectedAppointment.id, newStatus);
// //       setShowModal(false);
// //       setSelectedAppointment(null);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center py-20">
// //         <RefreshCw className="animate-spin text-purple-600" size={48} />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div>
// //       <div className="flex justify-between items-center mb-6">
// //         <h2 className="text-2xl font-bold text-gray-800">All Appointments</h2>
// //         <button
// //           onClick={onRefresh}
// //           className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
// //         >
// //           <RefreshCw size={20} />
// //           Refresh
// //         </button>
// //       </div>

// //       {appointments.length === 0 ? (
// //         <div className="text-center py-12 text-gray-500">
// //           <Calendar size={64} className="mx-auto mb-4 text-gray-300" />
// //           <p className="text-xl">No appointments found</p>
// //         </div>
// //       ) : (
// //         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
// //           {appointments.map((appointment) => (
// //             <AppointmentCard
// //               key={appointment._id || appointment.id}
// //               appointment={appointment}
// //               onStatusChange={() => handleStatusChange(appointment)}
// //             />
// //           ))}
// //         </div>
// //       )}

// //       {/* Status Change Modal */}
// //       {showModal && (
// //         <StatusModal
// //           appointment={selectedAppointment}
// //           onClose={() => setShowModal(false)}
// //           onConfirm={confirmStatusChange}
// //         />
// //       )}
// //     </div>
// //   );
// // }

// // // Appointment Card Component
// // function AppointmentCard({ appointment, onStatusChange }) {
// //   const statusColors = {
// //     booked: 'bg-blue-100 text-blue-800 border-blue-300',
// //     cancelled: 'bg-red-100 text-red-800 border-red-300',
// //     completed: 'bg-green-100 text-green-800 border-green-300',
// //   };

// //   return (
// //     <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-5 hover:shadow-lg transition">
// //       <div className="flex justify-between items-start mb-3">
// //         <h3 className="font-bold text-lg text-gray-800">
// //           {appointment.customerName || 'Customer'}
// //         </h3>
// //         <span
// //           className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${
// //             statusColors[appointment.status] || 'bg-gray-100 text-gray-800'
// //           }`}
// //         >
// //           {appointment.status?.toUpperCase()}
// //         </span>
// //       </div>

// //       <div className="space-y-2 mb-4">
// //         <p className="text-sm text-gray-600 flex items-center gap-2">
// //           <Calendar size={16} />
// //           {appointment.date || 'N/A'}
// //         </p>
// //         <p className="text-sm text-gray-600 flex items-center gap-2">
// //           <Clock size={16} />
// //           {appointment.time || appointment.slot?.startTime || 'N/A'}
// //         </p>
// //       </div>

// //       <button
// //         onClick={onStatusChange}
// //         className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
// //       >
// //         <Edit size={16} />
// //         Update Status
// //       </button>
// //     </div>
// //   );
// // }

// // // Status Change Modal
// // function StatusModal({ appointment, onClose, onConfirm }) {
// //   const statuses = ['booked', 'cancelled', 'completed'];

// //   return (
// //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
// //       <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
// //         <h3 className="text-2xl font-bold mb-4 text-gray-800">
// //           Update Appointment Status
// //         </h3>
// //         <p className="text-gray-600 mb-6">
// //           Current Status: <span className="font-bold">{appointment.status}</span>
// //         </p>

// //         <div className="space-y-3 mb-6">
// //           {statuses.map((status) => (
// //             <button
// //               key={status}
// //               onClick={() => onConfirm(status)}
// //               disabled={appointment.status === status}
// //               className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
// //                 appointment.status === status
// //                   ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
// //                   : 'bg-purple-600 text-white hover:bg-purple-700'
// //               }`}
// //             >
// //               {status.toUpperCase()}
// //             </button>
// //           ))}
// //         </div>

// //         <button
// //           onClick={onClose}
// //           className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
// //         >
// //           Cancel
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // // Slots View Component
// // function SlotsView({ slots, loading, onRefresh, onUpdate, onDelete }) {
// //   const [editingSlot, setEditingSlot] = useState(null);
// //   const [showEditModal, setShowEditModal] = useState(false);

// //   const handleEdit = (slot) => {
// //     setEditingSlot(slot);
// //     setShowEditModal(true);
// //   };

// //   const handleDelete = async (slotId) => {
// //     if (window.confirm('Are you sure you want to delete this slot?')) {
// //       await onDelete(slotId);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center py-20">
// //         <RefreshCw className="animate-spin text-purple-600" size={48} />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div>
// //       <div className="flex justify-between items-center mb-6">
// //         <h2 className="text-2xl font-bold text-gray-800">All Slots</h2>
// //         <button
// //           onClick={onRefresh}
// //           className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
// //         >
// //           <RefreshCw size={20} />
// //           Refresh
// //         </button>
// //       </div>

// //       {slots.length === 0 ? (
// //         <div className="text-center py-12 text-gray-500">
// //           <Clock size={64} className="mx-auto mb-4 text-gray-300" />
// //           <p className="text-xl">No slots found</p>
// //         </div>
// //       ) : (
// //         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
// //           {slots.map((slot) => (
// //             <SlotCard
// //               key={slot._id || slot.id}
// //               slot={slot}
// //               onEdit={() => handleEdit(slot)}
// //               onDelete={() => handleDelete(slot._id || slot.id)}
// //             />
// //           ))}
// //         </div>
// //       )}

// //       {/* Edit Slot Modal */}
// //       {showEditModal && editingSlot && (
// //         <EditSlotModal
// //           slot={editingSlot}
// //           onClose={() => {
// //             setShowEditModal(false);
// //             setEditingSlot(null);
// //           }}
// //           onSave={(updates) => {
// //             onUpdate(editingSlot._id || editingSlot.id, updates);
// //             setShowEditModal(false);
// //             setEditingSlot(null);
// //           }}
// //         />
// //       )}
// //     </div>
// //   );
// // }

// // // Slot Card Component
// // function SlotCard({ slot, onEdit, onDelete }) {
// //   return (
// //     <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-5 hover:shadow-lg transition">
// //       <div className="flex justify-between items-start mb-3">
// //         <h3 className="font-bold text-lg text-gray-800">Slot</h3>
// //         <span
// //           className={`px-3 py-1 rounded-full text-xs font-bold ${
// //             slot.isBooked
// //               ? 'bg-red-100 text-red-800'
// //               : 'bg-green-100 text-green-800'
// //           }`}
// //         >
// //           {slot.isBooked ? 'BOOKED' : 'AVAILABLE'}
// //         </span>
// //       </div>

// //       <div className="space-y-2 mb-4">
// //         <p className="text-sm text-gray-600 flex items-center gap-2">
// //           <Calendar size={16} />
// //           {slot.date || 'N/A'}
// //         </p>
// //         <p className="text-sm text-gray-600 flex items-center gap-2">
// //           <Clock size={16} />
// //           {slot.startTime} - {slot.endTime}
// //         </p>
// //       </div>

// //       <div className="flex gap-2">
// //         <button
// //           onClick={onEdit}
// //           className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
// //         >
// //           <Edit size={16} />
// //           Edit
// //         </button>
// //         <button
// //           onClick={onDelete}
// //           className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
// //         >
// //           <Trash2 size={16} />
// //           Delete
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // // Edit Slot Modal
// // function EditSlotModal({ slot, onClose, onSave }) {
// //   const [formData, setFormData] = useState({
// //     startTime: slot.startTime || '',
// //     endTime: slot.endTime || '',
// //     isBooked: slot.isBooked || false,
// //     date: slot.date || '',
// //     product: slot.product || '',
// //     bookedBy: slot.bookedBy || null,
// //     appointment: slot.appointment || null,
// //   });

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     onSave(formData);
// //   };

// //   return (
// //     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
// //       <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl my-8">
// //         <h3 className="text-2xl font-bold mb-4 text-gray-800">Edit Slot</h3>

// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">
// //               Date
// //             </label>
// //             <input
// //               type="date"
// //               value={formData.date}
// //               onChange={(e) => setFormData({ ...formData, date: e.target.value })}
// //               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
// //             />
// //           </div>

// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">
// //               Start Time
// //             </label>
// //             <input
// //               type="time"
// //               value={formData.startTime}
// //               onChange={(e) =>
// //                 setFormData({ ...formData, startTime: e.target.value })
// //               }
// //               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
// //             />
// //           </div>

// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">
// //               End Time
// //             </label>
// //             <input
// //               type="time"
// //               value={formData.endTime}
// //               onChange={(e) =>
// //                 setFormData({ ...formData, endTime: e.target.value })
// //               }
// //               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
// //             />
// //           </div>

// //           <div>
// //             <label className="block text-sm font-medium text-gray-700 mb-1">
// //               Product ID
// //             </label>
// //             <input
// //               type="text"
// //               value={formData.product}
// //               onChange={(e) =>
// //                 setFormData({ ...formData, product: e.target.value })
// //               }
// //               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
// //             />
// //           </div>

// //           <div className="flex items-center gap-2">
// //             <input
// //               type="checkbox"
// //               id="isBooked"
// //               checked={formData.isBooked}
// //               onChange={(e) =>
// //                 setFormData({ ...formData, isBooked: e.target.checked })
// //               }
// //               className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
// //             />
// //             <label htmlFor="isBooked" className="text-sm font-medium text-gray-700">
// //               Is Booked
// //             </label>
// //           </div>

// //           <div className="flex gap-3 mt-6">
// //             <button
// //               type="submit"
// //               className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
// //             >
// //               Save Changes
// //             </button>
// //             <button
// //               type="button"
// //               onClick={onClose}
// //               className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
// //             >
// //               Cancel
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // // Create Slots View Component
// // function CreateSlotsView({ onCreateSuccess, onError }) {
// //   const [date, setDate] = useState('');
// //   const [slots, setSlots] = useState([{ startTime: '', endTime: '' }]);
// //   const [loading, setLoading] = useState(false);

// //   const addSlot = () => {
// //     setSlots([...slots, { startTime: '', endTime: '' }]);
// //   };

// //   const removeSlot = (index) => {
// //     setSlots(slots.filter((_, i) => i !== index));
// //   };

// //   const updateSlot = (index, field, value) => {
// //     const newSlots = [...slots];
// //     newSlots[index][field] = value;
// //     setSlots(newSlots);
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (!date) {
// //       onError('Please select a date');
// //       return;
// //     }

// //     const validSlots = slots.filter(
// //       (slot) => slot.startTime && slot.endTime
// //     );

// //     if (validSlots.length === 0) {
// //       onError('Please add at least one valid slot');
// //       return;
// //     }

// //     setLoading(true);
// //     try {
// //       await api.createSlots(date, validSlots);
// //       onCreateSuccess();
// //       setDate('');
// //       setSlots([{ startTime: '', endTime: '' }]);
// //     } catch (error) {
// //       onError(error.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="max-w-3xl mx-auto">
// //       <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Slots</h2>

// //       <form onSubmit={handleSubmit} className="space-y-6">
// //         <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border-2 border-purple-200">
// //           <label className="block text-sm font-bold text-gray-700 mb-2">
// //             Select Date
// //           </label>
// //           <input
// //             type="date"
// //             value={date}
// //             onChange={(e) => setDate(e.target.value)}
// //             className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent text-lg"
// //             required
// //           />
// //         </div>

// //         <div className="space-y-4">
// //           <div className="flex justify-between items-center">
// //             <h3 className="text-lg font-bold text-gray-700">Time Slots</h3>
// //             <button
// //               type="button"
// //               onClick={addSlot}
// //               className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
// //             >
// //               <Plus size={20} />
// //               Add Slot
// //             </button>
// //           </div>

// //           {slots.map((slot, index) => (
// //             <div
// //               key={index}
// //               className="bg-white p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition"
// //             >
// //               <div className="flex items-center gap-4">
// //                 <div className="flex-1">
// //                   <label className="block text-xs font-medium text-gray-600 mb-1">
// //                     Start Time
// //                   </label>
// //                   <input
// //                     type="time"
// //                     value={slot.startTime}
// //                     onChange={(e) =>
// //                       updateSlot(index, 'startTime', e.target.value)
// //                     }
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
// //                     required
// //                   />
// //                 </div>

// //                 <div className="flex-1">
// //                   <label className="block text-xs font-medium text-gray-600 mb-1">
// //                     End Time
// //                   </label>
// //                   <input
// //                     type="time"
// //                     value={slot.endTime}
// //                     onChange={(e) =>
// //                       updateSlot(index, 'endTime', e.target.value)
// //                     }
// //                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
// //                     required
// //                   />
// //                 </div>

// //                 {slots.length > 1 && (
// //                   <button
// //                     type="button"
// //                     onClick={() => removeSlot(index)}
// //                     className="mt-5 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
// //                   >
// //                     <Trash2 size={20} />
// //                   </button>
// //                 )}
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         <button
// //           type="submit"
// //           disabled={loading}
// //           className="w-full bg-purple-600 text-white py-4 rounded-xl hover:bg-purple-700 transition text-lg font-bold flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
// //         >
// //           {loading ? (
// //             <>
// //               <RefreshCw className="animate-spin" size={24} />
// //               Creating Slots...
// //             </>
// //           ) : (
// //             <>
// //               <CheckCircle size={24} />
// //               Create Slots
// //             </>
// //           )}
// //         </button>
// //       </form>

// //       {/* Quick Templates */}
// //       <div className="mt-8 bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
// //         <h3 className="text-lg font-bold text-gray-700 mb-4">Quick Templates</h3>
// //         <div className="grid gap-3 md:grid-cols-2">
// //           <button
// //             type="button"
// //             onClick={() => {
// //               setSlots([
// //                 { startTime: '09:00', endTime: '10:00' },
// //                 { startTime: '10:00', endTime: '11:00' },
// //                 { startTime: '11:00', endTime: '12:00' },
// //               ]);
// //             }}
// //             className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
// //           >
// //             Morning Slots (9 AM - 12 PM)
// //           </button>
// //           <button
// //             type="button"
// //             onClick={() => {
// //               setSlots([
// //                 { startTime: '14:00', endTime: '15:00' },
// //                 { startTime: '15:00', endTime: '16:00' },
// //                 { startTime: '16:00', endTime: '17:00' },
// //               ]);
// //             }}
// //             className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
// //           >
// //             Afternoon Slots (2 PM - 5 PM)
// //           </button>
// //           <button
// //             type="button"
// //             onClick={() => {
// //               setSlots([
// //                 { startTime: '09:00', endTime: '10:00' },
// //                 { startTime: '10:00', endTime: '11:00' },
// //                 { startTime: '11:00', endTime: '12:00' },
// //                 { startTime: '14:00', endTime: '15:00' },
// //                 { startTime: '15:00', endTime: '16:00' },
// //                 { startTime: '16:00', endTime: '17:00' },
// //               ]);
// //             }}
// //             className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition"
// //           >
// //             Full Day (9 AM - 5 PM)
// //           </button>
// //           <button
// //             type="button"
// //             onClick={() => {
// //               setSlots([{ startTime: '', endTime: '' }]);
// //             }}
// //             className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
// //           >
// //             Clear All
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// import React, { useState, useEffect } from "react";
// import {
//   Clock,
//   Calendar,
//   Trash2,
//   Edit2,
//   AlertCircle,
//   X,
//   Search,
//   Filter,
//   ChevronDown,
//   RefreshCw,
//   CheckCircle,
//   XCircle,
//   Eye,
//   Plus,
//   User,
//   Phone,
//   Mail,
//   Package,
//   Layers,
//   Shield,
//   BarChart3,
//   Tag,
//   MousePointerClick,
//   ExternalLink,
//   Video,
// } from "lucide-react";

// // ==================== API Clients ====================
// class SlotsAPI {
//   constructor(baseURL = 'https://api.houseofresha.com') {
//     this.baseURL = baseURL;
//   }

//   async getAllSlots() {
//     const response = await fetch(`${this.baseURL}/slots`);
//     if (!response.ok) {
//       throw new Error(`HTTP Error: ${response.status}`);
//     }
//     return response.json();
//   }

//   async createSlots(date, slots) {
//     const response = await fetch(`${this.baseURL}/slots`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ date, slots }),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || `HTTP Error: ${response.status}`);
//     }

//     return response.json();
//   }

//   async updateSlot(id, updates) {
//     const response = await fetch(`${this.baseURL}/slots/${id}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(updates),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || `HTTP Error: ${response.status}`);
//     }

//     return response.json();
//   }

//   async deleteSlot(id) {
//     const response = await fetch(`${this.baseURL}/slots/${id}`, {
//       method: 'DELETE',
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || `HTTP Error: ${response.status}`);
//     }

//     return response.json();
//   }
// }

// class AppointmentsAPI {
//   constructor(baseURL = 'https://api.houseofresha.com') {
//     this.baseURL = baseURL;
//   }

//   async getAllAppointments() {
//     const response = await fetch(`${this.baseURL}/appointments`);
//     if (!response.ok) {
//       throw new Error(`HTTP Error: ${response.status}`);
//     }
//     return response.json();
//   }

//   async updateAppointmentStatus(id, status) {
//     const response = await fetch(`${this.baseURL}/appointment/${id}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ status }),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || `HTTP Error: ${response.status}`);
//     }

//     return response.json();
//   }
// }

// const slotsApi = new SlotsAPI();
// const appointmentsApi = new AppointmentsAPI();

// // ==================== Reusable Components ====================
// const StatsCard = ({ icon: Icon, label, value, color }) => (
//   <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-xs text-gray-500 font-medium">{label}</p>
//         <p className="text-lg font-bold text-gray-800 mt-1">{value}</p>
//       </div>
//       <div className={`p-2 rounded-lg ${color}`}>
//         <Icon className="w-5 h-5 text-white" />
//       </div>
//     </div>
//   </div>
// );

// function Notification({ message, type, onClose }) {
//   return (
//     <div className="fixed top-4 right-4 z-50 animate-slide-in">
//       <div
//         className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 ${
//           type === 'success'
//             ? 'bg-green-500 text-white'
//             : 'bg-red-500 text-white'
//         }`}
//       >
//         {type === 'success' ? (
//           <CheckCircle size={24} />
//         ) : (
//           <AlertCircle size={24} />
//         )}
//         <span className="font-medium">{message}</span>
//         <button
//           onClick={onClose}
//           className="ml-4 text-white hover:text-gray-200"
//         >
//           <X className="w-4 h-4" />
//         </button>
//       </div>
//     </div>
//   );
// }

// // ==================== Modal Components ====================
// function CreateSlotsModal({ isOpen, onClose, onCreateSuccess, onError }) {
//   const [date, setDate] = useState('');
//   const [slots, setSlots] = useState([{ startTime: '', endTime: '' }]);
//   const [loading, setLoading] = useState(false);

//   const addSlot = () => {
//     setSlots([...slots, { startTime: '', endTime: '' }]);
//   };

//   const removeSlot = (index) => {
//     if (slots.length > 1) {
//       setSlots(slots.filter((_, i) => i !== index));
//     }
//   };

//   const updateSlot = (index, field, value) => {
//     const newSlots = [...slots];
//     newSlots[index][field] = value;
//     setSlots(newSlots);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!date) {
//       onError('Please select a date');
//       return;
//     }

//     const validSlots = slots.filter(
//       (slot) => slot.startTime && slot.endTime
//     );

//     if (validSlots.length === 0) {
//       onError('Please add at least one valid slot');
//       return;
//     }

//     setLoading(true);
//     try {
//       await slotsApi.createSlots(date, validSlots);
//       onCreateSuccess();
//       onClose();
//       setDate('');
//       setSlots([{ startTime: '', endTime: '' }]);
//     } catch (error) {
//       onError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyTemplate = (templateSlots) => {
//     setSlots(templateSlots);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
//       <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
//           <div className="flex justify-between items-center gap-4">
//             <h2 className="text-xl font-bold text-gray-900">Create New Slots</h2>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
//           <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border-2 border-purple-200">
//             <label className="block text-sm font-bold text-gray-700 mb-2">
//               Select Date
//             </label>
//             <input
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               className="w-full px-4 py-3 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
//               required
//             />
//           </div>

//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <h3 className="text-lg font-bold text-gray-700">Time Slots</h3>
//               <button
//                 type="button"
//                 onClick={addSlot}
//                 className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
//               >
//                 <Plus className="w-4 h-4" />
//                 Add Slot
//               </button>
//             </div>

//             {slots.map((slot, index) => (
//               <div
//                 key={index}
//                 className="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="flex-1">
//                     <label className="block text-xs font-medium text-gray-600 mb-1">
//                       Start Time
//                     </label>
//                     <input
//                       type="time"
//                       value={slot.startTime}
//                       onChange={(e) =>
//                         updateSlot(index, 'startTime', e.target.value)
//                       }
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
//                       required
//                     />
//                   </div>

//                   <div className="flex-1">
//                     <label className="block text-xs font-medium text-gray-600 mb-1">
//                       End Time
//                     </label>
//                     <input
//                       type="time"
//                       value={slot.endTime}
//                       onChange={(e) =>
//                         updateSlot(index, 'endTime', e.target.value)
//                       }
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
//                       required
//                     />
//                   </div>

//                   <button
//                     type="button"
//                     onClick={() => removeSlot(index)}
//                     disabled={slots.length === 1}
//                     className="mt-6 p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//             <h3 className="text-sm font-bold text-gray-700 mb-3">Quick Templates</h3>
//             <div className="grid grid-cols-2 gap-2">
//               <button
//                 type="button"
//                 onClick={() => applyTemplate([
//                   { startTime: '09:00', endTime: '10:00' },
//                   { startTime: '10:00', endTime: '11:00' },
//                   { startTime: '11:00', endTime: '12:00' },
//                 ])}
//                 className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
//               >
//                 Morning (9AM-12PM)
//               </button>
//               <button
//                 type="button"
//                 onClick={() => applyTemplate([
//                   { startTime: '14:00', endTime: '15:00' },
//                   { startTime: '15:00', endTime: '16:00' },
//                   { startTime: '16:00', endTime: '17:00' },
//                 ])}
//                 className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm"
//               >
//                 Afternoon (2PM-5PM)
//               </button>
//               <button
//                 type="button"
//                 onClick={() => applyTemplate([
//                   { startTime: '09:00', endTime: '10:00' },
//                   { startTime: '10:00', endTime: '11:00' },
//                   { startTime: '11:00', endTime: '12:00' },
//                   { startTime: '14:00', endTime: '15:00' },
//                   { startTime: '15:00', endTime: '16:00' },
//                   { startTime: '16:00', endTime: '17:00' },
//                 ])}
//                 className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
//               >
//                 Full Day
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setSlots([{ startTime: '', endTime: '' }])}
//                 className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
//               >
//                 Clear All
//               </button>
//             </div>
//           </div>

//           <div className="flex gap-3 pt-4 border-t border-gray-200">
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
//             >
//               {loading ? (
//                 <>
//                   <RefreshCw className="w-4 h-4 animate-spin" />
//                   Creating Slots...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle className="w-4 h-4" />
//                   Create Slots
//                 </>
//               )}
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// function EditSlotModal({ slot, isOpen, onClose, onSave }) {
//   const [formData, setFormData] = useState({
//     startTime: slot?.startTime || '',
//     endTime: slot?.endTime || '',
//     isBooked: slot?.isBooked || false,
//     date: slot?.date || '',
//     product: slot?.product || '',
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (slot) {
//       setFormData({
//         startTime: slot.startTime || '',
//         endTime: slot.endTime || '',
//         isBooked: slot.isBooked || false,
//         date: slot.date || '',
//         product: slot.product || '',
//       });
//     }
//   }, [slot]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     await onSave(formData);
//     setLoading(false);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-md w-full">
//         <div className="border-b border-gray-200 p-6">
//           <div className="flex justify-between items-center gap-4">
//             <h2 className="text-xl font-bold text-gray-900">Edit Slot</h2>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <X className="w-6 h-6" />
//             </button>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Date
//             </label>
//             <input
//               type="date"
//               value={formData.date}
//               onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
//               required
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Start Time
//               </label>
//               <input
//                 type="time"
//                 value={formData.startTime}
//                 onChange={(e) =>
//                   setFormData({ ...formData, startTime: e.target.value })
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
//                 required
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 End Time
//               </label>
//               <input
//                 type="time"
//                 value={formData.endTime}
//                 onChange={(e) =>
//                   setFormData({ ...formData, endTime: e.target.value })
//                 }
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Product ID
//             </label>
//             <input
//               type="text"
//               value={formData.product}
//               onChange={(e) =>
//                 setFormData({ ...formData, product: e.target.value })
//               }
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
//               placeholder="Optional"
//             />
//           </div>

//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               id="isBooked"
//               checked={formData.isBooked}
//               onChange={(e) =>
//                 setFormData({ ...formData, isBooked: e.target.checked })
//               }
//               className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500"
//             />
//             <label htmlFor="isBooked" className="text-sm font-medium text-gray-700">
//               Mark as Booked
//             </label>
//           </div>

//           <div className="flex gap-3 pt-4">
//             <button
//               type="submit"
//               disabled={loading}
//               className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
//             >
//               {loading ? 'Saving...' : 'Save Changes'}
//             </button>
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// function DeleteConfirmationModal({ isOpen, onClose, onConfirm, slot, loading }) {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-md w-full p-6">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
//             <AlertCircle className="w-5 h-5 text-red-600" />
//           </div>
//           <div>
//             <h3 className="font-bold text-gray-900">Delete Slot</h3>
//             <p className="text-sm text-gray-600">
//               This action cannot be undone
//             </p>
//           </div>
//         </div>
//         <p className="text-gray-600 mb-6">
//           Are you sure you want to delete the slot on{" "}
//           <span className="font-semibold text-gray-800">
//             {slot?.date}
//           </span>{" "}
//           from{" "}
//           <span className="font-semibold text-gray-800">
//             {slot?.startTime} - {slot?.endTime}
//           </span>
//           ?
//         </p>
//         <div className="flex gap-3">
//           <button
//             onClick={onClose}
//             disabled={loading}
//             className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             disabled={loading}
//             className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 font-medium"
//           >
//             {loading ? (
//               <>
//                 <RefreshCw className="w-5 h-5 animate-spin" />
//                 Deleting...
//               </>
//             ) : (
//               'Delete'
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function StatusModal({ appointment, isOpen, onClose, onConfirm }) {
//   const statuses = [
//     { value: 'booked', label: 'Booked', color: 'bg-blue-100 text-blue-800' },
//     { value: 'confirmed', label: 'Confirmed', color: 'bg-green-100 text-green-800' },
//     { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
//     { value: 'completed', label: 'Completed', color: 'bg-purple-100 text-purple-800' },
//   ];

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-md w-full p-6">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
//             <Edit2 className="w-5 h-5 text-blue-600" />
//           </div>
//           <div>
//             <h3 className="font-bold text-gray-900">Update Appointment Status</h3>
//             <p className="text-sm text-gray-600">
//               Current Status: <span className="font-semibold capitalize">{appointment?.status}</span>
//             </p>
//           </div>
//         </div>

//         <div className="space-y-2 mb-6">
//           {statuses.map((status) => (
//             <button
//               key={status.value}
//               onClick={() => onConfirm(status.value)}
//               disabled={appointment?.status === status.value}
//               className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
//                 appointment?.status === status.value
//                   ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                   : `${status.color} hover:opacity-90`
//               }`}
//             >
//               {status.label}
//             </button>
//           ))}
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={onClose}
//             className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ==================== Tab Components ====================
// function ManageSlotsTab() {
//   const [slots, setSlots] = useState([]);
//   const [filteredSlots, setFilteredSlots] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedDate, setSelectedDate] = useState("All");
//   const [selectedStatus, setSelectedStatus] = useState("All");
//   const [dates, setDates] = useState(["All"]);
//   const [showFilters, setShowFilters] = useState(false);
//   const [editingSlot, setEditingSlot] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [slotToDelete, setSlotToDelete] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [visibleCount, setVisibleCount] = useState(6);
//   const [notification, setNotification] = useState(null);

//   const statuses = ["All", "Available", "Booked"];

//   useEffect(() => {
//     fetchSlots();
//   }, []);

//   useEffect(() => {
//     filterSlots();
//   }, [slots, searchQuery, selectedDate, selectedStatus]);

//   const showNotification = (message, type = 'success') => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 4000);
//   };

//   const fetchSlots = async () => {
//     try {
//       setLoading(true);
//       const data = await slotsApi.getAllSlots();

//       const slotsArray = Array.isArray(data) ? data : data.slots || [];
//       const transformedSlots = slotsArray.map(slot => ({
//         id: slot._id || slot.id,
//         date: slot.date || "No Date",
//         startTime: slot.startTime || "",
//         endTime: slot.endTime || "",
//         isBooked: slot.isBooked || false,
//         product: slot.product || "",
//         bookedBy: slot.bookedBy || null,
//         appointment: slot.appointment || null,
//         createdAt: slot.createdAt,
//         updatedAt: slot.updatedAt,
//       }));

//       setSlots(transformedSlots);

//       const uniqueDates = [
//         "All",
//         ...new Set(transformedSlots.map(s => s.date).filter(Boolean)),
//       ];
//       setDates(uniqueDates);
//       showNotification('Slots loaded successfully');
//     } catch (error) {
//       console.error("Error fetching slots:", error);
//       showNotification("Failed to load slots", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterSlots = () => {
//     let filtered = slots;

//     if (selectedDate !== "All") {
//       filtered = filtered.filter(s => s.date === selectedDate);
//     }

//     if (selectedStatus !== "All") {
//       if (selectedStatus === "Available") {
//         filtered = filtered.filter(s => !s.isBooked);
//       } else if (selectedStatus === "Booked") {
//         filtered = filtered.filter(s => s.isBooked);
//       }
//     }

//     if (searchQuery) {
//       filtered = filtered.filter(
//         s =>
//           s.date?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           s.startTime?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           s.endTime?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           s.product?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     setFilteredSlots(filtered);
//   };

//   const handleEdit = (slot) => {
//     setEditingSlot(slot);
//     setShowEditModal(true);
//   };

//   const handleSaveEdit = async (updates) => {
//     try {
//       await slotsApi.updateSlot(editingSlot.id, updates);

//       setSlots(prev => prev.map(slot =>
//         slot.id === editingSlot.id ? { ...slot, ...updates } : slot
//       ));

//       setShowEditModal(false);
//       setEditingSlot(null);
//       showNotification("Slot updated successfully");
//     } catch (error) {
//       showNotification(error.message, "error");
//     }
//   };

//   const handleDeleteClick = (slot) => {
//     setSlotToDelete(slot);
//     setShowDeleteModal(true);
//   };

//   const handleDeleteConfirm = async () => {
//     if (!slotToDelete) return;

//     try {
//       setDeleteLoading(true);
//       await slotsApi.deleteSlot(slotToDelete.id);

//       setSlots(prev => prev.filter(s => s.id !== slotToDelete.id));

//       setShowDeleteModal(false);
//       setSlotToDelete(null);
//       showNotification("Slot deleted successfully");
//     } catch (error) {
//       showNotification(error.message, "error");
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   const handleLoadMore = () => {
//     setVisibleCount(prev => prev + 6);
//   };

//   // Calculate stats
//   const totalSlots = slots.length;
//   const bookedSlots = slots.filter(s => s.isBooked).length;
//   const availableSlots = totalSlots - bookedSlots;
//   const uniqueDatesCount = dates.length - 1;

//   // Get slots to display
//   const slotsToDisplay = filteredSlots.slice(0, visibleCount);
//   const hasMoreSlots = visibleCount < filteredSlots.length;

//   return (
//     <>
//       {notification && (
//         <Notification
//           message={notification.message}
//           type={notification.type}
//           onClose={() => setNotification(null)}
//         />
//       )}

//       <div className="mb-8">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <StatsCard
//             icon={Clock}
//             label="Total Slots"
//             value={totalSlots}
//             color="bg-blue-500"
//           />
//           <StatsCard
//             icon={CheckCircle}
//             label="Available Slots"
//             value={availableSlots}
//             color="bg-green-500"
//           />
//           <StatsCard
//             icon={XCircle}
//             label="Booked Slots"
//             value={bookedSlots}
//             color="bg-red-500"
//           />
//           <StatsCard
//             icon={Calendar}
//             label="Unique Dates"
//             value={uniqueDatesCount}
//             color="bg-purple-500"
//           />
//         </div>
//       </div>

//       <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
//         <div className="flex flex-col gap-4">
//           <div className="w-full">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search slots by date, time, or product..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
//               />
//               {searchQuery && (
//                 <button
//                   type="button"
//                   onClick={() => setSearchQuery("")}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               )}
//             </div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//             <div className="w-full">
//               <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500 font-medium mb-2">
//                 <Filter className="w-4 h-4" />
//                 Filter by Date:
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {dates.slice(0, 5).map((date) => (
//                   <button
//                     key={date}
//                     onClick={() => setSelectedDate(date)}
//                     className={`px-3 py-1.5 rounded-md font-medium transition-colors text-sm ${
//                       selectedDate === date
//                         ? "bg-purple-600 text-white"
//                         : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                     }`}
//                   >
//                     {date}
//                   </button>
//                 ))}
//                 {dates.length > 5 && (
//                   <span className="text-xs text-gray-500 self-center">
//                     +{dates.length - 5} more
//                   </span>
//                 )}
//               </div>
//             </div>

//             <div className="w-full">
//               <div className="hidden lg:flex items-center gap-2 text-sm text-gray-500 font-medium mb-2">
//                 <Filter className="w-4 h-4" />
//                 Filter by Status:
//               </div>
//               <div className="flex flex-wrap gap-2">
//                 {statuses.map((status) => (
//                   <button
//                     key={status}
//                     onClick={() => setSelectedStatus(status)}
//                     className={`px-3 py-1.5 rounded-md font-medium transition-colors text-sm ${
//                       selectedStatus === status
//                         ? "bg-purple-600 text-white"
//                         : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                     }`}
//                   >
//                     {status}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-4 text-xs sm:text-sm text-gray-600">
//           Showing{" "}
//           <span className="font-semibold text-purple-600">
//             {slotsToDisplay.length}
//           </span>{" "}
//           of <span className="font-semibold">{filteredSlots.length}</span> slots
//           {hasMoreSlots && (
//             <span className="block sm:inline sm:ml-2 mt-1 sm:mt-0">
//               • {filteredSlots.length - visibleCount} more available
//             </span>
//           )}
//         </div>
//       </div>

//       {loading ? (
//         <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-purple-600"></div>
//           <p className="mt-4 text-gray-600">Loading slots...</p>
//         </div>
//       ) : filteredSlots.length === 0 ? (
//         <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
//           <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//           <h3 className="text-xl font-semibold text-gray-600 mb-2">
//             No slots found
//           </h3>
//           <p className="text-gray-500 mb-6">
//             {searchQuery || selectedDate !== "All" || selectedStatus !== "All"
//               ? "Try adjusting your search or filters"
//               : "Create your first slot to get started"}
//           </p>
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
//             {slotsToDisplay.map((slot) => (
//               <div
//                 key={slot.id}
//                 className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
//               >
//                 <div className="p-4 border-b border-gray-100">
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       <h3 className="font-bold text-gray-900 text-base sm:text-lg line-clamp-1">
//                         {slot.date}
//                       </h3>
//                       <p className="text-sm text-gray-600">
//                         {slot.startTime} - {slot.endTime}
//                       </p>
//                     </div>
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-semibold ${
//                         slot.isBooked
//                           ? "bg-red-100 text-red-800"
//                           : "bg-green-100 text-green-800"
//                       }`}
//                     >
//                       {slot.isBooked ? "BOOKED" : "AVAILABLE"}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="p-4 flex-1">
//                   <div className="space-y-3">
//                     {slot.product && (
//                       <div>
//                         <p className="text-xs text-gray-500 font-medium">Product ID</p>
//                         <p className="text-sm text-gray-800 font-mono truncate">
//                           {slot.product}
//                         </p>
//                       </div>
//                     )}

//                     {slot.bookedBy && (
//                       <div>
//                         <p className="text-xs text-gray-500 font-medium">Booked By</p>
//                         <p className="text-sm text-gray-800 truncate">
//                           {typeof slot.bookedBy === 'object'
//                             ? slot.bookedBy.name || slot.bookedBy.email || 'Unknown'
//                             : slot.bookedBy}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="p-4 border-t border-gray-100">
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleEdit(slot)}
//                       className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-xs sm:text-sm"
//                     >
//                       <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
//                       <span className="hidden xs:inline">Edit</span>
//                     </button>
//                     <button
//                       onClick={() => handleDeleteClick(slot)}
//                       className="flex-1 flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors font-medium text-xs sm:text-sm"
//                     >
//                       <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
//                       <span className="hidden xs:inline">Delete</span>
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {hasMoreSlots && (
//             <div className="mt-8 text-center">
//               <button
//                 onClick={handleLoadMore}
//                 className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
//               >
//                 <ChevronDown className="w-4 h-4" />
//                 Load More ({filteredSlots.length - visibleCount} remaining)
//               </button>
//             </div>
//           )}

//           {filteredSlots.length > 0 && !hasMoreSlots && (
//             <div className="mt-8 text-center">
//               <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg inline-flex items-center gap-2">
//                 <span className="text-lg">🎉</span>
//                 <span className="font-medium">
//                   All {filteredSlots.length} slots are displayed!
//                 </span>
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       <EditSlotModal
//         slot={editingSlot}
//         isOpen={showEditModal}
//         onClose={() => {
//           setShowEditModal(false);
//           setEditingSlot(null);
//         }}
//         onSave={handleSaveEdit}
//       />

//       <DeleteConfirmationModal
//         isOpen={showDeleteModal}
//         onClose={() => {
//           setShowDeleteModal(false);
//           setSlotToDelete(null);
//         }}
//         onConfirm={handleDeleteConfirm}
//         slot={slotToDelete}
//         loading={deleteLoading}
//       />
//     </>
//   );
// }

// function CreateSlotsTab() {
//   const [date, setDate] = useState('');
//   const [slots, setSlots] = useState([{ startTime: '', endTime: '' }]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [notification, setNotification] = useState(null);

//   const showNotification = (message, type = 'success') => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 4000);
//   };

//   const addSlot = () => {
//     setSlots([...slots, { startTime: '', endTime: '' }]);
//   };

//   const removeSlot = (index) => {
//     if (slots.length > 1) {
//       setSlots(slots.filter((_, i) => i !== index));
//     }
//   };

//   const updateSlot = (index, field, value) => {
//     const newSlots = [...slots];
//     newSlots[index][field] = value;
//     setSlots(newSlots);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     if (!date) {
//       setError('Please select a date');
//       showNotification('Please select a date', 'error');
//       return;
//     }

//     const validSlots = slots.filter(slot => slot.startTime && slot.endTime);

//     if (validSlots.length === 0) {
//       setError('Please add at least one valid time slot');
//       showNotification('Please add valid time slots', 'error');
//       return;
//     }

//     setLoading(true);
//     try {
//       await slotsApi.createSlots(date, validSlots);
//       showNotification('Slots created successfully!');

//       setDate('');
//       setSlots([{ startTime: '', endTime: '' }]);
//       setError(null);
//     } catch (error) {
//       console.error("Error creating slots:", error);
//       setError(error.message || 'Failed to create slots. Please try again.');
//       showNotification(error.message || 'Failed to create slots', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyTemplate = (templateSlots) => {
//     setSlots(templateSlots);
//   };

//   return (
//     <>
//       {notification && (
//         <Notification
//           message={notification.message}
//           type={notification.type}
//           onClose={() => setNotification(null)}
//         />
//       )}

//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
//           <div className="border-b border-gray-200 p-6">
//             <h2 className="text-xl font-bold text-gray-900">Create New Slots</h2>
//             <p className="text-gray-600 mt-1">
//               Select a date and add time slots for appointments
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="p-6 space-y-6">
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-gray-700">
//                 <div className="flex items-center gap-2 mb-1">
//                   <Calendar className="w-4 h-4" />
//                   Select Date
//                 </div>
//               </label>
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
//                 required
//                 min={new Date().toISOString().split('T')[0]}
//               />
//             </div>

//             <div className="space-y-4">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                   <Clock className="w-5 h-5" />
//                   Time Slots
//                 </h3>
//                 <button
//                   type="button"
//                   onClick={addSlot}
//                   className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
//                 >
//                   <Plus className="w-4 h-4" />
//                   Add Slot
//                 </button>
//               </div>

//               {error && (
//                 <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
//                   <div className="flex items-center gap-3">
//                     <AlertCircle className="w-5 h-5" />
//                     <p className="font-medium">{error}</p>
//                   </div>
//                 </div>
//               )}

//               <div className="space-y-4">
//                 {slots.map((slot, index) => (
//                   <div
//                     key={index}
//                     className="bg-gray-50 border border-gray-200 rounded-lg p-4"
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="flex-1">
//                         <label className="block text-xs font-medium text-gray-600 mb-1">
//                           Start Time
//                         </label>
//                         <input
//                           type="time"
//                           value={slot.startTime}
//                           onChange={(e) =>
//                             updateSlot(index, 'startTime', e.target.value)
//                           }
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
//                           required
//                         />
//                       </div>

//                       <div className="flex-1">
//                         <label className="block text-xs font-medium text-gray-600 mb-1">
//                           End Time
//                         </label>
//                         <input
//                           type="time"
//                           value={slot.endTime}
//                           onChange={(e) =>
//                             updateSlot(index, 'endTime', e.target.value)
//                           }
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
//                           required
//                         />
//                       </div>

//                       <div className="flex items-end">
//                         <button
//                           type="button"
//                           onClick={() => removeSlot(index)}
//                           disabled={slots.length === 1}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
//                 <h4 className="text-sm font-semibold text-gray-700 mb-3">
//                   Quick Templates
//                 </h4>
//                 <div className="grid grid-cols-2 gap-2">
//                   <button
//                     type="button"
//                     onClick={() => applyTemplate([
//                       { startTime: '09:00', endTime: '10:00' },
//                       { startTime: '10:00', endTime: '11:00' },
//                       { startTime: '11:00', endTime: '12:00' },
//                     ])}
//                     className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
//                   >
//                     Morning (9AM-12PM)
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => applyTemplate([
//                       { startTime: '14:00', endTime: '15:00' },
//                       { startTime: '15:00', endTime: '16:00' },
//                       { startTime: '16:00', endTime: '17:00' },
//                     ])}
//                     className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm"
//                   >
//                     Afternoon (2PM-5PM)
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => applyTemplate([
//                       { startTime: '09:00', endTime: '10:00' },
//                       { startTime: '10:00', endTime: '11:00' },
//                       { startTime: '11:00', endTime: '12:00' },
//                       { startTime: '14:00', endTime: '15:00' },
//                       { startTime: '15:00', endTime: '16:00' },
//                       { startTime: '16:00', endTime: '17:00' },
//                     ])}
//                     className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
//                   >
//                     Full Day
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setSlots([{ startTime: '', endTime: '' }])}
//                     className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
//                   >
//                     Clear All
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div className="flex gap-3 pt-6 border-t border-gray-200">
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
//               >
//                 {loading ? (
//                   <>
//                     <RefreshCw className="w-4 h-4 animate-spin" />
//                     Creating Slots...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle className="w-4 h-4" />
//                     Create Slots
//                   </>
//                 )}
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setDate('');
//                   setSlots([{ startTime: '', endTime: '' }]);
//                   setError(null);
//                 }}
//                 className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//               >
//                 Reset
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }

// function AppointmentsTab() {
//   const [appointments, setAppointments] = useState([]);
//   const [filteredAppointments, setFilteredAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedStatus, setSelectedStatus] = useState("All");
//   const [selectedAppointment, setSelectedAppointment] = useState(null);
//   const [showStatusModal, setShowStatusModal] = useState(false);
//   const [visibleCount, setVisibleCount] = useState(6);
//   const [notification, setNotification] = useState(null);

//   const statuses = ["All", "booked", "confirmed", "cancelled", "completed"];

//   useEffect(() => {
//     fetchAppointments();
//   }, []);

//   useEffect(() => {
//     filterAppointments();
//   }, [appointments, searchQuery, selectedStatus]);

//   const showNotification = (message, type = 'success') => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 4000);
//   };

//   const fetchAppointments = async () => {
//     try {
//       setLoading(true);
//       const data = await appointmentsApi.getAllAppointments();

//       const appointmentsArray = Array.isArray(data) ? data : data.appointments || [];
//       setAppointments(appointmentsArray);
//       showNotification('Appointments loaded successfully');
//     } catch (error) {
//       console.error("Error fetching appointments:", error);
//       showNotification("Failed to load appointments", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterAppointments = () => {
//     let filtered = appointments;

//     if (selectedStatus !== "All") {
//       filtered = filtered.filter(app => app.status === selectedStatus);
//     }

//     if (searchQuery) {
//       filtered = filtered.filter(
//         app =>
//           app.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           app.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           app.customerPhone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           app.date?.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     setFilteredAppointments(filtered);
//   };

//   const handleUpdateStatus = async (newStatus) => {
//     if (!selectedAppointment) return;

//     try {
//       await appointmentsApi.updateAppointmentStatus(selectedAppointment._id || selectedAppointment.id, newStatus);

//       setAppointments(prev => prev.map(app =>
//         app._id === selectedAppointment._id ? { ...app, status: newStatus } : app
//       ));

//       setShowStatusModal(false);
//       setSelectedAppointment(null);
//       showNotification(`Appointment status updated to ${newStatus}`);
//     } catch (error) {
//       showNotification(error.message, "error");
//     }
//   };

//   const handleStatusChangeClick = (appointment) => {
//     setSelectedAppointment(appointment);
//     setShowStatusModal(true);
//   };

//   const handleLoadMore = () => {
//     setVisibleCount(prev => prev + 6);
//   };

//   // Calculate stats
//   const totalAppointments = appointments.length;
//   const bookedCount = appointments.filter(app => app.status === 'booked').length;
//   const confirmedCount = appointments.filter(app => app.status === 'confirmed').length;
//   const cancelledCount = appointments.filter(app => app.status === 'cancelled').length;
//   const completedCount = appointments.filter(app => app.status === 'completed').length;

//   // Get appointments to display
//   const appointmentsToDisplay = filteredAppointments.slice(0, visibleCount);
//   const hasMoreAppointments = visibleCount < filteredAppointments.length;

//   return (
//     <>
//       {notification && (
//         <Notification
//           message={notification.message}
//           type={notification.type}
//           onClose={() => setNotification(null)}
//         />
//       )}

//       <div className="mb-8">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//           <StatsCard
//             icon={Calendar}
//             label="Total Appointments"
//             value={totalAppointments}
//             color="bg-blue-500"
//           />
//           <StatsCard
//             icon={CheckCircle}
//             label="Booked"
//             value={bookedCount}
//             color="bg-green-500"
//           />
//           <StatsCard
//             icon={AlertCircle}
//             label="Confirmed"
//             value={confirmedCount}
//             color="bg-yellow-500"
//           />
//           <StatsCard
//             icon={XCircle}
//             label="Cancelled"
//             value={cancelledCount}
//             color="bg-red-500"
//           />
//         </div>
//       </div>

//       <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
//         <div className="flex flex-col gap-4">
//           <div className="w-full">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search appointments..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//               />
//               {searchQuery && (
//                 <button
//                   type="button"
//                   onClick={() => setSearchQuery("")}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               )}
//             </div>
//           </div>

//           <div className="w-full">
//             <div className="flex flex-wrap gap-2">
//               {statuses.map((status) => (
//                 <button
//                   key={status}
//                   onClick={() => setSelectedStatus(status)}
//                   className={`px-3 py-1.5 rounded-md font-medium transition-colors text-sm ${
//                     selectedStatus === status
//                       ? "bg-blue-600 text-white"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   {status.charAt(0).toUpperCase() + status.slice(1)}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         <div className="mt-4 text-xs sm:text-sm text-gray-600">
//           Showing{" "}
//           <span className="font-semibold text-blue-600">
//             {appointmentsToDisplay.length}
//           </span>{" "}
//           of <span className="font-semibold">{filteredAppointments.length}</span>{" "}
//           appointments
//           {hasMoreAppointments && (
//             <span className="block sm:inline sm:ml-2 mt-1 sm:mt-0">
//               • {filteredAppointments.length - visibleCount} more available
//             </span>
//           )}
//         </div>
//       </div>

//       {loading ? (
//         <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
//           <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-blue-600"></div>
//           <p className="mt-4 text-gray-600">Loading appointments...</p>
//         </div>
//       ) : filteredAppointments.length === 0 ? (
//         <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
//           <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//           <h3 className="text-xl font-semibold text-gray-600 mb-2">
//             No appointments found
//           </h3>
//           <p className="text-gray-500 mb-6">
//             {searchQuery || selectedStatus !== "All"
//               ? "Try adjusting your search or filters"
//               : "No appointments scheduled yet"}
//           </p>
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
//             {appointmentsToDisplay.map((appointment) => (
//               <div
//                 key={appointment._id || appointment.id}
//                 className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full"
//               >
//                 <div className="p-4 border-b border-gray-100">
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       <h3 className="font-bold text-gray-900 text-base sm:text-lg line-clamp-1">
//                         {appointment.customerName || 'Customer'}
//                       </h3>
//                       <p className="text-sm text-gray-600">{appointment.customerEmail}</p>
//                     </div>
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${
//                         appointment.status === 'booked' ? 'bg-blue-100 text-blue-800' :
//                         appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
//                         appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
//                         'bg-purple-100 text-purple-800'
//                       }`}
//                     >
//                       {appointment.status}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="p-4 flex-1">
//                   <div className="space-y-3">
//                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                       <Calendar className="w-4 h-4" />
//                       <span>{appointment.date}</span>
//                     </div>
//                     <div className="flex items-center gap-2 text-sm text-gray-600">
//                       <Clock className="w-4 h-4" />
//                       <span>{appointment.time}</span>
//                     </div>
//                     {appointment.customerPhone && (
//                       <div className="flex items-center gap-2 text-sm text-gray-600">
//                         <Phone className="w-4 h-4" />
//                         <span>{appointment.customerPhone}</span>
//                       </div>
//                     )}
//                     {appointment.service?.name && (
//                       <div className="flex items-center gap-2 text-sm text-gray-600">
//                         <Package className="w-4 h-4" />
//                         <span>{appointment.service.name}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="p-4 border-t border-gray-100">
//                   <button
//                     onClick={() => handleStatusChangeClick(appointment)}
//                     className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors font-medium text-sm"
//                   >
//                     <Edit2 className="w-4 h-4" />
//                     Update Status
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {hasMoreAppointments && (
//             <div className="mt-8 text-center">
//               <button
//                 onClick={handleLoadMore}
//                 className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//               >
//                 <ChevronDown className="w-4 h-4" />
//                 Load More ({filteredAppointments.length - visibleCount} remaining)
//               </button>
//             </div>
//           )}

//           {filteredAppointments.length > 0 && !hasMoreAppointments && (
//             <div className="mt-8 text-center">
//               <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg inline-flex items-center gap-2">
//                 <span className="text-lg">🎉</span>
//                 <span className="font-medium">
//                   All {filteredAppointments.length} appointments are displayed!
//                 </span>
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       <StatusModal
//         appointment={selectedAppointment}
//         isOpen={showStatusModal}
//         onClose={() => {
//           setShowStatusModal(false);
//           setSelectedAppointment(null);
//         }}
//         onConfirm={handleUpdateStatus}
//       />
//     </>
//   );
// }

// // ==================== Main Slots Component ====================
// const Slots = () => {
//   const [activeTab, setActiveTab] = useState("manage-slots");
//   const [showCreateModal, setShowCreateModal] = useState(false);

//   const tabs = [
//     { id: "manage-slots", label: "Manage Slots", icon: Clock },
//     { id: "create-slots", label: "Create Slots", icon: Plus },
//     { id: "appointments", label: "Appointments", icon: Calendar },
//   ];

//   const handleCreateSuccess = () => {
//     // Refresh slots tab when slots are created
//     setActiveTab("manage-slots");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
//             <div className="flex items-center gap-3 flex-1 min-w-0">
//               <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0">
//                 <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
//               </div>
//               <div className="min-w-0 flex-1">
//                 <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
//                   Slot Management
//                 </h1>
//                 <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 truncate">
//                   Manage appointments and time slots
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0 w-full sm:w-auto">
//               <button
//                 onClick={() => {
//                   if (activeTab === "manage-slots") {
//                     // Refresh slots
//                     window.location.reload();
//                   }
//                 }}
//                 className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 hover:text-gray-900 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors text-sm sm:text-base whitespace-nowrap"
//               >
//                 <RefreshCw className="w-4 h-4 flex-shrink-0" />
//                 <span className="hidden xs:inline">Refresh</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Tab Navigation */}
//         <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
//           <div className="flex overflow-x-auto">
//             {tabs.map((tab) => {
//               const Icon = tab.icon;
//               return (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`flex-1 min-w-[120px] sm:min-w-[150px] px-4 py-3 sm:py-4 font-medium text-sm sm:text-base transition-colors flex items-center justify-center gap-2 ${
//                     activeTab === tab.id
//                       ? "bg-purple-50 text-purple-700 border-b-2 border-purple-600"
//                       : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
//                   }`}
//                 >
//                   <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
//                   <span>{tab.label}</span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Tab Content */}
//         <div className="mt-6">
//           {activeTab === "manage-slots" && <ManageSlotsTab />}
//           {activeTab === "create-slots" && <CreateSlotsTab />}
//           {activeTab === "appointments" && <AppointmentsTab />}
//         </div>
//       </div>

//       {/* Create Slots Modal (alternative to tab) */}
//       <CreateSlotsModal
//         isOpen={showCreateModal}
//         onClose={() => setShowCreateModal(false)}
//         onCreateSuccess={handleCreateSuccess}
//         onError={(error) => console.error(error)}
//       />
//     </div>
//   );
// };

// export default Slots;
import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Clock, Calendar, PlusCircle, ListChecks } from "lucide-react";

const Slots = () => {
  const navItems = [
    {
      label: "Manage Slots",
      path: "/slots/manage",
      icon: ListChecks,
    },
    {
      label: "Appointments",
      path: "/slots/appointments",
      icon: Calendar,
    },
    {
      label: "Create Slots",
      path: "/slots/create",
      icon: PlusCircle,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tabs Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <nav className="flex gap-3 sm:gap-6 overflow-x-auto scrollbar-hide">
            {navItems.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end
                className={({ isActive }) =>
                  `flex items-center gap-1.5 sm:gap-2 py-3 sm:py-4 px-2 sm:px-0 border-b-2 font-medium transition-colors whitespace-nowrap text-sm sm:text-base ${
                    isActive
                      ? "border-purple-600 text-purple-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`
                }
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="hidden xs:inline sm:inline">{label}</span>
                <span className="xs:hidden sm:hidden">
                  {label.split(" ")[0]}
                </span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Child Pages Render Here */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Slots;