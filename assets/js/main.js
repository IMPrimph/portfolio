/*==================== SDE3 BACKEND ENGINEER PORTFOLIO JS ====================*/

document.addEventListener('DOMContentLoaded', function() {
    // Subtle typing effect for the title
    const titleElement = document.querySelector('.title');
    if (titleElement) {
        const originalText = titleElement.textContent;
        titleElement.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                titleElement.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 500);
    }

    // Tech stack hover effects with performance metrics
    const techItems = document.querySelectorAll('.tech-item');
    const performanceData = {
        'Java': 'Enterprise scale • High performance',
        'Python': 'ML & Data • Rapid development',
        'Node.js': 'Real-time • Event-driven',
        'Spring Boot': 'Microservices • Production ready',
        'PostgreSQL': 'ACID compliance • Scalable',
        'Redis': 'Sub-ms latency • Caching',
        'Kubernetes': 'Container orchestration',
        'AWS': 'Cloud infrastructure',
        'Docker': 'Containerization',
        'MongoDB': 'Document store • NoSQL'
    };

    techItems.forEach(item => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tech-tooltip';
        tooltip.textContent = performanceData[item.textContent] || 'Core technology';
        item.appendChild(tooltip);

        item.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(-5px)';
        });

        item.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(0)';
        });
    });

    // Add tooltip styles dynamically
    const tooltipStyle = document.createElement('style');
    tooltipStyle.textContent = `
        .tech-tooltip {
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: var(--bg-primary);
            color: var(--text-primary);
            padding: 0.5rem;
            border-radius: 4px;
            font-size: 0.7rem;
            white-space: nowrap;
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: none;
            z-index: 10;
            border: 1px solid var(--border-color);
            font-family: var(--font-mono);
        }
        .tech-item {
            position: relative;
            overflow: visible;
        }
    `;
    document.head.appendChild(tooltipStyle);

    // Experience counter animation
    const counters = document.querySelectorAll('.number');
    const animateCounter = (counter) => {
        const target = counter.textContent;
        const isPercentage = target.includes('%');
        const isPlus = target.includes('+');
        const numericValue = parseFloat(target.replace(/[^\d.]/g, ''));
        
        let currentValue = 0;
        const increment = numericValue / 30;
        
        const updateCounter = () => {
            if (currentValue < numericValue) {
                currentValue += increment;
                if (isPercentage) {
                    counter.textContent = Math.floor(currentValue) + '%';
                } else if (isPlus) {
                    counter.textContent = Math.floor(currentValue) + '+';
                } else {
                    counter.textContent = Math.floor(currentValue);
                }
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        setTimeout(updateCounter, 1000);
    };

    // Intersection observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // Smooth reveal animations for sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll('.project-item, .timeline-item, .education-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        sectionObserver.observe(el);
    });

    // Add subtle parallax effect to left panel
    const leftPanel = document.querySelector('.left-panel');
    let ticking = false;

    const updateParallax = () => {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.02;
        
        if (leftPanel) {
            leftPanel.style.transform = `translateY(${parallax}px)`;
        }
        
        ticking = false;
    };

    const requestTick = () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    };

    window.addEventListener('scroll', requestTick);

    // Add hover sound effect simulation (visual feedback)
    const interactiveElements = document.querySelectorAll('.contact-link, .tech-item, .project-item');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.1)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.boxShadow = '';
        });
    });

    // Add focus states for accessibility
    const focusableElements = document.querySelectorAll('a, button');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid var(--accent-primary)';
            element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = '';
            element.style.outlineOffset = '';
        });
    });

    // Performance optimization: debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            // Additional scroll-based animations can be added here
            console.log('Scroll optimized');
        }, 100);
    });

    console.log('🚀 SDE3 Backend Engineer Portfolio loaded successfully');
});