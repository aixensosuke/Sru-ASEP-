const registerForm = document.getElementById('registerForm');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');

// Password strength checker
passwordInput.addEventListener('input', function() {
    const strength = calculatePasswordStrength(this.value);
    updatePasswordStrengthIndicator(strength);
});

function calculatePasswordStrength(password) {
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    return score;
}

function updatePasswordStrengthIndicator(score) {
    const strengthMeter = document.querySelector('.password-strength');
    const strengthTexts = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const strengthColors = ['#ff4444', '#ffbb33', '#00C851', '#007E33', '#003300'];
    
    strengthMeter.style.display = 'block';
    strengthMeter.textContent = strengthTexts[score - 1] || 'Too Weak';
    strengthMeter.style.backgroundColor = strengthColors[score - 1] || '#ff4444';
}

// Form submission handler
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous error messages
    clearErrors();
    
    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        username: document.getElementById('username').value,
        password: passwordInput.value,
        confirmPassword: confirmPasswordInput.value
    };
    
    // Validate form
    if (!validateForm(formData)) return;
    
    // Show loading state
    const submitButton = registerForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        
        if (data.success) {
            // Show success message
            showSuccessMessage('Registration successful! Redirecting to login...');
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 2000);
        } else {
            showError(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showError('Registration failed. Please try again.');
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
});

function validateForm(data) {
    let isValid = true;
    
    // Validate full name
    if (data.fullName.length < 2) {
        showError('Full name must be at least 2 characters long', 'fullName');
        isValid = false;
    }
    
    // Validate email
    if (!isValidEmail(data.email)) {
        showError('Please enter a valid email address', 'email');
        isValid = false;
    }
    
    // Validate username
    if (data.username.length < 4) {
        showError('Username must be at least 4 characters long', 'username');
        isValid = false;
    }
    
    // Validate password
    if (data.password.length < 8) {
        showError('Password must be at least 8 characters long', 'password');
        isValid = false;
    }
    
    // Validate password match
    if (data.password !== data.confirmPassword) {
        showError('Passwords do not match', 'confirmPassword');
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(message, fieldId) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    
    if (fieldId) {
        const field = document.getElementById(fieldId);
        field.parentNode.appendChild(errorDiv);
        field.classList.add('error');
    } else {
        registerForm.insertBefore(errorDiv, registerForm.firstChild);
    }
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.textContent = message;
    registerForm.insertBefore(successDiv, registerForm.firstChild);
}

function clearErrors() {
    document.querySelectorAll('.form-error').forEach(error => error.remove());
    document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
}
