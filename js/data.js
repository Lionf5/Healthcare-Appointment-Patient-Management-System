const SPECIALIZATIONS = [
    'Cardiologist',
    'Dermatologist',
    'Endocrinologist',
    'General Physician',
    'Neurologist',
    'Orthopedist',
    'Pediatrician',
    'Psychiatrist'
];

const TIME_SLOTS = [
    '09:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '01:00 PM - 02:00 PM',
    '02:00 PM - 03:00 PM',
    '03:00 PM - 04:00 PM',
    '04:00 PM - 05:00 PM'
];

const APPOINTMENT_STATUSES = {
    BOOKED: 'Booked',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled'
};

const StorageHelper = {
    get: function(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },
    set: function(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },
    generateId: function(prefix) {
        return prefix + Math.floor(10000 + Math.random() * 90000);
    }
};

// Initialize default empty arrays if nothing exists
$(document).ready(function() {
    if (!localStorage.getItem('patients')) StorageHelper.set('patients', []);
    if (!localStorage.getItem('doctors')) StorageHelper.set('doctors', []);
    if (!localStorage.getItem('appointments')) StorageHelper.set('appointments', []);
});
