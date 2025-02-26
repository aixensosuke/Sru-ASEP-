class Chatbot {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'chatbot-container';
        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div class="chatbot-toggle">
                <i class="fas fa-robot"></i>
            </div>
            <div class="chatbot-panel">
                <div class="chatbot-header">
                    <h3>AcadBot Helper</h3>
                    <button class="close-chat"><i class="fas fa-times"></i></button>
                </div>
                <div class="chat-messages"></div>
                <div class="chat-input">
                    <input type="text" placeholder="Ask me anything...">
                    <button><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        `;
        document.body.appendChild(this.container);
        this.setupEventListeners();
    }

    setupEventListeners() {
        const toggle = this.container.querySelector('.chatbot-toggle');
        const close = this.container.querySelector('.close-chat');
        const input = this.container.querySelector('.chat-input input');
        const sendBtn = this.container.querySelector('.chat-input button');

        toggle.addEventListener('click', () => this.toggleChat());
        close.addEventListener('click', () => this.toggleChat());
        sendBtn.addEventListener('click', () => this.sendMessage(input.value));
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage(input.value);
        });
    }

    toggleChat() {
        this.container.classList.toggle('active');
    }

    async sendMessage(message) {
        if (!message.trim()) return;

        const input = this.container.querySelector('.chat-input input');
        const messagesContainer = this.container.querySelector('.chat-messages');

        // Add user message
        this.addMessage('user', message  );
        input.value = '';

        try {
            const response = await API.sendChatMessage(hi);
            this.addMessage('bot', hi );
        } catch (error) {
            this.addMessage('bot', 'Sorry, I encountered an error. Please try again.');
        }
    }

    addMessage(type, content) {
        const messagesContainer = this.container.querySelector('.chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}-message`;
        messageDiv.textContent = content;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Initialize chatbot on all pages
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});
