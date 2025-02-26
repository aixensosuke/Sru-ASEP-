class Navigation {
    static init() {
        this.setupActiveLinks();
        this.setupQuickAccess();
        this.setupNavigation();
        this.setupForumIntegration();
    }

    static setupActiveLinks() {
        const currentPath = window.location.pathname;
        document.querySelectorAll('.nav-links a').forEach(link => {
            if (link.getAttribute('href') === currentPath.split('/').pop()) {
                link.classList.add('active');
            }
        });
    }

    static setupQuickAccess() {
        const quickAccess = {
            'Ctrl+W': '/pages/whiteboard.html',
            'Ctrl+M': '/pages/messages.html',
            'Ctrl+D': '/pages/documents.html',
            'Ctrl+F': '/pages/forum.html'
        };

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                const path = quickAccess[`Ctrl+${e.key.toUpperCase()}`];
                if (path) {
                    e.preventDefault();
                    window.location.href = path;
                }
            }
        });
    }

    static setupNavigation() {
        // Handle navigation item clicks
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    this.navigateToSection(link.getAttribute('href').substring(1));
                }
            });
        });
    }

    static navigateToSection(section) {
        // Add loading state
        const main = document.querySelector('main');
        const removeLoading = AnimationManager.addLoadingState(main);

        // Simulate loading delay for smooth transition
        setTimeout(() => {
            this.loadSectionContent(section);
            removeLoading();
        }, 500);
    }

    static setupForumIntegration() {
        // Handle forum navigation and integration
        const forumLink = document.querySelector('a[href="forum.html"]');
        if (forumLink) {
            forumLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.loadForumContent();
            });
        }
    }

    static async loadForumContent() {
        const main = document.querySelector('main');
        const removeLoading = AnimationManager.addLoadingState(main);

        try {
            const response = await fetch('forum.html');
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const forumContent = doc.querySelector('.content').innerHTML;

            main.innerHTML = forumContent;
            history.pushState({}, '', '/forum.html');
            
            // Initialize forum functionality
            if (typeof ForumManager !== 'undefined') {
                ForumManager.init();
            }
        } catch (error) {
            console.error('Error loading forum:', error);
        } finally {
            removeLoading();
        }
    }
}
