document.addEventListener('DOMContentLoaded', () => {
    // Initialize dashboard components
    loadDashboardData();
    setupEventListeners();
    initializeUI();
});

async function loadDashboardData() {
    try {
        const [events, messages, stats, announcements] = await Promise.all([
            fetchEvents(),
            fetchMessages(),
            fetchStats(),
            fetchAnnouncements()
        ]);

        updateDashboard(events, messages, stats, announcements);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

function updateDashboard(events, messages, stats, announcements) {
    // Update events list
    const eventsList = document.getElementById('events-list');
    events.forEach(event => {
        eventsList.innerHTML += `
            <div class="event-item" onclick="showEventDetails(${event.id})">
                <h4>${event.title}</h4>
                <p>${event.date}</p>
                <p>${event.location}</p>
            </div>
        `;
    });

    // Update messages list
    const messagesList = document.getElementById('messages-list');
    messages.forEach(message => {
        messagesList.innerHTML += `
            <div class="message-item">
                <strong>${message.sender}</strong>
                <p>${message.preview}</p>
            </div>
        `;
    });

    // Update stats
    const statsContainer = document.getElementById('stats-container');
    Object.entries(stats).forEach(([key, value]) => {
        statsContainer.innerHTML += `
            <div class="stat-item">
                <h4>${key}</h4>
                <p>${value}</p>
            </div>
        `;
    });

    // Update announcements
    const announcementsList = document.getElementById('announcements-list');
    announcements.forEach(announcement => {
        announcementsList.innerHTML += `
            <div class="announcement-item">
                <h4>${announcement.title}</h4>
                <p>${announcement.content}</p>
            </div>
        `;
    });
}

// Update fetch functions to use real API
async function fetchEvents() {
    const response = await fetch('/api/events');
    return await response.json();
}

async function fetchMessages() {
    const response = await fetch('/api/messages');
    return await response.json();
}

async function fetchStats() {
    const response = await fetch('/api/stats');
    return await response.json();
}

async function fetchAnnouncements() {
    const response = await fetch('/api/announcements');
    return await response.json();
}

function setupEventListeners() {
    // Add event listeners for interactive elements
    document.querySelector('.search-bar input').addEventListener('input', handleSearch);
    document.querySelector('.notifications').addEventListener('click', handleNotifications);
    
    // Add login/logout handling
    document.getElementById('logoutLink').addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/logout', {
                method: 'POST'
            });
            const data = await response.json();
            if (data.success) {
                window.location.href = '/login.html';
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    });

    // Check login status on page load
    checkLoginStatus();
}

async function checkLoginStatus() {
    try {
        const response = await fetch('/api/checkLogin');
        const data = await response.json();
        updateLoginUI(data.isLoggedIn);
    } catch (error) {
        console.error('Login check error:', error);
    }
}

function updateLoginUI(isLoggedIn) {
    const loginLink = document.getElementById('loginLink');
    const logoutLink = document.getElementById('logoutLink');
    
    if (isLoggedIn) {
        loginLink.style.display = 'none';
        logoutLink.style.display = 'block';
    } else {
        loginLink.style.display = 'block';
        logoutLink.style.display = 'none';
    }
}

async function handleSearch(e) {
    const searchTerm = e.target.value;
    if (searchTerm.length < 2) return;

    try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
        const results = await response.json();
        displaySearchResults(results);
    } catch (error) {
        console.error('Search error:', error);
    }
}

function displaySearchResults(results) {
    const eventsDiv = document.getElementById('events-list');
    const messagesDiv = document.getElementById('messages-list');
    const announcementsDiv = document.getElementById('announcements-list');

    // Clear existing content
    eventsDiv.innerHTML = '';
    messagesDiv.innerHTML = '';
    announcementsDiv.innerHTML = '';

    // Update with search results
    results.events.forEach(event => {
        eventsDiv.innerHTML += `
            <div class="event-item" onclick="showEventDetails(${event.id})">
                <h4>${event.title}</h4>
                <p>${event.date}</p>
                <p>${event.location}</p>
            </div>
        `;
    });

    // Similar updates for messages and announcements
    results.messages.forEach(message => {
        messagesDiv.innerHTML += `
            <div class="message-item">
                <strong>${message.sender}</strong>
                <p>${message.preview}</p>
            </div>
        `;
    });

    results.announcements.forEach(announcement => {
        announcementsDiv.innerHTML += `
            <div class="announcement-item">
                <h4>${announcement.title}</h4>
                <p>${announcement.content}</p>
            </div>
        `;
    });
}

function handleNotifications() {
    const notificationPanel = document.createElement('div');
    notificationPanel.className = 'notification-panel';
    notificationPanel.innerHTML = `
        <div class="notification-header">
            <h3>Notifications</h3>
            <button onclick="closeNotifications()">×</button>
        </div>
        <div class="notification-list">
            <div class="notification-item">
                <i class="fas fa-envelope"></i>
                <p>New message from Dr. Smith</p>
                <span>2 min ago</span>
            </div>
            <div class="notification-item">
                <i class="fas fa-calendar"></i>
                <p>Upcoming event: Faculty Meeting</p>
                <span>1 hour ago</span>
            </div>
        </div>
    `;
    document.body.appendChild(notificationPanel);
}

function closeNotifications() {
    const panel = document.querySelector('.notification-panel');
    if (panel) panel.remove();
}

function showEventDetails(eventId) {
    // Create and show modal with event details
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>${event.title}</h2>
            <p><strong>Date:</strong> ${event.date}</p>
            <p><strong>Location:</strong> ${event.location}</p>
            <p><strong>Description:</strong> ${event.description}</p>
            <button onclick="this.parentElement.parentElement.remove()">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Add navigation handling
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = e.target.getAttribute('href').substring(1);
        loadSection(section);
    });
});

function loadSection(section) {
    // Handle section loading
    const mainContent = document.querySelector('.dashboard-grid');
    switch(section) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'messages':
            loadMessages();
            break;
        case 'calendar':
            loadCalendar();
            break;
        // Add other section handlers
    }
}

// Initialize tooltips and other UI enhancements
function initializeUI() {
    // Add tooltip functionality
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(element => {
        element.addEventListener('mouseover', showTooltip);
        element.addEventListener('mouseout', hideTooltip);
    });
    
    initializeSlider();
    
    // Add scroll animations
    const animatedElements = document.querySelectorAll('.feature-card, .news-card, .resource-link');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s, transform 0.5s';
        observer.observe(element);
    });
}

// Hero Slider functionality
function initializeSlider() {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slide-controls .prev');
    const nextBtn = document.querySelector('.slide-controls .next');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Auto-advance slides
    setInterval(nextSlide, 5000);
}
