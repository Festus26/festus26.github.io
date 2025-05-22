document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Highlight the clicked navigation item
                document.querySelectorAll('.nav-links a').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu after clicking a link
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
    
    // Scroll animations
    const header = document.querySelector('header');
    const animatedElements = document.querySelectorAll('.project-card, .skill-category');
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
    const scrollProgress = document.querySelector('.scroll-progress');
    
    // Change header on scroll and highlight current section in navigation
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update scroll progress bar
        if (scrollProgress) {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            scrollProgress.style.width = scrolled + '%';
        }
        
        // Animate elements when they come into view
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
        
        // Highlight current section in navigation
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        // Add 'active' class to the corresponding navigation item
        navItems.forEach(item => {
            item.classList.remove('active');
            const href = item.getAttribute('href').substring(1);
            if (href === currentSectionId) {
                item.classList.add('active');
            }
        });
    });
    
    // Trigger scroll once to check initial positions
    window.dispatchEvent(new Event('scroll'));
    
    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
    
    // Load project data with staggered animations
    loadProjects();
});

// Sample project data - you would replace this with your actual projects
const gameProjects = [
    {
        title: "Space Explorer",
        description: "A 3D space exploration game built with Unity where players can explore different planets and complete missions.",
        image: "images/game1.jpg",
        tags: ["Unity", "C#", "3D Game"],
        platform: "PC | Steam",
        technology: "Unity Engine",
        demo: "#",
        github: "#"
    },
    {
        title: "Dungeon Crawler",
        description: "A procedurally generated dungeon crawler game with pixel art aesthetics and roguelike elements.",
        image: "images/game2.jpg",
        tags: ["Unreal Engine", "C++", "Procedural Generation"],
        platform: "PC | Consoles",
        technology: "Unreal Engine",
        demo: "#",
        github: "#"
    },
    {
        title: "Strategy Tactics",
        description: "A turn-based strategy game inspired by classic tactical RPGs, featuring unique character classes and abilities.",
        image: "images/game3.jpg",
        tags: ["Unity", "C#", "Game Design"],
        platform: "PC | Mobile",
        technology: "Unity Engine",
        demo: "#",
        github: "#"
    }
];

const techProjects = [
    {
        title: "AI Image Generator",
        description: "A web application that uses machine learning to generate images based on text descriptions.",
        image: "images/tech1.jpg",
        tags: ["Python", "TensorFlow", "React"],
        demo: "#",
        github: "#"
    },
    {
        title: "Game Development Toolkit",
        description: "A custom toolkit for Unity that streamlines the game development workflow with reusable components.",
        image: "images/tech2.jpg",
        tags: ["C#", "Unity", "Editor Scripting"],
        demo: "#",
        github: "#"
    },
    {
        title: "Procedural World Generator",
        description: "An algorithm for generating realistic 3D worlds with terrain, vegetation, and cities.",
        image: "images/tech3.jpg",
        tags: ["C++", "OpenGL", "Procedural Generation"],
        demo: "#",
        github: "#"
    }
];

function loadProjects() {
    // Load game projects
    const gameContainer = document.querySelector('#games .games-container');
    if (gameContainer) {
        gameContainer.innerHTML = '';
        
        gameProjects.forEach((project, index) => {
            const gameCard = createGameCard(project);
            gameCard.style.transitionDelay = `${index * 0.1}s`;
            gameCard.classList.add('visible'); // Make sure cards are visible initially
            gameContainer.appendChild(gameCard);
        });
    }
    
    // Load tech projects
    const techGrid = document.querySelector('#tech .project-grid');
    if (techGrid) {
        techGrid.innerHTML = '';
        
        techProjects.forEach((project, index) => {
            const projectCard = createProjectCard(project);
            projectCard.style.transitionDelay = `${index * 0.1}s`;
            projectCard.classList.add('visible'); // Make sure cards are visible initially
            techGrid.appendChild(projectCard);
        });
    }
    
    // Initialize tooltips for project tags
    initializeTooltips();
}

function createGameCard(project) {
    const card = document.createElement('div');
    card.className = 'game-card';
    
    const tagsHTML = project.tags ? project.tags.map(tag => `<span class="tag" title="${getTagDescription(tag)}">${tag}</span>`).join('') : '';
    
    card.innerHTML = `
        <div class="game-img">
            <img src="${project.image}" alt="${project.title}">
        </div>
        <div class="game-info">
            <h3>${project.title}</h3>
            <div class="game-meta">
                <span class="game-platform">${project.platform || 'PC | Windows'}</span>
                <span class="game-tech">${project.technology || project.tags[0]}</span>
            </div>
            <p>${project.description}</p>
            <div class="tags">
                ${tagsHTML}
            </div>
            <div class="game-links">
                <a href="${project.demo}" class="btn btn-sm">Play Now</a>
                <a href="${project.github}" class="btn btn-sm btn-outline">View Source</a>
            </div>
        </div>
    `;
    
    return card;
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const tagsHTML = project.tags ? project.tags.map(tag => `<span class="tag" title="${getTagDescription(tag)}">${tag}</span>`).join('') : '';
    
    card.innerHTML = `
        <div class="project-img">
            <img src="${project.image}" alt="${project.title}">
        </div>
        <div class="project-info">
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="tags">
                    ${tagsHTML}
                </div>
            </div>
            <div class="project-links">
                <a href="${project.demo}" class="btn btn-sm">Live Demo</a>
                <a href="${project.github}" class="btn btn-sm btn-outline">GitHub</a>
            </div>
        </div>
    `;
    
    return card;
}

// Add tooltip functionality
function initializeTooltips() {
    const tags = document.querySelectorAll('.tag');
    
    tags.forEach(tag => {
        tag.addEventListener('mouseover', function(e) {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('title');
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            
            setTimeout(() => tooltip.classList.add('show'), 10);
            
            this.addEventListener('mouseleave', function() {
                tooltip.classList.remove('show');
                setTimeout(() => tooltip.remove(), 300);
            }, { once: true });
        });
    });
}

// Get descriptions for technology tags (for tooltips)
function getTagDescription(tag) {
    const descriptions = {
        'Unity': 'A powerful cross-platform game engine',
        'C#': 'A modern, object-oriented programming language',
        'C++': 'A high-performance programming language',
        '3D Game': 'Games with three-dimensional graphics and gameplay',
        'Unreal Engine': 'A state-of-the-art game engine with photorealistic rendering',
        'Procedural Generation': 'Algorithm-based content creation',
        'Game Design': 'The art of designing game concepts and mechanics',
        'Python': 'A versatile, high-level programming language',
        'TensorFlow': 'An open-source machine learning framework',
        'React': 'A JavaScript library for building user interfaces',
        'OpenGL': 'A cross-language, cross-platform API for rendering',
        'Editor Scripting': 'Creating custom tools within game engines'
    };
    
    return descriptions[tag] || tag;
}

// Make showNotification available globally
window.showNotification = showNotification;
