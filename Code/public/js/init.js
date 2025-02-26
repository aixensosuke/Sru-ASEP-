import { AuthManager } from './utils.js';

class AppInitializer {
    static init() {
        this.setupGlobalErrorHandling();
        this.checkAuthentication();
        this.initializeComponents();
        this.setupServiceWorker();
    }

    static setupGlobalErrorHandling() {
        window.onerror = (msg, url, lineNo, columnNo, error) => {
            console.error('Global error:', error);
            return false;
        };

        window.addEventListener('unhandledrejection', event => {
            console.error('Unhandled promise rejection:', event.reason);
        });
    }

    static checkAuthentication() {
        const publicPages = ['login.html', 'register.html', 'index.html'];
        const currentPage = window.location.pathname.split('/').pop();

        if (!publicPages.includes(currentPage) && !AuthManager.isAuthenticated()) {
            window.location.href = '/login.html';
        }
    }

    static initializeComponents() {
        // Initialize chatbot if not on login/register pages
        if (!window.location.pathname.includes('login') && 
            !window.location.pathname.includes('register')) {
            new Chatbot();
        }

        // Initialize page-specific components
        const pageInitializers = {
            'dashboard.html': () => new DashboardManager(),
            'whiteboard.html': () => new Whiteboard(),
            'messages.html': () => new MessageSystem()
        };

        const currentPage = window.location.pathname.split('/').pop();
        if (pageInitializers[currentPage]) {
            pageInitializers[currentPage]();
        }
    }

    static async setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/service-worker.js');
                console.log('Service Worker registered');
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    AppInitializer.init();
});
