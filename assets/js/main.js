let portfolioData = null;

const DOMCache = {
    name: null,
    titleStatic: null,
    titleTypewriter: null,
    bentoTagline: null,
    bentoBio: null,
    bentoStackChips: null,
    bentoCurrently: null,
    bentoStats: null,
    bentoLocation: null,
    bentoTimezone: null,
    bentoOpenTo: null,
    location: null,
    experienceBadge: null,
    heroMonogram: null,
    heroChips: null,
    skillsContainer: null,
    experienceContainer: null,
    projectsContainer: null,
    achievementsContainer: null,
    educationContainer: null,
    playlistContainer: null,
    themeToggle: null,
    navButtons: null,
    sections: null,
    status: null,

    init() {
        this.name = document.getElementById('name');
        this.titleStatic = document.getElementById('title-static');
        this.titleTypewriter = document.getElementById('title-typewriter');
        this.bentoTagline = document.getElementById('bento-tagline');
        this.bentoBio = document.getElementById('bento-bio');
        this.bentoStackChips = document.getElementById('bento-stack-chips');
        this.bentoCurrently = document.getElementById('bento-currently');
        this.bentoStats = document.getElementById('bento-stats');
        this.bentoLocation = document.getElementById('bento-location');
        this.bentoTimezone = document.getElementById('bento-timezone');
        this.bentoOpenTo = document.getElementById('bento-open-to');
        this.location = document.getElementById('location');
        this.experienceBadge = document.getElementById('experience-badge');
        this.heroMonogram = document.getElementById('hero-monogram');
        this.heroChips = document.getElementById('hero-chips');
        this.skillsContainer = document.getElementById('skills-container');
        this.experienceContainer = document.getElementById('experience-container');
        this.projectsContainer = document.getElementById('projects-container');
        this.achievementsContainer = document.getElementById('achievements-container');
        this.educationContainer = document.getElementById('education-container');
        this.playlistContainer = document.getElementById('playlist-container');
        this.themeToggle = document.getElementById('theme-toggle');
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.sections = document.querySelectorAll('.section');
        this.status = document.getElementById('status');
    }
};

(function initThemeEarly() {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'warm';
    document.body.classList.add(`theme-${savedTheme}`);
})();

(function initFunEarly() {
    try {
        const funOn = localStorage.getItem('portfolio-fun') === 'on';
        if (funOn) document.body.classList.add('fun');
    } catch (_) { /* no-op */ }
})();

async function loadContent() {
    try {
        const response = await fetch('assets/data/content.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        portfolioData = await response.json();
        renderContent();
    } catch (loadError) {
        console.error('Error loading content:', loadError);
        portfolioData = {
            personal: {
                name: "Vishnu Sai Jaswanth",
                title: "Senior Software Development Engineer",
                bio: "Senior Software Engineer with 3+ years building scalable distributed systems.",
                shortBio: "Backend engineer.",
                location: "Bengaluru, India"
            }
        };
        renderContent();
    }
}

function renderContent() {
    if (!portfolioData) return;

    try {
        if (DOMCache.name) DOMCache.name.textContent = portfolioData.personal.name;
        if (DOMCache.titleStatic) DOMCache.titleStatic.textContent = portfolioData.personal.title;
        if (DOMCache.location) DOMCache.location.textContent = `Based in ${portfolioData.personal.location}`;

        renderExperienceBadge();
        renderHeroChips();
        renderAboutBento();
        renderSkills();
        renderExperience();
        renderProjects();
        renderAchievements();
        renderContact();
        renderHeroActions();
        renderEducation();
        renderPlaylist();
    } catch (renderError) {
        console.error('Error rendering content:', renderError);
    }
}

function renderExperienceBadge() {
    if (!DOMCache.experienceBadge) return;
    const startISO = portfolioData?.personal?.experienceStart;
    if (!startISO) return;
    const start = new Date(startISO);
    if (Number.isNaN(start.getTime())) return;
    const now = new Date();
    let years = now.getFullYear() - start.getFullYear();
    const monthDiff = now.getMonth() - start.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < start.getDate())) {
        years -= 1;
    }
    if (years < 1) years = 1;
    DOMCache.experienceBadge.textContent = `${years}+ years experience`;
}

function renderHeroChips() {
    if (!DOMCache.heroChips || !Array.isArray(portfolioData.heroChips)) return;
    DOMCache.heroChips.innerHTML = '';
    portfolioData.heroChips.forEach(chip => {
        const span = document.createElement('span');
        span.className = 'hero-chip';
        span.innerHTML = `<span class="hero-chip-icon">${chip.icon}</span> ${chip.label}`;
        DOMCache.heroChips.appendChild(span);
    });
}

function renderAboutBento() {
    if (DOMCache.bentoTagline) {
        DOMCache.bentoTagline.textContent = portfolioData.personal?.tagline || '';
    }
    if (DOMCache.bentoBio) {
        DOMCache.bentoBio.textContent = portfolioData.personal?.shortBio || portfolioData.personal?.bio || '';
    }
    if (DOMCache.bentoStackChips && Array.isArray(portfolioData.personal?.stack)) {
        DOMCache.bentoStackChips.innerHTML = '';
        portfolioData.personal.stack.forEach(tech => {
            const span = document.createElement('span');
            span.textContent = tech;
            DOMCache.bentoStackChips.appendChild(span);
        });
    }
    if (DOMCache.bentoCurrently && Array.isArray(portfolioData.currently)) {
        DOMCache.bentoCurrently.innerHTML = '';
        portfolioData.currently.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            DOMCache.bentoCurrently.appendChild(li);
        });
    }
    if (DOMCache.bentoStats && Array.isArray(portfolioData.quickStats)) {
        DOMCache.bentoStats.innerHTML = '';
        portfolioData.quickStats.forEach(stat => {
            const block = document.createElement('div');
            block.className = 'bento-stat';
            block.innerHTML = `<span class="bento-stat-value">${stat.value}</span><span class="bento-stat-label">${stat.label}</span>`;
            DOMCache.bentoStats.appendChild(block);
        });
    }
    if (DOMCache.bentoLocation) {
        DOMCache.bentoLocation.textContent = `📍 ${portfolioData.personal?.location || ''}`;
    }
    if (DOMCache.bentoTimezone) {
        DOMCache.bentoTimezone.textContent = `🕐 ${portfolioData.personal?.timezone || ''}`;
    }
    if (DOMCache.bentoOpenTo && Array.isArray(portfolioData.openTo)) {
        DOMCache.bentoOpenTo.innerHTML = '';
        portfolioData.openTo.forEach(item => {
            const chip = document.createElement('span');
            chip.className = 'bento-open-chip';
            chip.textContent = item;
            DOMCache.bentoOpenTo.appendChild(chip);
        });
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

        if (portfolioData.skills[category].length > 3) {
            const showMoreBtn = document.createElement('button');
            showMoreBtn.className = 'show-more-skills';
            showMoreBtn.textContent = 'Show more';
            showMoreBtn.setAttribute('aria-expanded', 'false');
            showMoreBtn.addEventListener('click', () => {
                const wasCollapsed = categoryDiv.classList.contains('collapsed');
                categoryDiv.classList.toggle('collapsed');
                const nowCollapsed = categoryDiv.classList.contains('collapsed');
                showMoreBtn.textContent = nowCollapsed ? 'Show more' : 'Show less';
                showMoreBtn.setAttribute('aria-expanded', wasCollapsed ? 'true' : 'false');
            });
            categoryDiv.appendChild(showMoreBtn);
        }

        DOMCache.skillsContainer.appendChild(categoryDiv);
    });
}

