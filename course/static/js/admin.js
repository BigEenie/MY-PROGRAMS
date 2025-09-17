/**
 * University of Ibadan Course Materials Portal - Admin Panel JavaScript
 * Handles admin panel functionality, faculty/department management
 */

// Global admin state
let currentMaterialsData = null;
let currentSection = 'settings';

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
});

/**
 * Initialize admin panel
 */
function initializeAdminPanel() {
    // Load materials data if available
    if (window.materialsData) {
        currentMaterialsData = JSON.parse(JSON.stringify(window.materialsData));
    }
    
    // Initialize color inputs
    initializeColorInputs();
    
    // Initialize section switching
    initializeSectionSwitching();
    
    // Initialize modals
    initializeModals();
    
    // Initialize faculty search
    initializeFacultySearch();
    
    // Auto-hide flash messages
    setTimeout(hideFlashMessages, 5000);
    
    console.log('Admin panel initialized');
}

/**
 * Initialize color inputs
 */
function initializeColorInputs() {
    const colorInputs = document.querySelectorAll('input[type="color"]');
    colorInputs.forEach(colorInput => {
        const textInput = document.getElementById(colorInput.id + '-text');
        if (textInput) {
            // Update text when color changes
            colorInput.addEventListener('input', function() {
                textInput.value = this.value;
            });
            
            // Update color when text changes
            textInput.addEventListener('input', function() {
                if (this.value.match(/^#[0-9A-F]{6}$/i)) {
                    colorInput.value = this.value;
                }
            });
        }
    });
}

/**
 * Initialize section switching
 */
function initializeSectionSwitching() {
    // Section switching is handled by the showSection function
    // which is called by the quick action buttons
}

/**
 * Show specific admin section
 */
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section-content');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show target section
    const targetSection = document.getElementById(sectionName + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionName;
    }
    
    // Update active button
    const buttons = document.querySelectorAll('.action-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Scroll to top of admin section
    Utils.scrollToElement('.admin-section', 80);
}

/**
 * Initialize modals
 */
function initializeModals() {
    // Close modals when clicking outside
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this);
            }
        });
    });
    
    // Close modals with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });
}

/**
 * Initialize faculty search
 */
function initializeFacultySearch() {
    const searchInput = document.getElementById('faculty-search');
    if (searchInput) {
        const debouncedSearch = Utils.debounce(filterFaculties, 300);
        searchInput.addEventListener('input', function() {
            debouncedSearch(this.value);
        });
    }
}

/**
 * Filter faculties based on search
 */
