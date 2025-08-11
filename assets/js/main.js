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
    
    Object.keys(portfolioData.skills).forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'skill-category';
        
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
        skillsContainer.appendChild(categoryDiv);
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
    portfolioData.projects.forEach(project => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project';
        
        const imageHtml = project.image ? `<img src="${project.image}" alt="${project.imageAlt}" width="300" height="200" class="project-image" loading="lazy">` : '';
        const aiAssistedBadge = project.aiAssisted ? `<span class="ai-badge">🤖 AI-Assisted</span>` : `<span class="independent-badge">👨‍💻 Built Independently</span>`;
        projectDiv.innerHTML = `
            ${imageHtml}
            <div class="project-header">
                <h3>${project.title}</h3>
                ${aiAssistedBadge}
            </div>
            <p>${project.description}</p>
            <a href="${project.link}" target="_blank" class="project-link">View Project →</a>
        `;
        
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
        resumeLink.className = 'contact-link primary';
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

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadContent();
    initNavigation();
    initTheme();
});