## Adding 3D Models to the Portfolio

The portfolio uses Three.js to display 3D models in GLB format. Follow these steps to add your models:

1. **Export your 3D models as GLB files**:
   - In Blender: File > Export > glTF 2.0 (.glb/.gltf)
   - In Maya: Use the [glTF Exporter plugin](https://github.com/KhronosGroup/glTF-Maya-Exporter)
   - In ZBrush: Export as OBJ then convert to GLB using [gltf-pipeline](https://github.com/CesiumGS/gltf-pipeline)

2. **Optimize your models**:
   - Keep polycount reasonable (under 100k for web)
   - Compress textures (use .jpg for diffuse, .png for alpha)
   - Use the [gltf-transform](https://gltf-transform.dev/) command-line tool:
     ```
     npx @gltf-transform/cli optimize model.glb output.glb --texture-compress webp
     ```

3. **Place models in the assets folder**:
   - Save your .glb files in `/Users/semih/Documents/Projects/Portfolio/assets/models/`
