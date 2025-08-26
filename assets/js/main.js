let portfolioData = null;

// DOM Cache for performance
const DOMCache = {
    pageTitle: null,
    name: null,
    title: null,
    bio: null,
    location: null,
    skillsContainer: null,
    experienceContainer: null,
    projectsContainer: null,
    achievementsContainer: null,
    contactLinks: null,
    educationContainer: null,
    recommendationsContainer: null,
    themeToggle: null,
    navButtons: null,
    sections: null,
    status: null,

    // Initialize DOM cache
    init() {
        this.pageTitle = document.getElementById('page-title');
        this.name = document.getElementById('name');
        this.title = document.getElementById('title');
        this.bio = document.getElementById('bio');
        this.location = document.getElementById('location');
        this.skillsContainer = document.getElementById('skills-container');
        this.experienceContainer = document.getElementById('experience-container');
        this.projectsContainer = document.getElementById('projects-container');
        this.achievementsContainer = document.getElementById('achievements-container');
        this.contactLinks = document.getElementById('contact-links');
        this.educationContainer = document.getElementById('education-container');
        this.recommendationsContainer = document.getElementById('recommendations-container');
        this.themeToggle = document.getElementById('theme-toggle');
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.sections = document.querySelectorAll('.section');
        this.status = document.getElementById('status');
    }
};

// Debounce utility function
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

// Initialize theme immediately to prevent flash
(function initThemeEarly() {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'warm';
    document.body.classList.add(`theme-${savedTheme}`);
})();

// Load content from JSON file
async function loadContent() {
    try {
        const response = await fetch('assets/data/content.json');

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        portfolioData = await response.json();
        renderContent();
        return Promise.resolve();
    } catch (error) {
        console.error('Error loading content:', error);

        // Fallback content in case JSON fails to load
        portfolioData = {
            personal: {
                name: "Vishnu Sai Jaswanth",
                title: "Senior Software Development Engineer",
                bio: "Senior Software Engineer with 3+ years of experience building scalable distributed systems.",
                location: "Bengaluru, India"
            }
        };
        renderContent();
        return Promise.resolve();
    }
}

// Render all content to HTML
function renderContent() {
    if (!portfolioData) {
        console.error('No portfolio data available');
        return;
    }

    try {
        // Update page title and header using cached DOM elements
        if (DOMCache.pageTitle) DOMCache.pageTitle.textContent = portfolioData.personal.name;
        if (DOMCache.name) DOMCache.name.textContent = portfolioData.personal.name;
        if (DOMCache.title) DOMCache.title.textContent = portfolioData.personal.title;
        if (DOMCache.bio) DOMCache.bio.textContent = portfolioData.personal.bio;
        if (DOMCache.location) DOMCache.location.textContent = `Based in ${portfolioData.personal.location}`;

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

        // Render recommendations
        renderRecommendations();

        // Hide any remaining loading states
        hideLoadingStates();
    } catch (error) {
        console.error('Error rendering content:', error);
    }
}

