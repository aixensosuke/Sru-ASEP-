class AnimationManager {
    static initPageTransitions() {
        document.querySelectorAll('a[href]').forEach(link => {
            if (link.href.includes(window.location.origin)) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = link.getAttribute('href');
                    document.body.classList.add('page-transitioning');
                    setTimeout(() => {
                        window.location.href = target;
                    }, 500);
                });
            }
        });
    }

    static initScrollAnimations() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(element => observer.observe(element));
    }

    static addLoadingState(element) {
        element.classList.add('loading-state');
        return () => element.classList.remove('loading-state');
    }

    static initImageLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}