function renderExperience() {
    if (!portfolioData.experience || !DOMCache.experienceContainer) return;

    DOMCache.experienceContainer.innerHTML = '';
    DOMCache.experienceContainer.className = 'experience-container';

    portfolioData.experience.forEach(experience => {
        const experienceDiv = document.createElement('div');
        experienceDiv.className = 'experience-item';

        const header = document.createElement('div');
        header.className = 'experience-header';

        const titleCompany = document.createElement('div');
        titleCompany.className = 'title-company';

        const titleEl = document.createElement('h3');
        titleEl.className = 'experience-title';
        titleEl.textContent = experience.title;

        const companyEl = document.createElement('div');
        companyEl.className = 'experience-company';
        companyEl.textContent = experience.company;

        titleCompany.appendChild(titleEl);
        titleCompany.appendChild(companyEl);

        const meta = document.createElement('div');
        meta.className = 'experience-meta';

        const duration = document.createElement('div');
        duration.className = 'experience-duration';
        duration.textContent = experience.duration;

        const locationEl = document.createElement('div');
        locationEl.className = 'experience-location';
        locationEl.textContent = experience.location;

        meta.appendChild(duration);
        meta.appendChild(locationEl);

        header.appendChild(titleCompany);
        header.appendChild(meta);

        const achievements = document.createElement('ul');
        achievements.className = 'experience-achievements collapsed';

        experience.achievements.forEach(achievementText => {
            const li = document.createElement('li');
            li.textContent = achievementText;
            achievements.appendChild(li);
        });

        if (experience.achievements.length > 2) {
            const expandBtn = document.createElement('button');
            expandBtn.className = 'expand-experience';
            expandBtn.textContent = 'Show more';
            expandBtn.setAttribute('aria-expanded', 'false');

            expandBtn.addEventListener('click', function (clickEvent) {
                clickEvent.preventDefault();
                const wasCollapsed = achievements.classList.contains('collapsed');
                achievements.classList.toggle('collapsed');
                expandBtn.textContent = wasCollapsed ? 'Show less' : 'Show more';
                expandBtn.setAttribute('aria-expanded', wasCollapsed ? 'true' : 'false');
            });

            experienceDiv.appendChild(header);
            experienceDiv.appendChild(achievements);
            experienceDiv.appendChild(expandBtn);
        } else {
            achievements.classList.remove('collapsed');
            experienceDiv.appendChild(header);
            experienceDiv.appendChild(achievements);
        }

        DOMCache.experienceContainer.appendChild(experienceDiv);
    });
}

function renderAchievements() {
    if (!portfolioData.achievements || !DOMCache.achievementsContainer) return;

    DOMCache.achievementsContainer.innerHTML = '';
    portfolioData.achievements.forEach(achievement => {
        const achievementDiv = document.createElement('div');
        achievementDiv.className = 'achievement';
        achievementDiv.innerHTML = `
            <h3>${achievement.title}</h3>
            <p>${achievement.description}</p>
        `;
        DOMCache.achievementsContainer.appendChild(achievementDiv);
    });
}

function renderProjects() {
    if (!portfolioData.projects || !DOMCache.projectsContainer) return;

    DOMCache.projectsContainer.innerHTML = '';
    DOMCache.projectsContainer.className = 'projects-container';

    portfolioData.projects.forEach((project) => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project';
        if (project.accent) {
            projectDiv.style.setProperty('--project-accent', project.accent);
        }

        const accentStrip = document.createElement('div');
        accentStrip.className = 'project-strip';
        projectDiv.appendChild(accentStrip);

        const projectHeader = document.createElement('div');
        projectHeader.className = 'project-header';

        const titleBlock = document.createElement('div');
        titleBlock.className = 'project-title-block';
        const titleEl = document.createElement('h3');
        titleEl.textContent = project.title;
        titleBlock.appendChild(titleEl);
        if (project.subtitle) {
            const subtitleEl = document.createElement('p');
            subtitleEl.className = 'project-subtitle';
            subtitleEl.textContent = project.subtitle;
            titleBlock.appendChild(subtitleEl);
        }

        const badge = document.createElement('span');
        if (project.badgeLabel) {
            badge.className = 'independent-badge';
            badge.textContent = `${project.badgeIcon ? project.badgeIcon + ' ' : ''}${project.badgeLabel}`;
        } else {
            badge.className = project.aiAssisted ? 'ai-badge' : 'independent-badge';
            badge.textContent = project.aiAssisted ? '🤖 AI-Assisted' : '👨‍💻 Built Independently';
        }

        projectHeader.appendChild(titleBlock);
        projectHeader.appendChild(badge);

        const description = document.createElement('div');
        description.className = 'project-description collapsed';

        const descText = document.createElement('p');
        descText.textContent = project.description;
        description.appendChild(descText);

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

        const projectFooter = document.createElement('div');
        projectFooter.className = 'project-footer';

        const expandBtn = document.createElement('button');
        expandBtn.className = 'expand-project';
        expandBtn.textContent = 'Read more';
        expandBtn.setAttribute('aria-expanded', 'false');

        expandBtn.addEventListener('click', function (clickEvent) {
            clickEvent.preventDefault();
            clickEvent.stopPropagation();
            const wasCollapsed = description.classList.contains('collapsed');
            description.classList.toggle('collapsed');
            expandBtn.textContent = wasCollapsed ? 'Read less' : 'Read more';
            expandBtn.setAttribute('aria-expanded', wasCollapsed ? 'true' : 'false');
            projectDiv.style.height = 'auto';
        });

        projectFooter.appendChild(expandBtn);

        if (project.link) {
            const projectLink = document.createElement('a');
            projectLink.href = project.link;
            projectLink.target = '_blank';
            projectLink.rel = 'noopener noreferrer';
            projectLink.className = 'project-link';
            projectLink.textContent = 'View Project →';
            projectFooter.appendChild(projectLink);
        } else if (project.linkNote) {
            const note = document.createElement('span');
            note.className = 'project-link-note';
            note.textContent = project.linkNote;
            projectFooter.appendChild(note);
        }

        projectDiv.appendChild(projectHeader);
        projectDiv.appendChild(description);
        projectDiv.appendChild(projectFooter);

        DOMCache.projectsContainer.appendChild(projectDiv);
    });
}

