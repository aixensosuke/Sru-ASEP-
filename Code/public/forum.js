let currentQuestions = [];
let currentFilter = '';
let currentSort = 'newest';

document.addEventListener('DOMContentLoaded', () => {
    loadQuestions();
    setupEventListeners();
});

function setupEventListeners() {
    // Ask Question button
    document.getElementById('askQuestionBtn').addEventListener('click', showQuestionModal);
    
    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
        currentFilter = e.target.value;
        filterQuestions();
    });
    
    // Search input
    document.querySelector('.search-bar input').addEventListener('input', debounce((e) => {
        searchQuestions(e.target.value);
    }, 300));

    // Question form submission
    document.getElementById('questionForm').addEventListener('submit', handleQuestionSubmit);
}

async function loadQuestions() {
    try {
        const response = await fetch('/api/forum/questions');
        currentQuestions = await response.json();
        displayQuestions(currentQuestions);
    } catch (error) {
        console.error('Error loading questions:', error);
        showError('Failed to load questions');
    }
}

function displayQuestions(questions) {
    const questionsList = document.getElementById('questionsList');
    questionsList.innerHTML = '';

    questions.forEach(question => {
        questionsList.innerHTML += `
            <div class="question-card" data-id="${question.id}">
                <div class="question-header">
                    <h3 class="question-title">${question.title}</h3>
                    <span class="question-category">${question.category}</span>
                </div>
                <div class="question-meta">
                    <span><i class="fas fa-user"></i> ${question.author}</span>
                    <span><i class="fas fa-clock"></i> ${formatDate(question.timestamp)}</span>
                    <span><i class="fas fa-comment"></i> ${question.answers.length} answers</span>
                </div>
                <div class="question-content">
                    ${question.content}
                </div>
                <div class="tag-list">
                    ${question.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="question-actions">
                    <button class="action-button vote-button" onclick="handleVote(${question.id}, 'up')">
                        <i class="fas fa-arrow-up"></i> ${question.votes}
                    </button>
                    <button class="action-button answer-button" onclick="showAnswerModal(${question.id})">
                        <i class="fas fa-reply"></i> Answer
                    </button>
                </div>
                ${question.answers.length > 0 ? renderAnswers(question.answers) : ''}
            </div>
        `;
    });
}

function renderAnswers(answers) {
    return `
        <div class="answer-section">
            ${answers.map(answer => `
                <div class="answer-card">
                    <div class="question-meta">
                        <span><i class="fas fa-user"></i> ${answer.author}</span>
                        <span><i class="fas fa-clock"></i> ${formatDate(answer.timestamp)}</span>
                    </div>
                    <div class="question-content">
                        ${answer.content}
                    </div>
                    <div class="question-actions">
                        <button class="action-button vote-button" onclick="handleVote(${answer.id}, 'up', 'answer')">
                            <i class="fas fa-arrow-up"></i> ${answer.votes}
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

async function handleQuestionSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    try {
        const response = await fetch('/api/forum/questions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });
        
        if (response.ok) {
            closeModal();
            loadQuestions();
            showSuccess('Question posted successfully!');
        }
    } catch (error) {
        console.error('Error posting question:', error);
        showError('Failed to post question');
    }
}

function filterQuestions() {
    let filtered = [...currentQuestions];
    if (currentFilter) {
        filtered = filtered.filter(q => q.category === currentFilter);
    }
    displayQuestions(filtered);
}

function searchQuestions(query) {
    if (!query) {
        displayQuestions(currentQuestions);
        return;
    }
    
    const filtered = currentQuestions.filter(q => 
        q.title.toLowerCase().includes(query.toLowerCase()) ||
        q.content.toLowerCase().includes(query.toLowerCase()) ||
        q.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
    displayQuestions(filtered);
}

// Utility functions
function formatDate(timestamp) {
    return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showSuccess(message) {
    // Implement success toast notification
}

function showError(message) {
    // Implement error toast notification
}