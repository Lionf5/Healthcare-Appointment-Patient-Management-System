$(document).ready(function() {
    let doctors = StorageHelper.get('doctors');
    const doctorModal = new bootstrap.Modal(document.getElementById('doctorModal'));

    // Populate dropdowns from constants in data.js
    const specSelect = $('#doctorSpecialization');
    SPECIALIZATIONS.forEach(s => specSelect.append(`<option value="${s}">${s}</option>`));

    const timeSelect = $('#doctorTimeSlot');
    TIME_SLOTS.forEach(t => timeSelect.append(`<option value="${t}">${t}</option>`));

    function renderDoctors(data) {
        const tbody = $('#doctorsTable tbody');
        tbody.empty();

        if (data.length === 0) {
            $('#noDataFound').show();
            $('#doctorsTable').hide();
        } else {
            $('#noDataFound').hide();
            $('#doctorsTable').show();
            
            data.forEach(d => {
                tbody.append(`
                    <tr>
                        <td class="text-muted fw-medium">${d.id}</td>
                        <td class="fw-bold">${d.name}</td>
                        <td>${d.specialization}</td>
                        <td><span class="badge badge-booked">${d.timeSlot}</span></td>
                        <td class="text-end">
                            <button class="btn btn-light btn-action text-primary edit-btn" data-id="${d.id}"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-light btn-action text-danger delete-btn" data-id="${d.id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `);
            });
        }
    }

    renderDoctors(doctors);

    // Search functionality
    $('#searchInput').on('keyup', function() {
        const value = $(this).val().toLowerCase();
        const filtered = doctors.filter(d => 
            d.name.toLowerCase().includes(value) || 
            d.specialization.toLowerCase().includes(value)
        );
        renderDoctors(filtered);
    });

    // Open Modal for Add
    $('#addDoctorBtn').click(function() {
        resetForm('#doctorForm');
        $('#editDoctorId').val('');
        $('#doctorModalTitle').text('Add New Doctor');
        doctorModal.show();
    });

    // Validate and Save Doctor
    $('#saveDoctorBtn').click(function() {
        const name = $('#doctorName').val().trim();
        const specialization = $('#doctorSpecialization').val();
        const timeSlot = $('#doctorTimeSlot').val();

        let isValid = true;
        
        isValid = validateField('#doctorName', name === '', "Name is required") && isValid;
        isValid = validateField('#doctorSpecialization', specialization === '', "Specialization is required") && isValid;
        isValid = validateField('#doctorTimeSlot', timeSlot === '', "Time slot is required") && isValid;
        
        if (!isValid) return;

        const editId = $('#editDoctorId').val();
        const doctorData = {
            id: editId ? editId : StorageHelper.generateId('DR'),
            name,
            specialization,
            timeSlot
        };

        if (editId) {
            const index = doctors.findIndex(d => d.id === editId);
            if (index !== -1) doctors[index] = doctorData;
        } else {
            doctors.push(doctorData);
        }

        StorageHelper.set('doctors', doctors);
        renderDoctors(doctors);
        doctorModal.hide();
    });

    // Edit Doctor
    $(document).on('click', '.edit-btn', function() {
        const id = $(this).data('id');
        const doc = doctors.find(d => d.id === id);
        
        if (doc) {
            resetForm('#doctorForm');
            $('#editDoctorId').val(doc.id);
            $('#doctorName').val(doc.name);
            $('#doctorSpecialization').val(doc.specialization);
            $('#doctorTimeSlot').val(doc.timeSlot);
            
            $('#doctorModalTitle').text('Edit Doctor');
            doctorModal.show();
        }
    });

    // Delete Doctor
    $(document).on('click', '.delete-btn', function() {
        const id = $(this).data('id');
        
        // Ensure no appointments exist for this doctor
        const appointments = StorageHelper.get('appointments');
        const hasAppointments = appointments.some(a => a.doctorId === id);
        
        if (hasAppointments) {
            alert('Cannot delete this doctor because there are associated appointments.');
            return;
        }

        showDeleteConfirmation("Are you sure you want to delete this doctor?", function() {
            doctors = doctors.filter(d => d.id !== id);
            StorageHelper.set('doctors', doctors);
            renderDoctors(doctors);
            $('#searchInput').val(''); // Clear search on delete
        });
    });
});
