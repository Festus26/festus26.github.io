document.addEventListener('DOMContentLoaded', function() {
    // Add orbit decorations to sections
    addOrbitDecorations();
    
    // Add star trail effect on mouse movement
    addStarTrailEffect();
    
    // Add parallax effect to space elements
    addParallaxEffect();
});

// Add orbit decorations to certain sections
function addOrbitDecorations() {
    const sectionsForOrbits = ['about', 'skills', 'contact'];
    
    sectionsForOrbits.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        // Add top-right orbit
        const topRightOrbit = document.createElement('div');
        topRightOrbit.className = 'orbit-decoration top-right';
        section.appendChild(topRightOrbit);
        
        // Add bottom-left orbit
        const bottomLeftOrbit = document.createElement('div');
        bottomLeftOrbit.className = 'orbit-decoration bottom-left';
        section.appendChild(bottomLeftOrbit);
    });
}

// Add star trail following the mouse cursor
function addStarTrailEffect() {
    const maxTrails = 20;
    const trails = [];
    let mouseX = 0;
    let mouseY = 0;
    
    // Create trail elements
    for (let i = 0; i < maxTrails; i++) {
        const trail = document.createElement('div');
        trail.className = 'star-trail';
        trail.style.opacity = 0;
        document.body.appendChild(trail);
        trails.push({
            element: trail,
            x: 0,
            y: 0,
            size: Math.random() * 4 + 1,
            speed: Math.random() * 0.5 + 0.1,
            opacity: Math.random() * 0.5 + 0.1,
            active: false,
            delay: i * 50
        });
    }
    
    // Track mouse movement
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Activate trails with delay
        trails.forEach((trail, index) => {
            if (!trail.active) {
                setTimeout(() => {
                    trail.active = true;
                    trail.x = mouseX;
                    trail.y = mouseY;
                }, trail.delay);
            }
        });
    });
    
    // Update trail positions
    function updateTrails() {
        trails.forEach(trail => {
            if (!trail.active) return;
            
            // Calculate distance from current position to mouse
            const dx = mouseX - trail.x;
            const dy = mouseY - trail.y;
            
            // Move trail toward mouse
            trail.x += dx * trail.speed;
            trail.y += dy * trail.speed;
            
            // Update trail element position
            trail.element.style.left = `${trail.x}px`;
            trail.element.style.top = `${trail.y}px`;
            trail.element.style.width = `${trail.size}px`;
            trail.element.style.height = `${trail.size}px`;
            trail.element.style.opacity = trail.opacity;
        });
        
        requestAnimationFrame(updateTrails);
    }
    
    updateTrails();
}

// Add parallax effect to elements based on mouse movement
function addParallaxEffect() {
    let mouseX = 0;
    let mouseY = 0;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Elements to apply parallax to (with different depth values)
    const parallaxElements = [
        { selector: '.hero-content', depth: 0.05 },
        { selector: '.orbit-decoration', depth: 0.1 },
        { selector: 'h2', depth: 0.02 }
    ];
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function updateParallax() {
        // Calculate mouse offset from center
        const offsetX = (mouseX - centerX) / centerX;
        const offsetY = (mouseY - centerY) / centerY;
        
        // Apply transform to each element based on its depth
        parallaxElements.forEach(item => {
            const elements = document.querySelectorAll(item.selector);
            elements.forEach(element => {
                const moveX = offsetX * 50 * item.depth;
                const moveY = offsetY * 50 * item.depth;
                element.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
        
        requestAnimationFrame(updateParallax);
    }
    
    updateParallax();
}
