$(document).ready(function() {
    let patients = StorageHelper.get('patients');
    const patientModal = new bootstrap.Modal(document.getElementById('patientModal'));

    function renderPatients(data) {
        const tbody = $('#patientsTable tbody');
        tbody.empty();

        if (data.length === 0) {
            $('#noDataFound').show();
            $('#patientsTable').hide();
        } else {
            $('#noDataFound').hide();
            $('#patientsTable').show();
            
            data.forEach(p => {
                tbody.append(`
                    <tr>
                        <td class="text-muted fw-medium">${p.id}</td>
                        <td class="fw-bold">${p.name}</td>
                        <td>${p.age} yrs • ${p.gender}</td>
                        <td>
                            <div><i class="fas fa-phone alt text-muted me-1"></i> ${p.phone}</div>
                            <div class="text-muted small">${p.email || 'No email provided'}</div>
                        </td>
                        <td class="text-muted small" style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${p.notes || '-'}
                        </td>
                        <td class="text-end">
                            <button class="btn btn-light btn-action text-primary edit-btn" data-id="${p.id}"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-light btn-action text-danger delete-btn" data-id="${p.id}"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `);
            });
        }
    }

    renderPatients(patients);

    // Search functionality
    $('#searchInput').on('keyup', function() {
        const value = $(this).val().toLowerCase();
        const filtered = patients.filter(p => 
            p.name.toLowerCase().includes(value) || 
            p.phone.includes(value)
        );
        renderPatients(filtered);
    });

    // Open Modal for Add
    $('#addPatientBtn').click(function() {
        resetForm('#patientForm');
        $('#editPatientId').val('');
        $('#patientModalTitle').text('Add New Patient');
        patientModal.show();
    });

    // Validate and Save
    $('#savePatientBtn').click(function() {
        const name = $('#patientName').val().trim();
        const age = $('#patientAge').val().trim();
        const gender = $('#patientGender').val();
        const phone = $('#patientPhone').val().trim();
        const email = $('#patientEmail').val().trim();
        const notes = $('#patientNotes').val().trim();

        let isValid = true;
        
        isValid = validateField('#patientName', name === '', "Name is required") && isValid;
        isValid = validateField('#patientAge', age === '' || isNaN(age) || age <= 0, "Valid age required") && isValid;
        isValid = validateField('#patientGender', gender === '', "Gender is required") && isValid;
        
        const phoneRegex = /^[0-9]{10}$/; // Simple 10 digit check
        isValid = validateField('#patientPhone', !phoneRegex.test(phone), "Valid 10-digit phone number required") && isValid;
        
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = validateField('#patientEmail', !emailRegex.test(email), "Valid email required") && isValid;
        } else {
            validateField('#patientEmail', false, "");
        }

        if (!isValid) return;

        const editId = $('#editPatientId').val();
        const patientData = {
            id: editId ? editId : StorageHelper.generateId('PT'),
            name,
            age,
            gender,
            phone,
            email,
            notes
        };

        if (editId) {
            const index = patients.findIndex(p => p.id === editId);
            if (index !== -1) patients[index] = patientData;
        } else {
            patients.push(patientData);
        }

        StorageHelper.set('patients', patients);
        renderPatients(patients);
        patientModal.hide();
    });

    // Edit Patient
    $(document).on('click', '.edit-btn', function() {
        const id = $(this).data('id');
        const patient = patients.find(p => p.id === id);
        
        if (patient) {
            resetForm('#patientForm');
            $('#editPatientId').val(patient.id);
            $('#patientName').val(patient.name);
            $('#patientAge').val(patient.age);
            $('#patientGender').val(patient.gender);
            $('#patientPhone').val(patient.phone);
            $('#patientEmail').val(patient.email);
            $('#patientNotes').val(patient.notes);
            
            $('#patientModalTitle').text('Edit Patient');
            patientModal.show();
        }
    });

    // Delete Patient
    $(document).on('click', '.delete-btn', function() {
        const id = $(this).data('id');
        
        // Ensure no appointments exist for this patient
        const appointments = StorageHelper.get('appointments');
        const hasAppointments = appointments.some(a => a.patientId === id);
        
        if (hasAppointments) {
            alert('Cannot delete this patient because there are associated appointments.');
            return;
        }

        showDeleteConfirmation("Are you sure you want to delete this patient?", function() {
            patients = patients.filter(p => p.id !== id);
            StorageHelper.set('patients', patients);
            renderPatients(patients);
            $('#searchInput').val(''); // Clear search on delete
        });
    });
});
