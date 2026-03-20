$(document).ready(function() {
    let appointments = StorageHelper.get('appointments');
    let patients = StorageHelper.get('patients');
    let doctors = StorageHelper.get('doctors');
    
    const appointmentModal = new bootstrap.Modal(document.getElementById('appointmentModal'));
    const statusModal = new bootstrap.Modal(document.getElementById('statusModal'));

    // Min date for appointment is today
    const today = new Date().toISOString().split('T')[0];
    $('#apptDate').attr('min', today);

    // Populate Patients
    const patSelect = $('#apptPatient');
    patients.forEach(p => patSelect.append(`<option value="${p.id}">${p.name} (${p.id})</option>`));

    // Populate Doctors
    const docSelect = $('#apptDoctor');
    doctors.forEach(d => docSelect.append(`<option value="${d.id}">Dr. ${d.name} (${d.specialization})</option>`));

    // Populate Time Slots
    const timeSelect = $('#apptTimeSlot');
    TIME_SLOTS.forEach(t => timeSelect.append(`<option value="${t}">${t}</option>`));

    function renderAppointments(data) {
        const tbody = $('#appointmentsTable tbody');
        tbody.empty();

        if (data.length === 0) {
            $('#noDataFound').show();
            $('#appointmentsTable').hide();
        } else {
            $('#noDataFound').hide();
            $('#appointmentsTable').show();
            
            data.forEach(a => {
                const patName = patients.find(p => p.id === a.patientId)?.name || 'Unknown';
                const docName = doctors.find(d => d.id === a.doctorId)?.name || 'Unknown';
                const statusClass = 'badge-' + a.status.toLowerCase();
                
                tbody.append(`
                    <tr>
                        <td class="text-muted fw-medium">${a.id}</td>
                        <td class="fw-medium">${patName}</td>
                        <td>${docName}</td>
                        <td>${a.date}</td>
                        <td>${a.time}</td>
                        <td>
                            <span class="badge ${statusClass} status-badge-click" data-id="${a.id}" style="cursor:pointer" title="Click to change status">
                                ${a.status} <i class="fas fa-caret-down ms-1 opacity-50"></i>
                            </span>
                        </td>
                        <td class="text-end">
                            <button class="btn btn-light btn-action text-primary edit-btn" data-id="${a.id}"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-light btn-action text-danger delete-btn" data-id="${a.id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `);
            });
        }
    }

    renderAppointments(appointments);

    // Filter functionality
    function applyFilters() {
        const dateVal = $('#filterDate').val();
        const statusVal = $('#filterStatus').val();

        let filtered = appointments;
        if (dateVal) {
            filtered = filtered.filter(a => a.date === dateVal);
        }
        if (statusVal) {
            filtered = filtered.filter(a => a.status === statusVal);
        }
        renderAppointments(filtered);
    }

    $('#filterDate, #filterStatus').on('change', applyFilters);
    
    $('#clearFiltersBtn').click(function() {
        $('#filterDate').val('');
        $('#filterStatus').val('');
        renderAppointments(appointments);
    });

    // Open Modal for Add
    $('#bookAppointmentBtn').click(function() {
        resetForm('#appointmentForm');
        $('#editAppointmentId').val('');
        $('#appointmentModalTitle').text('Book Appointment');
        $('#bookErrorAlert').hide();
        $('#apptStatus').val('Booked'); // Default explicitly
        appointmentModal.show();
    });

    // Save Appointment
    $('#saveAppointmentBtn').click(function() {
        $('#bookErrorAlert').hide();
        const patientId = $('#apptPatient').val();
        const doctorId = $('#apptDoctor').val();
        const date = $('#apptDate').val();
        const time = $('#apptTimeSlot').val();
        const status = $('#apptStatus').val();

        let isValid = true;
        isValid = validateField('#apptPatient', patientId === '', "Select a patient") && isValid;
        isValid = validateField('#apptDoctor', doctorId === '', "Select a doctor") && isValid;
        isValid = validateField('#apptDate', date === '', "Select a date") && isValid;
        isValid = validateField('#apptTimeSlot', time === '', "Select a time slot") && isValid;
        
        if (!isValid) return;

        const editId = $('#editAppointmentId').val();

        // Prevent duplicate time-slot booking for the same doctor
        const duplicate = appointments.find(a => 
            a.doctorId === doctorId && 
            a.date === date && 
            a.time === time && 
            a.status !== 'Cancelled' && 
            a.id !== editId
        );

        if (duplicate) {
            $('#bookErrorAlert').text("This doctor is already booked for the selected date and time.").show();
            return;
        }

        const aptData = {
            id: editId ? editId : StorageHelper.generateId('APT'),
            patientId,
            doctorId,
            date,
            time,
            status
        };

        if (editId) {
            const index = appointments.findIndex(a => a.id === editId);
            if (index !== -1) appointments[index] = aptData;
        } else {
            appointments.push(aptData);
        }

        StorageHelper.set('appointments', appointments);
        
        // Re-apply filters to refresh the view correctly
        appointments = StorageHelper.get('appointments');
        applyFilters(); 
        
        appointmentModal.hide();
    });

    // Edit Appointment
    $(document).on('click', '.edit-btn', function() {
        const id = $(this).data('id');
        const apt = appointments.find(a => a.id === id);
        
        if (apt) {
            resetForm('#appointmentForm');
            $('#bookErrorAlert').hide();
            $('#editAppointmentId').val(apt.id);
            $('#apptPatient').val(apt.patientId);
            $('#apptDoctor').val(apt.doctorId);
            $('#apptDate').val(apt.date);
            $('#apptTimeSlot').val(apt.time);
            $('#apptStatus').val(apt.status);
            
            $('#appointmentModalTitle').text('Edit Appointment');
            appointmentModal.show();
        }
    });

    // Status quick change
    $(document).on('click', '.status-badge-click', function() {
        const id = $(this).data('id');
        const apt = appointments.find(a => a.id === id);
        
        if (apt) {
            $('#statusUpdateId').val(apt.id);
            $('#quickStatusSelect').val(apt.status);
            statusModal.show();
        }
    });

    $('#saveStatusBtn').click(function() {
        const id = $('#statusUpdateId').val();
        const newStatus = $('#quickStatusSelect').val();
        
        const index = appointments.findIndex(a => a.id === id);
        if (index !== -1) {
            appointments[index].status = newStatus;
            StorageHelper.set('appointments', appointments);
            
            // Allow checking for slot collision if changed back from cancelled?
            // Optional enhancement: if changing back to booked, check collision. We skip for now to keep simple logic.
            
            appointments = StorageHelper.get('appointments');
            applyFilters();
            statusModal.hide();
        }
    });

    // Delete Appointment
    $(document).on('click', '.delete-btn', function() {
        const id = $(this).data('id');
        
        showDeleteConfirmation("Are you sure you want to delete this appointment?", function() {
            appointments = appointments.filter(a => a.id !== id);
            StorageHelper.set('appointments', appointments);
            applyFilters();
        });
    });
});
