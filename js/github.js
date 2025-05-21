// Github repository loader
console.log("GitHub script loading...");

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded - GitHub script executing");
    
    // Verify container exists
    const repoContainer = document.getElementById('github-repos');
    console.log("Repository container found:", !!repoContainer);
    
    if (!repoContainer) {
        console.error("ERROR: Could not find element with ID 'github-repos'. Make sure it exists in your HTML.");
        return;
    }
    
    // GitHub username - replace with your own
    const username = 'Festus26'; // ⚠️ IMPORTANT: REPLACE WITH YOUR ACTUAL GITHUB USERNAME
    
    // Number of repositories to display
    const repoLimit = 6;
    
    // Show loading state
    repoContainer.innerHTML = `
        <div class="loading-repos">
            <div class="spinner"></div>
            <p>Loading repositories...</p>
        </div>
    `;
    
    // Fetch repositories from GitHub API
    console.log(`Attempting to fetch GitHub repositories for user: ${username}`);
    fetchRepositories();
    
    async function fetchRepositories() {
        try {
            const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=${repoLimit}`;
            console.log(`Fetching from: ${apiUrl}`);
            
            const response = await fetch(apiUrl);
            console.log("API response status:", response.status);
            
            // Check if we hit the rate limit
            if (response.status === 403) {
                // Try to get more details about the error
                const errorData = await response.json().catch(e => ({ message: "Unknown error" }));
                console.error("GitHub API error:", errorData);
                
                if (errorData.message && errorData.message.includes('rate limit')) {
                    displayRateLimitError(errorData.message);
                } else {
                    displayGenericError(errorData.message || "Access forbidden");
                }
                return;
            }
            
            if (!response.ok) {
                const errorData = await response.json().catch(e => ({ message: "Unknown error" }));
                throw new Error(`GitHub API error (${response.status}): ${errorData.message}`);
            }
            
            const repos = await response.json();
            console.log(`Successfully received ${repos.length} repositories`);
            
            if (repos.length > 0) {
                displayRepositories(repos);
            } else {
                repoContainer.innerHTML = `
                    <div class="empty-repos">
                        <i class="fas fa-folder-open"></i>
                        <p>No repositories found for this GitHub account.</p>
                        <button id="load-demo-data" class="btn">Show Sample Repositories</button>
                    </div>
                `;
                
                document.getElementById('load-demo-data').addEventListener('click', function() {
                    displayRepositories(getDemoRepos());
                });
            }
        } catch (error) {
            console.error('Error fetching repositories:', error);
            displayGenericError(error.message);
        }
    }
    
    // Display a rate limit error with option to see demo data
    function displayRateLimitError(message) {
        repoContainer.innerHTML = `
            <div class="error-message rate-limit">
                <i class="fas fa-exclamation-triangle"></i>
                <p>GitHub API rate limit exceeded</p>
                <small>${message}</small>
                <small>GitHub limits API requests to 60 per hour for unauthenticated requests.</small>
                <button id="load-demo-data" class="btn" style="margin-top: 20px;">
                    Show Sample Repositories
                </button>
            </div>
        `;
        
        document.getElementById('load-demo-data').addEventListener('click', function() {
            displayRepositories(getDemoRepos(), true);
        });
    }
    
    // Display a generic error with option to see demo data
    function displayGenericError(message) {
        repoContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Failed to load GitHub repositories</p>
                <small>${message}</small>
                <button id="load-demo-data" class="btn" style="margin-top: 20px;">
                    Show Sample Repositories
                </button>
            </div>
        `;
        
        document.getElementById('load-demo-data').addEventListener('click', function() {
            displayRepositories(getDemoRepos(), true);
        });
    }
    
    // Display a warning about demo data
    function displayDemoWarning() {
        const warningDiv = document.createElement('div');
        warningDiv.className = 'demo-data-warning';
        warningDiv.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <p>Showing sample repository data</p>
            <small>These are example projects and do not represent actual GitHub repositories.</small>
        `;
        
        // Add warning before the repository container
        const container = repoContainer.closest('.container');
        
        // Check if warning already exists
        if (!container.querySelector('.demo-data-warning')) {
            container.insertBefore(warningDiv, repoContainer);
        }
    }
    
    // Provides demo data if API fails
    function getDemoRepos() {
        // Create sample repositories that match your portfolio theme
        return [
            {
                name: "space-exploration-game",
                html_url: "https://github.com/Festus26/space-exploration-game",
                description: "A 3D space exploration game built with Unity. Features procedural planet generation and interactive spacecraft controls.",
                language: "C#",
                updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
                stargazers_count: 42,
                forks_count: 10,
                private: false
            },
            {
                name: "procedural-dungeon-generator",
                html_url: "https://github.com/Festus26/procedural-dungeon-generator",
                description: "A procedural dungeon generation algorithm for 2D games. Creates randomized but coherent level layouts with rooms and corridors.",
                language: "JavaScript",
                updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
                stargazers_count: 21,
                forks_count: 5,
                private: false
            },
            {
                name: "portfolio-website",
                html_url: "https://github.com/Festus26/portfolio-website",
                description: "My personal game developer portfolio website built with HTML, CSS, and JavaScript. Features space animations and 3D model viewers.",
                language: "HTML",
                updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
                stargazers_count: 12,
                forks_count: 3,
                private: false
            },
            {
                name: "unity-toolkit",
                html_url: "https://github.com/Festus26/unity-toolkit",
                description: "A collection of reusable Unity components and utilities to speed up game development workflows.",
                language: "C#",
                updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
                stargazers_count: 35,
                forks_count: 12,
                private: false
            },
            {
                name: "pixel-shader-collection",
                html_url: "https://github.com/Festus26/pixel-shader-collection",
                description: "A collection of custom GLSL shaders for real-time visual effects in games. Includes water, fire, and procedural sky effects.",
                language: "GLSL",
                updated_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), // 20 days ago
                stargazers_count: 28,
                forks_count: 8,
                private: false
            },
            {
                name: "game-ai-experiments",
                html_url: "https://github.com/Festus26/game-ai-experiments",
                description: "Experiments with artificial intelligence techniques for games, including pathfinding, behavior trees, and machine learning for NPCs.",
                language: "Python",
                updated_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(), // 25 days ago
                stargazers_count: 19,
                forks_count: 4,
                private: false
            }
        ];
    }
    
    function displayRepositories(repos, isDemo = false) {
        // Clear loading state
        repoContainer.innerHTML = '';
        
        console.log("Displaying repositories...");
        
        // Show demo data warning if needed
        if (isDemo) {
            displayDemoWarning();
        }
        
        // Create a card for each repository
        repos.forEach((repo, index) => {
            // Format date
            const updatedAt = new Date(repo.updated_at);
            const formattedDate = updatedAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            // Create repository card
            const repoCard = document.createElement('div');
            repoCard.className = 'repo-card';
            repoCard.style.animationDelay = `${index * 0.1}s`;
            
            // Get language color
            const languageColor = getLanguageColor(repo.language);
            
            // Add repository card content
            repoCard.innerHTML = `
                <div class="repo-header">
                    <div class="repo-name-container">
                        <i class="fas fa-code-branch"></i>
                        <h3 class="repo-name">${repo.name}</h3>
                    </div>
                    <div class="repo-visibility">${repo.private ? 'Private' : 'Public'}</div>
                </div>
                <p class="repo-description">${repo.description || 'No description provided'}</p>
                <div class="repo-meta">
                    ${repo.language ? 
                        `<div class="repo-language">
                            <span class="language-color" style="background-color: ${languageColor}"></span>
                            ${repo.language}
                        </div>` : ''
                    }
                    <div class="repo-stats">
                        <span class="repo-stars" title="Stars">
                            <i class="fas fa-star"></i> ${repo.stargazers_count}
                        </span>
                        <span class="repo-forks" title="Forks">
                            <i class="fas fa-code-branch"></i> ${repo.forks_count}
                        </span>
                    </div>
                    <div class="repo-updated">Updated: ${formattedDate}</div>
                </div>
                <a href="${repo.html_url}" class="repo-link" target="_blank" rel="noopener noreferrer">
                    View Repository <i class="fas fa-external-link-alt"></i>
                </a>
            `;
            
            repoContainer.appendChild(repoCard);
            
            // Add visible class after a short delay for animation
            setTimeout(() => {
                repoCard.classList.add('visible');
            }, 50);
        });
        
        // Remove any existing "View More" containers first
        const existingViewMore = document.querySelector('.view-more-container');
        if (existingViewMore) {
            existingViewMore.remove();
        }
        
        // Add "View More" link to GitHub profile
        const viewMoreLink = document.createElement('a');
        viewMoreLink.href = isDemo ? '#' : `https://github.com/${username}`;
        viewMoreLink.className = 'btn view-more-repos';
        viewMoreLink.target = isDemo ? '_self' : '_blank';
        viewMoreLink.rel = 'noopener noreferrer';
        viewMoreLink.innerHTML = isDemo ? 
            'These are sample repositories' : 
            'View More on GitHub <i class="fab fa-github"></i>';
        
        if (isDemo) {
            viewMoreLink.style.cursor = 'default';
            viewMoreLink.addEventListener('click', e => e.preventDefault());
        }
        
        const viewMoreContainer = document.createElement('div');
        viewMoreContainer.className = 'view-more-container';
        viewMoreContainer.appendChild(viewMoreLink);
        
        const parentContainer = repoContainer.closest('.container');
        
        if (parentContainer) {
            parentContainer.appendChild(viewMoreContainer);
        } else {
            repoContainer.parentNode.appendChild(viewMoreContainer);
        }
        
        console.log("Repository display complete!");
    }
    
    // Get color for programming language
    function getLanguageColor(language) {
        // Common programming language colors
        const colors = {
            JavaScript: '#f1e05a',
            Python: '#3572A5',
            Java: '#b07219',
            TypeScript: '#2b7489',
            HTML: '#e34c26',
            CSS: '#563d7c',
            C: '#555555',
            'C++': '#f34b7d',
            'C#': '#178600',
            PHP: '#4F5D95',
            Ruby: '#701516',
            Go: '#00ADD8',
            Swift: '#ffac45',
            Kotlin: '#F18E33',
            Rust: '#dea584',
            Dart: '#00B4AB',
            Elixir: '#6e4a7e',
            GLSL: '#5686a5'
        };
        
        return colors[language] || '#8E44AD'; // Default purple color
    }
});