function renderContact() {
    if (!portfolioData.contact) return;

    const channelsContainer = document.getElementById('contact-channels');
    const availabilityText = document.getElementById('contact-availability-text');
    const introText = document.getElementById('contact-intro-text');
    const whereLocation = document.getElementById('contact-where-location');

    if (availabilityText && portfolioData.contact.availability) {
        availabilityText.textContent = portfolioData.contact.availability;
    }
    if (introText && portfolioData.contact.intro) {
        introText.textContent = portfolioData.contact.intro;
    }
    if (whereLocation && portfolioData.personal?.location) {
        whereLocation.textContent = portfolioData.personal.location;
    }

    if (!channelsContainer) return;
    channelsContainer.innerHTML = '';

    const channels = portfolioData.contact.channels || [
        { key: 'resume', label: 'Resume', icon: '📄', description: 'PDF resume' },
        { key: 'email', label: 'Email', icon: '✉️', description: 'Direct line' },
        { key: 'linkedin', label: 'LinkedIn', icon: '💼', description: 'Connect & message' },
        { key: 'github', label: 'GitHub', icon: '💻', description: 'Code repos' }
    ];

    channels.forEach(channel => {
        const value = portfolioData.contact[channel.key];
        if (!value) return;
        const card = document.createElement('a');
        card.className = 'contact-channel';
        card.href = channel.key === 'email' ? `mailto:${value}` : value;
        if (channel.key !== 'email') {
            card.target = '_blank';
            card.rel = 'noopener noreferrer';
        }

        card.innerHTML = `
            <div class="contact-channel-icon" aria-hidden="true">${channel.icon}</div>
            <div class="contact-channel-text">
                <div class="contact-channel-label">${channel.label}</div>
                <div class="contact-channel-desc">${channel.description}</div>
            </div>
            <div class="contact-channel-arrow" aria-hidden="true">→</div>
        `;

        // mailto: links don't work for everyone (no mail client configured),
        // so intercept the email click: copy the address and show a fallback toast
        // with Gmail / mail-app options.
        if (channel.key === 'email') {
            card.addEventListener('click', clickEvent => {
                clickEvent.preventDefault();
                showEmailToast(value);
            });
        }

        channelsContainer.appendChild(card);
    });
}

