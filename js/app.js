// ===== QuickFix Main Application JavaScript =====

// ===== Mobile Menu Toggle =====
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('active');
}

// ===== Toast Notifications =====
function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// ===== Loading Overlay =====
function showLoading() {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    overlay.id = 'loadingOverlay';
    overlay.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(overlay);
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.remove();
}

// ===== Render Popular Services =====
function renderPopularServices() {
    const container = document.getElementById('popularServices');
    if (!container) return;

    const colors = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    ];

    container.innerHTML = popularServices.map((service, index) => `
        <a href="pages/user/workers.html?category=${service.category}" class="service-card animate-slideUp" style="animation-delay: ${index * 50}ms">
            <div class="service-image" style="background: ${colors[index % colors.length]}">
                <i class="${service.icon}"></i>
            </div>
            <div class="service-info">
                <h4 class="service-name">${service.name}</h4>
                <div class="service-meta">
                    <span class="service-rating">
                        <i class="fas fa-star"></i>
                        ${service.rating} (${service.reviews})
                    </span>
                </div>
                <div class="service-price">${formatCurrency(service.price)}</div>
            </div>
        </a>
    `).join('');
}

// ===== Render All Categories =====
function renderAllCategories() {
    const container = document.getElementById('allCategories');
    if (!container) return;

    container.innerHTML = categories.map((category, index) => `
        <a href="pages/user/workers.html?category=${category.id}" class="category-item animate-slideUp" style="animation-delay: ${index * 50}ms">
            <div class="category-item-icon" style="background: ${category.color}; color: ${category.iconColor}">
                <i class="${category.icon}"></i>
            </div>
            <div class="category-item-info">
                <h4>${category.name}</h4>
                <p>${category.description}</p>
            </div>
        </a>
    `).join('');
}

// ===== Render Top Workers =====
function renderTopWorkers() {
    const container = document.getElementById('topWorkers');
    if (!container) return;

    const topWorkers = getApprovedWorkers()
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);

    container.innerHTML = topWorkers.map((worker, index) => `
        <a href="pages/user/worker-profile.html?id=${worker.id}" class="worker-card animate-slideUp" style="animation-delay: ${index * 100}ms">
            <div class="worker-header">
                <div class="worker-avatar">
                    <img src="${worker.avatar}" alt="${worker.name}">
                </div>
                <div class="worker-info">
                    <h4 class="worker-name">${worker.name}</h4>
                    <p class="worker-skill">${worker.skill}</p>
                    <p class="worker-experience">${worker.experience}</p>
                </div>
            </div>
            <div class="worker-stats">
                <div class="worker-stat rating">
                    <i class="fas fa-star"></i>
                    <span>${worker.rating} (${worker.totalReviews})</span>
                </div>
                <div class="worker-stat">
                    <i class="fas fa-briefcase"></i>
                    <span>${worker.completedJobs} jobs</span>
                </div>
            </div>
            <div class="worker-footer">
                <div class="worker-price">
                    ${formatCurrency(worker.minCharge)}
                    <span>onwards</span>
                </div>
                <span class="availability-badge ${worker.isAvailable ? 'available' : 'busy'}">
                    ${worker.isAvailable ? 'Available' : 'Busy'}
                </span>
            </div>
        </a>
    `).join('');
}