function renderSkills() {
    if (!portfolioData.skills || !DOMCache.skillsContainer) return;

    DOMCache.skillsContainer.innerHTML = '';
    DOMCache.skillsContainer.className = 'skills-container';

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

        // Add description text
        const descText = document.createElement('p');
        descText.textContent = project.description;
        description.appendChild(descText);

        // Technologies used
        if (project.technologies && project.technologies.length > 0) {
            const techContainer = document.createElement('div');
            techContainer.className = 'project-technologies';

            project.technologies.forEach(tech => {
                const techTag = document.createElement('span');
                techTag.className = 'tech-tag';
                techTag.textContent = tech;
                techContainer.appendChild(techTag);
            });

            description.appendChild(techContainer);
        }

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

            // Toggle collapsed state on this specific description
            const isCollapsed = description.classList.contains('collapsed');
            description.classList.toggle('collapsed');
            expandBtn.textContent = isCollapsed ? 'Read less' : 'Read more';

            // Force layout recalculation to prevent other cards from being affected
            projectDiv.style.height = 'auto';
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

// Recommendations functionality
let currentRecommendationType = 'movies';
let filteredRecommendations = [];
let currentFilters = {
    language: '',
    genre: '',
    search: ''
};

function renderRecommendations() {
    if (!portfolioData.recommendations) return;

    // Initialize recommendations
    initializeRecommendations();

    // Populate filter dropdowns
    populateFilterDropdowns();

    // Render initial movie recommendations
    displayRecommendations(portfolioData.recommendations.movies);
}

function initializeRecommendations() {
    // Toggle button functionality
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.getAttribute('data-type');
            switchRecommendationType(type);

            // Update button states
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });

    // Initialize custom dropdowns
    initializeCustomDropdowns();

    // Search functionality with debouncing
    const searchInput = document.getElementById('recommendations-search');
    if (searchInput) {
        const debouncedSearch = debounce((value) => {
            currentFilters.search = value;
            applyAllFilters();
        }, 300);

        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });
    }

    // Clear filters functionality
    const clearButton = document.getElementById('clear-filters');
    if (clearButton) {
        clearButton.addEventListener('click', () => {
            clearAllFilters();
        });
    }

    // Random pick functionality
    const randomButton = document.getElementById('random-pick');
    if (randomButton) {
        randomButton.addEventListener('click', () => {
            pickRandomRecommendation();
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-dropdown')) {
            document.querySelectorAll('.custom-dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
}

function switchRecommendationType(type) {
    currentRecommendationType = type;

    // Show/hide filters based on type
    const filtersContainer = document.querySelector('.recommendations-filters');
    if (type === 'music') {
        filtersContainer.style.display = 'none';
    } else {
        filtersContainer.style.display = 'block';
        // Clear filters when switching types
        clearAllFilters();

        // Repopulate filters for the new type
        populateFilterDropdowns();
    }

    // Display recommendations
    const recommendations = portfolioData.recommendations[type];
    displayRecommendations(recommendations);
}

function displayRecommendations(recommendations) {
    const container = document.getElementById('recommendations-container');
    if (!container || !recommendations) return;

    filteredRecommendations = recommendations;
    container.innerHTML = '';

    // Set appropriate class based on content type
    if (currentRecommendationType === 'music') {
        container.className = 'recommendations-container music-container';
    } else {
        container.className = 'recommendations-container';
    }

    if (recommendations.length === 0) {
        container.innerHTML = '<div class="no-results">No recommendations found 😔</div>';
        return;
    }

    recommendations.forEach(item => {
        const card = createRecommendationCard(item);
        container.appendChild(card);
    });
}

function createRecommendationCard(item) {
    const card = document.createElement('div');
    card.className = 'recommendation-card';

    // Check if this is a music item
    if (currentRecommendationType === 'music') {
        return createMusicCard(item);
    }

    // Create header with title and Vishnu's pick badge
    const header = document.createElement('div');
    header.className = 'recommendation-header';

    const title = document.createElement('h3');
    title.className = 'recommendation-title';
    title.textContent = item.title;
    header.appendChild(title);

    if (item.vishnu_pick) {
        const badge = document.createElement('div');
        badge.className = 'vishnu-pick';
        badge.textContent = "Vishnu's Pick";
        header.appendChild(badge);
    }

    // Create meta information
    const meta = document.createElement('div');
    meta.className = 'recommendation-meta';

    // Genre tag
    if (item.genre) {
        const genreTag = document.createElement('span');
        genreTag.className = 'genre-tag';
        genreTag.textContent = item.genre;
        meta.appendChild(genreTag);
    }

    // Rating tag
    if (item.rating) {
        const ratingTag = document.createElement('span');
        ratingTag.className = 'rating-tag';
        ratingTag.textContent = '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating);
        meta.appendChild(ratingTag);
    }

    // Episodes tag (for anime)
    if (item.episodes) {
        const episodesTag = document.createElement('span');
        episodesTag.className = 'episodes-tag';
        episodesTag.textContent = `${item.episodes} eps`;
        meta.appendChild(episodesTag);
    }

    // Language tag (for non-English movies)
    if (item.language) {
        const languageTag = document.createElement('span');
        languageTag.className = 'language-tag';
        languageTag.textContent = item.language;
        meta.appendChild(languageTag);
    }

    // Description
    const description = document.createElement('p');
    description.className = 'recommendation-description';
    description.textContent = item.description;

    // Assemble card
    card.appendChild(header);
    card.appendChild(meta);
    card.appendChild(description);

    return card;
}

function createMusicCard(item) {
    const card = document.createElement('div');
    card.className = 'music-card';

    // Create header
    const header = document.createElement('div');
    header.className = 'music-header';

    const title = document.createElement('h3');
    title.className = 'music-title';
    title.textContent = item.title;
    header.appendChild(title);

    const platform = document.createElement('span');
    platform.className = 'music-platform';
    platform.textContent = `🎵 ${item.platform}`;
    header.appendChild(platform);

    // Description
    const description = document.createElement('p');
    description.className = 'music-description';
    description.textContent = item.description;

    // Spotify embed
    const embedContainer = document.createElement('div');
    embedContainer.className = 'spotify-embed-container';

    const embed = document.createElement('iframe');
    embed.src = item.embed_url;
    embed.width = "100%";
    embed.height = "500";
    embed.frameBorder = "0";
    embed.allowtransparency = "true";
    embed.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    embed.loading = "lazy";

    embedContainer.appendChild(embed);

    // External link
    const linkContainer = document.createElement('div');
    linkContainer.className = 'music-link-container';

    const externalLink = document.createElement('a');
    externalLink.href = item.external_url;
    externalLink.target = '_blank';
    externalLink.rel = 'noopener noreferrer';
    externalLink.className = 'music-external-link';
    externalLink.innerHTML = '🎵 Open in Spotify';

    linkContainer.appendChild(externalLink);

    // Assemble card
    card.appendChild(header);
    card.appendChild(description);
    card.appendChild(embedContainer);
    card.appendChild(linkContainer);

    return card;
}

function initializeCustomDropdowns() {
    // Language dropdown
    const languageDropdown = document.getElementById('language-dropdown');
    const languageBtn = languageDropdown.querySelector('.dropdown-btn');

    languageBtn.addEventListener('click', () => {
        toggleDropdown(languageDropdown);
    });

    // Genre dropdown
    const genreDropdown = document.getElementById('genre-dropdown');
    const genreBtn = genreDropdown.querySelector('.dropdown-btn');

    genreBtn.addEventListener('click', () => {
        toggleDropdown(genreDropdown);
    });
}

function toggleDropdown(dropdown) {
    // Close other dropdowns
    document.querySelectorAll('.custom-dropdown.active').forEach(otherDropdown => {
        if (otherDropdown !== dropdown) {
            otherDropdown.classList.remove('active');
            const btn = otherDropdown.querySelector('.dropdown-btn');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        }
    });

    // Toggle current dropdown
    const isOpening = !dropdown.classList.contains('active');
    dropdown.classList.toggle('active');

    const button = dropdown.querySelector('.dropdown-btn');
    if (button) {
        button.setAttribute('aria-expanded', isOpening ? 'true' : 'false');
    }

    // Apply smart positioning if opening
    if (isOpening) {
        requestAnimationFrame(() => {
            adjustDropdownPosition(dropdown);
        });
    }
}

function adjustDropdownPosition(dropdown) {
    const menu = dropdown.querySelector('.dropdown-menu');
    if (!menu) return;

    // Reset position
    menu.style.top = 'calc(100% + 12px)';
    menu.style.bottom = 'auto';

    // Get dimensions
    const menuRect = menu.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    // Check if dropdown goes below viewport
    if (menuRect.bottom > viewportHeight - 20) {
        // Position above the button
        menu.style.top = 'auto';
        menu.style.bottom = 'calc(100% + 12px)';
        menu.style.transform = 'translateX(-50%) translateY(10px) scale(0.95)';
    }

    // Check if dropdown goes outside viewport horizontally
    if (menuRect.left < 10) {
        menu.style.left = '0';
        menu.style.transform = menu.style.transform.replace('translateX(-50%)', 'translateX(10px)');
    } else if (menuRect.right > viewportWidth - 10) {
        menu.style.left = 'auto';
        menu.style.right = '0';
        menu.style.transform = menu.style.transform.replace('translateX(-50%)', 'translateX(-10px)');
    }

    // Trigger the animation
    requestAnimationFrame(() => {
        if (dropdown.classList.contains('active')) {
            if (menu.style.bottom !== 'auto') {
                menu.style.transform = menu.style.transform.replace('translateY(10px)', 'translateY(0)');
            } else {
                menu.style.transform = menu.style.transform.replace('translateY(-10px)', 'translateY(0)');
            }
        }
    });
}

function populateFilterDropdowns() {
    const recommendations = portfolioData.recommendations[currentRecommendationType];
    if (!recommendations) return;

    // Populate language filter
    const languageMenu = document.getElementById('language-menu');
    const languages = [...new Set(recommendations
        .map(item => item.language || 'English')
        .filter(lang => lang)
    )].sort();

    languageMenu.innerHTML = '<li class="dropdown-item active" data-value="">All Languages</li>';
    languages.forEach(language => {
        const item = document.createElement('li');
        item.className = 'dropdown-item';
        item.setAttribute('data-value', language);
        item.textContent = language;
        item.addEventListener('click', () => {
            selectLanguage(language);
        });
        languageMenu.appendChild(item);
    });

    // Add click handler for "All Languages"
    languageMenu.querySelector('[data-value=""]').addEventListener('click', () => {
        selectLanguage('');
    });

    // Populate genre filter
    const genreMenu = document.getElementById('genre-menu');
    const genres = [...new Set(recommendations
        .map(item => item.genre)
        .filter(genre => genre)
    )].sort();

    genreMenu.innerHTML = '<li class="dropdown-item active" data-value="">All Genres</li>';
    genres.forEach(genre => {
        const item = document.createElement('li');
        item.className = 'dropdown-item';
        item.setAttribute('data-value', genre);
        item.textContent = genre;
        item.addEventListener('click', () => {
            selectGenre(genre);
        });
        genreMenu.appendChild(item);
    });

    // Add click handler for "All Genres"
    genreMenu.querySelector('[data-value=""]').addEventListener('click', () => {
        selectGenre('');
    });
}

function selectLanguage(language) {
    const languageDropdown = document.getElementById('language-dropdown');
    const languageText = languageDropdown.querySelector('.dropdown-text');
    const languageMenu = document.getElementById('language-menu');

    // Update button text
    languageText.textContent = language || 'All Languages';

    // Update active state
    languageMenu.querySelectorAll('.dropdown-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-value') === language) {
            item.classList.add('active');
        }
    });

    // Close dropdown
    languageDropdown.classList.remove('active');

    // Update filter
    currentFilters.language = language;
    applyAllFilters();
}

