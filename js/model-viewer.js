let scene, camera, renderer, model, controls;
let isModelViewerInitialized = false;

function initModelViewer() {
    const container = document.getElementById('model-container');
    
    if (!container) return;
    
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfff9f2); // Light orange background
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Add spotlight for dramatic effect
    const spotLight = new THREE.SpotLight(0xff7b00, 0.5);
    spotLight.position.set(5, 10, 5);
    spotLight.angle = Math.PI / 6;
    spotLight.penumbra = 0.3;
    spotLight.decay = 2;
    spotLight.distance = 50;
    spotLight.castShadow = true;
    scene.add(spotLight);
    
    // Add ground for shadow casting (invisible)
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.ShadowMaterial({
        opacity: 0.3
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Add a subtle grid
    const gridHelper = new THREE.GridHelper(20, 20, 0xff7b00, 0xffbf69);
    gridHelper.position.y = -2;
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);
    
    // Add controls for rotating the model
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    // Add loading indicator
    addLoadingIndicator(container);
    
    // Start animation loop
    animate();
    
    isModelViewerInitialized = true;
    
    // Load a default model if available
    if (modelProjects && modelProjects.length > 0) {
        loadModel(modelProjects[0].modelPath, modelProjects[0].title);
    }
}

function addLoadingIndicator(container) {
    const loadingElement = document.createElement('div');
    loadingElement.className = 'model-loading-indicator';
    loadingElement.innerHTML = `
        <div class="spinner"></div>
        <p>Loading 3D Model...</p>
    `;
    container.appendChild(loadingElement);
}

// Add this function to help diagnose model loading issues
function debugModelLoading(modelPath) {
    console.log(`Attempting to load model: ${modelPath}`);
    
    // Check if the file exists
    fetch(modelPath)
        .then(response => {
            if (!response.ok) {
                console.error(`Model file not found: ${modelPath}`);
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                console.log(`Model file found: ${modelPath}`);
                return response.blob();
            }
        })
        .then(blob => {
            console.log(`Model size: ${(blob.size / 1024).toFixed(2)} KB`);
        })
        .catch(error => {
            console.error('Error checking model file:', error);
        });
}

// Update the loadModel function with better error handling and path resolution
function loadModel(modelPath, title) {
    console.log(`Attempting to load model: ${modelPath}`);
    
    // If the viewer isn't initialized yet, initialize it
    if (!isModelViewerInitialized) {
        initModelViewer();
    }
    
    // Clear previous model if exists
    if (model) {
        scene.remove(model);
    }
    
    // Show loading indicator
    const container = document.getElementById('model-container');
    const loadingIndicator = document.querySelector('.model-loading-indicator');
    
    if (container) {
        container.classList.add('loading');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'flex';
        }
    }
    
    // Update viewer title if provided
    let viewerTitle = document.querySelector('.model-viewer-title');
    if (!viewerTitle && title) {
        viewerTitle = document.createElement('div');
        viewerTitle.className = 'model-viewer-title';
        container.appendChild(viewerTitle);
    }
    
    if (viewerTitle && title) {
        viewerTitle.textContent = title;
    }
    
    // Try to resolve the path - fix common issues with paths
    const resolvedPath = resolvePath(modelPath);
    console.log(`Resolved path: ${resolvedPath}`);
    
    // Load the new model
    const loader = new THREE.GLTFLoader();
    
    // Add error handler for the loader
    loader.onError = function(error) {
        console.error('GLTFLoader error:', error);
        handleModelLoadingError(container, loadingIndicator, `Error loading model: ${error.message}`);
        
        // Try loading a fallback model
        loadFallbackModel(container, loadingIndicator, title);
    };
    
    loader.load(
        resolvedPath,
        function(gltf) {
            // Success callback
            model = gltf.scene;
            
            // Enable shadows for all objects in the model
            model.traverse(function(object) {
                if (object.isMesh) {
                    object.castShadow = true;
                    object.receiveShadow = true;
                    
                    // Add subtle orange rim light effect if the object has a material
                    if (object.material) {
                        object.material.emissive = new THREE.Color(0xff7b00);
                        object.material.emissiveIntensity = 0.1;
                    }
                }
            });
            
            // Center the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.x = -center.x;
            model.position.y = -center.y;
            model.position.z = -center.z;
            
            // Scale model to fit in view
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 3 / maxDim;
            model.scale.multiplyScalar(scale);
            
            // Add model to scene with entrance animation
            model.scale.set(0, 0, 0);
            scene.add(model);
            
            // Animate model entrance
            animateModelEntrance(model, scale);
            
            // Remove loading indicator
            if (container) {
                container.classList.remove('loading');
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'none';
                }
            }
            
            // Reset camera position and controls
            camera.position.set(0, 0, 5);
            controls.reset();
            
            console.log('Model loaded successfully');
        },
        // Progress callback
        function(xhr) {
            if (xhr.lengthComputable) {
                const percentComplete = (xhr.loaded / xhr.total) * 100;
                console.log(`Loading progress: ${Math.round(percentComplete)}%`);
            }
        },
        // Error callback
        function(error) {
            console.error('Error loading model:', error);
            handleModelLoadingError(container, loadingIndicator, 'Failed to load 3D model');
            
            // Try loading a fallback model
            loadFallbackModel(container, loadingIndicator, title);
        }
    );
}