// ===== Render Workers List Page =====
function renderWorkersPage() {
    const container = document.getElementById('workersGrid');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const categoryFilter = urlParams.get('category');
    
    let filteredWorkers = getApprovedWorkers();
    
    if (categoryFilter) {
        filteredWorkers = filteredWorkers.filter(w => w.categoryId === categoryFilter);
        
        // Update page title
        const category = getCategoryById(categoryFilter);
        if (category) {
            document.getElementById('pageTitle').textContent = category.name + ' Services';
            document.getElementById('categoryFilter').value = categoryFilter;
        }
    }

    // Sort by rating
    filteredWorkers.sort((a, b) => b.rating - a.rating);

    // Update count
    document.getElementById('workerCount').textContent = filteredWorkers.length + ' workers found';

    if (filteredWorkers.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1">
                <i class="fas fa-search"></i>
                <h3>No workers found</h3>
                <p>Try selecting a different category</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredWorkers.map((worker, index) => `
        <a href="worker-profile.html?id=${worker.id}" class="worker-card animate-slideUp" style="animation-delay: ${index * 50}ms">
            <div class="worker-header">
                <div class="worker-avatar">
                    <img src="${worker.avatar}" alt="${worker.name}">
                </div>
                <div class="worker-info">
                    <h4 class="worker-name">${worker.name}</h4>
                    <p class="worker-skill">${worker.skill}</p>
                    <p class="worker-experience">${worker.experience}</p>
                </div>
            </div>
            <div class="worker-stats">
                <div class="worker-stat rating">
                    <i class="fas fa-star"></i>
                    <span>${worker.rating} (${worker.totalReviews})</span>
                </div>
                <div class="worker-stat distance">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${(Math.random() * 3 + 0.5).toFixed(1)} km</span>
                </div>
            </div>
            <div class="worker-footer">
                <div class="worker-price">
                    ${formatCurrency(worker.minCharge)}
                    <span>onwards</span>
                </div>
                <span class="availability-badge ${worker.isAvailable ? 'available' : 'busy'}">
                    ${worker.isAvailable ? 'Available' : 'Busy'}
                </span>
            </div>
        </a>
    `).join('');
}

// ===== Filter Workers =====
function filterWorkers() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    if (categoryFilter) {
        window.location.href = `workers.html?category=${categoryFilter}`;
    } else {
        window.location.href = 'workers.html';
    }
}

// ===== Render Category Filter Options =====
function renderCategoryOptions() {
    const select = document.getElementById('categoryFilter');
    if (!select) return;

    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
    });
}

// ===== Render Worker Profile =====
function renderWorkerProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const workerId = urlParams.get('id');
    
    if (!workerId) {
        window.location.href = 'workers.html';
        return;
    }

    const worker = getWorkerById(workerId);
    if (!worker) {
        window.location.href = 'workers.html';
        return;
    }

    const reviews = getWorkerReviews(workerId);

    // Update profile header
    document.getElementById('workerAvatar').innerHTML = `<img src="${worker.avatar}" alt="${worker.name}">`;
    document.getElementById('workerName').textContent = worker.name;
    document.getElementById('workerSkill').textContent = worker.skill;

    // Update stats
    document.getElementById('workerRating').textContent = worker.rating;
    document.getElementById('workerReviews').textContent = worker.totalReviews;
    document.getElementById('workerJobs').textContent = worker.completedJobs;

    // Update info
    document.getElementById('workerExperience').textContent = worker.experience;
    document.getElementById('workerPhone').textContent = worker.phone;
    document.getElementById('workerEmail').textContent = worker.email;
    document.getElementById('workerMinCharge').textContent = formatCurrency(worker.minCharge);
    document.getElementById('workerAvailability').innerHTML = `
        <span class="availability-badge ${worker.isAvailable ? 'available' : 'busy'}">
            ${worker.isAvailable ? 'Available Now' : 'Currently Busy'}
        </span>
    `;

    // Render reviews
    const reviewsContainer = document.getElementById('workerReviewsList');
    if (reviews.length === 0) {
        reviewsContainer.innerHTML = '<p class="text-secondary">No reviews yet</p>';
    } else {
        reviewsContainer.innerHTML = reviews.map(review => {
            const user = getUserById(review.userId);
            return `
                <div class="review-item">
                    <div class="review-header">
                        <div class="review-author">
                            <div class="review-avatar">${user ? user.name[0] : 'U'}</div>
                            <span>${user ? user.name : 'User'}</span>
                        </div>
                        <div class="review-stars">
                            ${'<i class="fas fa-star"></i>'.repeat(review.rating)}
                            ${'<i class="far fa-star"></i>'.repeat(5 - review.rating)}
                        </div>
                    </div>
                    <p class="review-text">${review.comment}</p>
                    <p class="review-date">${formatDate(review.createdAt)}</p>
                </div>
            `;
        }).join('');
    }

    // Setup book button
    const bookBtn = document.getElementById('bookWorkerBtn');
    if (worker.isAvailable) {
        bookBtn.onclick = () => {
            const currentUser = getCurrentUser();
            if (!currentUser || currentUser.type !== 'user') {
                showToast('Please login to book a service', 'warning');
                setTimeout(() => {
                    window.location.href = 'login.html?redirect=worker-profile.html?id=' + workerId;
                }, 1000);
                return;
            }
            window.location.href = `booking.html?workerId=${workerId}`;
        };
    } else {
        bookBtn.disabled = true;
        bookBtn.textContent = 'Currently Unavailable';
    }

    // Setup contact buttons
    document.getElementById('callWorkerBtn').onclick = () => {
        window.location.href = `tel:${worker.phone}`;
    };

    document.getElementById('whatsappWorkerBtn').onclick = () => {
        const message = encodeURIComponent(`Hi ${worker.name}, I found you on QuickFix and would like to book your service.`);
        window.open(`https://wa.me/${worker.phone.replace(/\D/g, '')}?text=${message}`, '_blank');
    };
}

