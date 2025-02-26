class App {
    static init() {
        this.initChatbot();
        this.initNotifications();
        this.checkAuth();
    }

    static initChatbot() {
        if (!window.chatbot) {
            window.chatbot = new Chatbot();
        }
    }

    static initNotifications() {
        const notificationBell = document.querySelector('.notifications');
        if (notificationBell) {
            notificationBell.addEventListener('click', () => {
                // Toggle notifications panel
                this.toggleNotifications();
            });
        }
    }

    static checkAuth() {
        const token = localStorage.getItem('token');
        const loginLink = document.getElementById('loginLink');
        const logoutLink = document.getElementById('logoutLink');

        if (token) {
            loginLink.style.display = 'none';
            logoutLink.style.display = 'block';
        } else {
            loginLink.style.display = 'block';
            logoutLink.style.display = 'none';
        }
    }

    static toggleNotifications() {
        // Notifications panel implementation
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
