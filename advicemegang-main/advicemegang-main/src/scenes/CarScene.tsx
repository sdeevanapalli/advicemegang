import React, { Suspense, useRef, useEffect } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import { useGLTF, useScroll } from '@react-three/drei';

// CarModel Component with fallback
function CarModel() {
  const scroll = useScroll();
  const carRef = useRef();
  
  // Try to load the model, but provide a fallback if it fails
  let modelData;
  try {
    modelData = useGLTF("/cyberpunk_car.glb");
  } catch (error) {
    // Model not found, we'll use a simple geometric fallback
    modelData = null;
  }

  useFrame((state) => {
    const offset = scroll.offset;
    if (carRef.current) {
      carRef.current.position.z = offset * -50;
      carRef.current.rotation.y = offset * Math.PI * 0.5;
    }
    state.camera.position.z = 5 + offset * -50;
    state.camera.lookAt(0, 0, offset * -50);
  });

  // If model loads successfully, use it
  if (modelData?.scene) {
    return <primitive ref={carRef} object={modelData.scene} scale={1.5} />;
  }

  // Fallback: Simple geometric car shape
  return (
    <group ref={carRef} scale={1.5}>
      {/* Car body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[4, 1, 2]} />
        <meshStandardMaterial color="#ff6b35" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Car roof */}
      <mesh position={[0, 1.2, -0.3]}>
        <boxGeometry args={[2.5, 0.8, 1.2]} />
        <meshStandardMaterial color="#ff6b35" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Wheels */}
      <mesh position={[-1.3, -0.3, 1]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[1.3, -0.3, 1]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[-1.3, -0.3, -1]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[1.3, -0.3, -1]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Neon accent lines */}
      <mesh position={[0, 0.5, 1.01]}>
        <boxGeometry args={[3.8, 0.05, 0.05]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0.5, -1.01]}>
        <boxGeometry args={[3.8, 0.05, 0.05]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

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