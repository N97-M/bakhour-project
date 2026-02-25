'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroScene() {
    const mountRef = useRef(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // ── Renderer ──
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.4;
        mount.appendChild(renderer.domElement);

        // ── Scene & Camera ──
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, mount.clientWidth / mount.clientHeight, 0.1, 100);
        camera.position.set(0, 0.3, 4.5);

        // ── Lights ──
        const ambientLight = new THREE.AmbientLight(0x1a0810, 1.2);
        scene.add(ambientLight);

        // Warm golden bottom glow (mimics the glow around the jar base in the photo)
        const bottomGlow = new THREE.PointLight(0xE8A84A, 6, 4);
        bottomGlow.position.set(0, -0.5, 1);
        scene.add(bottomGlow);

        // Key light from front-top
        const keySpot = new THREE.SpotLight(0xE8C070, 10, 12, Math.PI / 5, 0.7, 1);
        keySpot.position.set(1, 4, 3);
        keySpot.castShadow = true;
        scene.add(keySpot);

        // Rim light from back
        const rimLight = new THREE.DirectionalLight(0x4A0E1A, 2);
        rimLight.position.set(-3, 2, -3);
        scene.add(rimLight);

        // ── Jar Group ──
        const jar = new THREE.Group();
        scene.add(jar);

        // === BODY — wide squat dark brown jar ===
        // The real jar is wide and short (like a cream jar), matte dark brown
        const bodyGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.95, 64, 1);
        const bodyMat = new THREE.MeshPhysicalMaterial({
            color: 0x3A2010,
            metalness: 0.0,
            roughness: 0.65,
            clearcoat: 0.3,
            clearcoatRoughness: 0.5,
        });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.castShadow = true;
        body.receiveShadow = true;
        jar.add(body);

        // === LID — ribbed bamboo/wood colored lid ===
        // The bamboo lid is cylindrical, slightly wider, with many vertical ridges
        const lidGroup = new THREE.Group();
        lidGroup.position.y = 0.58;
        jar.add(lidGroup);

        // Lid base (solid cylinder)
        const lidBaseGeo = new THREE.CylinderGeometry(1.03, 1.03, 0.55, 64, 1);
        const lidMat = new THREE.MeshPhysicalMaterial({
            color: 0xC8A255,     // warm bamboo/gold color
            metalness: 0.0,
            roughness: 0.75,
            clearcoat: 0.1,
        });
        const lidBase = new THREE.Mesh(lidBaseGeo, lidMat);
        lidGroup.add(lidBase);

        // Ribbed ridges on lid (vertical flutes around the circumference)
        const RIDGE_COUNT = 36;
        const ridgeMat = new THREE.MeshPhysicalMaterial({
            color: 0xA07830,
            metalness: 0.0,
            roughness: 0.8,
        });
        for (let i = 0; i < RIDGE_COUNT; i++) {
            const angle = (i / RIDGE_COUNT) * Math.PI * 2;
            const ridgeGeo = new THREE.BoxGeometry(0.06, 0.56, 0.08);
            const ridge = new THREE.Mesh(ridgeGeo, ridgeMat);
            ridge.position.x = Math.cos(angle) * 1.02;
            ridge.position.z = Math.sin(angle) * 1.02;
            ridge.rotation.y = -angle;
            lidGroup.add(ridge);
        }

        // Lid top disc
        const lidTopGeo = new THREE.CylinderGeometry(1.03, 1.03, 0.04, 64);
        const lidTop = new THREE.Mesh(lidTopGeo, lidMat);
        lidTop.position.y = 0.29;
        lidGroup.add(lidTop);

        // ── Shadow / Marble Plane ──
        const planeGeo = new THREE.PlaneGeometry(8, 8);
        const planeMat = new THREE.MeshStandardMaterial({
            color: 0x1a1008,
            roughness: 0.3,
            metalness: 0.4,
        });
        const plane = new THREE.Mesh(planeGeo, planeMat);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -0.48;
        plane.receiveShadow = true;
        scene.add(plane);

        // ── Smoke Particles ──
        const PARTICLE_COUNT = 120;
        const positions = new Float32Array(PARTICLE_COUNT * 3);
        const sizes = new Float32Array(PARTICLE_COUNT);
        const velocities = [];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 0.3;
            positions[i * 3 + 1] = Math.random() * 3.0;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
            sizes[i] = 0.02 + Math.random() * 0.05;
            velocities.push({
                speed: 0.004 + Math.random() * 0.005,
                drift: (Math.random() - 0.5) * 0.001,
                driftZ: (Math.random() - 0.5) * 0.001,
            });
        }

        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
            size: 0.055,
            color: 0xEEDDCC,
            transparent: true,
            opacity: 0.22,
            sizeAttenuation: true,
            depthWrite: false,
        });
        const particles = new THREE.Points(particleGeo, particleMat);
        // Smoke rises from top of lid
        particles.position.y = 1.17;
        scene.add(particles);

        // ── Mouse parallax ──
        let targetX = 0, targetY = 0;
        const onMouseMove = (e) => {
            targetX = (e.clientX / window.innerWidth - 0.5) * 0.4;
            targetY = -(e.clientY / window.innerHeight - 0.5) * 0.3;
        };
        window.addEventListener('mousemove', onMouseMove);

        // ── Resize ──
        const onResize = () => {
            camera.aspect = mount.clientWidth / mount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mount.clientWidth, mount.clientHeight);
        };
        window.addEventListener('resize', onResize);

        // ── Animation Loop ──
        let animId;
        const clock = new THREE.Clock();

        const animate = () => {
            animId = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();
            const pos = particleGeo.attributes.position.array;

            // Animate smoke particles
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                pos[i * 3 + 1] += velocities[i].speed;
                pos[i * 3] += velocities[i].drift;
                pos[i * 3 + 2] += velocities[i].driftZ;
                // Widen smoke as it rises (simulate diffusion)
                velocities[i].drift += (Math.random() - 0.5) * 0.0003;
                if (pos[i * 3 + 1] > 3.0) {
                    pos[i * 3 + 1] = 0;
                    pos[i * 3] = (Math.random() - 0.5) * 0.2;
                    pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
                    velocities[i].drift = (Math.random() - 0.5) * 0.001;
                }
            }
            particleGeo.attributes.position.needsUpdate = true;

            // Very slow rotation + mouse parallax tilt
            jar.rotation.y += 0.003;
            jar.rotation.x += (targetY - jar.rotation.x) * 0.04;
            jar.rotation.z += (-targetX * 0.2 - jar.rotation.z) * 0.04;
            // Gentle float
            jar.position.y = Math.sin(t * 0.5) * 0.06;

            // Animate bottom glow pulse
            bottomGlow.intensity = 5 + Math.sin(t * 1.2) * 1.5;

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
        />
    );
}
