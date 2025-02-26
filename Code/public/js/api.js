const API_URL = 'http://localhost:5000/api';

class API {
    static async request(endpoint, options = {}) {
        try {
            const token = localStorage.getItem('token');
            const defaultHeaders = {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            };

            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers: {
                    ...defaultHeaders,
                    ...options.headers
                },
                mode: 'cors'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Server error');
            }

            return await response.json();
        } catch (error) {
            console.error(`API Error (${endpoint}):`, error);
            if (error.message === 'Failed to fetch') {
                throw new Error('Server is not responding. Please check if the server is running.');
            }
            throw error;
        }
    }

    static async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    static async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    static async getTasks() {
        return this.request('/tasks');
    }

    static async createTask(taskData) {
        return this.request('/tasks', {
            method: 'POST',
            body: JSON.stringify(taskData)
        });
    }

    static async updateTask(taskId, taskData) {
        return this.request(`/tasks/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify(taskData)
        });
    }

    static async deleteTask(taskId) {
        return this.request(`/tasks/${taskId}`, {
            method: 'DELETE'
        });
    }

    static async sendMessage(recipientId, content) {
        return this.request('/messages', {
            method: 'POST',
            body: JSON.stringify({ recipientId, content })
        });
    }
}

window.API = API;