// ===== Handle User Login =====
function handleUserLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    showLoading();

    setTimeout(() => {
        hideLoading();
        const user = loginUser(email, password);
        
        if (user) {
            showToast('Login successful!', 'success');
            setTimeout(() => {
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect');
                window.location.href = redirect || 'home.html';
            }, 1000);
        } else {
            showToast('Invalid email or password', 'error');
        }
    }, 1000);
}

// ===== Handle User Signup =====
function handleUserSignup(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        password: document.getElementById('password').value
    };

    const confirmPassword = document.getElementById('confirmPassword').value;

    if (formData.password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    if (formData.password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }

    showLoading();

    setTimeout(() => {
        hideLoading();
        const result = registerUser(formData);
        
        if (result.error) {
            showToast(result.error, 'error');
        } else {
            showToast('Account created successfully!', 'success');
            setTimeout(() => {
                window.location.href = 'home.html';
            }, 1000);
        }
    }, 1000);
}

// ===== Handle Worker Login =====
function handleWorkerLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    showLoading();

    setTimeout(() => {
        hideLoading();
        const result = loginWorker(email, password);
        
        if (result && result.error === 'pending') {
            showToast('Your account is pending approval from admin', 'warning');
        } else if (result) {
            showToast('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = 'worker-dashboard.html';
            }, 1000);
        } else {
            showToast('Invalid email or password', 'error');
        }
    }, 1000);
}

// ===== Handle Worker Signup =====
function handleWorkerSignup(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        categoryId: document.getElementById('skill').value,
        experience: document.getElementById('experience').value,
        password: document.getElementById('password').value
    };

    const confirmPassword = document.getElementById('confirmPassword').value;

    if (formData.password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    showLoading();

    setTimeout(() => {
        hideLoading();
        const result = registerWorker(formData);
        
        if (result.error) {
            showToast(result.error, 'error');
        } else {
            showToast('Registration successful! Awaiting admin approval.', 'success');
            setTimeout(() => {
                window.location.href = 'worker-login.html';
            }, 2000);
        }
    }, 1000);
}

// ===== Handle Admin Login =====
function handleAdminLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    showLoading();

    setTimeout(() => {
        hideLoading();
        const admin = loginAdmin(email, password);
        
        if (admin) {
            showToast('Login successful!', 'success');
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 1000);
        } else {
            showToast('Invalid admin credentials', 'error');
        }
    }, 1000);
}

// ===== Render User Home Page =====
function renderUserHome() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.type !== 'user') {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userAvatar').textContent = currentUser.name[0];

    // Render categories
    const categoriesContainer = document.getElementById('homeCategories');
    categoriesContainer.innerHTML = categories.map((cat, index) => `
        <a href="workers.html?category=${cat.id}" class="main-category-card animate-slideUp" style="animation-delay: ${index * 50}ms">
            <div class="category-icon" style="background: ${cat.color}; color: ${cat.iconColor}">
                <i class="${cat.icon}"></i>
            </div>
            <span>${cat.name}</span>
        </a>
    `).join('');

    // Render nearby workers
    const workersContainer = document.getElementById('nearbyWorkers');
    const nearbyWorkers = getApprovedWorkers()
        .filter(w => w.isAvailable)
        .slice(0, 4);

    workersContainer.innerHTML = nearbyWorkers.map((worker, index) => `
        <a href="worker-profile.html?id=${worker.id}" class="worker-card animate-slideUp" style="animation-delay: ${index * 100}ms">
            <div class="worker-header">
                <div class="worker-avatar">
                    <img src="${worker.avatar}" alt="${worker.name}">
                </div>
                <div class="worker-info">
                    <h4 class="worker-name">${worker.name}</h4>
                    <p class="worker-skill">${worker.skill}</p>
                </div>
            </div>
            <div class="worker-stats">
                <div class="worker-stat rating">
                    <i class="fas fa-star"></i>
                    <span>${worker.rating}</span>
                </div>
                <div class="worker-stat distance">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${(Math.random() * 2 + 0.5).toFixed(1)} km</span>
                </div>
                <span class="availability-badge available">Available</span>
            </div>
        </a>
    `).join('');
}

