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
    
    // Number of repositories to display - setting to 100 to load all repositories
    const repoLimit = 100;
    
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
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error fetching repositories:', error);
            displayGenericError(error.message);
        }
    }
    
    // Display a rate limit error with a link to the GitHub profile
    function displayRateLimitError(message) {
        repoContainer.innerHTML = `
            <div class="error-message rate-limit">
                <i class="fas fa-exclamation-triangle"></i>
                <p>GitHub API rate limit exceeded</p>
                <small>${message}</small>
                <small>GitHub limits API requests to 60 per hour for unauthenticated requests.</small>
                <a href="https://github.com/${username}" class="btn" target="_blank" rel="noopener noreferrer" style="margin-top: 20px;">
                    Visit My GitHub Profile <i class="fab fa-github"></i>
                </a>
            </div>
        `;
    }
    
    // Display a generic error with a link to the GitHub profile
    function displayGenericError(message) {
        repoContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Failed to load GitHub repositories</p>
                <small>${message}</small>
                <a href="https://github.com/${username}" class="btn" target="_blank" rel="noopener noreferrer" style="margin-top: 20px;">
                    Visit My GitHub Profile <i class="fab fa-github"></i>
                </a>
            </div>
        `;
    }
    
    function displayRepositories(repos) {
        // Clear loading state
        repoContainer.innerHTML = '';
        
        console.log("Displaying repositories...");
        
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
        viewMoreLink.href = `https://github.com/${username}`;
        viewMoreLink.className = 'btn view-more-repos';
        viewMoreLink.target = '_blank';
        viewMoreLink.rel = 'noopener noreferrer';
        viewMoreLink.innerHTML = 'Visit My GitHub Profile <i class="fab fa-github"></i>';
        
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