// Helper function to resolve path issues
function resolvePath(modelPath) {
    // If it's an absolute URL (starts with http or https), use it directly
    if (modelPath.startsWith('http://') || modelPath.startsWith('https://')) {
        return modelPath;
    }
    
    // If it doesn't start with '/', './', or '../', add './' to make it relative to the current page
    if (!modelPath.startsWith('/') && !modelPath.startsWith('./') && !modelPath.startsWith('../')) {
        return './' + modelPath;
    }
    
    return modelPath;
}

// Handle model loading errors
function handleModelLoadingError(container, loadingIndicator, message) {
    if (container) {
        container.classList.remove('loading');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
        
        // Clear any existing error messages
        const existingError = container.querySelector('.model-error');
        if (existingError) {
            existingError.remove();
        }
        
        showModelError(container, message);
    }
}

// Create and load a fallback primitive model when file loading fails
function loadFallbackModel(container, loadingIndicator, title) {
    console.log('Loading fallback model...');
    
    if (loadingIndicator) {
        loadingIndicator.style.display = 'flex';
        const loadingText = loadingIndicator.querySelector('p');
        if (loadingText) {
            loadingText.textContent = 'Loading fallback model...';
        }
    }
    
    // Create a simple geometric model as fallback
    let geometry, material;
    
    // Choose a random shape for variety
    const shapeType = Math.floor(Math.random() * 4);
    
    switch(shapeType) {
        case 0:
            geometry = new THREE.BoxGeometry(1, 1, 1);
            break;
        case 1:
            geometry = new THREE.SphereGeometry(0.7, 32, 32);
            break;
        case 2:
            geometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
            break;
        default:
            geometry = new THREE.TetrahedronGeometry(0.8);
    }
    
    material = new THREE.MeshStandardMaterial({
        color: 0xff7b00,
        metalness: 0.5,
        roughness: 0.3,
        emissive: 0xff4500,
        emissiveIntensity: 0.2
    });
    
    const fallbackModel = new THREE.Mesh(geometry, material);
    fallbackModel.castShadow = true;
    fallbackModel.receiveShadow = true;
    
    // Clear previous model
    if (model) {
        scene.remove(model);
    }
    
    // Set the model to our fallback
    model = new THREE.Group();
    model.add(fallbackModel);
    
    // Add to scene
    scene.add(model);
    
    // Add some animation to make it interesting
    model.rotation.x = Math.PI / 6;
    
    // Set up animation
    const animate = () => {
        fallbackModel.rotation.x += 0.01;
        fallbackModel.rotation.y += 0.01;
        requestAnimationFrame(animate);
    };
    animate();
    
    // Update title
    let viewerTitle = document.querySelector('.model-viewer-title');
    if (!viewerTitle) {
        viewerTitle = document.createElement('div');
        viewerTitle.className = 'model-viewer-title';
        container.appendChild(viewerTitle);
    }
    
    viewerTitle.textContent = title ? `${title} (Fallback)` : 'Fallback Model';
    
    // Remove loading indicator
    if (container) {
        container.classList.remove('loading');
        if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
        }
    }
    
    // Reset camera
    camera.position.set(0, 0, 3);
    controls.reset();
    
    console.log('Fallback model loaded');
    
    // Show a notification about the fallback
    if (window.showNotification) {
        window.showNotification('Using fallback 3D model. Please check console for details.', 'warning');
    }
}

function animateModelEntrance(model, targetScale) {
    const duration = 1000; // ms
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smoother animation
        const eased = easeOutElastic(progress);
        
        const currentScale = targetScale * eased;
        model.scale.set(currentScale, currentScale, currentScale);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

function easeOutElastic(x) {
    const c4 = (2 * Math.PI) / 3;
    
    return x === 0
        ? 0
        : x === 1
        ? 1
        : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}

function showModelError(container, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'model-error';
    errorElement.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <p>${message}</p>
        <button class="retry-btn">Try Again</button>
    `;
    container.appendChild(errorElement);
    
    // Add retry functionality
    const retryBtn = errorElement.querySelector('.retry-btn');
    if (retryBtn) {
        retryBtn.addEventListener('click', function() {
            errorElement.remove();
            // Try to load the model again
            if (modelProjects && modelProjects.length > 0) {
                loadModel(modelProjects[0].modelPath, modelProjects[0].title);
            }
        });
    }
}

function onWindowResize() {
    const container = document.getElementById('model-container');
    if (!container) return;
    
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    if (controls) {
        controls.update();
    }
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Make functions available globally
window.initModelViewer = initModelViewer;
window.loadModel = loadModel;
window.showModelError = showModelError;

// Initialize the viewer when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // We'll delay initialization until a model is selected to save resources
    
    // But if we have a default model to show, initialize now
    const modelGrid = document.querySelector('.model-grid');
    if (modelGrid && modelGrid.children.length > 0) {
        initModelViewer();
    }
});
