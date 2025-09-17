/**
 * UI Social - Main JavaScript File
 * University of Ibadan Social Platform
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeLikeButtons();
    initializeFormValidations();
    initializeImagePreviews();
    initializeTooltips();
    initializeAutoResize();
    initializeAnimations();
    
    console.log('UI Social platform initialized');
});

/**
 * Initialize like button functionality
 */
function initializeLikeButtons() {
    const likeButtons = document.querySelectorAll('.like-btn');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const postId = this.getAttribute('data-post-id');
            if (!postId) return;
            
            // Disable button during request
            this.disabled = true;
            const originalContent = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i><span class="like-count">...</span>';
            
            // Send like request
            fetch(`/like_post/${postId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const likeCountSpan = this.querySelector('.like-count');
                    likeCountSpan.textContent = data.likes_count;
                    
                    if (data.is_liked) {
                        this.classList.add('liked');
                        // Animate heart
                        const heartIcon = this.querySelector('i');
                        heartIcon.style.animation = 'heartBeat 0.6s ease';
                        setTimeout(() => {
                            heartIcon.style.animation = '';
                        }, 600);
                    } else {
                        this.classList.remove('liked');
                    }
                    
                    // Update button content
                    this.innerHTML = `<i class="fas fa-heart me-1"></i><span class="like-count">${data.likes_count}</span>`;
                } else {
                    console.error('Like failed:', data.message);
                    this.innerHTML = originalContent;
                    showNotification('Failed to update like. Please try again.', 'error');
                }
            })
            .catch(error => {
                console.error('Like request failed:', error);
                this.innerHTML = originalContent;
                showNotification('Network error. Please check your connection.', 'error');
            })
            .finally(() => {
                this.disabled = false;
            });
        });
    });
}

/**
 * Initialize form validations
 */
function initializeFormValidations() {
    // Registration form validation
    const registerForm = document.querySelector('form[action*="register"]');
    if (registerForm) {
        const passwordField = registerForm.querySelector('#password');
        const confirmPasswordField = registerForm.querySelector('#confirm_password');
        const emailField = registerForm.querySelector('#email');
        
        if (passwordField && confirmPasswordField) {
            confirmPasswordField.addEventListener('input', function() {
                if (this.value && passwordField.value !== this.value) {
                    this.setCustomValidity('Passwords do not match');
                    this.classList.add('is-invalid');
                } else {
                    this.setCustomValidity('');
                    this.classList.remove('is-invalid');
                }
            });
            
            passwordField.addEventListener('input', function() {
                if (confirmPasswordField.value) {
                    confirmPasswordField.dispatchEvent(new Event('input'));
                }
                
                // Password strength indicator
                const strength = getPasswordStrength(this.value);
                updatePasswordStrength(this, strength);
            });
        }
        
        if (emailField) {
            emailField.addEventListener('input', function() {
                if (this.value && !this.value.endsWith('@ui.edu.ng')) {
                    this.setCustomValidity('Please use your University of Ibadan email address');
                    this.classList.add('is-invalid');
                } else {
                    this.setCustomValidity('');
                    this.classList.remove('is-invalid');
                }
            });
        }
    }
    
    // Comment form validation
    const commentForms = document.querySelectorAll('form[action*="comment_post"]');
    commentForms.forEach(form => {
        const input = form.querySelector('input[name="content"]');
        if (input) {
            form.addEventListener('submit', function(e) {
                if (!input.value.trim()) {
                    e.preventDefault();
                    input.focus();
                    showNotification('Please enter a comment', 'warning');
                }
            });
        }
    });
}

/**
 * Initialize image preview functionality
 */
function initializeImagePreviews() {
    const imageInputs = document.querySelectorAll('input[type="file"][accept*="image"]');
    
    imageInputs.forEach(input => {
        input.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (!file) return;
            
            // Validate file size (16MB limit)
            if (file.size > 16 * 1024 * 1024) {
                showNotification('Image size must be less than 16MB', 'error');
                this.value = '';
                return;
            }
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showNotification('Please select a valid image file', 'error');
                this.value = '';
                return;
            }
            
            // Show preview for specific contexts
            if (this.id === 'profile_photo') {
                previewProfilePhoto(file);
            } else if (this.id === 'post_image') {
                previewPostImage(file);
            }
        });
    });
}

/**
 * Preview profile photo
 */
function previewProfilePhoto(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const existingPhoto = document.querySelector('.profile-photo-edit, .profile-photo-placeholder-edit');
        if (existingPhoto) {
            if (existingPhoto.tagName === 'IMG') {
                existingPhoto.src = e.target.result;
            } else {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'profile-photo-edit';
                img.alt = 'Profile preview';
                existingPhoto.parentNode.replaceChild(img, existingPhoto);
            }
        }
    };
    reader.readAsDataURL(file);
}

/**
 * Preview post image
 */
function previewPostImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('imagePreview');
        const img = document.getElementById('previewImg');
        if (preview && img) {
            img.src = e.target.result;
            preview.style.display = 'block';
        }
    };
    reader.readAsDataURL(file);
}

/**
 * Calculate password strength
 */
function getPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return 'weak';
    if (score <= 4) return 'medium';
    return 'strong';
}

/**
 * Update password strength indicator
 */
function updatePasswordStrength(input, strength) {
    let indicator = input.parentNode.parentNode.querySelector('.password-strength');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.className = 'password-strength mt-1';
        input.parentNode.parentNode.appendChild(indicator);
    }
    
    const colors = {
        weak: '#dc3545',
        medium: '#ffc107',
        strong: '#28a745'
    };
    
    const texts = {
        weak: 'Weak password',
        medium: 'Medium strength',
        strong: 'Strong password'
    };
    
    indicator.style.color = colors[strength];
    indicator.innerHTML = `<small><i class="fas fa-shield-alt me-1"></i>${texts[strength]}</small>`;
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
 * Initialize auto-resize textareas
 */
function initializeAutoResize() {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        // Set initial height
        autoResize(textarea);
        
        // Add event listener for input
        textarea.addEventListener('input', function() {
            autoResize(this);
        });
    });
}

/**
 * Auto-resize textarea
 */
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
}

/**
 * Initialize animations
 */
function initializeAnimations() {
    // Animate cards on scroll
    const cards = document.querySelectorAll('.card, .post-card, .feature-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        observer.observe(card);
    });
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show notification-toast`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 150);
        }
    }, 5000);
}

