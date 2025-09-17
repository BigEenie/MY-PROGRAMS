/**
 * University of Ibadan Course Materials Portal - Main JavaScript
 * Handles navigation, search, and material selection functionality
 */

// Global state
let materialsData = null;
let currentStep = 1;
let selectedFaculty = null;
let selectedDepartment = null;
let searchTimeout = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePortal();
});

/**
 * Initialize the portal
 */
function initializePortal() {
    // Hide loading screen after delay
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, CONFIG.LOADING_DELAY);

    // Initialize navigation
    initializeNavigation();
    
    // Initialize search
    initializeSearch();
    
    // Initialize stats animation
    initializeStatsAnimation();
    
    // Load materials data
    loadMaterialsData();
    
    // Initialize responsive navigation
    initializeMobileNav();

    console.log('UI Portal Initialized');
}

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                Utils.scrollToElement(target, 80);
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Handle scroll for navigation highlighting
    window.addEventListener('scroll', updateNavigationHighlight);
}

/**
 * Update navigation highlighting based on scroll position
 */
function updateNavigationHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop <= 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

/**
 * Initialize mobile navigation
 */
function initializeMobileNav() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            
            // Toggle hamburger icon
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close mobile nav when clicking on a link
        navLinks.addEventListener('click', function(e) {
            if (e.target.classList.contains('nav-link')) {
                navLinks.classList.remove('active');
                const icon = navToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

/**
 * Initialize search functionality
 */
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (searchInput) {
        // Debounced search function
        const debouncedSearch = Utils.debounce(performSearch, CONFIG.SEARCH_DEBOUNCE_DELAY);
        
        searchInput.addEventListener('input', function() {
            const query = this.value.trim();
            if (query.length > 2) {
                debouncedSearch(query);
            } else {
                hideSearchResults();
            }
        });

        // Hide search results when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                hideSearchResults();
            }
        });
    }
}

/**
 * Perform search
 */
function performSearch(query) {
    if (!materialsData) return;
    
    const results = [];
    
    materialsData.faculties.forEach(faculty => {
        // Search in faculty
        if (faculty.name.toLowerCase().includes(query.toLowerCase()) || 
            faculty.description.toLowerCase().includes(query.toLowerCase())) {
            results.push({
                type: 'faculty',
                name: faculty.name,
                description: faculty.description,
                id: faculty.id,
                icon: faculty.icon
            });
        }
        
        // Search in departments
        faculty.departments.forEach(department => {
            if (department.name.toLowerCase().includes(query.toLowerCase()) || 
                department.description.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                    type: 'department',
                    name: department.name,
                    description: department.description,
                    faculty: faculty.name,
                    faculty_id: faculty.id,
                    id: department.id
                });
            }
        });
    });
    
    displaySearchResults(results.slice(0, CONFIG.MAX_SEARCH_RESULTS));
}

/**
 * Display search results
 */
