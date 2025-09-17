/**
 * University of Ibadan Course Materials Portal - Configuration
 * Global configuration and utility functions
 */

// Global configuration
const CONFIG = {
    // Animation settings
    ANIMATION_DURATION: 300,
    LOADING_DELAY: 1500,
    
    // Search settings
    SEARCH_DEBOUNCE_DELAY: 300,
    MAX_SEARCH_RESULTS: 10,
    
    // UI settings
    MOBILE_BREAKPOINT: 768,
    
    // API endpoints
    API_ENDPOINTS: {
        MATERIALS: '/api/materials',
        SEARCH: '/api/search'
    }
};

// Utility functions
const Utils = {
    /**
     * Debounce function to limit API calls
     */
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Smooth scroll to element
     */
    scrollToElement: function(element, offset = 0) {
        if (typeof element === 'string') {
            element = document.querySelector(element);
        }
        
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    },

    /**
     * Show loading state
     */
    showLoading: function(element) {
        if (element) {
            element.style.opacity = '0.6';
            element.style.pointerEvents = 'none';
        }
    },

    /**
     * Hide loading state
     */
    hideLoading: function(element) {
        if (element) {
            element.style.opacity = '1';
            element.style.pointerEvents = 'auto';
        }
    },

    /**
     * Show notification
     */
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            ${message}
            <button class="alert-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to flash messages container or create one
        let flashContainer = document.querySelector('.flash-messages');
        if (!flashContainer) {
            flashContainer = document.createElement('div');
            flashContainer.className = 'flash-messages';
            document.body.appendChild(flashContainer);
        }

        flashContainer.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    },

    /**
     * Format number with animation
     */
    animateNumber: function(element, target, duration = 2000) {
        const start = 0;
        const startTime = performance.now();

        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentNumber = Math.floor(easeOutQuart * target);
            
            element.textContent = currentNumber;

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(updateNumber);
    },

    /**
     * Check if device is mobile
     */
    isMobile: function() {
        return window.innerWidth <= CONFIG.MOBILE_BREAKPOINT;
    },

    /**
     * Generate unique ID
     */
    generateId: function() {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Copy text to clipboard
     */
    copyToClipboard: function(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                Utils.showNotification('Copied to clipboard!', 'success');
            }).catch(() => {
                Utils.showNotification('Failed to copy to clipboard', 'error');
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                Utils.showNotification('Copied to clipboard!', 'success');
            } catch (err) {
                Utils.showNotification('Failed to copy to clipboard', 'error');
            }
            document.body.removeChild(textArea);
        }
    }
};

// Export for use in other files
window.CONFIG = CONFIG;
window.Utils = Utils;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('UI Portal Configuration Loaded');
});