function selectGenre(genre) {
    const genreDropdown = document.getElementById('genre-dropdown');
    const genreText = genreDropdown.querySelector('.dropdown-text');
    const genreMenu = document.getElementById('genre-menu');

    // Update button text
    genreText.textContent = genre || 'All Genres';

    // Update active state
    genreMenu.querySelectorAll('.dropdown-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-value') === genre) {
            item.classList.add('active');
        }
    });

    // Close dropdown
    genreDropdown.classList.remove('active');

    // Update filter
    currentFilters.genre = genre;
    applyAllFilters();
}

function applyAllFilters() {
    const recommendations = portfolioData.recommendations[currentRecommendationType];
    if (!recommendations) return;

    let filtered = recommendations.filter(item => {
        // Language filter
        if (currentFilters.language && (item.language || 'English') !== currentFilters.language) {
            return false;
        }

        // Genre filter
        if (currentFilters.genre && item.genre !== currentFilters.genre) {
            return false;
        }

        // Search filter
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            const matchesTitle = item.title.toLowerCase().includes(searchTerm);
            const matchesGenre = item.genre.toLowerCase().includes(searchTerm);
            const matchesDescription = item.description && item.description.toLowerCase().includes(searchTerm);
            const matchesLanguage = (item.language || 'English').toLowerCase().includes(searchTerm);

            if (!matchesTitle && !matchesGenre && !matchesDescription && !matchesLanguage) {
                return false;
            }
        }

        return true;
    });

    displayRecommendations(filtered);
}

