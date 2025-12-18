// src/utils/sweetAlertConfig.js
import Swal from 'sweetalert2';

// Small toast notification for login success
const showLoginSuccess = async (username = 'Admin') => {
    return Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: `Welcome back, ${username}!`,
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        background: '#10B981',
        color: 'white',
        customClass: {
            popup: 'swal2-toast',
            title: 'text-white'
        }
    });
};

// Small error toast
const showLoginError = async (message = 'Invalid credentials') => {
    return Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
        background: '#EF4444',
        color: 'white',
        customClass: {
            popup: 'swal2-toast',
            title: 'text-white'
        }
    });
};

// Regular modals for other purposes
const showSuccess = async (title, text) => {
    return Swal.fire({
        icon: 'success',
        title: title || 'Success!',
        text: text || 'Operation completed successfully.',
        confirmButtonColor: '#7C3AED',
        timer: 1000,
        timerProgressBar: true,
    });
};

const showError = async (title, text) => {
    return Swal.fire({
        icon: 'error',
        title: title || 'Error!',
        text: text || 'An error occurred. Please try again.',
        confirmButtonColor: '#DC2626',
    });
};

const showConfirm = async (title, text, confirmButtonText = 'Yes') => {
    return Swal.fire({
        title: title || 'Are you sure?',
        text: text || "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#7C3AED',
        cancelButtonColor: '#6B7280',
        confirmButtonText: confirmButtonText,
        cancelButtonText: 'Cancel'
    });
};

const academic_years = [
    { year: '2024-2025' },
    { year: '2025-2026' },
    { year: '2026-2027' },
    { year: '2027-2028' },
    { year: '2028-2029' },
    { year: '2029-2030' },
    { year: '2030-2031' },
    { year: '2031-2032' },
    { year: '2032-2033' },
    { year: '2033-2034' },
    { year: '2034-2035' },
    { year: '2035-2036' },
    { year: '2036-2037' },
    { year: '2037-2038' },
    { year: '2038-2039' },
    { year: '2039-2040' },
    { year: '2040-2041' },
    { year: '2041-2042' },
    { year: '2042-2043' },
    { year: '2043-2044' },
];

export { 
    showLoginSuccess, 
    showLoginError, 
    showSuccess, 
    showError, 
    showConfirm, 
    academic_years 
};