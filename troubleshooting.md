# 3D Model Viewer Troubleshooting

If you're experiencing issues with the 3D model viewer in your portfolio, follow these steps to diagnose and fix the problem.

## Common Issues and Solutions

### "Failed to load 3D model" Error

This error occurs when the model viewer can't load the specified GLB file. Here are potential causes and solutions:

1. **Missing model file**
   - Check if the file exists at the specified path
   - Verify file permissions (should be readable)
   - Confirm the file name matches exactly (case sensitive)

2. **Incorrect file path**
   - Make sure the path is relative to your index.html file
   - Try using `./assets/models/your-model.glb` with the leading `./`
   - Check for typos in the folder or file name

3. **CORS restrictions**
   - If loading from a different domain, CORS headers must be set correctly
   - Try using a local file or a file from a CORS-enabled server

4. **Invalid GLB file**
   - Ensure the file is a valid GLB format
   - Try re-exporting from your 3D software
   - Verify the file isn't corrupted (try opening in another viewer)

5. **Browser limitations**
   - Some browsers may have issues with WebGL or large files
   - Try a different browser (Chrome usually works best)

## Testing Solutions

1. **Use the built-in demo model**
   - Click the "Create Demo Model" button in the lower right
   - This creates a model in-memory that bypasses file loading

2. **Use a known working sample model**
   - The Duck model should load automatically as a fallback
   - If this works but your model doesn't, the issue is with your file

3. **Check the console for detailed errors**
   - Open your browser's developer tools (F12 or Ctrl+Shift+I)
   - Look for specific error messages in the Console tab

4. **Enable diagnostic mode**
   - Press Ctrl+Shift+D to show the diagnostic information panel
   - This shows details about Three.js initialization and model paths

## Creating a Test Model

If you're having issues with your model files, create a simple test cube:

```javascript
// Run this in your browser console
modelUtils.createDemoModel();
```

This will create a simple model directly in the browser, bypassing any file loading issues.

## File Structure Check

Your model files should be in the following location:
```
/Users/semih/Documents/Projects/Portfolio/
  ├── index.html
  ├── css/
  ├── js/
  ├── images/
  └── assets/
      └── models/
          └── your-model.glb  // Place your models here
```

To verify this structure, create a file using your text editor at the path:
`/Users/semih/Documents/Projects/Portfolio/assets/models/test.txt`

If you can't create this file, the folder may not exist or you may not have write permissions.

## Creating a Test GLB File

If you don't have a GLB file to test with, you can create one following these steps:

1. Download [Blender](https://www.blender.org/download/) (free 3D software)
2. Create a simple cube or shape
3. Export as GLB (File > Export > glTF 2.0)
4. Save directly to your `/Users/semih/Documents/Projects/Portfolio/assets/models/` folder

## Contact for Support

If you're still experiencing issues, contact the developer with:
- Screenshots of any error messages
- The browser and version you're using
- Which model files you've tried to load