/**
 * Format timestamps
 */
function formatTimestamp(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
}

/**
 * Initialize character counters
 */
function initializeCharacterCounters() {
    const textareas = document.querySelectorAll('textarea[maxlength]');
    
    textareas.forEach(textarea => {
        const maxLength = parseInt(textarea.getAttribute('maxlength'));
        
        // Create counter element
        const counter = document.createElement('div');
        counter.className = 'character-counter text-muted small mt-1';
        
        // Insert counter after textarea
        textarea.parentNode.insertBefore(counter, textarea.nextSibling);
        
        // Update counter function
        const updateCounter = () => {
            const remaining = maxLength - textarea.value.length;
            counter.textContent = `${remaining} characters remaining`;
            
            if (remaining < 50) {
                counter.className = 'character-counter text-warning small mt-1';
            } else if (remaining < 0) {
                counter.className = 'character-counter text-danger small mt-1';
            } else {
                counter.className = 'character-counter text-muted small mt-1';
            }
        };
        
        // Initial update
        updateCounter();
        
        // Update on input
        textarea.addEventListener('input', updateCounter);
    });
}

/**
 * Initialize smooth scrolling
 */
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
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

/**
 * Initialize loading states for forms
 */
function initializeLoadingStates() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton && !submitButton.disabled) {
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Loading...';
                submitButton.disabled = true;
                
                // Re-enable after 10 seconds as fallback
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                }, 10000);
            }
        });
    });
}

/**
 * Initialize comment toggling
 */
function initializeCommentToggling() {
    const commentButtons = document.querySelectorAll('.comment-toggle');
    
    commentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-bs-target');
            const commentsSection = document.querySelector(targetId);
            
            if (commentsSection) {
                // Focus on comment input when section is shown
                commentsSection.addEventListener('shown.bs.collapse', function() {
                    const commentInput = this.querySelector('input[name="content"]');
                    if (commentInput) {
                        setTimeout(() => commentInput.focus(), 100);
                    }
                }, { once: true });
            }
        });
    });
}

/**
 * Initialize back to top button
 */
function initializeBackToTop() {
    // Create back to top button
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.className = 'btn btn-ui-blue back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        z-index: 999;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: none;
        box-shadow: 0 4px 12px rgba(0,51,102,0.3);
    `;
    
    document.body.appendChild(backToTopButton);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'block';
        } else {
            backToTopButton.style.display = 'none';
        }
    });
    
    // Scroll to top when clicked
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeCharacterCounters();
    initializeSmoothScrolling();
    initializeLoadingStates();
    initializeCommentToggling();
    initializeBackToTop();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        // Refresh timestamps when page becomes visible
        const timeElements = document.querySelectorAll('.timestamp');
        timeElements.forEach(element => {
            const originalTime = element.getAttribute('data-time');
            if (originalTime) {
                element.textContent = formatTimestamp(originalTime);
            }
        });
    }
});

// Global error handler
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Don't show user-facing errors for minor issues
});

// Global utility functions
window.UISocial = {
    showNotification: showNotification,
    formatTimestamp: formatTimestamp
};
