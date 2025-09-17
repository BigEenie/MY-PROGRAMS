// Alumni Directory JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeSearch();
    initializeFilters();
    initializeCardAnimations();
    initializeFormValidation();
    initializeTooltips();
    
    // Initialize Feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});

/**
 * Initialize search functionality
 */
function initializeSearch() {
    const searchInput = document.getElementById('search');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        
        // Clear previous timeout
        clearTimeout(searchTimeout);
        
        // Add loading state
        this.classList.add('loading');
        
        // Debounce search
        searchTimeout = setTimeout(() => {
            if (query.length >= 2) {
                performLiveSearch(query);
            }
            this.classList.remove('loading');
        }, 500);
    });
    
    // Clear search on escape key
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            this.dispatchEvent(new Event('input'));
        }
    });
}

/**
 * Perform live search (optional enhancement)
 */
function performLiveSearch(query) {
    // This could be enhanced with AJAX calls for real-time search
    console.log('Searching for:', query);
    
    // For now, we'll just highlight matching text on the current page
    highlightSearchResults(query);
}

/**
 * Highlight search results on current page
 */
function highlightSearchResults(query) {
    const alumniCards = document.querySelectorAll('.alumni-card');
    const searchTerm = query.toLowerCase();
    
    alumniCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const matches = text.includes(searchTerm);
        
        if (matches) {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        } else {
            card.style.opacity = '0.5';
            card.style.transform = 'scale(0.95)';
        }
    });
    
    // Reset after 3 seconds
    setTimeout(() => {
        alumniCards.forEach(card => {
            card.style.opacity = '';
            card.style.transform = '';
        });
    }, 3000);
}

/**
 * Initialize filter functionality
 */
function initializeFilters() {
    const filterForm = document.getElementById('filterForm');
    if (!filterForm) return;
    
    const filterInputs = filterForm.querySelectorAll('select, input[type="text"]');
    
    filterInputs.forEach(input => {
        if (input.type === 'text' && input.name === 'search') {
            // Search input is handled separately
            return;
        }
        
        input.addEventListener('change', function() {
            // Add loading state to form
            filterForm.classList.add('loading');
            
            // Submit form with slight delay for better UX
            setTimeout(() => {
                filterForm.submit();
            }, 100);
        });
    });
    
    // Clear filters functionality
    const clearFiltersBtn = document.querySelector('a[href*="clear"]');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear all filter inputs
            filterInputs.forEach(input => {
                if (input.type === 'text') {
                    input.value = '';
                } else {
                    input.selectedIndex = 0;
                }
            });
            
            // Redirect to clean URL
            window.location.href = this.href;
        });
    }
}

/**
 * Initialize card animations and interactions
 */
function initializeCardAnimations() {
    const alumniCards = document.querySelectorAll('.alumni-card');
    
    alumniCards.forEach((card, index) => {
        // Staggered entrance animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 1rem 2rem rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '';
        });
    });
}

/**
 * Initialize form validation
 */
function initializeFormValidation() {
    const forms = document.querySelectorAll('form[novalidate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            form.classList.add('was-validated');
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', validateInput);
            input.addEventListener('input', validateInput);
        });
    });
}

/**
 * Validate individual input
 */
function validateInput(e) {
    const input = e.target;
    
    if (input.checkValidity()) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
    }
}

/**
 * Initialize tooltips
 */
function initializeTooltips() {
    // Initialize Bootstrap tooltips if available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
}

/**
 * Utility function to show loading state
 */
function showLoading(element) {
    if (element) {
        element.classList.add('loading');
        element.style.pointerEvents = 'none';
    }
}

/**
 * Utility function to hide loading state
 */
function hideLoading(element) {
    if (element) {
        element.classList.remove('loading');
        element.style.pointerEvents = '';
    }
}

/**
 * Smooth scroll to top
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Copy text to clipboard
 */
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!', 'success');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Copied to clipboard!', 'success');
    }
}

/**
 * Show notification (requires Bootstrap toast or custom implementation)
 */
function showNotification(message, type = 'info') {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

/**
 * Format phone numbers
 */
function formatPhoneNumber(phoneNumber) {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    
    return phoneNumber;
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate URL format
 */
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Export alumni data (future enhancement)
 */
function exportAlumniData(format = 'csv') {
    console.log(`Exporting alumni data in ${format} format...`);
    // Implementation would depend on requirements
}

/**
 * Print alumni directory
 */
function printDirectory() {
    window.print();
}

// Global utility functions
window.AlumniDirectory = {
    showLoading,
    hideLoading,
    scrollToTop,
    copyToClipboard,
    showNotification,
    formatPhoneNumber,
    isValidEmail,
    isValidURL,
    exportAlumniData,
    printDirectory
};
