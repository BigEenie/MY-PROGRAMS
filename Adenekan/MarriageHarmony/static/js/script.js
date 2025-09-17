// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', function() {
        const faqItem = this.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            faqItem.classList.add('active');
        }
    });
});

// Contact Form Handling
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        showMessage('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
        this.reset();
    })
    .catch(error => {
        showMessage('Sorry, there was an error sending your message. Please try again or call us directly.', 'error');
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
});

// Booking Form Handling
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;
    
    // Simulate booking submission
    fetch('/api/booking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        showMessage('Your appointment request has been submitted! We\'ll contact you within 24 hours to confirm your session.', 'success');
        this.reset();
    })
    .catch(error => {
        showMessage('Sorry, there was an error processing your request. Please try again or call us directly.', 'error');
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
});

// Newsletter Form Handling
document.getElementById('newsletterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    
    fetch('/api/newsletter', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        showMessage('Thank you for subscribing! You\'ll receive our monthly newsletter with relationship tips and updates.', 'success');
        this.reset();
    })
    .catch(error => {
        showMessage('Sorry, there was an error subscribing you to our newsletter. Please try again.', 'error');
    })
    .finally(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    });
});

// Resource Download Handling
document.querySelectorAll('.download-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const resource = this.dataset.resource;
        const resourceNames = {
            'questionnaire': 'Pre-Counseling Questionnaire',
            'checklist': 'Communication Checklist',
            'questions': '5 Questions Before Marriage Counseling'
        };
        
        // Simulate download
        fetch(`/api/download/${resource}`, {
            method: 'GET'
        })
        .then(response => {
            if (response.ok) {
                // Create a temporary download link
                const link = document.createElement('a');
                link.href = `/static/resources/${resource}.pdf`;
                link.download = `${resourceNames[resource]}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                showMessage(`"${resourceNames[resource]}" has been downloaded successfully!`, 'success');
            } else {
                throw new Error('Download failed');
            }
        })
        .catch(error => {
            showMessage('Sorry, there was an error downloading the resource. Please try again later.', 'error');
        });
    });
});

// Message Display Function
function showMessage(text, type) {
    // Remove any existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const message = document.createElement('div');
    message.className = `message ${type} show`;
    message.textContent = text;
    
    // Find the closest form or section to insert the message
    const activeElement = document.activeElement;
    let container = activeElement.closest('form') || activeElement.closest('section');
    
    if (!container) {
        container = document.querySelector('.hero');
    }
    
    // Insert message at the top of the container
    container.insertBefore(message, container.firstChild);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        if (message.parentNode) {
            message.classList.remove('show');
            setTimeout(() => {
                if (message.parentNode) {
                    message.remove();
                }
            }, 300);
        }
    }, 5000);
    
    // Scroll to message
    message.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Form Validation Enhancement
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Add real-time validation to forms
document.querySelectorAll('input[type="email"]').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            this.style.borderColor = '#e53e3e';
            showFieldError(this, 'Please enter a valid email address');
        } else {
            this.style.borderColor = '#e2e8f0';
            removeFieldError(this);
        }
    });
});

document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !validatePhone(this.value)) {
            this.style.borderColor = '#e53e3e';
            showFieldError(this, 'Please enter a valid phone number');
        } else {
            this.style.borderColor = '#e2e8f0';
            removeFieldError(this);
        }
    });
});

function showFieldError(field, message) {
    removeFieldError(field);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#e53e3e';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function removeFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.service-card, .testimonial-card, .blog-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Set minimum date for booking form
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const bookingDateInput = document.getElementById('booking-date');
if (bookingDateInput) {
    bookingDateInput.min = tomorrow.toISOString().split('T')[0];
}

// Google Maps Integration (placeholder)
function initMap() {
    // This would integrate with Google Maps API
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%; color: #4a5568;">
                <p style="margin-bottom: 1rem; font-size: 1.1rem; font-weight: 500;">📍 Our Location</p>
                <p style="text-align: center; line-height: 1.6;">
                    123 Wellness Way, Suite 200<br>
                    Your City, ST 12345<br><br>
                    <strong>Office Hours:</strong><br>
                    Monday - Friday: 9am - 7pm<br>
                    Saturday: 10am - 4pm<br>
                    Sunday: By appointment
                </p>
                <button onclick="openDirections()" style="margin-top: 1rem; background: #4299e1; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                    Get Directions
                </button>
            </div>
        `;
    }
}

function openDirections() {
    const address = encodeURIComponent('123 Wellness Way, Suite 200, Your City, ST 12345');
    window.open(`https://www.google.com/maps/search/${address}`, '_blank');
}

// Initialize map on page load
document.addEventListener('DOMContentLoaded', initMap);

// Print functionality for resources
function printResource(resourceType) {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>${resourceType} - Harmony Counseling</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                h1 { color: #2c5282; border-bottom: 2px solid #4299e1; padding-bottom: 10px; }
                .header { text-align: center; margin-bottom: 30px; }
                .content { max-width: 600px; margin: 0 auto; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Harmony Counseling</h1>
                <p>Professional Marriage & Relationship Therapy</p>
            </div>
            <div class="content">
                <!-- Resource content would be dynamically generated here -->
                <h2>${resourceType}</h2>
                <p>This resource will help you prepare for your counseling journey.</p>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close mobile menu on Escape
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        // Close any open FAQ items
        document.querySelectorAll('.faq-item.active').forEach(item => {
            item.classList.remove('active');
        });
    }
});

// Service worker registration for offline functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}