function clearAllFilters() {
    // Reset filter state
    currentFilters = {
        language: '',
        genre: '',
        search: ''
    };

    // Reset custom dropdowns
    const languageDropdown = document.getElementById('language-dropdown');
    const genreDropdown = document.getElementById('genre-dropdown');
    const searchInput = document.getElementById('recommendations-search');

    // Reset language dropdown
    if (languageDropdown) {
        const languageText = languageDropdown.querySelector('.dropdown-text');
        const languageMenu = document.getElementById('language-menu');

        languageText.textContent = 'All Languages';
        languageMenu.querySelectorAll('.dropdown-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-value') === '') {
                item.classList.add('active');
            }
        });
        languageDropdown.classList.remove('active');
    }

    // Reset genre dropdown
    if (genreDropdown) {
        const genreText = genreDropdown.querySelector('.dropdown-text');
        const genreMenu = document.getElementById('genre-menu');

        genreText.textContent = 'All Genres';
        genreMenu.querySelectorAll('.dropdown-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-value') === '') {
                item.classList.add('active');
            }
        });
        genreDropdown.classList.remove('active');
    }

    // Reset search input
    if (searchInput) {
        searchInput.value = '';
    }

    // Show all recommendations
    const recommendations = portfolioData.recommendations[currentRecommendationType];
    displayRecommendations(recommendations);
}

