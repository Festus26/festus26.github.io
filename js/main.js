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
        title: "Clean Go",
        description: "So, what do you think applications that claim to speed up your computer actually do? This game, which consists of blood, sweat and pixels in real terms, leaves you with a newfound data and a very impatient gamer.",
        image: "images/game1.png",
        tags: ["Unity", "C#", "3D", "Arcade"],
        platform: "PC",
        technology: "Unity Engine",
        demo: "https://teamsermath.itch.io/clean-go",
        github: "#"
    },
    {
        title: "Sci Run",
        description: "A mad scientist works on a different virus. However, something goes wrong and the scientist starts to run after this disappointment to save humanity which suddenly falls under his responsibility.",
        image: "images/game2.jpg",
        tags: ["Unity", "C#", "3D", "Runner"],
        platform: "Mobile",
        technology: "Unity Engine",
        demo: "#",
        github: "#"
    },
    {
        title: "Anti-Goodness Department",
        description: "In this universe, life is so simple. There is a corperation called Anti-Goodness Department which in charge of eliminate good people. This agency is tasked with rooting out good people and preparing worst life for their world.",
        image: "images/game3.jpg",
        tags: ["Unity", "C#", "3D", "Adventure"],
        platform: "PC",
        technology: "Unity Engine",
        demo: "https://teamsermath.itch.io/agd",
        github: "#"
    }
];

