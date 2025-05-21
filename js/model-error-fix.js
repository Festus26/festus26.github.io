/**
 * Fix for persistent error messages in model viewer
 * This script provides a fix without modifying the core model-viewer.js file
 */

document.addEventListener('DOMContentLoaded', function() {
    // Wait for the DOM and other scripts to load
    setTimeout(function() {
        // Get references to our model viewer functions
        const originalLoadFallbackModel = window.loadFallbackModel;
        const originalShowModelError = window.showModelError;
        
        // Create a helper function to clear error messages
        window.clearModelError = function(container) {
            if (!container) container = document.getElementById('model-container');
            if (!container) return;
            
            // Find and remove any existing error messages
            const existingErrors = container.querySelectorAll('.model-error');
            existingErrors.forEach(function(error) {
                error.classList.add('hidden');
                // Remove after transition completes
                setTimeout(function() {
                    if (error.parentNode) {
                        error.parentNode.removeChild(error);
                    }
                }, 300);
            });
        };
        
        // Override the loadFallbackModel function to clear errors
        if (originalLoadFallbackModel) {
            window.loadFallbackModel = function(container, loadingIndicator, title) {
                // First, clear any existing error messages
                window.clearModelError(container);
                
                // Then call the original function
                return originalLoadFallbackModel(container, loadingIndicator, title);
            };
        }
        
        // Override showModelError to use our enhanced version
        if (originalShowModelError) {
            window.showModelError = function(container, message) {
                // First, clear any existing error messages
                window.clearModelError(container);
                
                // Then call the original function
                return originalShowModelError(container, message);
            };
        }
        
        // Add click handler to model container to dismiss errors
        const modelContainer = document.getElementById('model-container');
        if (modelContainer) {
            modelContainer.addEventListener('click', function(e) {
                // If click is directly on the container (not a child element)
                if (e.target === modelContainer) {
                    window.clearModelError(modelContainer);
                }
            });
        }
        
        // Add a helper button to clear errors
        const addClearErrorButton = function() {
            const existingButton = document.getElementById('clear-model-error');
            if (existingButton) return;
            
            const button = document.createElement('button');
            button.id = 'clear-model-error';
            button.innerHTML = '✕';
            button.title = 'Clear Error Message';
            button.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(255, 123, 0, 0.8);
                color: white;
                border: none;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                font-size: 16px;
                cursor: pointer;
                z-index: 25;
                display: none;
            `;
            
            modelContainer.appendChild(button);
            
            button.addEventListener('click', function() {
                window.clearModelError(modelContainer);
                this.style.display = 'none';
            });
            
            // Show the button when an error is present
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        const hasError = modelContainer.querySelector('.model-error');
                        button.style.display = hasError ? 'block' : 'none';
                    }
                });
            });
            
            observer.observe(modelContainer, { childList: true });
        };
        
        if (modelContainer) {
            addClearErrorButton();
        }
        
        console.log('Model error fix applied');
    }, 500); // Wait 500ms to ensure all scripts are loaded
});

// Immediately clear any existing errors
(function() {
    const modelContainer = document.getElementById('model-container');
    if (modelContainer) {
        const errors = modelContainer.querySelectorAll('.model-error');
        errors.forEach(function(error) {
            if (error.parentNode) {
                error.parentNode.removeChild(error);
            }
        });
    }
})();
