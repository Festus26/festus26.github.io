/**
 * Manages smooth background transitions between sections
 */
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Initialize
    initSectionTransitions();
    
    function initSectionTransitions() {
        // Add fade transition class to all sections
        sections.forEach(section => {
            section.classList.add('fade-transition');
        });
        
        // Handle section visibility on scroll
        handleSectionVisibility();
        window.addEventListener('scroll', handleSectionVisibility);
        window.addEventListener('resize', handleSectionVisibility);
        
        // Add special events for smoother transitions
        addSmoothTransitionEvents();
    }
    
    function handleSectionVisibility() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        // Check each section
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            // Calculate if section is currently visible
            if (scrollPosition >= sectionTop && scrollPosition <= sectionTop + sectionHeight) {
                // Add active class to current section
                section.classList.add('active-section');
                
                // Set corresponding nav link as active
                const id = section.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            } else {
                // Remove active class from non-visible sections
                section.classList.remove('active-section');
            }
        });
    }
    
    function addSmoothTransitionEvents() {
        // Create parallax effect on scroll
        window.addEventListener('scroll', function() {
            const scrollTop = window.scrollY;
            
            // Apply subtle parallax to background elements
            const bgStars = document.querySelector('.bg-stars');
            if (bgStars) {
                bgStars.style.transform = `translateY(${scrollTop * 0.1}px)`;
            }
        });
        
        // Handle click transitions for navigation
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // We don't need to prevent default as it's handled in main.js
                
                // Get the target section
                const targetId = this.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    // Add transition class to enhance the smoothness
                    targetSection.classList.add('active-section');
                }
            });
        });
    }
});
