import React, { Suspense, useRef, useEffect } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
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
    if (carRef.current) {
      carRef.current.position.z = offset * -50;
      carRef.current.rotation.y = offset * Math.PI * 0.5;
      
      // Animate wheels based on movement
      const wheelRotation = offset * Math.PI * 10;
      if (wheelFrontLRef.current) wheelFrontLRef.current.rotation.x = wheelRotation;
      if (wheelFrontRRef.current) wheelFrontRRef.current.rotation.x = wheelRotation;
      if (wheelBackLRef.current) wheelBackLRef.current.rotation.x = wheelRotation;
      if (wheelBackRRef.current) wheelBackRRef.current.rotation.x = wheelRotation;
    }
    state.camera.position.z = 5 + offset * -50;
    state.camera.lookAt(0, 0, offset * -50);
  });

  return (
    <primitive 
      ref={carRef} 
      object={scene} 
      scale={0.8} // Adjusted scale for the new model
      position-y={-1} // Lower the car to sit on the ground
      rotation-y={Math.PI / 2} // Rotate it to face forward
    />
  );
}

// Path is updated here as well
useGLTF.preload("/cyberpunk-car.glb");

// Main Scene Component
export default function CarScene() {
  return (
    <Canvas gl={{ antialias: true }} camera={{ position: [10, 5, 10], fov: 35 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 10, 5]} intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        <CarModel />
      </Suspense>
    </Canvas>
  );
};