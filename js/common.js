// Common utilitarian and UI scripts
$(document).ready(function() {
    // Delete Confirmation Setup
    $('body').append(`
        <div class="modal fade" id="deleteConfirmModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header border-0 pb-0">
                        <h5 class="modal-title text-danger"><i class="fas fa-exclamation-triangle me-2"></i>Confirm Delete</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body py-4">
                        <p class="mb-0" id="deleteConfirmText">Are you sure you want to delete this record? This action cannot be undone.</p>
                    </div>
                    <div class="modal-footer border-0 pt-0">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    `);

    window.showDeleteConfirmation = function(message, onConfirm) {
        $('#deleteConfirmText').text(message);
        const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
        modal.show();

        $('#confirmDeleteBtn').off('click').on('click', function() {
            onConfirm();
            modal.hide();
        });
    };

    // Generic form reset and validation clear
    window.resetForm = function(formId) {
        $(formId).trigger("reset");
        $(formId).find('.is-invalid').removeClass('is-invalid');
    };

    // Validation helper
    window.validateField = function(selector, condition, errorMessage) {
        const el = $(selector);
        if (condition) {
            el.addClass('is-invalid');
            el.siblings('.error-msg').text(errorMessage);
            return false;
        } else {
            el.removeClass('is-invalid');
            return true;
        }
    }
});
