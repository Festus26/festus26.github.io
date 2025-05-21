// Fixed Navigation Animations
console.log("Nav animations script loaded");

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded - initializing nav animations");
    
    try {
        // Select elements with error checking
        const header = document.querySelector('header');
        if (!header) {
            console.error("Header element not found!");
            return;
        }
        
        const navLinks = document.querySelectorAll('.nav-links a');
        if (navLinks.length === 0) {
            console.error("Navigation links not found!");
            return;
        }
        
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileNav = document.querySelector('.nav-links');
        const sections = document.querySelectorAll('section');
        
        console.log(`Found ${navLinks.length} nav links and ${sections.length} sections`);
        
        // Create scroll progress bar
        const scrollProgress = document.createElement('div');
        scrollProgress.className = 'scroll-progress';
        header.appendChild(scrollProgress);
        console.log("Scroll progress bar added");
        
        // Create nav indicator (sliding highlight under active link)
        const navContainer = header.querySelector('nav');
        if (!navContainer) {
            console.error("Nav container not found within header!");
            return;
        }
        
        const navIndicator = document.createElement('div');
        navIndicator.className = 'nav-indicator';
        navIndicator.style.display = 'none'; // Hide initially
        navContainer.appendChild(navIndicator);
        console.log("Nav indicator added");
        
        // Activate all links initially
        navLinks.forEach(link => {
            link.classList.add('nav-enabled');
        });
        
        // Track last scroll position to determine scroll direction
        let lastScrollTop = 0;
        
        // Handle scroll events
        window.addEventListener('scroll', function() {
            // Update scroll progress bar width
            const scrollPercentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            scrollProgress.style.width = `${scrollPercentage}%`;
            
            // Toggle header visibility based on scroll direction
            const currentScrollTop = window.scrollY;
            
            if (currentScrollTop > 100) {
                // Already handled by existing code to add 'scrolled' class
                header.classList.add('scrolled');
                
                // Handle header hide/show based on scroll direction
                if (currentScrollTop > lastScrollTop && currentScrollTop > 200) {
                    // Scrolling down - hide header
                    header.classList.add('nav-reveal');
                    header.classList.remove('visible');
                } else {
                    // Scrolling up - show header
                    header.classList.add('visible');
                }
            } else {
                header.classList.remove('scrolled');
                header.classList.remove('nav-reveal');
            }
            
            lastScrollTop = currentScrollTop;
            
            // Highlight current section in navigation
            updateActiveNavLink();
        });
        
        // Trigger a scroll event to initialize states
        window.dispatchEvent(new Event('scroll'));
        console.log("Initial scroll event triggered");
        
        // Update navigation indicator position
        function updateIndicator(el) {
            if (!el) return;
            
            // Only show indicator on desktop
            if (window.innerWidth < 768) {
                navIndicator.style.display = 'none';
                return;
            }
            
            navIndicator.style.display = 'block';
            navIndicator.style.width = `${el.offsetWidth}px`;
            navIndicator.style.left = `${el.offsetLeft}px`;
        }
        
        // Find the current section and update active nav link
        function updateActiveNavLink() {
            let currentSectionId = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.offsetHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    currentSectionId = section.getAttribute('id');
                }
            });
            
            // Remove active class from all links
            navLinks.forEach(link => {
                link.classList.remove('active');
                
                // If this link points to the current section, make it active
                const href = link.getAttribute('href');
                if (href && href.substring(1) === currentSectionId) {
                    link.classList.add('active');
                    updateIndicator(link);
                }
            });
        }
        
        // Enhanced smooth scrolling with animation
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get the target section
                const targetId = this.getAttribute('href');
                if (!targetId) return;
                
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Create page transition effect 
                    const transition = document.createElement('div');
                    transition.className = 'page-transition';
                    document.body.appendChild(transition);
                    
                    // Activate transition
                    setTimeout(() => transition.classList.add('active'), 10);
                    
                    // After transition completes, scroll and then remove it
                    setTimeout(() => {
                        // Scroll to section
                        window.scrollTo({
                            top: targetSection.offsetTop - 80,
                            behavior: 'smooth'
                        });
                        
                        // Start exit animation
                        transition.classList.add('exit');
                        
                        // Remove transition element after animation completes
                        setTimeout(() => {
                            transition.remove();
                        }, 500);
                        
                        // Close mobile menu if open
                        if (mobileNav && mobileNav.classList.contains('active')) {
                            mobileNav.classList.remove('active');
                            if (menuToggle) menuToggle.classList.remove('active');
                        }
                    }, 300);
                }
            });
            
            // Update indicator on hover
            link.addEventListener('mouseenter', function() {
                if (window.innerWidth >= 768) {
                    updateIndicator(this);
                }
            });
        });
        
        // Reset indicator to active link when mouse leaves navigation
        if (document.querySelector('.nav-links')) {
            document.querySelector('.nav-links').addEventListener('mouseleave', function() {
                const activeLink = document.querySelector('.nav-links a.active');
                updateIndicator(activeLink);
            });
        }
        
        // Toggle mobile menu with animation
        if (menuToggle && mobileNav) {
            menuToggle.addEventListener('click', function() {
                mobileNav.classList.toggle('active');
                this.classList.toggle('active');
                console.log("Mobile menu toggled");
            });
        }
        
        // Initialize on page load
        updateActiveNavLink();
        
        // Handle resize events for responsive adjustments
        window.addEventListener('resize', function() {
            const activeLink = document.querySelector('.nav-links a.active');
            updateIndicator(activeLink);
        });
        
        console.log("Navigation animations initialized successfully");
    } catch (error) {
        console.error("Error initializing navigation animations:", error);
    }
});
