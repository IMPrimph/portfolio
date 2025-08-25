let portfolioData = null;

// Load content from JSON file
async function loadContent() {
    try {
        const response = await fetch('assets/data/content.json');
        portfolioData = await response.json();
        renderContent();
    } catch (error) {
        console.error('Error loading content:', error);
        // Fallback content in case JSON fails to load
        portfolioData = {
            personal: {
                name: "Vishnu Gajulapalli",
                title: "Senior Backend Engineer",
                bio: "Senior Backend Engineer with 3+ years of experience building scalable distributed systems.",
                location: "Hyderabad, India"
            }
        };
        renderContent();
    }
}

// Render all content to HTML
function renderContent() {
    if (!portfolioData) return;

    // Update page title and header
    document.getElementById('page-title').textContent = portfolioData.personal.name;
    document.getElementById('name').textContent = portfolioData.personal.name;
    document.getElementById('title').textContent = portfolioData.personal.title;
    document.getElementById('bio').textContent = portfolioData.personal.bio;
    document.getElementById('location').textContent = `Based in ${portfolioData.personal.location}`;

    // Render skills
    renderSkills();

    // Render experience
    renderExperience();

    // Render projects
    renderProjects();

    // Render achievements
    renderAchievements();

    // Render contact links
    renderContact();

    // Render education
    renderEducation();
}

function renderSkills() {
    const skillsContainer = document.getElementById('skills-container');
    if (!portfolioData.skills) return;

    skillsContainer.innerHTML = '';
    skillsContainer.className = 'skills-container';

    Object.keys(portfolioData.skills).forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'skill-category collapsed';

        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = category;
        categoryDiv.appendChild(categoryTitle);

        const techTags = document.createElement('div');
        techTags.className = 'tech-tags';

        portfolioData.skills[category].forEach(tech => {
            const span = document.createElement('span');
            span.textContent = tech;
            techTags.appendChild(span);
        });

        categoryDiv.appendChild(techTags);

        // Add show more button if category has more than 3 items
        if (portfolioData.skills[category].length > 3) {
            const showMoreBtn = document.createElement('button');
            showMoreBtn.className = 'show-more-skills';
            showMoreBtn.textContent = 'Show more';
            showMoreBtn.addEventListener('click', () => {
                categoryDiv.classList.toggle('collapsed');
                showMoreBtn.textContent = categoryDiv.classList.contains('collapsed') ? 'Show more' : 'Show less';
            });
            categoryDiv.appendChild(showMoreBtn);
        }

        skillsContainer.appendChild(categoryDiv);
    });
}

function renderExperience() {
    const experienceContainer = document.getElementById('experience-container');
    if (!portfolioData.experience) return;

    experienceContainer.innerHTML = '';
    experienceContainer.className = 'experience-container';

    portfolioData.experience.forEach(exp => {
        const experienceDiv = document.createElement('div');
        experienceDiv.className = 'experience-item';

        const header = document.createElement('div');
        header.className = 'experience-header';

        const titleCompany = document.createElement('div');
        titleCompany.className = 'title-company';

        const title = document.createElement('h3');
        title.className = 'experience-title';
        title.textContent = exp.title;

        const company = document.createElement('div');
        company.className = 'experience-company';
        company.textContent = exp.company;

        titleCompany.appendChild(title);
        titleCompany.appendChild(company);

        const meta = document.createElement('div');
        meta.className = 'experience-meta';

        const duration = document.createElement('div');
        duration.className = 'experience-duration';
        duration.textContent = exp.duration;

        const location = document.createElement('div');
        location.className = 'experience-location';
        location.textContent = exp.location;

        meta.appendChild(duration);
        meta.appendChild(location);

        header.appendChild(titleCompany);
        header.appendChild(meta);

        const achievements = document.createElement('ul');
        achievements.className = 'experience-achievements collapsed';

        exp.achievements.forEach(achievement => {
            const li = document.createElement('li');
            li.textContent = achievement;
            achievements.appendChild(li);
        });

        // Add expand/collapse functionality for achievements
        if (exp.achievements.length > 2) {
            const expandBtn = document.createElement('button');
            expandBtn.className = 'expand-experience';
            expandBtn.textContent = 'Show more';

            expandBtn.addEventListener('click', function (e) {
                e.preventDefault();
                achievements.classList.toggle('collapsed');
                expandBtn.textContent = achievements.classList.contains('collapsed') ? 'Show more' : 'Show less';
            });

            experienceDiv.appendChild(header);
            experienceDiv.appendChild(achievements);
            experienceDiv.appendChild(expandBtn);
        } else {
            achievements.classList.remove('collapsed');
            experienceDiv.appendChild(header);
            experienceDiv.appendChild(achievements);
        }

        experienceContainer.appendChild(experienceDiv);
    });
}

