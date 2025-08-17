# 3D Model Setup

## Required File: cyberpunk_car.glb

To complete the 3D scene setup, you need to place a 3D model file named `cyberpunk_car.glb` in this public directory.

### Where to find 3D models:
- [Sketchfab](https://sketchfab.com/) - Search for "cyberpunk car" or "futuristic car"
- [TurboSquid](https://www.turbosquid.com/)
- [CGTrader](https://www.cgtrader.com/)
- [Free3D](https://free3d.com/)

### Model Requirements:
- Format: GLB (GLTF Binary)
- File name: `cyberpunk_car.glb`
- Recommended polygon count: Under 50k triangles for web performance
- Should include wheels that can be animated (with names containing "wheel")

### Alternative Models:
If you can't find a cyberpunk car model, you can use any car model and update the file reference in `/src/scenes/CarScene.tsx` from `"/cyberpunk_car.glb"` to your model's filename.

### Current Status:
⚠️ **Missing Model**: The 3D scene will not render properly until the model file is added to this directory.