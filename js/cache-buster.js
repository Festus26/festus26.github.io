// Cache busting utility
// This script can dynamically load CSS/JS with cache busting parameters

class CacheBuster {
    constructor() {
        this.version = this.getCurrentVersion();
    }

    getCurrentVersion() {
        // Use build timestamp or current time
        return Date.now().toString();
    }

    loadCSS(href, id = null) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `${href}?v=${this.version}`;
        if (id) link.id = id;
        
        // Remove existing link with same id if exists
        if (id) {
            const existing = document.getElementById(id);
            if (existing) existing.remove();
        }
        
        document.head.appendChild(link);
        return link;
    }

    loadJS(src, id = null) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `${src}?v=${this.version}`;
            if (id) script.id = id;
            
            script.onload = () => resolve(script);
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            
            // Remove existing script with same id if exists
            if (id) {
                const existing = document.getElementById(id);
                if (existing) existing.remove();
            }
            
            document.head.appendChild(script);
        });
    }

    // Force reload a specific CSS file
    reloadCSS(href) {
        const links = document.querySelectorAll(`link[href*="${href}"]`);
        links.forEach(link => {
            const newHref = href + '?v=' + Date.now();
            link.href = newHref;
        });
    }

    // Get current page version from URL or generate new one
    getPageVersion() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v') || this.version;
    }
}

// Make it globally available
window.CacheBuster = CacheBuster;

// Auto-initialize if not in development
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    window.cacheBuster = new CacheBuster();
}
