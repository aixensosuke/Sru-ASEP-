class Auth {
    static async register(userData) {
        try {
            const response = await API.register(userData);
            if (response.success) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                return { success: true, user: response.user };
            } else {
                throw new Error(response.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: error.message || 'Registration failed. Please try again.'
            };
        }
    }

    static async login(credentials) {
        try {
            const response = await API.login(credentials);
            if (response.success) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                return { success: true, user: response.user };
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: error.message || 'Login failed. Please try again.'
            };
        }
    }

    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    }

    static isAuthenticated() {
        return !!localStorage.getItem('token');
    }

    static getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    static updateUser(userData) {
        localStorage.setItem('user', JSON.stringify(userData));
    }
}

// Add authentication check on page load
document.addEventListener('DOMContentLoaded', () => {
    const protectedPages = ['dashboard', 'messages', 'settings'];
    const currentPage = window.location.pathname.split('/').pop().split('.')[0];
    
    if (protectedPages.includes(currentPage) && !Auth.isAuthenticated()) {
        window.location.href = '/login.html';
    }
});