// Toast shown when the email card is clicked
async function showEmailToast(emailAddress) {
    let copied = false;
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(emailAddress);
            copied = true;
        }
    } catch (_) {
        copied = false;
    }

    // Reuse an existing toast if it's already showing
    document.querySelectorAll('.email-toast').forEach(node => node.remove());

    const toast = document.createElement('div');
    toast.className = 'email-toast';
    toast.setAttribute('role', 'status');

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fu=1&to=${encodeURIComponent(emailAddress)}`;
    const mailtoUrl = `mailto:${emailAddress}`;

    toast.innerHTML = `
        <button class="email-toast-close" aria-label="Dismiss">✕</button>
        <div class="email-toast-status">
            ${copied ? '✓ Email copied to clipboard' : 'Email address ready to copy'}
        </div>
        <div class="email-toast-address">${emailAddress}</div>
        <div class="email-toast-actions">
            <a class="email-toast-action" href="${gmailUrl}" target="_blank" rel="noopener noreferrer">📨 Open in Gmail</a>
            <a class="email-toast-action" href="${mailtoUrl}">✉️ Mail app</a>
        </div>
    `;

    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('visible'));

    const closeBtn = toast.querySelector('.email-toast-close');
    function dismiss() {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 250);
    }
    closeBtn.addEventListener('click', dismiss);

    setTimeout(dismiss, 6000);

    if (DOMCache.status) {
        DOMCache.status.textContent = copied
            ? `Email copied to clipboard: ${emailAddress}`
            : `Email address: ${emailAddress}`;
    }
}

// Persistent hero action row — the money actions (resume / email / socials)
// one click from the top, so recruiters never have to hunt for them.
function renderHeroActions() {
    const container = document.getElementById('hero-actions');
    if (!container || !portfolioData.contact) return;
    const contact = portfolioData.contact;
    container.innerHTML = '';

    const actions = [
        { label: 'Resume', icon: '📄', href: contact.resume, primary: true },
        { label: 'Email', icon: '✉️', email: contact.email },
        { label: 'GitHub', icon: '💻', href: contact.github },
        { label: 'LinkedIn', icon: '💼', href: contact.linkedin }
    ];

    actions.forEach(action => {
        const target = action.email || action.href;
        if (!target) return;
        const link = document.createElement('a');
        link.className = 'hero-action' + (action.primary ? ' hero-action-primary' : '');
        link.innerHTML = `<span class="hero-action-icon" aria-hidden="true">${action.icon}</span> ${action.label}`;
        if (action.email) {
            link.href = `mailto:${action.email}`;
            link.addEventListener('click', clickEvent => {
                clickEvent.preventDefault();
                showEmailToast(action.email);
            });
        } else {
            link.href = action.href;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        }
        container.appendChild(link);
    });
}

// Live IST clock for the Contact "Where" card
function initLiveClock() {
    const liveTime = document.getElementById('contact-live-time');
    if (!liveTime) return;

    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    function update() {
        liveTime.textContent = formatter.format(new Date());
    }
    update();
    setInterval(update, 30 * 1000);
}

function renderEducation() {
    if (!portfolioData.education || !DOMCache.educationContainer) return;

    DOMCache.educationContainer.innerHTML = '';
    portfolioData.education.forEach(education => {
        const educationDiv = document.createElement('div');
        educationDiv.className = 'education';
        educationDiv.innerHTML = `
            <h3>${education.degree}</h3>
            <p class="institution">${education.institution}</p>
            <p class="year">${education.duration}</p>
        `;
        DOMCache.educationContainer.appendChild(educationDiv);
    });
}

function renderPlaylist() {
    if (!portfolioData.playlist || !DOMCache.playlistContainer) return;

    const playlist = portfolioData.playlist;
    DOMCache.playlistContainer.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'music-card';

    const header = document.createElement('div');
    header.className = 'music-header';

    const titleEl = document.createElement('h3');
    titleEl.className = 'music-title';
    titleEl.textContent = playlist.title;
    header.appendChild(titleEl);

    const platform = document.createElement('span');
    platform.className = 'music-platform';
    platform.textContent = `🎵 ${playlist.platform}`;
    header.appendChild(platform);

    const description = document.createElement('p');
    description.className = 'music-description';
    description.textContent = playlist.description;

    const embedContainer = document.createElement('div');
    embedContainer.className = 'spotify-embed-container';

    const embed = document.createElement('iframe');
    embed.src = playlist.embed_url;
    embed.width = "100%";
    embed.height = "500";
    embed.frameBorder = "0";
    embed.allowtransparency = "true";
    embed.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    embed.loading = "lazy";

    embedContainer.appendChild(embed);

    const linkContainer = document.createElement('div');
    linkContainer.className = 'music-link-container';

    const externalLink = document.createElement('a');
    externalLink.href = playlist.external_url;
    externalLink.target = '_blank';
    externalLink.rel = 'noopener noreferrer';
    externalLink.className = 'music-external-link';
    externalLink.textContent = '🎵 Open in Spotify';

    linkContainer.appendChild(externalLink);

    card.appendChild(header);
    card.appendChild(description);
    card.appendChild(embedContainer);
    card.appendChild(linkContainer);

    DOMCache.playlistContainer.appendChild(card);
}

// Navigation + hash routing
const VALID_SECTIONS = ['about', 'skills', 'experience', 'projects', 'achievements', 'vibes', 'contact', 'education'];

function activateSection(sectionId, { updateHash = true } = {}) {
    if (!VALID_SECTIONS.includes(sectionId)) sectionId = 'about';

    DOMCache.navButtons.forEach(btn => {
        const isMatch = btn.getAttribute('data-section') === sectionId;
        btn.classList.toggle('active', isMatch);
        btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
        if (isMatch) {
            btn.setAttribute('aria-current', 'page');
        } else {
            btn.removeAttribute('aria-current');
        }
    });

    DOMCache.sections.forEach(section => {
        section.classList.toggle('active', section.id === sectionId);
    });

    document.body.setAttribute('data-active-section', sectionId);

    // Reset scroll on section change — otherwise switching from a long section
    // while scrolled down lands you mid-content (or in empty space) in the next.
    window.scrollTo({ top: 0, behavior: 'auto' });

    if (updateHash) {
        const newHash = `#${sectionId}`;
        if (window.location.hash !== newHash) {
            history.replaceState(null, '', newHash);
        }
    }
}

function initNavigation() {
    DOMCache.navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.getAttribute('data-section');
            activateSection(targetSection);
        });
    });

    window.addEventListener('hashchange', () => {
        const sectionFromHash = window.location.hash.replace('#', '');
        if (VALID_SECTIONS.includes(sectionFromHash)) {
            activateSection(sectionFromHash, { updateHash: false });
        }
    });

    const initialHash = window.location.hash.replace('#', '');
    if (VALID_SECTIONS.includes(initialHash)) {
        activateSection(initialHash, { updateHash: false });
    } else {
        activateSection('about', { updateHash: false });
    }
}

// Theme
function initTheme() {
    const themeButtons = document.querySelectorAll('.theme-btn');
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

function updateMetaThemeColor() {
    const meta = document.getElementById('meta-theme-color');
    if (!meta) return;
    // Match the mobile browser-chrome color to whatever theme is active
    // (light / warm / dark) instead of guessing from prefers-color-scheme.
    const bg = getComputedStyle(document.body).backgroundColor;
    if (bg) meta.setAttribute('content', bg);
}

function setTheme(theme) {
    const body = document.body;
    const themeButtons = document.querySelectorAll('.theme-btn');
    body.classList.remove('theme-light', 'theme-dark', 'theme-warm');
    body.classList.add(`theme-${theme}`);
    updateMetaThemeColor();

    themeButtons.forEach(button => {
        const buttonTheme = button.getAttribute('data-theme');
        const isActive = buttonTheme === theme;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });
}

// Fun mode
function initFunMode() {
    const funBtn = document.getElementById('fun-toggle');
    if (!funBtn) return;

    const funOn = localStorage.getItem('portfolio-fun') === 'on';
    funBtn.setAttribute('aria-pressed', funOn ? 'true' : 'false');
    document.body.classList.toggle('fun', funOn);

    funBtn.addEventListener('click', () => {
        const isOn = funBtn.getAttribute('aria-pressed') === 'true';
        const next = !isOn;
        funBtn.setAttribute('aria-pressed', next ? 'true' : 'false');
        document.body.classList.toggle('fun', next);
        try {
            localStorage.setItem('portfolio-fun', next ? 'on' : 'off');
        } catch (_) { /* no-op */ }
    });
}

// Cycling progress indicator — fades in only once the user has actually scrolled
function initCyclingProgress() {
    const progressCircle = document.getElementById('progress-circle');
    const wrapper = document.getElementById('cycling-progress');
    if (!progressCircle || !wrapper) return;
    const radius = 17;
    const circumference = 2 * Math.PI * radius;
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference;

    function updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
        const offset = circumference - (scrollPercent / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
        wrapper.classList.toggle('is-scrolled', scrollTop > 80);
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}

// Parallax for clouds and horizon
function initParallax() {
    const clouds = document.querySelector('.cloud-layer');
    const hills = document.querySelector('.nature-hills');
    if (!clouds && !hills) return;

    function update() {
        const scrollY = window.pageYOffset || 0;
        if (clouds) clouds.style.transform = `translateY(${scrollY * 0.05}px)`;
        if (hills) hills.style.transform = `translateY(${scrollY * 0.02}px)`;
    }

    window.addEventListener('scroll', () => requestAnimationFrame(update));
    update();
}

// Easter egg effects
function createPizzaRain() {
    for (let pizzaIndex = 0; pizzaIndex < 5; pizzaIndex++) {
        setTimeout(() => {
            const pizzaElement = document.createElement('div');
            pizzaElement.textContent = '🍕';
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
            setTimeout(() => pizzaElement.remove(), 3000);
        }, pizzaIndex * 200);
    }
}

function createPizzaParty() {
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
    setTimeout(() => party.remove(), 2000);
}

function createAnimeSparkleBurst() {
    const sparkles = ['✨', '⭐', '💫', '🌟', '💥'];
    for (let burstIndex = 0; burstIndex < 8; burstIndex++) {
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
            setTimeout(() => sparkle.remove(), 2000);
        }, burstIndex * 100);
    }
}