function displaySearchResults(results) {
    const searchResults = document.getElementById('search-results');
    if (!searchResults) return;
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
    } else {
        searchResults.innerHTML = results.map(result => `
            <div class="search-result-item" onclick="selectSearchResult('${result.type}', '${result.id}', '${result.faculty_id || ''}')">
                <div style="display: flex; align-items: center; gap: 10px;">
                    ${result.icon ? `<i class="${result.icon}"></i>` : '<i class="fas fa-search"></i>'}
                    <div>
                        <strong>${Utils.escapeHtml(result.name)}</strong>
                        <div style="font-size: 0.875rem; color: var(--gray-600);">
                            ${Utils.escapeHtml(result.description)}
                            ${result.faculty ? `<br><em>in ${Utils.escapeHtml(result.faculty)}</em>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    searchResults.style.display = 'block';
}

/**
 * Hide search results
 */
function hideSearchResults() {
    const searchResults = document.getElementById('search-results');
    if (searchResults) {
        searchResults.style.display = 'none';
    }
}

/**
 * Handle search result selection
 */
function selectSearchResult(type, id, facultyId) {
    hideSearchResults();
    
    if (type === 'faculty') {
        selectFaculty(id);
    } else if (type === 'department') {
        selectFaculty(facultyId);
        setTimeout(() => selectDepartment(id), 300);
    }
    
    // Scroll to materials section
    Utils.scrollToElement('#materials', 80);
}

/**
 * Initialize stats animation
 */
function initializeStatsAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                Utils.animateNumber(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

/**
 * Load materials data
 */
function loadMaterialsData() {
    // Use the data passed from the template
    if (window.materialsData) {
        materialsData = window.materialsData;
        console.log('Materials data loaded successfully');
    } else {
        console.log('Materials data not found in window, using fallback');
    }
    setupMaterialsNavigation();
}

/**
 * Setup materials navigation
 */
function setupMaterialsNavigation() {
    // Faculty cards are already rendered by the template
    // Just add click handlers if they don't exist
    const facultyCards = document.querySelectorAll('.faculty-card');
    facultyCards.forEach(card => {
        if (!card.hasAttribute('onclick')) {
            const facultyId = card.getAttribute('data-faculty-id');
            card.addEventListener('click', () => selectFaculty(facultyId));
        }
    });
}

/**
 * Select faculty and show departments
 */
function selectFaculty(facultyId) {
    if (!materialsData || !materialsData.faculties) {
        console.error('Materials data not available');
        return;
    }
    
    selectedFaculty = materialsData.faculties.find(f => f.id === facultyId);
    
    if (!selectedFaculty) {
        console.error('Faculty not found:', facultyId);
        return;
    }
    
    // Update breadcrumb
    updateBreadcrumb(['Home', selectedFaculty.name]);
    
    // Update navigation steps
    updateNavigationSteps(2);
    
    // Show department selection
    showDepartmentSelection();
    
    // Populate departments immediately
    populateDepartments(selectedFaculty);
}

/**
 * Show department selection
 */
function showDepartmentSelection() {
    const facultySelection = document.getElementById('faculty-selection');
    const departmentSelection = document.getElementById('department-selection');
    
    if (facultySelection) facultySelection.classList.remove('active');
    if (departmentSelection) departmentSelection.classList.add('active');
    
    currentStep = 2;
}

/**
 * Populate departments
 */
function populateDepartments(faculty) {
    const departmentGrid = document.getElementById('department-grid');
    if (!departmentGrid || !faculty.departments) return;
    
    departmentGrid.innerHTML = faculty.departments.map(dept => `
        <div class="card" onclick="selectDepartment('${dept.id}')">
            <div class="card-icon">
                <i class="fas fa-building"></i>
            </div>
            <div class="card-content">
                <h4 class="card-title">${Utils.escapeHtml(dept.name)}</h4>
                <p class="card-description">${Utils.escapeHtml(dept.description)}</p>
                <div class="card-stats">
                    <span><i class="fas fa-layer-group"></i> ${dept.levels ? dept.levels.length : 0} Levels</span>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Select department and show levels
 */
function selectDepartment(departmentId) {
    if (!selectedFaculty || !selectedFaculty.departments) {
        console.error('Faculty not selected or has no departments');
        return;
    }
    
    selectedDepartment = selectedFaculty.departments.find(d => d.id === departmentId);
    
    if (!selectedDepartment) {
        console.error('Department not found:', departmentId);
        return;
    }
    
    // Update breadcrumb
    updateBreadcrumb(['Home', selectedFaculty.name, selectedDepartment.name]);
    
    // Update navigation steps
    updateNavigationSteps(3);
    
    // Show level selection
    showLevelSelection();
    
    // Populate levels
    populateLevels(selectedDepartment);
}

/**
 * Show level selection
 */
function showLevelSelection() {
    const departmentSelection = document.getElementById('department-selection');
    const levelSelection = document.getElementById('level-selection');
    
    if (departmentSelection) departmentSelection.classList.remove('active');
    if (levelSelection) levelSelection.classList.add('active');
    
    currentStep = 3;
}

/**
 * Populate levels
 */
function populateLevels(department) {
    const levelGrid = document.getElementById('level-grid');
    if (!levelGrid) return;
    
    if (department.levels) {
        levelGrid.innerHTML = department.levels.map(level => `
            <div class="card" onclick="accessLevel('${selectedFaculty.id}', '${department.id}', '${level.id}')">
                <div class="card-icon">
                    <i class="fas fa-layer-group"></i>
                </div>
                <div class="card-content">
                    <h4 class="card-title">${Utils.escapeHtml(level.name)}</h4>
                    <p class="card-description">Access course materials for this level</p>
                    <div class="card-stats">
                        <span><i class="fas fa-external-link-alt"></i> View Materials</span>
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        // Default levels if not specified
        const defaultLevels = ['100 Level', '200 Level', '300 Level', '400 Level'];
        levelGrid.innerHTML = defaultLevels.map((level, index) => `
            <div class="card" onclick="accessLevel('${selectedFaculty.id}', '${department.id}', '${100 + (index * 100)}l')">
                <div class="card-icon">
                    <i class="fas fa-layer-group"></i>
                </div>
                <div class="card-content">
                    <h4 class="card-title">${level}</h4>
                    <p class="card-description">Access course materials for this level</p>
                    <div class="card-stats">
                        <span><i class="fas fa-external-link-alt"></i> View Materials</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

/**
 * Access level materials
 */
function accessLevel(facultyId, departmentId, levelId) {
    Utils.showNotification('Redirecting to course materials...', 'info');
    
    // Find the actual Google Drive URL from the data
    const faculty = materialsData.faculties.find(f => f.id === facultyId);
    if (!faculty) {
        Utils.showNotification('Faculty not found', 'error');
        return;
    }
    
    const department = faculty.departments.find(d => d.id === departmentId);
    if (!department) {
        Utils.showNotification('Department not found', 'error');
        return;
    }
    
    const level = department.levels.find(l => l.id === levelId);
    if (!level || !level.driveUrl) {
        Utils.showNotification('Course materials not available yet', 'error');
        return;
    }
    
    // Open the actual Google Drive URL
    window.open(level.driveUrl, '_blank');
}

/**
 * Go back to previous step
 */
function goBack(target) {
    if (target === 'faculty') {
        // Go back to faculty selection
        const departmentSelection = document.getElementById('department-selection');
        const facultySelection = document.getElementById('faculty-selection');
        
        if (departmentSelection) departmentSelection.classList.remove('active');
        if (facultySelection) facultySelection.classList.add('active');
        
        updateBreadcrumb(['Home']);
        updateNavigationSteps(1);
        currentStep = 1;
        selectedFaculty = null;
        
    } else if (target === 'department') {
        // Go back to department selection
        const levelSelection = document.getElementById('level-selection');
        const departmentSelection = document.getElementById('department-selection');
        
        if (levelSelection) levelSelection.classList.remove('active');
        if (departmentSelection) departmentSelection.classList.add('active');
        
        updateBreadcrumb(['Home', selectedFaculty.name]);
        updateNavigationSteps(2);
        currentStep = 2;
        selectedDepartment = null;
    }
}

/**
 * Update breadcrumb navigation
 */
function updateBreadcrumb(items) {
    const breadcrumb = document.getElementById('breadcrumb');
    if (!breadcrumb) return;
    
    breadcrumb.innerHTML = items.map((item, index) => {
        const isActive = index === items.length - 1;
        const icon = index === 0 ? '<i class="fas fa-home"></i> ' : '';
        return `<span class="breadcrumb-item ${isActive ? 'active' : ''}">${icon}${Utils.escapeHtml(item)}</span>`;
    }).join('');
}

/**
 * Update navigation steps
 */
function updateNavigationSteps(activeStep) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        if (stepNumber <= activeStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

/**
 * Scroll to materials section
 */
function scrollToMaterials() {
    Utils.scrollToElement('#materials', 80);
}

// Expose global functions
window.selectFaculty = selectFaculty;
window.selectDepartment = selectDepartment;
window.accessLevel = accessLevel;
window.goBack = goBack;
window.scrollToMaterials = scrollToMaterials;
window.selectSearchResult = selectSearchResult;