function renderAchievements() {
    const achievementsContainer = document.getElementById('achievements-container');
    if (!portfolioData.achievements) return;

    achievementsContainer.innerHTML = '';
    portfolioData.achievements.forEach(achievement => {
        const achievementDiv = document.createElement('div');
        achievementDiv.className = 'achievement';

        achievementDiv.innerHTML = `
            <h3>${achievement.title}</h3>
            <p>${achievement.description}</p>
        `;

        achievementsContainer.appendChild(achievementDiv);
    });
}

function renderProjects() {
    const projectsContainer = document.getElementById('projects-container');
    if (!portfolioData.projects) return;

    projectsContainer.innerHTML = '';
    projectsContainer.className = 'projects-container';

    portfolioData.projects.forEach((project) => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project';

        // Project header with title and badge
        const projectHeader = document.createElement('div');
        projectHeader.className = 'project-header';

        const title = document.createElement('h3');
        title.textContent = project.title;

        const badge = document.createElement('span');
        badge.className = project.aiAssisted ? 'ai-badge' : 'independent-badge';
        badge.textContent = project.aiAssisted ? '🤖 AI-Assisted' : '👨‍💻 Built Independently';

        projectHeader.appendChild(title);
        projectHeader.appendChild(badge);

        // Project description with collapse functionality
        const description = document.createElement('div');
        description.className = 'project-description collapsed';
        description.textContent = project.description;

        // Project footer with link and expand button
        const projectFooter = document.createElement('div');
        projectFooter.className = 'project-footer';

        const expandBtn = document.createElement('button');
        expandBtn.className = 'expand-project';
        expandBtn.textContent = 'Read more';

        // Use direct element references (closure) instead of IDs
        expandBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            description.classList.toggle('collapsed');
            expandBtn.textContent = description.classList.contains('collapsed') ? 'Read more' : 'Read less';
        });

        const projectLink = document.createElement('a');
        projectLink.href = project.link;
        projectLink.target = '_blank';
        projectLink.className = 'project-link';
        projectLink.textContent = 'View Project →';

        projectFooter.appendChild(expandBtn);
        projectFooter.appendChild(projectLink);

        // Assemble the project card
        projectDiv.appendChild(projectHeader);
        projectDiv.appendChild(description);
        projectDiv.appendChild(projectFooter);

        projectsContainer.appendChild(projectDiv);
    });
}

function renderContact() {
    const contactContainer = document.getElementById('contact-links');
    if (!portfolioData.contact) return;

    contactContainer.innerHTML = '';

    // Resume (Primary CTA)
    if (portfolioData.contact.resume) {
        const resumeLink = document.createElement('a');
        resumeLink.href = portfolioData.contact.resume;
        resumeLink.className = 'contact-link';
        resumeLink.target = '_blank';
        resumeLink.textContent = '📄 Resume';
        contactContainer.appendChild(resumeLink);
    }

    // Email
    if (portfolioData.contact.email) {
        const emailLink = document.createElement('a');
        emailLink.href = `mailto:${portfolioData.contact.email}`;
        emailLink.className = 'contact-link';
        emailLink.textContent = '✉️ Email';
        contactContainer.appendChild(emailLink);
    }

    // LinkedIn
    if (portfolioData.contact.linkedin) {
        const linkedinLink = document.createElement('a');
        linkedinLink.href = portfolioData.contact.linkedin;
        linkedinLink.className = 'contact-link';
        linkedinLink.target = '_blank';
        linkedinLink.textContent = '💼 LinkedIn';
        contactContainer.appendChild(linkedinLink);
    }

    // GitHub
    if (portfolioData.contact.github) {
        const githubLink = document.createElement('a');
        githubLink.href = portfolioData.contact.github;
        githubLink.className = 'contact-link';
        githubLink.target = '_blank';
        githubLink.textContent = '💻 GitHub';
        contactContainer.appendChild(githubLink);
    }
}

function renderEducation() {
    const educationContainer = document.getElementById('education-container');
    if (!portfolioData.education) return;

    educationContainer.innerHTML = '';
    portfolioData.education.forEach(edu => {
        const educationDiv = document.createElement('div');
        educationDiv.className = 'education';

        educationDiv.innerHTML = `
            <h3>${edu.degree}</h3>
            <p class="institution">${edu.institution}</p>
            <p class="year">${edu.duration}</p>
        `;

        educationContainer.appendChild(educationDiv);
    });
}

