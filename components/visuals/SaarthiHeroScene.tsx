'use client';

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three-stdlib';
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion';
import { SaarthiHeroFallback } from './SaarthiHeroFallback';
import { ThreeSceneErrorBoundary } from './ThreeSceneErrorBoundary';

// Smoothly animated, interactive document model
function DocumentModel({ isReducedMotion, isLightMode }: { isReducedMotion: boolean; isLightMode: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const node1Ref = useRef<THREE.Mesh>(null);
  const node2Ref = useRef<THREE.Mesh>(null);
  const node3Ref = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Reusable geometries to avoid recreation on every render
  const docGeometry = useMemo(() => new RoundedBoxGeometry(2.3, 3.1, 0.12, 6, 0.08), []);
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(0.08, 16, 16), []);
  const ringGeo = useMemo(() => new THREE.TorusGeometry(1.6, 0.012, 8, 48), []);

  useFrame((state) => {
    if (isReducedMotion) return;
    const t = state.clock.getElapsedTime();

    if (meshRef.current) {
      // Subtle cursor tracking lerp + calm organic breathing
      const targetRotY = (state.pointer.x * 0.3) + Math.sin(t * 0.4) * 0.08;
      const targetRotX = (-state.pointer.y * 0.2) + Math.cos(t * 0.5) * 0.04;
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.06);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.06);
      meshRef.current.position.y = Math.sin(t * 0.6) * 0.06;
    }

    if (node1Ref.current) {
      node1Ref.current.position.y = 0.7 + Math.sin(t * 1.2) * 0.06;
      node1Ref.current.position.x = 0.8 + Math.cos(t * 0.8) * 0.04;
    }
    if (node2Ref.current) {
      node2Ref.current.position.y = 0.1 + Math.cos(t * 1.0) * 0.06;
      node2Ref.current.position.x = -0.8 + Math.sin(t * 0.7) * 0.04;
    }
    if (node3Ref.current) {
      node3Ref.current.position.y = -0.5 + Math.sin(t * 0.9) * 0.05;
      node3Ref.current.position.x = 0.7 + Math.sin(t * 1.1) * 0.04;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.15;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Abstract Report Slate / Document silhouette */}
      <mesh ref={meshRef} geometry={docGeometry}>
        <meshStandardMaterial
          color={isLightMode ? '#f1f5f9' : '#1e293b'}
          roughness={isLightMode ? 0.2 : 0.3}
          metalness={isLightMode ? 0.05 : 0.2}
        />
      </mesh>

      {/* Decorative extracted nodes (calm blue/sky/teal, non-clinical) */}
      <mesh ref={node1Ref} position={[0.8, 0.7, 0.25]} geometry={sphereGeo}>
        <meshStandardMaterial color="#38bdf8" emissive="#0284c7" emissiveIntensity={0.8} />
      </mesh>

      <mesh ref={node2Ref} position={[-0.8, 0.1, 0.25]} geometry={sphereGeo}>
        <meshStandardMaterial color="#818cf8" emissive="#4f46e5" emissiveIntensity={0.8} />
      </mesh>

      <mesh ref={node3Ref} position={[0.7, -0.5, 0.25]} geometry={sphereGeo}>
        <meshStandardMaterial color="#2dd4bf" emissive="#0d9488" emissiveIntensity={0.8} />
      </mesh>

      {/* Ambient orbit ring suggesting understanding & processing */}
      <mesh ref={ringRef} position={[0, 0, -0.1]} geometry={ringGeo}>
        <meshBasicMaterial color={isLightMode ? '#0284c7' : '#38bdf8'} transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

export function SaarthiHeroScene() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setMounted(true);

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }

    const checkTheme = () => {
      setIsLightMode(document.documentElement.classList.contains('light'));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Safe graceful degradation if not yet mounted, no WebGL, or reduced motion preferred
  if (!mounted || !hasWebGL || prefersReducedMotion) {
    return <SaarthiHeroFallback />;
  }

  return (
    <ThreeSceneErrorBoundary fallback={<SaarthiHeroFallback />}>
      <div
        role="img"
        aria-label="3D visualization representing medical document extraction and decoding"
        className="relative w-full h-[380px] md:h-[440px] rounded-2xl overflow-hidden border border-slate-800 dark:border-slate-800 border-slate-200 bg-slate-950 dark:bg-slate-950 bg-slate-50 shadow-2xl transition-colors duration-200"
      >
        <Canvas
          camera={{ position: [0, 0, 4.3], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={isLightMode ? 0.9 : 0.7} />
          <directionalLight position={[5, 8, 5]} intensity={isLightMode ? 1.4 : 1.2} color="#ffffff" />
          <pointLight position={[-4, -3, -2]} intensity={0.9} color="#0284c7" />
          <DocumentModel isReducedMotion={prefersReducedMotion} isLightMode={isLightMode} />
        </Canvas>

        {/* Overlay Badge */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-400 text-slate-600 bg-slate-900/80 dark:bg-slate-900/80 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 dark:border-slate-800 border-slate-200 pointer-events-none shadow-sm">
          <span>AI Explains &bull; Rules Compare</span>
          <span className="text-sky-500 font-semibold">Doctors Diagnose</span>
        </div>
      </div>
    </ThreeSceneErrorBoundary>
  );
}