function filterFaculties(query) {
    const facultyItems = document.querySelectorAll('.faculty-item');
    const searchTerm = query.toLowerCase();
    
    facultyItems.forEach(item => {
        const facultyName = item.querySelector('h4').textContent.toLowerCase();
        const facultyDesc = item.querySelector('p').textContent.toLowerCase();
        
        if (facultyName.includes(searchTerm) || facultyDesc.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

/**
 * Add new faculty
 */
function addFaculty() {
    const modal = document.getElementById('faculty-modal');
    const form = document.getElementById('faculty-form');
    const modalTitle = document.getElementById('faculty-modal-title');
    
    if (modal && form && modalTitle) {
        // Reset form
        form.reset();
        document.getElementById('faculty-id').value = '';
        modalTitle.textContent = 'Add New Faculty';
        
        // Show modal
        showModal(modal);
    }
}

/**
 * Edit faculty
 */
function editFaculty(facultyId) {
    if (!currentMaterialsData) {
        Utils.showNotification('Faculty data not available', 'error');
        return;
    }
    
    const faculty = currentMaterialsData.faculties.find(f => f.id === facultyId);
    if (!faculty) {
        Utils.showNotification('Faculty not found', 'error');
        return;
    }
    
    const modal = document.getElementById('faculty-modal');
    const modalTitle = document.getElementById('faculty-modal-title');
    
    if (modal && modalTitle) {
        // Fill form with faculty data
        document.getElementById('faculty-id').value = faculty.id;
        document.getElementById('faculty-name').value = faculty.name;
        document.getElementById('faculty-description').value = faculty.description;
        document.getElementById('faculty-icon').value = faculty.icon;
        
        modalTitle.textContent = 'Edit Faculty';
        
        // Show modal
        showModal(modal);
    }
}

/**
 * Save faculty
 */
function saveFaculty() {
    const form = document.getElementById('faculty-form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const facultyId = document.getElementById('faculty-id').value;
    const facultyData = {
        id: facultyId || generateFacultyId(),
        name: document.getElementById('faculty-name').value,
        description: document.getElementById('faculty-description').value,
        icon: document.getElementById('faculty-icon').value,
        departments: []
    };
    
    if (!currentMaterialsData) {
        currentMaterialsData = { faculties: [] };
    }
    
    if (facultyId) {
        // Update existing faculty
        const index = currentMaterialsData.faculties.findIndex(f => f.id === facultyId);
        if (index !== -1) {
            // Preserve existing departments
            facultyData.departments = currentMaterialsData.faculties[index].departments;
            currentMaterialsData.faculties[index] = facultyData;
        }
    } else {
        // Add new faculty
        currentMaterialsData.faculties.push(facultyData);
    }
    
    // Save to server
    saveMaterialsData();
    
    // Close modal
    closeFacultyModal();
    
    Utils.showNotification('Faculty saved successfully!', 'success');
}

/**
 * Delete faculty
 */
function deleteFaculty(facultyId) {
    if (!confirm('Are you sure you want to delete this faculty? This will also delete all its departments.')) {
        return;
    }
    
    if (!currentMaterialsData) {
        Utils.showNotification('Faculty data not available', 'error');
        return;
    }
    
    const index = currentMaterialsData.faculties.findIndex(f => f.id === facultyId);
    if (index !== -1) {
        currentMaterialsData.faculties.splice(index, 1);
        saveMaterialsData();
        
        // Remove from DOM
        const facultyItem = document.querySelector(`[data-faculty-id="${facultyId}"]`);
        if (facultyItem) {
            facultyItem.remove();
        }
        
        Utils.showNotification('Faculty deleted successfully!', 'success');
    }
}

/**
 * Add department
 */
function addDepartment(facultyId) {
    Utils.showNotification('Department management coming soon!', 'info');
}

/**
 * Edit department
 */
function editDepartment(facultyId, departmentId) {
    Utils.showNotification('Department management coming soon!', 'info');
}

/**
 * Delete department
 */
function deleteDepartment(facultyId, departmentId) {
    if (!confirm('Are you sure you want to delete this department?')) {
        return;
    }
    
    Utils.showNotification('Department management coming soon!', 'info');
}

/**
 * Save materials data to server
 */
function saveMaterialsData() {
    if (!currentMaterialsData) return;
    
    // In a real implementation, this would save to the server
    // For now, we'll just update the local data
    window.materialsData = currentMaterialsData;
    
    // You could implement an API call here:
    /*
    fetch('/admin/materials', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentMaterialsData)
    }).then(response => response.json())
      .then(data => {
          if (data.success) {
              Utils.showNotification('Materials saved successfully!', 'success');
          } else {
              Utils.showNotification('Failed to save materials', 'error');
          }
      });
    */
}

/**
 * Export data
 */
function exportData() {
    if (!currentMaterialsData) {
        Utils.showNotification('No data to export', 'error');
        return;
    }
    
    const dataStr = JSON.stringify(currentMaterialsData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'ui-materials-data.json';
    link.click();
    
    Utils.showNotification('Data exported successfully!', 'success');
}

/**
 * Import data
 */
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Validate data structure
                if (importedData.faculties && Array.isArray(importedData.faculties)) {
                    currentMaterialsData = importedData;
                    saveMaterialsData();
                    
                    // Refresh the page to show imported data
                    Utils.showNotification('Data imported successfully! Refreshing page...', 'success');
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                } else {
                    Utils.showNotification('Invalid data format', 'error');
                }
            } catch (error) {
                Utils.showNotification('Failed to parse JSON file', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

/**
 * Reset settings to default
 */
function resetSettings() {
    if (!confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
        return;
    }
    
    // Reset form values to defaults
    document.getElementById('university-name').value = 'University of Ibadan';
    document.getElementById('university-motto').value = 'Premier University, First and the Best';
    document.getElementById('portal-title').value = 'Course Materials Portal';
    document.getElementById('primary-color').value = '#1a365d';
    document.getElementById('primary-color-text').value = '#1a365d';
    document.getElementById('secondary-color').value = '#2d3748';
    document.getElementById('secondary-color-text').value = '#2d3748';
    document.getElementById('university-address').value = 'Ibadan, Oyo State, Nigeria';
    document.getElementById('university-phone').value = '+234 (0) 2 810 1100';
    document.getElementById('university-email').value = 'info@ui.edu.ng';
    
    Utils.showNotification('Settings reset to default values', 'info');
}

/**
 * Show modal
 */
function showModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close modal
 */
function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

/**
 * Close faculty modal
 */
function closeFacultyModal() {
    const modal = document.getElementById('faculty-modal');
    if (modal) {
        closeModal(modal);
    }
}

/**
 * Close department modal
 */
function closeDepartmentModal() {
    const modal = document.getElementById('department-modal');
    if (modal) {
        closeModal(modal);
    }
}

/**
 * Generate unique faculty ID
 */
function generateFacultyId() {
    return 'faculty_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Hide flash messages
 */
function hideFlashMessages() {
    const flashMessages = document.querySelectorAll('.flash-messages .alert');
    flashMessages.forEach(message => {
        message.style.transition = 'opacity 0.3s ease';
        message.style.opacity = '0';
        setTimeout(() => {
            if (message.parentElement) {
                message.remove();
            }
        }, 300);
    });
}

// Expose global functions
window.showSection = showSection;
window.addFaculty = addFaculty;
window.editFaculty = editFaculty;
window.saveFaculty = saveFaculty;
window.deleteFaculty = deleteFaculty;
window.addDepartment = addDepartment;
window.editDepartment = editDepartment;
window.deleteDepartment = deleteDepartment;
window.exportData = exportData;
window.importData = importData;
window.resetSettings = resetSettings;
window.closeFacultyModal = closeFacultyModal;
window.closeDepartmentModal = closeDepartmentModal;