function pickRandomRecommendation() {
    const recommendations = filteredRecommendations;
    if (recommendations.length === 0) return;

    // Pick random recommendation
    const randomIndex = Math.floor(Math.random() * recommendations.length);
    const randomPick = recommendations[randomIndex];

    // Highlight the card
    const cards = document.querySelectorAll('.recommendation-card');
    cards.forEach((card, index) => {
        card.classList.remove('highlight');
        if (index === randomIndex) {
            card.classList.add('highlight');
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });

    // Show notification
    showRandomPickNotification(randomPick.title);
}

function showRandomPickNotification(title) {
    const notification = document.createElement('div');
    notification.innerHTML = `🎯 Random Pick: ${title}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--accent, var(--warm-accent));
        color: white;
        padding: 12px 20px;
        border-radius: 25px;
        font-weight: 500;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out forwards, slideOutRight 0.3s ease-in 2.7s forwards;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);

    // Add keyframes for notification animation
    if (!document.querySelector('#random-pick-styles')) {
        const style = document.createElement('style');
        style.id = 'random-pick-styles';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
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

            // Set data attribute for container width management
            document.body.setAttribute('data-active-section', targetSection);
        });
    });
}

// Theme functionality
function initTheme() {
    const themeButtons = document.querySelectorAll('.theme-btn');

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

    // Update ARIA attributes for theme buttons
    themeButtons.forEach(button => {
        const buttonTheme = button.getAttribute('data-theme');
        const isActive = buttonTheme === theme;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });
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

    // Touch-friendly interactions for mobile
    if ('ontouchstart' in window) {
        // Add touch feedback for buttons
        const buttons = document.querySelectorAll('.nav-btn, .theme-btn, .contact-link, .expand-project, .expand-experience, .show-more-skills');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function () {
                this.style.transform = 'scale(0.95)';
            });

            button.addEventListener('touchend', function () {
                this.style.transform = '';
            });

            button.addEventListener('touchcancel', function () {
                this.style.transform = '';
            });
        });
    }

    // Keyboard shortcuts (desktop only)
    if (!('ontouchstart' in window)) {
        let cyclingBoostActive = false;
        let cyclingPushTimeout = null;

        document.addEventListener('keydown', function (e) {
            // Press 'C' for cycling boost
            if (e.key.toLowerCase() === 'c' && !e.repeat) {
                const cyclingTrack = document.querySelector('.cycling-track');
                if (cyclingTrack && !cyclingBoostActive) {
                    cyclingBoostActive = true;

                    // Give a quick push (subtly faster for short time)
                    cyclingTrack.style.setProperty('--cycle-speed', '15s');

                    // Clear any existing timeout
                    if (cyclingPushTimeout) {
                        clearTimeout(cyclingPushTimeout);
                    }

                    // If holding, make it moderately faster after the initial push
                    cyclingPushTimeout = setTimeout(() => {
                        if (cyclingBoostActive) {
                            cyclingTrack.style.setProperty('--cycle-speed', '13s');
                        }
                    }, 800);
                }
            }
        });

        document.addEventListener('keyup', function (e) {
            // Release 'C' - return to normal speed
            if (e.key.toLowerCase() === 'c') {
                const cyclingTrack = document.querySelector('.cycling-track');
                if (cyclingTrack && cyclingBoostActive) {
                    cyclingBoostActive = false;

                    // Clear timeout if still pending
                    if (cyclingPushTimeout) {
                        clearTimeout(cyclingPushTimeout);
                        cyclingPushTimeout = null;
                    }

                    // Return to normal speed
                    cyclingTrack.style.setProperty('--cycle-speed', '20s');
                }
            }
        });

        // Other keyboard shortcuts
        document.addEventListener('keydown', function (e) {
            // Press 'P' for pizza party
            if (e.key.toLowerCase() === 'p') {
                createPizzaParty();
            }

            // Press 'A' for anime sparkle burst
            if (e.key.toLowerCase() === 'a') {
                createAnimeSparkleBurst();
            }
        });
    }
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

function createAnimeSparkleBurst() {
    const sparkles = ['✨', '⭐', '💫', '🌟', '💥'];

    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                font-size: ${Math.random() * 20 + 15}px;
                z-index: 1000;
                pointer-events: none;
                animation: sparkleBurst 2s ease-out forwards;
                transform: translate(-50%, -50%) rotate(${Math.random() * 360}deg) translateY(-${Math.random() * 100 + 50}px);
            `;

            document.body.appendChild(sparkle);

            setTimeout(() => {
                sparkle.remove();
            }, 2000);
        }, i * 100);
    }
}

