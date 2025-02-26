export class LoadingManager {
    static showLoading(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.add('loading');
            element.innerHTML = '<div class="loader"></div>';
        }
    }

    static hideLoading(elementId, originalContent) {
        const element = document.getElementById(elementId);
        if (element) {
            element.classList.remove('loading');
            if (originalContent) element.innerHTML = originalContent;
        }
    }
}

export class ErrorHandler {
    static async handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);

        if (error.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login.html';
            return;
        }

        this.showErrorMessage(error.message || 'An unexpected error occurred');
    }

    static showErrorMessage(message) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'error-toast';
        errorContainer.textContent = message;
        document.body.appendChild(errorContainer);

        setTimeout(() => {
            errorContainer.remove();
        }, 5000);
    }
}

export class AuthManager {
    static isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    static checkAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '/login.html';
            return false;
        }
        return true;
    }

    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    }
}
