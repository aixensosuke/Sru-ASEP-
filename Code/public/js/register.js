class RegisterForm {
    constructor() {
        this.form = document.getElementById('registerForm');
        this.submitButton = this.form.querySelector('button[type="submit"]');
        this.errorMessages = {
            username: document.getElementById('username-error'),
            email: document.getElementById('email-error'),
            password: document.getElementById('password-error'),
            confirm: document.getElementById('confirm-password-error'),
            form: document.getElementById('form-error')
        };
        this.init();
    }

    init() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit();
        });

        // Real-time password match validation
        document.getElementById('confirmPassword').addEventListener('input', (e) => {
            const password = document.getElementById('password').value;
            if (e.target.value && e.target.value !== password) {
                this.errorMessages.confirm.textContent = 'Passwords do not match';
            } else {
                this.errorMessages.confirm.textContent = '';
            }
        });
    }

    validateForm() {
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const fullName = document.getElementById('fullName').value;

        // Reset errors
        Object.values(this.errorMessages).forEach(el => el.textContent = '');

        // Validation checks
        if (password !== confirmPassword) {
            this.errorMessages.confirm.textContent = 'Passwords do not match';
            return false;
        }

        if (password.length < 6) {
            this.errorMessages.password.textContent = 'Password must be at least 6 characters';
            return false;
        }

        if (username.length < 3) {
            this.errorMessages.username.textContent = 'Username must be at least 3 characters';
            return false;
        }

        return {
            username,
            email,
            password,
            fullName
        };
    }

    async handleSubmit() {
        try {
            this.clearErrors();
            this.setLoading(true);

            // Check server status first
            const isServerActive = await this.checkServerStatus();
            if (!isServerActive) {
                throw new Error('Server is not running. Please start the server and try again.');
            }

            const formData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                username: document.getElementById('username').value,
                password: document.getElementById('password').value
            };

            const response = await API.register(formData);

            if (response.success) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                window.location.href = '/pages/dashboard.html';
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.showError(error.message);
        } finally {
            this.setLoading(false);
        }
    }

    async checkServerStatus() {
        try {
            const response = await fetch('http://localhost:5000/api/health');
            const data = await response.json();
            return data.status === 'active';
        } catch (error) {
            console.error('Server check failed:', error);
            return false;
        }
    }

    setLoading(isLoading) {
        this.submitButton.disabled = isLoading;
        this.submitButton.innerHTML = isLoading ? 
            '<i class="fas fa-spinner fa-spin"></i> Registering...' : 
            'Register';
    }

    showError(message) {
        const serverError = document.getElementById('serverError');
        serverError.textContent = message;
        serverError.style.display = 'block';
    }

    clearErrors() {
        Object.values(this.errorMessages).forEach(element => {
            if (element) element.textContent = '';
        });
    }
}

// Initialize form handler
document.addEventListener('DOMContentLoaded', () => {
    new RegisterForm();
});
