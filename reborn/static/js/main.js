// University Marketplace - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeImageLoading();
    initializeFormValidation();
    initializeSearchFunctionality();
    initializeAnimations();
    initializeTooltips();
    initializeModals();
});

// Image Loading with Fallbacks
function initializeImageLoading() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        // Add loading animation
        img.classList.add('loading');
        
        img.addEventListener('load', function() {
            this.classList.remove('loading');
            this.classList.add('loaded');
        });
        
        img.addEventListener('error', function() {
            this.classList.remove('loading');
            // Set fallback image based on context
            if (this.classList.contains('product-image')) {
                this.src = 'https://via.placeholder.com/300x200/6c757d/ffffff?text=Product+Image';
            } else if (this.classList.contains('rounded-circle')) {
                const name = this.alt || 'User';
                const initial = name.charAt(0).toUpperCase();
                this.src = `https://via.placeholder.com/150x150/007bff/ffffff?text=${initial}`;
            }
            this.classList.add('loaded');
        });
    });
}

// Form Validation Enhancement
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
                
                // Focus on first invalid field
                const firstInvalid = form.querySelector(':invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
            
            form.classList.add('was-validated');
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (this.checkValidity()) {
                    this.classList.remove('is-invalid');
                    this.classList.add('is-valid');
                } else {
                    this.classList.remove('is-valid');
                    this.classList.add('is-invalid');
                }
            });
        });
    });
}

// Enhanced Search Functionality
function initializeSearchFunctionality() {
    const searchInput = document.querySelector('input[name="search"]');
    const categorySelect = document.querySelector('select[name="category"]');
    
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                // Add visual feedback for search
                if (this.value.trim()) {
                    this.classList.add('searching');
                } else {
                    this.classList.remove('searching');
                }
            }, 300);
        });
    }
    
    // Category filter enhancement
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            const form = this.closest('form');
            if (form && this.value) {
                // Auto-submit form when category changes
                // form.submit();
            }
        });
    }
}

// Smooth Animations
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe product cards and other elements
    const animatedElements = document.querySelectorAll('.card, .feature-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('.product-card, .btn, .seller-info');
    interactiveElements.forEach(el => {
        el.classList.add('hover-lift');
    });
}

// Initialize Bootstrap Tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Enhanced Modal Functionality
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        modal.addEventListener('shown.bs.modal', function() {
            // Focus on first input when modal opens
            const firstInput = this.querySelector('input, textarea, select');
            if (firstInput) {
                firstInput.focus();
            }
        });
    });
}

// Product Card Interactions
function initializeProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        // Add click to enlarge image functionality
        const image = card.querySelector('.product-image');
        if (image) {
            image.addEventListener('click', function() {
                showImageModal(this.src, this.alt);
            });
        }
        
        // Add favorite functionality (localStorage based)
        const favoriteBtn = createFavoriteButton();
        const cardBody = card.querySelector('.card-body');
        if (cardBody) {
            cardBody.appendChild(favoriteBtn);
        }
    });
}

// Create favorite button
function createFavoriteButton() {
    const btn = document.createElement('button');
    btn.className = 'btn btn-outline-danger btn-sm position-absolute';
    btn.style.cssText = 'top: 10px; right: 10px; z-index: 10;';
    btn.innerHTML = '<i class="far fa-heart"></i>';
    btn.title = 'Add to favorites';
    
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const icon = this.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            this.classList.remove('btn-outline-danger');
            this.classList.add('btn-danger');
            this.title = 'Remove from favorites';
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            this.classList.remove('btn-danger');
            this.classList.add('btn-outline-danger');
            this.title = 'Add to favorites';
        }
    });
    
    return btn;
}

// Image Modal for Product Images
function showImageModal(src, alt) {
    const modalHTML = `
        <div class="modal fade" id="imageModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${alt}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <img src="${src}" class="img-fluid" alt="${alt}">
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if present
    const existingModal = document.getElementById('imageModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('imageModal'));
    modal.show();
    
    // Clean up modal after hiding
    document.getElementById('imageModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Local Storage Utilities
const LocalStorageManager = {
    set: function(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('LocalStorage not available:', e);
        }
    },
    
    get: function(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.warn('Error reading from LocalStorage:', e);
            return null;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.warn('Error removing from LocalStorage:', e);
        }
    }
};

// Search History Management
function initializeSearchHistory() {
    const searchInput = document.querySelector('input[name="search"]');
    if (!searchInput) return;
    
    const searchHistory = LocalStorageManager.get('searchHistory') || [];
    
    // Add datalist for search suggestions
    const datalist = document.createElement('datalist');
    datalist.id = 'searchHistory';
    searchHistory.forEach(term => {
        const option = document.createElement('option');
        option.value = term;
        datalist.appendChild(option);
    });
    
    searchInput.setAttribute('list', 'searchHistory');
    searchInput.parentNode.appendChild(datalist);
    
    // Save search terms
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value.trim()) {
            const term = this.value.trim();
            if (!searchHistory.includes(term)) {
                searchHistory.unshift(term);
                if (searchHistory.length > 10) {
                    searchHistory.pop();
                }
                LocalStorageManager.set('searchHistory', searchHistory);
            }
        }
    });
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // Could send error reports to server here
});

// Service Worker Registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // navigator.serviceWorker.register('/sw.js')
        //     .then(function(registration) {
        //         console.log('ServiceWorker registration successful');
        //     })
        //     .catch(function(err) {
        //         console.log('ServiceWorker registration failed');
        //     });
    });
}

// Initialize additional features after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeProductCards();
    initializeSmoothScrolling();
    initializeSearchHistory();
});

// Export functions for use in other scripts
window.MarketplaceApp = {
    showImageModal,
    LocalStorageManager,
    debounce,
    throttle
};
