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
            if (targetId === '#') return; // placeholder link, nothing to scroll to
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
    
    // Make showNotification available globally
    window.showNotification = showNotification;
    
    // Load project data with staggered animations
    loadProjects();
});

// Sample project data - you would replace this with your actual projects
const gameProjects = [
    {
        title: "Sci Run",
        description: "A mad scientist is working on a new virus, but something goes wrong. Now he has to run to save humanity, which has suddenly become his responsibility.",
        image: "https://img.itch.zone/aW1nLzEwMzIzNjcyLnBuZw==/315x250%23c/FB31rG.png",
        tags: ["Unity", "C#", "3D", "Runner"],
        platform: "Mobile",
        technology: "Unity Engine",
        demo: "#",
        github: "#"
    },
    {
        title: "Clean Go",
        description: "What do those apps that claim to speed up your computer actually do? Made of blood, sweat and pixels, this game lets you find out first-hand.",
        image: "https://img.itch.zone/aW1nLzY1MTM1NDEucG5n/315x250%23c/9qvQb6.png",
        tags: ["Unity", "C#", "3D", "Arcade"],
        platform: "PC",
        technology: "Unity Engine",
        demo: "https://teamsermath.itch.io/clean-go",
        github: "#"
    },
    {
        title: "Anti-Goodness Department",
        description: "In this universe, life is simple. A corporation called the Anti-Goodness Department is in charge of eliminating good people, rooting them out and making their world as miserable as possible.",
        image: "https://img.itch.zone/aW1nLzYxNzA2MDEucG5n/315x250%23c/X%2BcgYg.png",
        tags: ["Unity", "C#", "3D", "Adventure"],
        platform: "PC",
        technology: "Unity Engine",
        demo: "https://teamsermath.itch.io/agd",
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
