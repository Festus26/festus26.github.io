// A utility script to generate a simple test model
// Run this in your browser console to generate a test cube

function createTestCube() {
    // Create a simple scene with a cube
    const scene = new THREE.Scene();
    
    // Create a cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ 
        color: 0xff7b00, // Orange color to match theme
        metalness: 0.3,
        roughness: 0.4
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Export the scene
    const exporter = new THREE.GLTFExporter();
    exporter.parse(scene, function(gltf) {
        // Download the file
        const blob = new Blob([gltf], { type: 'application/octet-stream' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'test-cube.glb';
        link.click();
        URL.revokeObjectURL(link.href);
    }, { binary: true });
}

// Call the function to create and download the test cube
createTestCube();