function createMovieClap() {
    const clapElement = document.createElement('div');
    clapElement.textContent = '🎬';
    clapElement.style.cssText = `
        position: fixed; top: 45%; left: 50%; transform: translate(-50%, -50%);
        font-size: 48px; z-index: 1000; pointer-events: none; animation: clapPop 900ms ease-out forwards;`;
    document.body.appendChild(clapElement);
    setTimeout(() => clapElement.remove(), 900);
}

function createLeafFall() {
    const leaves = ['🍃', '🍂', '🍁'];
    for (let leafIndex = 0; leafIndex < 10; leafIndex++) {
        const leaf = document.createElement('div');
        leaf.textContent = leaves[Math.floor(Math.random() * leaves.length)];
        leaf.style.cssText = `position: fixed; top: -40px; left: ${Math.random() * 100}vw; font-size: ${14 + Math.random() * 14}px; z-index: 1000; pointer-events: none; animation: leafFall ${6 + Math.random() * 4}s linear forwards;`;
        document.body.appendChild(leaf);
        setTimeout(() => leaf.remove(), 11000);
    }
}

// Keyboard shortcuts overlay
function initShortcutsOverlay() {
    const overlay = document.getElementById('shortcuts-overlay');
    const closeBtn = document.getElementById('shortcuts-close');
    const footerBtn = document.getElementById('footer-shortcuts-btn');
    if (!overlay) return;

    function open() {
        overlay.hidden = false;
        requestAnimationFrame(() => overlay.classList.add('visible'));
        if (closeBtn) closeBtn.focus();
    }
    function close() {
        overlay.classList.remove('visible');
        setTimeout(() => { overlay.hidden = true; }, 200);
    }

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (footerBtn) footerBtn.addEventListener('click', open);
    overlay.addEventListener('click', clickEvent => {
        if (clickEvent.target === overlay) close();
    });

    window.addEventListener('keydown', keyEvent => {
        const tag = (keyEvent.target.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        if (keyEvent.key === '?') {
            keyEvent.preventDefault();
            overlay.hidden ? open() : close();
        } else if (keyEvent.key === 'Escape' && !overlay.hidden) {
            close();
        }
    });
}

// Konami code
function initKonami() {
    const sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let position = 0;

    window.addEventListener('keydown', keyEvent => {
        const expected = sequence[position];
        const pressed = keyEvent.key.length === 1 ? keyEvent.key.toLowerCase() : keyEvent.key;
        if (pressed === expected) {
            position += 1;
            if (position === sequence.length) {
                position = 0;
                triggerKonami();
            }
        } else {
            position = pressed === sequence[0] ? 1 : 0;
        }
    });
}

function triggerKonami() {
    createPizzaParty();
    setTimeout(() => createAnimeSparkleBurst(), 200);
    setTimeout(() => createPizzaRain(), 400);
    if (DOMCache.status) DOMCache.status.textContent = 'Konami code activated';
}

// Terminal mode
const TERMINAL_BANNER = [
    '┌─────────────────────────────────────────┐',
    '│  vishnu@portfolio — type `help` to start │',
    '└─────────────────────────────────────────┘'
];

const TERMINAL_HELP = [
    'Available commands:',
    '  help            show this list',
    '  whoami          quick intro',
    '  neofetch        system-style profile card',
    '  git log         career history as commits',
    '  cat resume      open the resume PDF',
    '  ls projects     list projects',
    '  ls experience   list roles',
    '  open <section>  jump to a section',
    '  contact         contact links',
    '  theme [name]    light | warm | dark',
    '  fun [on|off]    toggle fun mode',
    '  joke            tell a programmer joke',
    '  clear           clear terminal',
    '  exit            close terminal (or press Esc)'
];

const TERMINAL_JOKES = [
    'Why do programmers prefer dark mode? Because light attracts bugs.',
    'There are 10 kinds of people: those who understand binary and those who don\'t.',
    'I would tell you a UDP joke, but you might not get it.',
    'A SQL query walks into a bar, sees two tables and asks: "Can I join you?"',
    '99 little bugs in the code… patch one, regress it around, 117 little bugs in the code.'
];

function initTerminal() {
    const overlay = document.getElementById('terminal-overlay');
    const body = document.getElementById('terminal-body');
    const output = document.getElementById('terminal-output');
    const input = document.getElementById('terminal-input');
    const footerBtn = document.getElementById('footer-terminal-btn');
    if (!overlay || !body || !output || !input) return;

    let historyShown = false;

    function open() {
        overlay.hidden = false;
        requestAnimationFrame(() => overlay.classList.add('visible'));
        if (!historyShown) {
            TERMINAL_BANNER.forEach(line => writeLine(line));
            writeLine('');
            historyShown = true;
        }
        setTimeout(() => input.focus(), 50);
    }
    function close() {
        overlay.classList.remove('visible');
        setTimeout(() => { overlay.hidden = true; }, 200);
    }
    function writeLine(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`.trim();
        line.textContent = text;
        output.appendChild(line);
        body.scrollTop = body.scrollHeight;
    }
    function echoCommand(commandText) {
        const line = document.createElement('div');
        line.className = 'terminal-line terminal-echo';
        line.innerHTML = `<span class="terminal-prompt">$</span> ${escapeHtml(commandText)}`;
        output.appendChild(line);
    }
    function escapeHtml(text) {
        return text.replace(/[&<>"']/g, character => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[character]));
    }

    function runCommand(rawCommand) {
        const command = rawCommand.trim();
        if (!command) return;
        echoCommand(command);
        const [head, ...rest] = command.split(/\s+/);
        const argument = rest.join(' ');

        switch (head.toLowerCase()) {
            case 'help':
                TERMINAL_HELP.forEach(line => writeLine(line));
                break;
            case 'whoami':
                writeLine(`${portfolioData?.personal?.name || 'Vishnu Sai Jaswanth'} — ${portfolioData?.personal?.title || 'Senior SDE'}`);
                writeLine(portfolioData?.personal?.shortBio || portfolioData?.personal?.bio || '');
                break;
            case 'neofetch': {
                const person = portfolioData?.personal || {};
                const currentRole = portfolioData?.experience?.[0];
                [
                    `${person.name || 'Vishnu Sai Jaswanth'}`,
                    '─────────────────────────────',
                    `Role:     ${person.title || 'Senior Backend & Applied AI Engineer'}`,
                    `Company:  ${currentRole?.company || '10x Productivity'}`,
                    `Location: ${person.location || 'Bengaluru, India'} (${person.timezone || 'IST'})`,
                    `Uptime:   4+ years in production`,
                    `Stack:    ${(person.stack || []).join(', ')}`,
                    `Shell:    /bin/curiosity`,
                    `Fuel:     coffee + pizza`
                ].forEach(line => writeLine(line));
                break;
            }
            case 'git':
                if (rest[0] === 'log') {
                    const hashes = ['a1b2c3d', 'f4e5d6c', '9c8b7a6', '12ab34c'];
                    (portfolioData?.experience || []).forEach((role, roleIndex) => {
                        writeLine(`commit ${hashes[roleIndex] || 'e0f1a2b'}  (${role.duration})`, 'terminal-accent');
                        writeLine(`    ${role.title} @ ${role.company}`);
                        writeLine('');
                    });
                } else {
                    writeLine('usage: git log');
                }
                break;
            case 'open': {
                const requested = (rest[0] || '').toLowerCase();
                if (VALID_SECTIONS.includes(requested)) {
                    writeLine(`opening ${requested}…`);
                    activateSection(requested);
                    close();
                } else {
                    writeLine(`open: unknown section. try: ${VALID_SECTIONS.join(', ')}`);
                }
                break;
            }
            case 'cat':
                if (rest[0] === 'resume') {
                    writeLine('opening resume.pdf…');
                    window.open(portfolioData?.contact?.resume || 'assets/pdf/resume.pdf', '_blank', 'noopener');
                } else {
                    writeLine(`cat: ${rest[0] || ''}: try \`cat resume\``);
                }
                break;
            case 'ls':
                if (rest[0] === 'projects') {
                    (portfolioData?.projects || []).forEach((project, projectIndex) => {
                        writeLine(`  ${projectIndex + 1}. ${project.title} — ${project.link}`);
                    });
                } else if (rest[0] === 'experience') {
                    (portfolioData?.experience || []).forEach((role, roleIndex) => {
                        writeLine(`  ${roleIndex + 1}. ${role.title} @ ${role.company} (${role.duration})`);
                    });
                } else {
                    writeLine('try: ls projects | ls experience');
                }
                break;
            case 'contact':
                writeLine(`email:    ${portfolioData?.contact?.email || ''}`);
                writeLine(`linkedin: ${portfolioData?.contact?.linkedin || ''}`);
                writeLine(`github:   ${portfolioData?.contact?.github || ''}`);
                break;
            case 'theme':
                if (['light', 'warm', 'dark'].includes(argument)) {
                    setTheme(argument);
                    localStorage.setItem('portfolio-theme', argument);
                    writeLine(`theme: ${argument}`);
                } else {
                    writeLine('usage: theme <light|warm|dark>');
                }
                break;
            case 'fun': {
                const funBtn = document.getElementById('fun-toggle');
                if (argument === 'on' || argument === 'off') {
                    const next = argument === 'on';
                    document.body.classList.toggle('fun', next);
                    localStorage.setItem('portfolio-fun', next ? 'on' : 'off');
                    if (funBtn) funBtn.setAttribute('aria-pressed', next ? 'true' : 'false');
                    writeLine(`fun mode: ${argument}`);
                } else {
                    if (funBtn) funBtn.click();
                    writeLine(`fun mode toggled`);
                }
                break;
            }
            case 'joke':
                writeLine(TERMINAL_JOKES[Math.floor(Math.random() * TERMINAL_JOKES.length)]);
                break;
            case 'clear':
                output.innerHTML = '';
                break;
            case 'exit':
            case 'quit':
            case 'close':
                close();
                break;
            case 'sudo':
                if (argument === 'make coffee') {
                    writeLine('☕ HTTP 418: I\'m a teapot. (brewing anyway…)');
                } else {
                    writeLine(`${portfolioData?.personal?.name || 'user'} is not in the sudoers file. This incident will be reported. 🍕`);
                }
                break;
            default:
                writeLine(`${head}: command not found. type \`help\``);
        }
    }

    input.addEventListener('keydown', keyEvent => {
        if (keyEvent.key === 'Enter') {
            const command = input.value;
            input.value = '';
            runCommand(command);
        } else if (keyEvent.key === 'Escape') {
            close();
        }
    });

    body.addEventListener('click', () => input.focus());

    if (footerBtn) footerBtn.addEventListener('click', open);

    window.addEventListener('keydown', keyEvent => {
        const tag = (keyEvent.target.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        if (keyEvent.key === '`') {
            keyEvent.preventDefault();
            overlay.hidden ? open() : close();
        }
    });
}