const techProjects = [
    {
        title: "AI Image Generator",
        description: "A web application that uses machine learning to generate images based on text descriptions. Users can input prompts and receive AI-generated artwork in various styles.",
        images: ["images/game1.png", "images/tech1-2.jpg", "images/tech1-3.jpg"],
        tags: ["Python", "TensorFlow", "React"],
        demo: "#",
        github: "#"
    },
    {
        title: "Game Development Toolkit",
        description: "A custom toolkit for Unity that streamlines the game development workflow with reusable components. Includes advanced physics systems, procedural level generation, and AI behavior tools.",
        images: ["images/tech2.jpg", "images/tech2-2.jpg", "images/tech2-3.jpg"],
        tags: ["C#", "Unity", "Editor Scripting"],
        demo: "#",
        github: "#"
    },
    {
        title: "Procedural World Generator",
        description: "An algorithm for generating realistic 3D worlds with terrain, vegetation, and cities. Features advanced biome systems, river networks, and dynamic weather patterns that affect the environment.",
        images: ["images/tech3.jpg", "images/tech3-2.jpg", "images/tech3-3.jpg"],
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
    const techGrid = document.querySelector('#tech .tech-project-grid');
    if (techGrid) {
        techGrid.innerHTML = '';
        
        techProjects.forEach((project, index) => {
            const projectCard = createTechProjectCard(project);
            projectCard.style.transitionDelay = `${index * 0.1}s`;
            projectCard.classList.add('visible'); // Make sure cards are visible initially
            techGrid.appendChild(projectCard);
        });
    }
    
    // Initialize tooltips for project tags
    initializeTooltips();
    
    // Initialize sliders after they are added to the DOM
    initializeSliders();
}

function createGameCard(project) {
    const card = document.createElement('div');
    card.className = 'game-card';
    
    // Removed title attribute for game tags to disable hover descriptions
    const tagsHTML = project.tags ? project.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
    
    // Prepare conditional buttons HTML
    const demoButton = (project.demo && project.demo !== '#') ? 
        `<a href="${project.demo}" class="btn btn-sm">Play Now</a>` : '';
    
    const githubButton = (project.github && project.github !== '#') ? 
        `<a href="${project.github}" class="btn btn-sm btn-outline">View Source</a>` : '';
    
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
                ${demoButton}
                ${githubButton}
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
}    // Add tooltip functionality
function initializeTooltips() {
    // Only initialize tooltips for tech project tags, not for game project tags
    const tags = document.querySelectorAll('.tech-project-tag');
    
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

// Function to create tech project cards with image sliders
function createTechProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'tech-project-card';
    
    const tagsHTML = project.tags ? project.tags.map(tag => `<span class="tech-project-tag" title="${getTagDescription(tag)}">${tag}</span>`).join('') : '';
    
    // Ensure project.images is an array (fallback for older project data)
    const images = project.images || [project.image || 'images/placeholder.jpg'];
    
    // Create image slider HTML
    const sliderImagesHTML = images.map(image => 
        `<img src="${image}" alt="${project.title}">`
    ).join('');
    
    // Create slider dots HTML (only if multiple images)
    const sliderDotsHTML = images.length > 1 ? 
        images.map((_, index) => 
            `<div class="slider-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`
        ).join('') : '';
    
    // Add image counter for multiple images
    const sliderCounter = images.length > 1 ? 
        `<div class="slider-counter">1/${images.length}</div>` : '';
    
    card.innerHTML = `
        <div class="tech-project-slider" data-project="${project.title.replace(/\s+/g, '-').toLowerCase()}">
            ${images.length > 1 ? `
            <div class="slider-control prev">
                <i class="fas fa-chevron-left"></i>
            </div>
            <div class="slider-control next">
                <i class="fas fa-chevron-right"></i>
            </div>
            ${sliderCounter}
            ` : ''}
            <div class="tech-project-slider-container">
                ${sliderImagesHTML}
            </div>
            ${sliderDotsHTML ? `<div class="slider-nav">${sliderDotsHTML}</div>` : ''}
        </div>
        <div class="tech-project-info">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="tech-project-tags">
                ${tagsHTML}
            </div>
            <div class="tech-project-links">
                <a href="${project.demo}" class="btn btn-sm">Live Demo</a>
                <a href="${project.github}" class="btn btn-sm btn-outline">GitHub</a>
            </div>
        </div>
    `;
    
    return card;
}

// Initialize all image sliders
function initializeSliders() {
    const sliders = document.querySelectorAll('.tech-project-slider');
    
    sliders.forEach(slider => {
        const container = slider.querySelector('.tech-project-slider-container');
        const dots = slider.querySelectorAll('.slider-dot');
        const prevBtn = slider.querySelector('.slider-control.prev');
        const nextBtn = slider.querySelector('.slider-control.next');
        const counter = slider.querySelector('.slider-counter');
        
        // Only initialize slider if it has multiple images
        if (container.children.length <= 1) {
            return;
        }
        
        const imageCount = container.children.length;
        let currentIndex = 0;
        
        // Function to navigate to a specific slide
        const goToSlide = (index) => {
            currentIndex = (index + imageCount) % imageCount; // Ensure index is in range
            container.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update active dot
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
            
            // Update counter if it exists
            if (counter) {
                counter.textContent = `${currentIndex + 1}/${imageCount}`;
            }
        };
        
        // Set up event listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });
        
        // Set up event listeners for prev/next buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                goToSlide(currentIndex - 1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                goToSlide(currentIndex + 1);
            });
        }
        
        // Add keyboard navigation when slider is hovered
        slider.addEventListener('mouseenter', () => {
            slider.setAttribute('tabindex', '0');
            slider.focus({preventScroll: true});
        });
        
        slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                goToSlide(currentIndex - 1);
                e.preventDefault();
            } else if (e.key === 'ArrowRight') {
                goToSlide(currentIndex + 1);
                e.preventDefault();
            }
        });
        
        // Auto-rotate slides every 5 seconds
        const sliderId = slider.dataset.project;
        let intervalId = setInterval(() => goToSlide(currentIndex + 1), 5000);
        
        // Pause auto-rotation on hover
        slider.addEventListener('mouseenter', () => clearInterval(intervalId));
        slider.addEventListener('mouseleave', () => {
            intervalId = setInterval(() => goToSlide(currentIndex + 1), 5000);
        });
        
        // Add swipe gesture support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50; // Minimum distance for a swipe
            
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe left, go to next slide
                goToSlide(currentIndex + 1);
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe right, go to previous slide
                goToSlide(currentIndex - 1);
            }
        }
    });
}
