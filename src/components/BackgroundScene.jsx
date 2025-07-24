import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const BackgroundScene = () => {
  const mountRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // 🎵 Speaker (Cylinder)
    const speakerGeometry = new THREE.CylinderGeometry(1, 1, 2, 32);
    const speakerMaterial = new THREE.MeshBasicMaterial({ color: 0xff5555 });
    const speaker = new THREE.Mesh(speakerGeometry, speakerMaterial);
    scene.add(speaker);

    // 🎶 Soundwave Rings
    const rings = [];
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });

    for (let i = 0; i < 5; i++) {
      const ringGeometry = new THREE.RingGeometry(1.2, 1.4, 64);
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.scale.set(1 + i * 0.2, 1 + i * 0.2, 1);
      scene.add(ring);
      rings.push(ring);
    }

    // Animate Rings
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      rings.forEach((ring, idx) => {
        const scale = 1 + (elapsed * 0.5 + idx * 0.3) % 3;
        ring.scale.set(scale, scale, scale);
        ring.material.opacity = 1 - (scale / 3);
      });

      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      renderer.dispose();
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0" />;
};

export default BackgroundScene;