// Command palette (⌘K / Ctrl-K) — jump to any section + run quick actions.
function initCommandPalette() {
    const overlay = document.getElementById('cmdk-overlay');
    const input = document.getElementById('cmdk-input');
    const list = document.getElementById('cmdk-list');
    const footerBtn = document.getElementById('footer-cmdk-btn');
    if (!overlay || !input || !list) return;

    const SECTION_LABELS = {
        about: 'About', skills: 'Skills', experience: 'Experience', projects: 'Projects',
        achievements: 'Wins', vibes: 'Vibes', contact: 'Contact', education: 'Education'
    };
    const SECTION_ICONS = {
        about: '👋', skills: '🧰', experience: '💼', projects: '🛠️',
        achievements: '🏆', vibes: '🎧', contact: '✉️', education: '🎓'
    };

    function setThemeCommand(theme) {
        setTheme(theme);
        try { localStorage.setItem('portfolio-theme', theme); } catch (_) { /* no-op */ }
    }

    const commands = [
        ...VALID_SECTIONS.map(sectionId => ({
            icon: SECTION_ICONS[sectionId] || '→',
            label: `Go to ${SECTION_LABELS[sectionId] || sectionId}`,
            keywords: `section ${sectionId}`,
            run: () => activateSection(sectionId)
        })),
        { icon: '📄', label: 'Open resume', keywords: 'cv pdf download', run: () => window.open(portfolioData?.contact?.resume || 'assets/pdf/resume.pdf', '_blank', 'noopener') },
        { icon: '✉️', label: 'Copy email', keywords: 'contact mail reach', run: () => portfolioData?.contact?.email && showEmailToast(portfolioData.contact.email) },
        { icon: '💻', label: 'Open GitHub', keywords: 'code repos', run: () => portfolioData?.contact?.github && window.open(portfolioData.contact.github, '_blank', 'noopener') },
        { icon: '💼', label: 'Open LinkedIn', keywords: 'connect message', run: () => portfolioData?.contact?.linkedin && window.open(portfolioData.contact.linkedin, '_blank', 'noopener') },
        { icon: '☀️', label: 'Theme: Light', keywords: 'appearance color', run: () => setThemeCommand('light') },
        { icon: '🌅', label: 'Theme: Warm', keywords: 'appearance color', run: () => setThemeCommand('warm') },
        { icon: '🌙', label: 'Theme: Dark', keywords: 'appearance color', run: () => setThemeCommand('dark') },
        { icon: '✨', label: 'Toggle Fun mode', keywords: 'effects pizza sparkles', run: () => document.getElementById('fun-toggle')?.click() },
        { icon: '❯', label: 'Open terminal', keywords: 'shell console cli', run: () => document.getElementById('footer-terminal-btn')?.click() }
    ];

    let visible = commands.slice();
    let selected = 0;

    function renderList() {
        list.innerHTML = '';
        visible.forEach((command, index) => {
            const item = document.createElement('li');
            item.className = 'cmdk-item' + (index === selected ? ' is-selected' : '');
            item.setAttribute('role', 'option');
            item.setAttribute('aria-selected', index === selected ? 'true' : 'false');
            item.innerHTML = `<span class="cmdk-item-icon" aria-hidden="true">${command.icon}</span><span class="cmdk-item-label">${command.label}</span>`;
            item.addEventListener('mouseenter', () => { selected = index; updateSelection(); });
            item.addEventListener('click', () => runSelected(index));
            list.appendChild(item);
        });
        if (visible.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'cmdk-empty';
            empty.textContent = 'No matches';
            list.appendChild(empty);
        }
    }

    function updateSelection() {
        list.querySelectorAll('.cmdk-item').forEach((item, index) => {
            const isOn = index === selected;
            item.classList.toggle('is-selected', isOn);
            item.setAttribute('aria-selected', isOn ? 'true' : 'false');
            if (isOn) item.scrollIntoView({ block: 'nearest' });
        });
    }

    function filter(query) {
        const normalized = query.trim().toLowerCase();
        visible = !normalized
            ? commands.slice()
            : commands.filter(command =>
                (command.label + ' ' + (command.keywords || '')).toLowerCase().includes(normalized));
        selected = 0;
        renderList();
    }

    function open() {
        overlay.hidden = false;
        requestAnimationFrame(() => overlay.classList.add('visible'));
        input.value = '';
        filter('');
        setTimeout(() => input.focus(), 40);
    }
    function close() {
        overlay.classList.remove('visible');
        setTimeout(() => { overlay.hidden = true; }, 180);
    }
    function runSelected(index) {
        const command = visible[index];
        if (!command) return;
        close();
        setTimeout(() => command.run(), 60);
    }

    input.addEventListener('input', () => filter(input.value));
    input.addEventListener('keydown', keyEvent => {
        if (keyEvent.key === 'ArrowDown') {
            keyEvent.preventDefault();
            if (visible.length) { selected = (selected + 1) % visible.length; updateSelection(); }
        } else if (keyEvent.key === 'ArrowUp') {
            keyEvent.preventDefault();
            if (visible.length) { selected = (selected - 1 + visible.length) % visible.length; updateSelection(); }
        } else if (keyEvent.key === 'Enter') {
            keyEvent.preventDefault();
            runSelected(selected);
        } else if (keyEvent.key === 'Escape') {
            close();
        }
    });
    overlay.addEventListener('click', clickEvent => {
        if (clickEvent.target === overlay) close();
    });
    if (footerBtn) footerBtn.addEventListener('click', open);

    window.addEventListener('keydown', keyEvent => {
        if ((keyEvent.metaKey || keyEvent.ctrlKey) && keyEvent.key.toLowerCase() === 'k') {
            keyEvent.preventDefault();
            overlay.hidden ? open() : close();
        }
    });
}

