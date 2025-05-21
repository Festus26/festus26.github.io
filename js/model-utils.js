/**
 * Utility functions for 3D model handling and debugging
 */

// Expose a global object for model utilities
window.modelUtils = {};

// Create a utility function to check model paths
modelUtils.checkModelPath = function(modelPath) {
    console.log('Checking model path:', modelPath);
    
    return fetch(modelPath, { method: 'HEAD' })
        .then(response => {
            if (!response.ok) {
                console.error(`Model not found at: ${modelPath}`);
                return { exists: false, status: response.status, statusText: response.statusText };
            }
            
            return { exists: true, status: response.status, statusText: response.statusText };
        })
        .catch(error => {
            console.error(`Error checking model path: ${error.message}`);
            return { exists: false, error: error.message };
        });
};

// Create a demo model directly in the browser
modelUtils.createDemoModel = function() {
    if (typeof THREE === 'undefined') {
        console.error('THREE.js is not loaded');
        return;
    }
    
    if (typeof THREE.GLTFExporter === 'undefined') {
        console.error('THREE.GLTFExporter is not loaded');
        return;
    }
    
    console.log('Creating demo model...');
    
    // Create a scene with multiple objects
    const scene = new THREE.Scene();
    
    // Add several geometric shapes
    const geometries = [
        new THREE.BoxGeometry(0.8, 0.8, 0.8),
        new THREE.SphereGeometry(0.5, 24, 24),
        new THREE.ConeGeometry(0.5, 1, 16),
        new THREE.TorusGeometry(0.4, 0.1, 16, 32)
    ];
    
    const materials = [
        new THREE.MeshStandardMaterial({ color: 0xff7b00, metalness: 0.3, roughness: 0.5 }),
        new THREE.MeshStandardMaterial({ color: 0xff9f45, metalness: 0.4, roughness: 0.3 }),
        new THREE.MeshStandardMaterial({ color: 0xffbf69, metalness: 0.5, roughness: 0.2 }),
        new THREE.MeshStandardMaterial({ color: 0xff5e00, metalness: 0.6, roughness: 0.1 })
    ];
    
    // Position the shapes in an interesting arrangement
    const positions = [
        { x: -0.8, y: 0, z: 0 },
        { x: 0.8, y: 0, z: 0 },
        { x: 0, y: 0.8, z: 0 },
        { x: 0, y: -0.8, z: 0 }
    ];
    
    // Create meshes and add to scene
    for (let i = 0; i < geometries.length; i++) {
        const mesh = new THREE.Mesh(geometries[i], materials[i]);
        mesh.position.set(positions[i].x, positions[i].y, positions[i].z);
        scene.add(mesh);
    }
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Export as GLB
    const exporter = new THREE.GLTFExporter();
    exporter.parse(
        scene,
        function(result) {
            if (result instanceof ArrayBuffer) {
                // Create a file from the ArrayBuffer
                const blob = new Blob([result], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                
                // Show success notification
                if (window.showNotification) {
                    window.showNotification('Demo model created successfully!', 'success');
                }
                
                // Store the model URL for the current session
                sessionStorage.setItem('demoModelUrl', url);
                
                // Update the model projects with the demo model
                if (window.modelProjects) {
                    // Add or update the demo model in the array
                    const demoModel = {
                        title: "Demo Model",
                        description: "A demo 3D model created directly in the browser.",
                        image: "https://via.placeholder.com/200x200/ff7b00/ffffff?text=Demo+Model",
                        modelPath: url,
                        software: "THREE.js"
                    };
                    
                    // Check if Demo Model already exists in the array
                    const existingIndex = window.modelProjects.findIndex(model => model.title === "Demo Model");
                    
                    if (existingIndex !== -1) {
                        // Update existing demo model
                        window.modelProjects[existingIndex] = demoModel;
                    } else {
                        // Add new demo model
                        window.modelProjects.push(demoModel);
                    }
                    
                    // Reload projects to include the demo model
                    if (window.loadProjects) {
                        window.loadProjects();
                    }
                }
                
                return url;
            } else {
                console.error('Failed to create demo model');
            }
        },
        { binary: true } // Export as binary GLB
    );
};

// Create a demo button for creating models on the fly
modelUtils.addDemoButton = function() {
    // Only add if running in a browser and not already added
    if (typeof document === 'undefined' || document.getElementById('create-demo-model')) {
        return;
    }
    
    const button = document.createElement('button');
    button.id = 'create-demo-model';
    button.textContent = 'Create Demo Model';
    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        background: #ff7b00;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px 15px;
        font-family: 'Poppins', sans-serif;
        font-size: 14px;
        cursor: pointer;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
    `;
    
    button.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#ff9f45';
    });
    
    button.addEventListener('mouseout', function() {
        this.style.backgroundColor = '#ff7b00';
    });
    
    button.addEventListener('click', function() {
        modelUtils.createDemoModel();
    });
    
    document.body.appendChild(button);
};

// Add the demo button when the page loads
document.addEventListener('DOMContentLoaded', function() {
    modelUtils.addDemoButton();
});
