import React, { Suspense, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useScroll } from '@react-three/drei';

// CarModel Component with fallback
function CarModel() {
  const scroll = useScroll();
  const carRef = useRef();
  
  // Wheel animation refs
  const wheelFrontLRef = useRef();
  const wheelFrontRRef = useRef();
  const wheelBackLRef = useRef();
  const wheelBackRRef = useRef();
  
  // Path is updated to the new cyberpunk car model
  const { scene, nodes, materials } = useGLTF("/cyberpunk-car.glb");

  // These are the correct wheel names for the cyberpunk car model
  useEffect(() => {
    const wheelNames = ["wheel_frontLeft", "wheel_frontRight", "wheel_rearLeft", "wheel_rearRight"];
    
    // Find the wheel nodes and assign them to refs
    scene.traverse((node) => {
      if (node.isMesh && wheelNames.includes(node.name)) {
        if (node.name === "wheel_frontLeft") wheelFrontLRef.current = node;
        if (node.name === "wheel_frontRight") wheelFrontRRef.current = node;
        if (node.name === "wheel_rearLeft") wheelBackLRef.current = node;
        if (node.name === "wheel_rearRight") wheelBackRRef.current = node;
      }
    });
  }, [scene]);

  useFrame((state) => {
    const offset = scroll.offset;
    const time = state.clock.getElapsedTime();
    
    if (carRef.current) {
      // Smooth Z movement with scroll
      carRef.current.position.z = offset * -30;
      
      // Dynamic rotation based on scroll and time
      carRef.current.rotation.y = offset * Math.PI * 0.3 + Math.sin(time * 0.2) * 0.1;
      
      // Subtle floating animation
      carRef.current.position.y = -1 + Math.sin(time * 0.5) * 0.2;
      
      // Animate wheels based on movement and time
      const wheelRotation = offset * Math.PI * 8 + time * 2;
      if (wheelFrontLRef.current) wheelFrontLRef.current.rotation.x = wheelRotation;
      if (wheelFrontRRef.current) wheelFrontRRef.current.rotation.x = wheelRotation;
      if (wheelBackLRef.current) wheelBackLRef.current.rotation.x = wheelRotation;
      if (wheelBackRRef.current) wheelBackRRef.current.rotation.x = wheelRotation;
    }
    
    // Dynamic camera movement
    state.camera.position.z = 8 + offset * -30 + Math.sin(time * 0.3) * 0.5;
    state.camera.position.y = 2 + offset * -5 + Math.cos(time * 0.2) * 0.3;
    state.camera.lookAt(0, -1, offset * -30);
  });

  // Enable shadows for all meshes in the car
  useEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        
        // Enhance materials for better visual appeal
        if (node.material) {
          node.material.envMapIntensity = 0.5;
        }
      }
    });
  }, [scene]);

  return (
    <primitive 
      ref={carRef} 
      object={scene} 
      scale={0.9} // Slightly larger scale
      position-y={-1} // Lower the car to sit on the ground
      rotation-y={Math.PI / 2} // Rotate it to face forward
      castShadow
      receiveShadow
    />
  );
}

// Path is updated here as well
useGLTF.preload("/cyberpunk-car.glb");

// Scene Content Component (to be used inside Canvas and ScrollControls)
export default function CarSceneContent() {
  return (
    <Suspense fallback={null}>
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <pointLight position={[-10, 10, -10]} intensity={0.8} color="#ff6b6b" />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#4ecdc4" />
      <spotLight 
        position={[0, 15, 0]} 
        angle={0.3} 
        penumbra={0.5} 
        intensity={1.5} 
        castShadow 
        color="#ffffff"
      />
      
      {/* Enhanced ground plane with grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Grid lines for futuristic feel */}
      <gridHelper args={[100, 50, '#333333', '#111111']} position={[0, -1.4, 0]} />
      
      {/* Fog for depth */}
      <fog attach="fog" args={['#000000', 30, 100]} />
      
      <CarModel />
    </Suspense>
  );
};