// Navigation functionality
function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.getAttribute('data-section');

            // Remove active class from all buttons and sections
            navButtons.forEach(btn => btn.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));

            // Add active class to clicked button and corresponding section
            button.classList.add('active');
            document.getElementById(targetSection).classList.add('active');
        });
    });
}

// Theme functionality
function initTheme() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const body = document.body;

    // Load saved theme or default to warm
    const savedTheme = localStorage.getItem('portfolio-theme') || 'warm';
    setTheme(savedTheme);

    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const theme = button.getAttribute('data-theme');
            setTheme(theme);
            localStorage.setItem('portfolio-theme', theme);
        });
    });
}

function setTheme(theme) {
    const body = document.body;
    const themeButtons = document.querySelectorAll('.theme-btn');

    // Remove existing theme classes
    body.classList.remove('theme-light', 'theme-dark', 'theme-warm');

    // Add new theme class
    body.classList.add(`theme-${theme}`);

    // Update active button
    themeButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-theme="${theme}"]`).classList.add('active');
}

// Cycling progress indicator
function initCyclingProgress() {
    const progressCircle = document.getElementById('progress-circle');
    const circumference = 2 * Math.PI * 20; // 2πr where r=20

    // Set initial state
    if (progressCircle) {
        progressCircle.style.strokeDasharray = circumference;
        progressCircle.style.strokeDashoffset = circumference;
    }

    function updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100);

        if (progressCircle) {
            const offset = circumference - (scrollPercent / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
        }

        window.lastScrollTop = scrollTop;
    }

    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initialize
}

// Fun easter eggs and interactions
function initEasterEggs() {
    let nameClickCount = 0;
    const nameElement = document.getElementById('name');

    // Pizza rain on triple-click name
    if (nameElement) {
        nameElement.addEventListener('click', function () {
            nameClickCount++;

            if (nameClickCount === 3) {
                createPizzaRain();
                nameClickCount = 0;
            }

            // Reset counter after 2 seconds
            setTimeout(() => {
                if (nameClickCount < 3) nameClickCount = 0;
            }, 2000);
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        // Press 'C' for cycling boost
        if (e.key.toLowerCase() === 'c') {
            const wheel = document.querySelector('.wheel');
            if (wheel) {
                wheel.style.animationDuration = '0.5s';
                setTimeout(() => {
                    wheel.style.animationDuration = '3s';
                }, 2000);
            }
        }

        // Press 'P' for pizza party
        if (e.key.toLowerCase() === 'p') {
            createPizzaParty();
        }
    });
}

function createPizzaRain() {
    const pizzas = ['🍕', '🍕', '🍕', '🍕', '🍕'];

    pizzas.forEach((pizza, index) => {
        setTimeout(() => {
            const pizzaElement = document.createElement('div');
            pizzaElement.textContent = pizza;
            pizzaElement.style.cssText = `
                position: fixed;
                top: -50px;
                left: ${Math.random() * window.innerWidth}px;
                font-size: ${Math.random() * 20 + 20}px;
                z-index: 1000;
                pointer-events: none;
                animation: pizzaFall 3s ease-in forwards;
            `;

            document.body.appendChild(pizzaElement);

            setTimeout(() => {
                pizzaElement.remove();
            }, 3000);
        }, index * 200);
    });
}

function createPizzaParty() {
    const container = document.querySelector('.container');
    if (!container) return;

    const party = document.createElement('div');
    party.innerHTML = '🍕 PIZZA PARTY! 🍕';
    party.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 2rem;
        color: var(--accent, var(--warm-accent));
        z-index: 1000;
        pointer-events: none;
        animation: partyPulse 2s ease-out forwards;
    `;

    document.body.appendChild(party);

    setTimeout(() => {
        party.remove();
    }, 2000);
}

// Add CSS animations for easter eggs
function addEasterEggStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pizzaFall {
            0% { 
                transform: translateY(-50px) rotate(0deg);
                opacity: 0;
            }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { 
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        @keyframes partyPulse {
            0% { 
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.5);
            }
            50% { 
                opacity: 1;
                transform: translate(-50%, -50%) scale(1.2);
            }
            100% { 
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    loadContent();
    initNavigation();
    initTheme();
    initCyclingProgress();
    initEasterEggs();
    addEasterEggStyles();
});