// ===== Render User Bookings =====
function renderUserBookings() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.type !== 'user') {
        window.location.href = 'login.html';
        return;
    }

    const bookings = getUserBookings(currentUser.id);
    const container = document.getElementById('bookingsList');

    if (bookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-calendar-alt"></i>
                <h3>No bookings yet</h3>
                <p>Book your first service to get started</p>
                <a href="home.html" class="btn btn-primary">Browse Services</a>
            </div>
        `;
        return;
    }

    container.innerHTML = bookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(booking => {
            const worker = getWorkerById(booking.workerId);
            return `
                <div class="job-card">
                    <div class="job-card-header">
                        <div class="job-customer">
                            <div class="job-customer-avatar">
                                <img src="${worker?.avatar}" alt="${worker?.name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">
                            </div>
                            <div class="job-customer-info">
                                <h4>${worker?.name || 'Worker'}</h4>
                                <p>${worker?.skill || booking.service}</p>
                            </div>
                        </div>
                        <span class="status-badge ${booking.status}">${booking.status}</span>
                    </div>
                    <div class="job-details">
                        <p><i class="fas fa-wrench"></i> ${booking.problemDescription}</p>
                        <p><i class="fas fa-clock"></i> ${booking.preferredTime}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${booking.address}</p>
                        ${booking.price ? `<p><i class="fas fa-rupee-sign"></i> <strong>${formatCurrency(booking.price)}</strong></p>` : ''}
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary);">
                        Booked on ${formatDate(booking.createdAt)}
                    </div>
                </div>
            `;
        }).join('');
}

// ===== Handle Booking Form =====
function handleBookingSubmit(event) {
    event.preventDefault();

    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.type !== 'user') {
        window.location.href = 'login.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const workerId = urlParams.get('workerId');
    const worker = getWorkerById(workerId);

    if (!worker) {
        showToast('Worker not found', 'error');
        return;
    }

    const bookingData = {
        userId: currentUser.id,
        workerId: workerId,
        categoryId: worker.categoryId,
        service: document.getElementById('service').value,
        problemDescription: document.getElementById('problem').value,
        preferredTime: document.getElementById('preferredTime').value,
        address: document.getElementById('address').value
    };

    showLoading();

    setTimeout(() => {
        hideLoading();
        const booking = createBooking(bookingData);
        showToast('Booking request sent successfully!', 'success');
        setTimeout(() => {
            window.location.href = 'my-bookings.html';
        }, 1500);
    }, 1500);
}

// ===== Render Booking Form =====
function renderBookingForm() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.type !== 'user') {
        window.location.href = 'login.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const workerId = urlParams.get('workerId');
    const worker = getWorkerById(workerId);

    if (!worker) {
        window.location.href = 'workers.html';
        return;
    }

    // Show worker info
    document.getElementById('bookingWorkerInfo').innerHTML = `
        <div class="booking-worker">
            <div class="worker-avatar" style="width:60px;height:60px">
                <img src="${worker.avatar}" alt="${worker.name}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">
            </div>
            <div>
                <h4>${worker.name}</h4>
                <p style="color:var(--primary)">${worker.skill}</p>
                <p style="font-size:0.9rem;color:var(--text-secondary)">${formatCurrency(worker.minCharge)} onwards</p>
            </div>
        </div>
    `;

    // Pre-fill address
    document.getElementById('address').value = currentUser.address;

    // Populate service options
    const category = getCategoryById(worker.categoryId);
    const serviceSelect = document.getElementById('service');
    if (category && category.services) {
        category.services.forEach(service => {
            const option = document.createElement('option');
            option.value = service;
            option.textContent = service;
            serviceSelect.appendChild(option);
        });
    }
}

// ===== Worker Dashboard Functions =====
function renderWorkerDashboard() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.type !== 'worker') {
        window.location.href = 'worker-login.html';
        return;
    }

    const worker = getWorkerById(currentUser.id);
    const bookings = getWorkerBookings(currentUser.id);

    // Update profile info
    document.getElementById('workerName').textContent = worker.name;
    document.getElementById('workerSkill').textContent = worker.skill;
    document.getElementById('workerAvatar').innerHTML = `<img src="${worker.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;

    // Update availability toggle
    const toggle = document.getElementById('availabilityToggle');
    toggle.checked = worker.isAvailable;
    document.getElementById('availabilityStatus').textContent = worker.isAvailable ? 'Online' : 'Offline';

    toggle.addEventListener('change', function() {
        updateWorkerAvailability(worker.id, this.checked);
        document.getElementById('availabilityStatus').textContent = this.checked ? 'Online' : 'Offline';
        showToast(this.checked ? 'You are now online' : 'You are now offline', 'success');
    });

    // Update stats
    const completed = bookings.filter(b => b.status === 'completed');
    const totalEarnings = completed.reduce((sum, b) => sum + (b.price || 0), 0);
    
    document.getElementById('statJobs').textContent = completed.length;
    document.getElementById('statEarnings').textContent = formatCurrency(totalEarnings);
    document.getElementById('statRating').textContent = worker.rating;
    document.getElementById('statReviews').textContent = worker.totalReviews;

    // Render pending requests
    const pendingBookings = bookings.filter(b => b.status === 'pending');
    const pendingContainer = document.getElementById('pendingRequests');

    if (pendingBookings.length === 0) {
        pendingContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>No pending requests</h3>
                <p>New job requests will appear here</p>
            </div>
        `;
    } else {
        pendingContainer.innerHTML = pendingBookings.map(booking => {
            const user = getUserById(booking.userId);
            return `
                <div class="job-card new">
                    <div class="job-card-header">
                        <div class="job-customer">
                            <div class="job-customer-avatar">${user?.name?.[0] || 'U'}</div>
                            <div class="job-customer-info">
                                <h4>${user?.name || 'Customer'}</h4>
                                <p>${booking.service || getCategoryById(booking.categoryId)?.name}</p>
                            </div>
                        </div>
                        <span class="status-badge pending">New Request</span>
                    </div>
                    <div class="job-details">
                        <p><i class="fas fa-exclamation-circle"></i> ${booking.problemDescription}</p>
                        <p><i class="fas fa-clock"></i> ${booking.preferredTime}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${booking.address}</p>
                    </div>
                    <div class="job-actions">
                        <button class="btn btn-danger btn-sm" onclick="handleJobAction('${booking.id}', 'rejected')">
                            <i class="fas fa-times"></i> Reject
                        </button>
                        <button class="btn btn-success btn-sm" onclick="handleJobAction('${booking.id}', 'accepted')">
                            <i class="fas fa-check"></i> Accept
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Render active jobs
    const activeBookings = bookings.filter(b => ['accepted', 'ongoing'].includes(b.status));
    const activeContainer = document.getElementById('activeJobs');

    if (activeBookings.length === 0) {
        activeContainer.innerHTML = `<p style="color:var(--text-secondary);text-align:center;padding:20px">No active jobs</p>`;
    } else {
        activeContainer.innerHTML = activeBookings.map(booking => {
            const user = getUserById(booking.userId);
            return `
                <div class="job-card">
                    <div class="job-card-header">
                        <div class="job-customer">
                            <div class="job-customer-avatar">${user?.name?.[0] || 'U'}</div>
                            <div class="job-customer-info">
                                <h4>${user?.name || 'Customer'}</h4>
                                <p>${user?.phone || ''}</p>
                            </div>
                        </div>
                        <span class="status-badge ${booking.status}">${booking.status}</span>
                    </div>
                    <div class="job-details">
                        <p><i class="fas fa-wrench"></i> ${booking.problemDescription}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${booking.address}</p>
                    </div>
                    <div class="job-actions">
                        ${booking.status === 'accepted' ? `
                            <button class="btn btn-primary btn-sm" onclick="handleJobAction('${booking.id}', 'ongoing')">
                                <i class="fas fa-play"></i> Start Job
                            </button>
                        ` : `
                            <button class="btn btn-success btn-sm" onclick="showCompleteModal('${booking.id}')">
                                <i class="fas fa-check-circle"></i> Complete Job
                            </button>
                        `}
                        <a href="tel:${user?.phone}" class="btn btn-secondary btn-sm">
                            <i class="fas fa-phone"></i> Call
                        </a>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function handleJobAction(bookingId, status) {
    updateBookingStatus(bookingId, status);
    showToast(`Job ${status}!`, 'success');
    renderWorkerDashboard();
}

function showCompleteModal(bookingId) {
    const modal = document.getElementById('completeModal');
    modal.classList.add('active');
    document.getElementById('completeBookingId').value = bookingId;
}

function closeCompleteModal() {
    document.getElementById('completeModal').classList.remove('active');
}

function handleCompleteJob(event) {
    event.preventDefault();
    const bookingId = document.getElementById('completeBookingId').value;
    const price = parseInt(document.getElementById('jobPrice').value);
    
    updateBookingStatus(bookingId, 'completed', price);
    closeCompleteModal();
    showToast('Job completed successfully!', 'success');
    renderWorkerDashboard();
}

// ===== Admin Dashboard Functions =====
function renderAdminDashboard() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.type !== 'admin') {
        window.location.href = 'admin-login.html';
        return;
    }

    const users = getUsers();
    const workers = getWorkers();
    const bookings = getBookings();

    // Update stats
    document.getElementById('statUsers').textContent = users.length;
    document.getElementById('statWorkers').textContent = workers.filter(w => w.isApproved).length;
    document.getElementById('statBookings').textContent = bookings.length;
    
    const totalRevenue = bookings
        .filter(b => b.status === 'completed' && b.price)
        .reduce((sum, b) => sum + b.price, 0);
    document.getElementById('statRevenue').textContent = formatCurrency(totalRevenue);

    // Pending approvals
    const pendingWorkers = getPendingWorkers();
    document.getElementById('pendingCount').textContent = pendingWorkers.length;

    // Render recent bookings
    const recentBookings = [...bookings]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    const tbody = document.getElementById('recentBookingsTable');
    tbody.innerHTML = recentBookings.map(booking => {
        const user = getUserById(booking.userId);
        const worker = getWorkerById(booking.workerId);
        return `
            <tr>
                <td>${booking.orderId || booking.id.slice(-8)}</td>
                <td>${user?.name || 'User'}</td>
                <td>${worker?.name || 'Worker'}</td>
                <td><span class="status-badge ${booking.status}">${booking.status}</span></td>
                <td>${booking.price ? formatCurrency(booking.price) : '-'}</td>
                <td>${formatDate(booking.createdAt)}</td>
            </tr>
        `;
    }).join('');
}

function renderAdminApprovals() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.type !== 'admin') {
        window.location.href = 'admin-login.html';
        return;
    }

    const pendingWorkers = getPendingWorkers();
    const container = document.getElementById('approvalsList');

    if (pendingWorkers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <h3>All caught up!</h3>
                <p>No pending worker approvals</p>
            </div>
        `;
        return;
    }

    container.innerHTML = pendingWorkers.map(worker => `
        <div class="job-card">
            <div class="job-card-header">
                <div class="job-customer">
                    <div class="job-customer-avatar">
                        <img src="${worker.avatar}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">
                    </div>
                    <div class="job-customer-info">
                        <h4>${worker.name}</h4>
                        <p>${worker.skill} - ${worker.experience}</p>
                    </div>
                </div>
                <span class="status-badge pending">Pending</span>
            </div>
            <div class="job-details">
                <p><i class="fas fa-envelope"></i> ${worker.email}</p>
                <p><i class="fas fa-phone"></i> ${worker.phone}</p>
                <p><i class="fas fa-calendar"></i> Applied on ${formatDate(worker.createdAt)}</p>
            </div>
            <div class="job-actions">
                <button class="btn btn-danger btn-sm" onclick="handleWorkerApproval('${worker.id}', false)">
                    <i class="fas fa-times"></i> Reject
                </button>
                <button class="btn btn-success btn-sm" onclick="handleWorkerApproval('${worker.id}', true)">
                    <i class="fas fa-check"></i> Approve
                </button>
            </div>
        </div>
    `).join('');
}

function handleWorkerApproval(workerId, approve) {
    if (approve) {
        approveWorker(workerId);
        showToast('Worker approved successfully!', 'success');
    } else {
        rejectWorker(workerId);
        showToast('Worker rejected', 'info');
    }
    renderAdminApprovals();
}

function renderAdminUsers() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.type !== 'admin') {
        window.location.href = 'admin-login.html';
        return;
    }

    const users = getUsers();
    const tbody = document.getElementById('usersTable');

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>
                <div style="display:flex;align-items:center;gap:10px">
                    <div style="width:36px;height:36px;border-radius:50%;background:var(--primary);color:white;display:flex;align-items:center;justify-content:center">${user.name[0]}</div>
                    ${user.name}
                </div>
            </td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${user.address}</td>
            <td>${formatDate(user.createdAt)}</td>
        </tr>
    `).join('');
}

function renderAdminWorkers() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.type !== 'admin') {
        window.location.href = 'admin-login.html';
        return;
    }

    const workers = getWorkers().filter(w => w.isActive);
    const tbody = document.getElementById('workersTable');

    tbody.innerHTML = workers.map(worker => `
        <tr>
            <td>
                <div style="display:flex;align-items:center;gap:10px">
                    <img src="${worker.avatar}" style="width:36px;height:36px;border-radius:50%">
                    ${worker.name}
                </div>
            </td>
            <td>${worker.skill}</td>
            <td>${worker.phone}</td>
            <td>${worker.rating} ⭐</td>
            <td>
                <span class="status-badge ${worker.isApproved ? 'completed' : 'pending'}">
                    ${worker.isApproved ? 'Approved' : 'Pending'}
                </span>
            </td>
            <td>
                <span class="availability-badge ${worker.isAvailable ? 'available' : 'busy'}">
                    ${worker.isAvailable ? 'Online' : 'Offline'}
                </span>
            </td>
        </tr>
    `).join('');
}

function renderAdminBookings() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.type !== 'admin') {
        window.location.href = 'admin-login.html';
        return;
    }

    const bookings = getBookings();
    const tbody = document.getElementById('bookingsTable');

    tbody.innerHTML = bookings
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .map(booking => {
            const user = getUserById(booking.userId);
            const worker = getWorkerById(booking.workerId);
            const category = getCategoryById(booking.categoryId);
            return `
                <tr>
                    <td>${booking.orderId || booking.id.slice(-8)}</td>
                    <td>${user?.name || 'User'}</td>
                    <td>${worker?.name || 'Worker'}</td>
                    <td>${category?.name || '-'}</td>
                    <td><span class="status-badge ${booking.status}">${booking.status}</span></td>
                    <td>${booking.price ? formatCurrency(booking.price) : '-'}</td>
                    <td>${formatDate(booking.createdAt)}</td>
                </tr>
            `;
        }).join('');
}

// ===== Logout Function =====
function handleLogout() {
    logout();
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = '../../index.html';
    }, 1000);
}

// ===== Check Auth =====
function checkAuth(requiredType) {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.type !== requiredType) {
        return false;
    }
    return true;
}

// ===== Demo Login Helpers =====
function fillDemoUserCredentials() {
    document.getElementById('email').value = 'aditya@example.com';
    document.getElementById('password').value = 'password123';
}

function fillDemoWorkerCredentials() {
    document.getElementById('email').value = 'amit.electrician@example.com';
    document.getElementById('password').value = 'worker123';
}

function fillDemoAdminCredentials() {
    document.getElementById('email').value = 'admin@quickfix.com';
    document.getElementById('password').value = 'admin123';
}