// Easter eggs
function initEasterEggs() {
    let nameClickCount = 0;
    const nameElement = document.getElementById('name');

    if (nameElement) {
        nameElement.addEventListener('click', function () {
            nameClickCount++;
            if (nameClickCount === 3) {
                createPizzaRain();
                nameClickCount = 0;
            }
            setTimeout(() => {
                if (nameClickCount < 3) nameClickCount = 0;
            }, 2000);
        });
    }

    if ('ontouchstart' in window) {
        const buttons = document.querySelectorAll('.nav-btn, .theme-btn, .contact-link, .expand-project, .expand-experience, .show-more-skills');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function () { this.style.transform = 'scale(0.95)'; });
            button.addEventListener('touchend', function () { this.style.transform = ''; });
            button.addEventListener('touchcancel', function () { this.style.transform = ''; });
        });
    }

    if (!('ontouchstart' in window)) {
        let cyclingBoostActive = false;
        let cyclingPushTimeout = null;

        document.addEventListener('keydown', function (keyEvent) {
            const tag = (keyEvent.target.tagName || '').toLowerCase();
            if (tag === 'input' || tag === 'textarea') return;
            // Single-key effects are opt-in: only fire when Fun mode is on, so a
            // recruiter tapping a key in the default (professional) view gets nothing.
            if (!document.body.classList.contains('fun')) return;

            if (keyEvent.key.toLowerCase() === 'c' && !keyEvent.repeat) {
                const cyclingTrack = document.querySelector('.cycling-track');
                if (cyclingTrack && !cyclingBoostActive) {
                    cyclingBoostActive = true;
                    cyclingTrack.style.setProperty('--cycle-speed', '15s');
                    if (cyclingPushTimeout) clearTimeout(cyclingPushTimeout);
                    cyclingPushTimeout = setTimeout(() => {
                        if (cyclingBoostActive) cyclingTrack.style.setProperty('--cycle-speed', '13s');
                    }, 800);
                }
            }

            if (keyEvent.key.toLowerCase() === 'p') createPizzaParty();
            if (keyEvent.key.toLowerCase() === 'a') createAnimeSparkleBurst();
            if (keyEvent.key.toLowerCase() === 'm') createMovieClap();
            if (keyEvent.key.toLowerCase() === 'n') createLeafFall();
        });

        document.addEventListener('keyup', function (keyEvent) {
            if (keyEvent.key.toLowerCase() === 'c') {
                const cyclingTrack = document.querySelector('.cycling-track');
                if (cyclingTrack && cyclingBoostActive) {
                    cyclingBoostActive = false;
                    if (cyclingPushTimeout) {
                        clearTimeout(cyclingPushTimeout);
                        cyclingPushTimeout = null;
                    }
                    cyclingTrack.style.removeProperty('--cycle-speed');
                }
            }
        });
    }
}

