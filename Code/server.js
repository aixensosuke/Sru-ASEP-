const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Add session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Database mock
const db = {
    events: [
        { id: 1, title: 'Faculty Meeting', date: '2024-01-20 14:00', location: 'Room 101', description: 'Monthly faculty meeting' },
        { id: 2, title: 'Research Presentation', date: '2024-01-22 10:00', location: 'Auditorium', description: 'PhD candidates presentations' },
        { id: 3, title: 'Workshop: Academic Writing', date: '2024-01-25 15:00', location: 'Library', description: 'Writing skills workshop' }
    ],
    messages: [
        { id: 1, sender: 'Dr. Smith', subject: 'Conference Update', preview: 'Regarding the upcoming conference...', full: 'The conference schedule has been finalized. Please review your presentation time.' },
        { id: 2, sender: 'Prof. Johnson', subject: 'Research Feedback', preview: 'Research proposal feedback', full: 'I've reviewed your research proposal. Let's discuss the methodology section.' }
    ],
    announcements: [
        { id: 1, title: 'New Research Grant', content: 'Applications now open for 2024 research grants. Deadline: March 1st', date: '2024-01-15' },
        { id: 2, title: 'System Maintenance', content: 'Scheduled maintenance on January 25th, 22:00-23:00', date: '2024-01-18' }
    ],
    users: [
        {
            id: 1,
            username: 'admin',
            password: '$2b$10$YourHashedPasswordHere',
            role: 'admin',
            fullName: 'Admin User',
            email: 'admin@example.com'
        }
    ],
    resetTokens: []
};

// Forum database mock
db.questions = [
    {
        id: 1,
        title: "Understanding Quantum Mechanics",
        content: "Can someone explain the double-slit experiment?",
        author: "student123",
        category: "physics",
        timestamp: new Date("2024-01-15"),
        votes: 5,
        tags: ["quantum-physics", "experiments"],
        answers: [
            {
                id: 1,
                content: "The double-slit experiment demonstrates wave-particle duality...",
                author: "prof_physics",
                timestamp: new Date("2024-01-16"),
                votes: 3
            }
        ]
    }
];

// Setup email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password'
    }
});

// Authentication middleware
const authMiddleware = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login.html');
    }
};

// Apply auth middleware to protected routes
app.use('/api', authMiddleware);

// Routes
app.get('/api/events', (req, res) => {
    res.json(db.events);
});

app.get('/api/messages', (req, res) => {
    res.json(db.messages);
});

app.get('/api/announcements', (req, res) => {
    res.json(db.announcements);
});

app.get('/api/stats', (req, res) => {
    res.json({
        'Active Projects': 12,
        'Pending Reviews': 5,
        'Upcoming Deadlines': 3,
        'New Messages': db.messages.length
    });
});

app.get('/api/search', (req, res) => {
    const query = req.query.q.toLowerCase();
    const results = {
        events: db.events.filter(event => 
            event.title.toLowerCase().includes(query) || 
            event.description.toLowerCase().includes(query)
        ),
        messages: db.messages.filter(message => 
            message.subject.toLowerCase().includes(query) || 
            message.preview.toLowerCase().includes(query)
        ),
        announcements: db.announcements.filter(announcement => 
            announcement.title.toLowerCase().includes(query) || 
            announcement.content.toLowerCase().includes(query)
        )
    };
    res.json(results);
});

// Add login status check endpoint
app.get('/api/checkLogin', (req, res) => {
    res.json({ isLoggedIn: !!req.session.userId });
});

// Auth routes
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = db.users.find(u => u.username === username);
    
    if (user && await bcrypt.compare(password, user.password)) {
        req.session.userId = user.id;
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
    const { username, password, email, fullName } = req.body;
    
    // Check if user exists
    if (db.users.find(u => u.username === username || u.email === email)) {
        return res.status(400).json({ error: 'Username or email already exists' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            id: db.users.length + 1,
            username,
            password: hashedPassword,
            email,
            fullName,
            role: 'user',
            created: new Date()
        };

        db.users.push(newUser);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Password reset request
app.post('/api/reset-password-request', async (req, res) => {
    const { email } = req.body;
    const user = db.users.find(u => u.email === email);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    db.resetTokens.push({
        token,
        userId: user.id,
        expiry
    });

    const resetLink = `http://localhost:3000/reset-password.html?token=${token}`;
    
    try {
        await transporter.sendMail({
            to: email,
            subject: 'Password Reset Request',
            html: `Click <a href="${resetLink}">here</a> to reset your password.`
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send reset email' });
    }
});

// Password reset
app.post('/api/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    const resetRequest = db.resetTokens.find(r => r.token === token);

    if (!resetRequest || new Date() > resetRequest.expiry) {
        return res.status(400).json({ error: 'Invalid or expired token' });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const user = db.users.find(u => u.id === resetRequest.userId);
        user.password = hashedPassword;

        // Remove used token
        db.resetTokens = db.resetTokens.filter(r => r.token !== token);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Password reset failed' });
    }
});

// Forum routes
app.get('/api/forum/questions', (req, res) => {
    res.json(db.questions);
});

app.post('/api/forum/questions', authMiddleware, async (req, res) => {
    const { title, content, category, tags } = req.body;
    const question = {
        id: db.questions.length + 1,
        title,
        content,
        category,
        tags: tags.split(',').map(tag => tag.trim()),
        author: req.session.username,
        timestamp: new Date(),
        votes: 0,
        answers: []
    };
    
    db.questions.push(question);
    res.json({ success: true, questionId: question.id });
});

app.post('/api/forum/questions/:id/answers', authMiddleware, (req, res) => {
    const { content } = req.body;
    const questionId = parseInt(req.params.id);
    const question = db.questions.find(q => q.id === questionId);
    
    if (!question) {
        return res.status(404).json({ error: 'Question not found' });
    }
    
    const answer = {
        id: question.answers.length + 1,
        content,
        author: req.session.username,
        timestamp: new Date(),
        votes: 0
    };
    
    question.answers.push(answer);
    res.json({ success: true, answerId: answer.id });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