// Hide any loading states and ensure smooth content display
function hideLoadingStates() {
    // Ensure body is visible and all content is loaded
    document.body.style.opacity = '1';
    document.body.classList.add('loaded');

    // Hide the loading screen
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        // Remove from DOM after transition
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }
}

// Show loading screen immediately if content takes too long
function ensureLoadingTimeout() {
    // If content isn't loaded within 3 seconds, hide loading anyway
    setTimeout(() => {
        if (!document.body.classList.contains('loaded')) {
            console.warn('Content loading timeout - showing page anyway');
            hideLoadingStates();
        }
    }, 3000);
}

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
        
        @keyframes sparkleBurst {
            0% { 
                opacity: 0;
                transform: translate(-50%, -50%) scale(0) rotate(0deg);
            }
            50% { 
                opacity: 1;
                transform: translate(-50%, -50%) scale(1.2) rotate(180deg) translateY(-50px);
            }
            100% { 
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.5) rotate(360deg) translateY(-100px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize DOM cache first
    DOMCache.init();

    // Start loading timeout protection
    ensureLoadingTimeout();

    // Wait for fonts and critical resources to load
    Promise.all([
        // Wait for fonts to load
        document.fonts.ready,
        // Wait for content to load
        loadContent(),
        // Small delay to ensure smooth transition
        new Promise(resolve => setTimeout(resolve, 300))
    ]).then(() => {
        // Initialize all components
        initNavigation();
        initTheme();
        initCyclingProgress();
        initEasterEggs();
        addEasterEggStyles();

        // Hide loading screen
        hideLoadingStates();
    }).catch(error => {
        console.error('Error during initialization:', error);
        // Still hide loading screen even if there's an error
        hideLoadingStates();
    });
});