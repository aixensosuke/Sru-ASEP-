class MessageSystem {
    constructor() {
        this.messages = {};
        this.currentContact = null;
        this.messageContainer = document.querySelector('.messages');
        this.messageInput = document.querySelector('.message-input input');
        this.sendButton = document.querySelector('.send-btn');
        this.init();
    }

    init() {
        this.loadMessages();
        this.attachEventListeners();
        this.setupContacts();
    }

    loadMessages() {
        this.messages = JSON.parse(localStorage.getItem('messages')) || {
            'contact1': [
                { sent: true, text: 'Hello!', timestamp: new Date().toISOString() },
                { sent: false, text: 'Hi there!', timestamp: new Date().toISOString() }
            ]
        };
    }

    attachEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        document.querySelectorAll('.contact').forEach(contact => {
            contact.addEventListener('click', () => {
                this.switchContact(contact.dataset.id);
            });
        });
    }

    sendMessage() {
        const text = this.messageInput.value.trim();
        if (text && this.currentContact) {
            const message = {
                sent: true,
                text: text,
                timestamp: new Date().toISOString()
            };
            
            if (!this.messages[this.currentContact]) {
                this.messages[this.currentContact] = [];
            }
            
            this.messages[this.currentContact].push(message);
            this.saveMessages();
            this.renderMessages();
            this.messageInput.value = '';
        }
    }

    switchContact(contactId) {
        this.currentContact = contactId;
        document.querySelectorAll('.contact').forEach(c => 
            c.classList.toggle('active', c.dataset.id === contactId)
        );
        this.renderMessages();
    }

    renderMessages() {
        if (!this.currentContact) return;
        
        const messages = this.messages[this.currentContact] || [];
        this.messageContainer.innerHTML = messages
            .map(msg => `
                <div class="message ${msg.sent ? 'sent' : 'received'}">
                    <div class="message-content">
                        ${msg.text}
                        <span class="message-time">
                            ${new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                </div>
            `).join('');
        
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    }

    saveMessages() {
        localStorage.setItem('messages', JSON.stringify(this.messages));
    }
}

const messageSystem = new MessageSystem();