// Typewriter — rotates roles, lands on the real title
function initTypewriter() {
    const typewriter = DOMCache.titleTypewriter;
    const staticEl = DOMCache.titleStatic;
    if (!typewriter || !staticEl) return;

    const roles = portfolioData?.personal?.rotatingRoles;
    if (!Array.isArray(roles) || roles.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    staticEl.classList.add('visually-hidden');
    typewriter.setAttribute('aria-hidden', 'true');

    const finalRole = roles[roles.length - 1];
    let roleIndex = 0;
    let charIndex = 0;
    let mode = 'typing';

    function tick() {
        const currentRole = roles[roleIndex];
        if (mode === 'typing') {
            charIndex += 1;
            typewriter.textContent = currentRole.slice(0, charIndex);
            if (charIndex === currentRole.length) {
                if (currentRole === finalRole) {
                    // Animation complete: swap back to the static title and remove the overlay
                    typewriter.classList.add('done');
                    staticEl.classList.remove('visually-hidden');
                    return;
                }
                mode = 'pause';
                setTimeout(tick, 900);
                return;
            }
            setTimeout(tick, 55 + Math.random() * 35);
        } else if (mode === 'pause') {
            mode = 'deleting';
            setTimeout(tick, 40);
        } else if (mode === 'deleting') {
            charIndex -= 1;
            typewriter.textContent = currentRole.slice(0, charIndex);
            if (charIndex === 0) {
                roleIndex = (roleIndex + 1) % roles.length;
                mode = 'typing';
                setTimeout(tick, 220);
                return;
            }
            setTimeout(tick, 28);
        }
    }

    setTimeout(tick, 400);
}

// Cursor sparkle trail (fun mode only)
function initCursorSparkles() {
    const canvas = document.getElementById('cursor-sparkles');
    if (!canvas) return;
    const context = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const particles = [];
    let lastSpawn = 0, running = false;
    let mouseX = -1, mouseY = -1;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    window.addEventListener('mousemove', moveEvent => {
        mouseX = moveEvent.clientX;
        mouseY = moveEvent.clientY;
        if (!document.body.classList.contains('fun')) return;
        const now = Date.now();
        if (now - lastSpawn < 30) return;
        lastSpawn = now;
        const accentRgb = getComputedStyle(document.body).getPropertyValue('--accent-rgb').trim() || '139,69,19';
        for (let particleIndex = 0; particleIndex < 2; particleIndex++) {
            particles.push({
                x: mouseX + (Math.random() - 0.5) * 6,
                y: mouseY + (Math.random() - 0.5) * 6,
                vx: (Math.random() - 0.5) * 0.8,
                vy: -0.4 - Math.random() * 0.6,
                life: 1,
                size: 1.5 + Math.random() * 2,
                color: accentRgb
            });
        }
        // Kick the render loop only when there's something to draw.
        if (!running) {
            running = true;
            requestAnimationFrame(frame);
        }
    });

    function frame() {
        context.clearRect(0, 0, width, height);
        for (let particleIndex = particles.length - 1; particleIndex >= 0; particleIndex--) {
            const particle = particles[particleIndex];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.018;
            if (particle.life <= 0) {
                particles.splice(particleIndex, 1);
                continue;
            }
            context.fillStyle = `rgba(${particle.color}, ${particle.life * 0.85})`;
            context.beginPath();
            context.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
            context.fill();
        }
        // Idle out when the last particle dies instead of looping forever.
        if (particles.length > 0) {
            requestAnimationFrame(frame);
        } else {
            running = false;
        }
    }
}

function setFooterYear() {
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = `© ${new Date().getFullYear()}`;
}

function hideLoadingStates() {
    document.body.classList.add('loaded');
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => loadingScreen.remove(), 300);
    }
}

function ensureLoadingTimeout() {
    setTimeout(() => {
        if (!document.body.classList.contains('loaded')) hideLoadingStates();
    }, 2500);
}

document.addEventListener('DOMContentLoaded', function () {
    DOMCache.init();
    ensureLoadingTimeout();

    loadContent().then(() => {
        initNavigation();
        initTheme();
        initFunMode();
        initCyclingProgress();
        initParallax();
        initEasterEggs();
        initShortcutsOverlay();
        initKonami();
        initTerminal();
        initCommandPalette();
        initTypewriter();
        initCursorSparkles();
        initLiveClock();
        setFooterYear();
        hideLoadingStates();
    }).catch(initError => {
        console.error('Error during initialization:', initError);
        hideLoadingStates();
    });
});
