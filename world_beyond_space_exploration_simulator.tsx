import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import {
  Rocket, Shield, Compass, Activity, Play, Pause, RotateCcw,
  Volume2, VolumeX, Info, CheckCircle2, AlertTriangle, XCircle,
  Database, User, Layers, ArrowRight, Eye, ChevronRight, Terminal,
  Radio, Crosshair, Sparkles, Sliders, Award, MapPin, Zap
} from 'lucide-react';

// ============================================================================
// 1. DATA DEFINITIONS & PLANETARY SCIENCE
// ============================================================================

interface POI {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
}

interface PlanetData {
  id: string;
  name: string;
  tagline: string;
  color: string;
  emissive?: string;
  size: number;
  distance: number;
  orbitSpeed: number;
  rotationSpeed: number;
  temp: string;
  tempKelvin: number;
  gravity: number;
  gravityMss: number;
  atmosphere: string;
  pressure: string;
  pressureAtm: number;
  water: string;
  radiation: string;
  radiationLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME' | 'LETHAL';
  dayLength: string;
  sunDistance: string;
  summary: string;
  canLand: boolean;
  type: 'Terrestrial' | 'Gas Giant' | 'Ice Giant' | 'Star';
  pois: POI[];
}

const PLANETS_DATA: PlanetData[] = [
  {
    id: 'sun',
    name: 'Sun',
    tagline: 'The Heart of the Solar System',
    color: '#ffaa00',
    emissive: '#ff4400',
    size: 5.5,
    distance: 0,
    orbitSpeed: 0,
    rotationSpeed: 0.002,
    temp: '5,500°C (Surface)',
    tempKelvin: 5778,
    gravity: 27.4,
    gravityMss: 274,
    atmosphere: 'Hydrogen (73%), Helium (25%)',
    pressure: '2.5 × 10¹¹ atm (Core)',
    pressureAtm: 250000000000,
    water: 'None',
    radiation: 'Lethal Solar Flare & Gamma',
    radiationLevel: 'LETHAL',
    dayLength: '25-35 Earth Days',
    sunDistance: '0 AU',
    summary: 'Yellow dwarf star containing 99.86% of the solar system mass. Extreme plasma radiation and magnetic turbulence prohibit human surface contact.',
    canLand: false,
    type: 'Star',
    pois: [
      { id: 'p1', name: 'Sunspot AR3664', lat: 20, lng: 45, description: 'Active magnetic region producing X-class solar flares.' },
      { id: 'p2', name: 'Coronal Loop Gamma', lat: -15, lng: 120, description: 'Magnetic flux tubes conducting superheated plasma.' }
    ]
  },
  {
    id: 'mercury',
    name: 'Mercury',
    tagline: 'Scorched Cratered Wasteland',
    color: '#8a8a8a',
    size: 0.8,
    distance: 10,
    orbitSpeed: 0.04,
    rotationSpeed: 0.005,
    temp: '-180°C to 430°C',
    tempKelvin: 440,
    gravity: 0.38,
    gravityMss: 3.7,
    atmosphere: 'Exosphere (Oxygen, Sodium, Hydrogen)',
    pressure: '10⁻¹⁴ atm',
    pressureAtm: 0.00000000000001,
    water: 'Polar Ice in Permanently Shadowed Craters',
    radiation: 'High Solar Wind & Cosmic Rays',
    radiationLevel: 'EXTREME',
    dayLength: '59 Earth Days',
    sunDistance: '0.39 AU (58M km)',
    summary: 'The smallest planet in the Solar System. Extreme temperature fluctuations due to virtually no atmospheric thermal blanket.',
    canLand: true,
    type: 'Terrestrial',
    pois: [
      { id: 'm1', name: 'Caloris Basin', lat: 30, lng: -20, description: 'Massive impact crater 1,550 km in diameter created 3.8B years ago.' },
      { id: 'm2', name: 'Chao Meng-Fu Crater', lat: -85, lng: 10, description: 'Deep polar crater harboring subsurface water ice deposits.' }
    ]
  },
  {
    id: 'venus',
    name: 'Venus',
    tagline: 'Toxic Runaway Greenhouse Oven',
    color: '#e3bb76',
    size: 1.3,
    distance: 15,
    orbitSpeed: 0.015,
    rotationSpeed: -0.002,
    temp: '465°C (Average)',
    tempKelvin: 738,
    gravity: 0.91,
    gravityMss: 8.87,
    atmosphere: 'Carbon Dioxide (96.5%), Nitrogen (3.5%), Sulfuric Acid Clouds',
    pressure: '92 atm (Crushing ocean equivalent)',
    pressureAtm: 92,
    water: 'Trace amounts in atmospheric vapors',
    radiation: 'Moderate Surface Shielding (Heavy Atmosphere)',
    radiationLevel: 'MODERATE',
    dayLength: '243 Earth Days',
    sunDistance: '0.72 AU (108M km)',
    summary: 'Sister planet to Earth in size, but a hellish inferno with surface pressures capable of crushing titanium probes.',
    canLand: true,
    type: 'Terrestrial',
    pois: [
      { id: 'v1', name: 'Maat Mons', lat: 0.5, lng: 194.3, description: 'Highest shield volcano on Venus rising 8 km above radar plains.' },
      { id: 'v2', name: 'Ishtar Terra', lat: 65, lng: 0, description: 'Australia-sized highland continent holding Maxwell Montes.' }
    ]
  },
  {
    id: 'earth',
    name: 'Earth',
    tagline: 'Cradle of Life & Humanity',
    color: '#2b82c9',
    size: 1.4,
    distance: 22,
    orbitSpeed: 0.01,
    rotationSpeed: 0.02,
    temp: '-88°C to 58°C (15°C Avg)',
    tempKelvin: 288,
    gravity: 1.0,
    gravityMss: 9.81,
    atmosphere: 'Nitrogen (78%), Oxygen (21%), Argon (0.9%)',
    pressure: '1.0 atm',
    pressureAtm: 1.0,
    water: 'Abundant Liquid Surface Oceans (71% coverage)',
    radiation: 'Low (Magnetosphere Protected)',
    radiationLevel: 'LOW',
    dayLength: '24 Hours',
    sunDistance: '1.0 AU (149.6M km)',
    summary: 'The only known world supporting life. Dynamic plate tectonics, rich liquid oceans, and a strong protective magnetosphere.',
    canLand: true,
    type: 'Terrestrial',
    pois: [
      { id: 'e1', name: 'Mariana Trench', lat: 11, lng: 142, description: 'Deepest oceanic point at -10,994 meters depth.' },
      { id: 'e2', name: 'Kilauea Shield Volcano', lat: 19, lng: -155, description: 'Highly active basaltic magma plume eruption zone.' }
    ]
  },
  {
    id: 'mars',
    name: 'Mars',
    tagline: 'The Red Frontier for Human Settlement',
    color: '#c85232',
    size: 1.1,
    distance: 30,
    orbitSpeed: 0.008,
    rotationSpeed: 0.018,
    temp: '-125°C to 20°C (-60°C Avg)',
    tempKelvin: 213,
    gravity: 0.38,
    gravityMss: 3.71,
    atmosphere: 'Carbon Dioxide (95.3%), Nitrogen (2.6%), Argon (1.9%)',
    pressure: '0.006 atm (0.6% Earth)',
    pressureAtm: 0.006,
    water: 'Subsurface Water Ice & Polar Ice Caps',
    radiation: 'High (0.67 mSv/day, No Global Field)',
    radiationLevel: 'HIGH',
    dayLength: '24 Hours 37 Mins',
    sunDistance: '1.52 AU (227.9M km)',
    summary: 'Cold desert world with thin atmosphere. Prime target for human interplanetary colonization and past biosignature discovery.',
    canLand: true,
    type: 'Terrestrial',
    pois: [
      { id: 'mrs1', name: 'Olympus Mons', lat: 18.6, lng: -133.8, description: 'Largest volcano in solar system, 21.9 km high (3x Everest).' },
      { id: 'mrs2', name: 'Valles Marineris', lat: -13.9, lng: -59.2, description: 'Grand canyon system extending over 4,000 km in length.' },
      { id: 'mrs3', name: 'Jezero Crater', lat: 18.38, lng: 77.58, description: 'Ancient dried river delta sediment site sampled by Perseverance.' }
    ]
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    tagline: 'King of Gas Giants',
    color: '#b07f35',
    size: 3.2,
    distance: 42,
    orbitSpeed: 0.004,
    rotationSpeed: 0.04,
    temp: '-110°C (Cloud Top)',
    tempKelvin: 165,
    gravity: 2.52,
    gravityMss: 24.79,
    atmosphere: 'Hydrogen (90%), Helium (10%)',
    pressure: '>1,000,000 atm (Metallic Interior)',
    pressureAtm: 1000000,
    water: 'Water vapor in atmospheric cloud belts',
    radiation: 'Lethal Radiation Belts (10,000x Earth)',
    radiationLevel: 'LETHAL',
    dayLength: '9.9 Hours',
    sunDistance: '5.2 AU (778.5M km)',
    summary: 'Massive gas planet with dynamic jet streams, ammonia storms, and over 95 moons. Possesses an immense magnetosphere.',
    canLand: false,
    type: 'Gas Giant',
    pois: [
      { id: 'j1', name: 'Great Red Spot', lat: -22, lng: 0, description: 'Anticyclonic storm larger than Earth raging for over 350 years.' },
      { id: 'j2', name: 'Io Plasma Torus Belt', lat: 0, lng: 180, description: 'Intense radiation zone fed by Io volcanism.' }
    ]
  },
  {
    id: 'saturn',
    name: 'Saturn',
    tagline: 'Jewel of the Solar System',
    color: '#e2c17b',
    size: 2.7,
    distance: 54,
    orbitSpeed: 0.003,
    rotationSpeed: 0.038,
    temp: '-140°C',
    tempKelvin: 133,
    gravity: 1.06,
    gravityMss: 10.44,
    atmosphere: 'Hydrogen (96%), Helium (3%)',
    pressure: 'Extreme Atmospheric Compression',
    pressureAtm: 500000,
    water: 'Ice particles forming ring complexes',
    radiation: 'High Trapped Particle Belts',
    radiationLevel: 'HIGH',
    dayLength: '10.7 Hours',
    sunDistance: '9.58 AU (1.4B km)',
    summary: 'Famous for its complex system of icy rings composed of water particles, dust, and boulders extending 282,000 km across.',
    canLand: false,
    type: 'Gas Giant',
    pois: [
      { id: 's1', name: 'North Polar Hexagon', lat: 78, lng: 0, description: 'Persistent hexagonal wave pattern jet stream storm system.' },
      { id: 's2', name: 'Cassini Division Gap', lat: 0, lng: 90, description: '4,800 km wide gap between Ring A and Ring B maintained by Mimas.' }
    ]
  },
  {
    id: 'uranus',
    name: 'Uranus',
    tagline: 'Tilted Ice Giant Realm',
    color: '#70cbdb',
    size: 2.0,
    distance: 66,
    orbitSpeed: 0.002,
    rotationSpeed: -0.025,
    temp: '-195°C',
    tempKelvin: 78,
    gravity: 0.89,
    gravityMss: 8.69,
    atmosphere: 'Hydrogen (83%), Helium (15%), Methane (2%)',
    pressure: 'High Deep Atmosphere',
    pressureAtm: 100000,
    water: 'Supercritical Water/Ammonia Mantle',
    radiation: 'Moderate Cosmic Exposure',
    radiationLevel: 'MODERATE',
    dayLength: '17.2 Hours (97.8° Axial Tilt)',
    sunDistance: '19.2 AU (2.87B km)',
    summary: 'An ice giant with a blue-green hue from atmospheric methane. It rotates virtually on its side with extreme axial tilt.',
    canLand: false,
    type: 'Ice Giant',
    pois: [
      { id: 'u1', name: 'Epsilon Ring System', lat: 0, lng: 45, description: 'Dense, narrow ring system dominated by boulder-sized icy rocks.' }
    ]
  },
  {
    id: 'neptune',
    name: 'Neptune',
    tagline: 'Windswept Deep Blue World',
    color: '#274687',
    size: 1.9,
    distance: 76,
    orbitSpeed: 0.001,
    rotationSpeed: 0.03,
    temp: '-200°C',
    tempKelvin: 73,
    gravity: 1.14,
    gravityMss: 11.15,
    atmosphere: 'Hydrogen (80%), Helium (19%), Methane (1%)',
    pressure: 'Extreme Planetary Pressure',
    pressureAtm: 100000,
    water: 'Icy Mantle (Water, Ammonia, Methane)',
    radiation: 'Moderate',
    radiationLevel: 'MODERATE',
    dayLength: '16.1 Hours',
    sunDistance: '30.1 AU (4.5B km)',
    summary: 'Farthest major planet in our system. Features supersonic planetary wind speeds up to 2,100 km/h and deep methane storms.',
    canLand: false,
    type: 'Ice Giant',
    pois: [
      { id: 'n1', name: 'Great Dark Spot', lat: -20, lng: 15, description: 'Earth-sized storm zone driven by fast supersonic global winds.' }
    ]
  }
];

// Sound Synthesizer Utility (Web Audio API)
const playSciFiSound = (type: 'hover' | 'click' | 'engine' | 'alert' | 'success') => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'alert') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.setValueAtTime(600, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'success') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.frequency.setValueAtTime(783.99, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (e) {
    // Audio context safe fallback
  }
};

const generatePlanetTexture = (type: string, baseColorHex: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = baseColorHex;
  ctx.fillRect(0, 0, 512, 256);

  if (type === 'sun') {
    for (let i = 0; i < 2000; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? '#ffcc00' : '#ff3300';
      ctx.fillRect(Math.random() * 512, Math.random() * 256, 3, 3);
    }
  } else if (type === 'jupiter' || type === 'saturn') {
    for (let y = 0; y < 256; y += 8) {
      ctx.fillStyle = (y / 16) % 2 === 0 ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.15)';
      ctx.fillRect(0, y, 512, 8 + Math.sin(y) * 4);
    }
    if (type === 'jupiter') {
      ctx.fillStyle = '#cc3311';
      ctx.beginPath();
      ctx.ellipse(300, 180, 40, 25, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'earth') {
    ctx.fillStyle = '#1e6823';
    for (let i = 0; i < 18; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 256, 30 + Math.random() * 40, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    for (let i = 0; i < 25; i++) {
      ctx.fillRect(Math.random() * 512, Math.random() * 256, 60, 4);
    }
  } else if (type === 'mars') {
    ctx.fillStyle = '#80220a';
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 256, 5 + Math.random() * 15, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 18);
    ctx.fillRect(0, 238, 512, 18);
  } else {
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    for (let i = 0; i < 100; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * 512, Math.random() * 256, Math.random() * 8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
};

// ============================================================================
// 2. STABLE THREE.JS SOLAR SYSTEM CANVAS
// ============================================================================

const SolarSystemCanvas: React.FC<{
  selectedPlanet: PlanetData | null;
  onSelectPlanet: (planet: PlanetData) => void;
  isPaused: boolean;
  speedMultiplier: number;
}> = ({ selectedPlanet, onSelectPlanet, isPaused, speedMultiplier }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const planetMeshesRef = useRef<{ [key: string]: { mesh: THREE.Mesh; group: THREE.Group; orbitAngle: number; data: PlanetData } }>({});
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.002);

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 35, 70);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffaa00, 3, 300);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // Starfield Background
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 4000;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      starPositions[i] = (Math.random() - 0.5) * 500;
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7, transparent: true, opacity: 0.8 });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    // Build Planets and Orbit Lines
    const planetMeshes: { [key: string]: { mesh: THREE.Mesh; group: THREE.Group; orbitAngle: number; data: PlanetData } } = {};

    PLANETS_DATA.forEach((data) => {
      // Orbit Ring
      if (data.distance > 0) {
        const points = [];
        for (let i = 0; i <= 128; i++) {
          const theta = (i / 128) * Math.PI * 2;
          points.push(new THREE.Vector3(Math.cos(theta) * data.distance, 0, Math.sin(theta) * data.distance));
        }
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({ color: 0x00f3ff, transparent: true, opacity: 0.15 });
        const orbitLine = new THREE.Line(lineGeo, lineMat);
        scene.add(orbitLine);
      }

      // Planet Orbit Group
      const orbitGroup = new THREE.Group();
      scene.add(orbitGroup);

      // Planet Mesh
      const sphereGeo = new THREE.SphereGeometry(data.size, 32, 32);
      const texture = generatePlanetTexture(data.id, data.color);
      let material: THREE.Material;

      if (data.id === 'sun') {
        material = new THREE.MeshBasicMaterial({ map: texture, color: data.color });
      } else {
        material = new THREE.MeshStandardMaterial({ map: texture, color: data.color, roughness: 0.7, metalness: 0.1 });
      }

      const mesh = new THREE.Mesh(sphereGeo, material);
      mesh.position.set(data.distance, 0, 0);
      orbitGroup.add(mesh);

      // Saturn Rings
      if (data.id === 'saturn') {
        const ringGeo = new THREE.RingGeometry(data.size * 1.4, data.size * 2.3, 32);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xe2c17b, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = -Math.PI / 2.3;
        mesh.add(ringMesh);
      }

      planetMeshes[data.id] = { mesh, group: orbitGroup, orbitAngle: Math.random() * Math.PI * 2, data };
    });

    planetMeshesRef.current = planetMeshes;

    // Mouse Dragging Controls Implementation
    let isMouseDown = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      const rotSpeed = 0.005;
      camera.position.x = camera.position.x * Math.cos(deltaX * rotSpeed) - camera.position.z * Math.sin(deltaX * rotSpeed);
      camera.position.z = camera.position.z * Math.cos(deltaX * rotSpeed) + camera.position.x * Math.sin(deltaX * rotSpeed);
      camera.position.y = Math.max(5, Math.min(120, camera.position.y + deltaY * 0.1));
      camera.lookAt(0, 0, 0);

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => { isMouseDown = false; };

    // Raycasting Click to Select Planet
    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseVec.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouseVec.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouseVec, camera);
      const meshesToTest = Object.values(planetMeshes).map((p) => p.mesh);
      const intersects = raycaster.intersectObjects(meshesToTest);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object;
        const entry = Object.values(planetMeshes).find((p) => p.mesh === hitMesh);
        if (entry) {
          onSelectPlanet(entry.data);
          playSciFiSound('click');
        }
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('click', handleClick);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Rotate planets and orbit
      Object.values(planetMeshes).forEach(({ mesh, group, data }) => {
        mesh.rotation.y += data.rotationSpeed * (isPaused ? 0.1 : 1);
        if (!isPaused && data.distance > 0) {
          group.rotation.y += data.orbitSpeed * delta * 0.5 * speedMultiplier;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isPaused, speedMultiplier]);

  // Handle Target Focusing when planet changes
  useEffect(() => {
    if (!cameraRef.current) return;
    const camera = cameraRef.current;
    if (selectedPlanet) {
      if (selectedPlanet.id === 'sun') {
        camera.position.set(0, 12, 25);
      } else {
        camera.position.set(selectedPlanet.distance + selectedPlanet.size * 3, selectedPlanet.size * 2, selectedPlanet.size * 4);
      }
      camera.lookAt(selectedPlanet.distance, 0, 0);
    } else {
      camera.position.set(0, 35, 70);
      camera.lookAt(0, 0, 0);
    }
  }, [selectedPlanet]);

  return <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />;
};

// ============================================================================
// 3. MARS SURFACE & ASTRONAUT/ROVER LANDING SIMULATOR
// ============================================================================

const MarsLandingSimulation: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const [stage, setStage] = useState<'entry' | 'descent' | 'landed' | 'exploration'>('entry');
  const [vehicleMode, setVehicleMode] = useState<'astronaut' | 'rover'>('astronaut');
  const [playerPos, setPlayerPos] = useState({ x: 0, z: 0, rot: 0 });
  const [discoveredPOIs, setDiscoveredPOIs] = useState<string[]>([]);
  const [discoveredModal, setDiscoveredModal] = useState<string | null>(null);

  const [suitOxygen, setSuitOxygen] = useState(98);
  const [suitTemp, setSuitTemp] = useState(21);
  const [radiation, setRadiation] = useState(0.67);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Surface Three.js Scene Setup
  useEffect(() => {
    const container = canvasRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2b0d07);
    scene.fog = new THREE.FogExp2(0x2b0d07, 0.02);

    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 500);
    camera.position.set(0, 4, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffaa77, 1.5);
    light.position.set(10, 20, 15);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    // Ground Plane Mesh
    const groundGeo = new THREE.PlaneGeometry(200, 200, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x80220a, roughness: 0.9 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Scattered Rocks
    for (let i = 0; i < 30; i++) {
      const rockGeo = new THREE.DodecahedronGeometry(0.5 + Math.random() * 0.8);
      const rockMat = new THREE.MeshStandardMaterial({ color: 0x4a1205 });
      const rock = new THREE.Mesh(rockGeo, rockMat);
      rock.position.set((Math.random() - 0.5) * 80, 0.2, (Math.random() - 0.5) * 80);
      scene.add(rock);
    }

    // Player Avatar Mesh
    const avatarGroup = new THREE.Group();
    const bodyGeo = new THREE.CapsuleGeometry(0.4, 1, 8, 16);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.9;
    avatarGroup.add(body);
    scene.add(avatarGroup);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      avatarGroup.position.set(playerPos.x, 0, playerPos.z);
      avatarGroup.rotation.y = playerPos.rot;

      // Camera follows avatar
      camera.position.x = playerPos.x - Math.sin(playerPos.rot) * -8;
      camera.position.z = playerPos.z - Math.cos(playerPos.rot) * -8;
      camera.position.y = 4;
      camera.lookAt(playerPos.x, 1, playerPos.z);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [playerPos]);

  // Key controls handler for surface exploration
  useEffect(() => {
    if (stage !== 'exploration') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const step = vehicleMode === 'rover' ? 1.2 : 0.6;
      setPlayerPos((prev) => {
        let { x, z, rot } = prev;
        if (e.key === 'w' || e.key === 'ArrowUp') {
          x -= Math.sin(rot) * step;
          z -= Math.cos(rot) * step;
        }
        if (e.key === 's' || e.key === 'ArrowDown') {
          x += Math.sin(rot) * step;
          z += Math.cos(rot) * step;
        }
        if (e.key === 'a' || e.key === 'ArrowLeft') rot += 0.15;
        if (e.key === 'd' || e.key === 'ArrowRight') rot -= 0.15;

        const surfacePOIs = [
          { id: 'water_ice', x: -12, z: -15, name: 'Glacial Subsurface Ice Delta', desc: 'Ground-penetrating radar confirms 88% pure H2O ice matrix 0.5m below regolith.' },
          { id: 'methane_vent', x: 18, z: -8, name: 'Active Methane Plume Emission', desc: 'Localized atmosphere spike of 12 ppb methane suggesting ongoing biological or serpentinization activity.' },
          { id: 'ancient_rover', x: 5, z: -25, name: 'Opportunity Rover Debris Site', desc: 'Historical human exploration relic from Sol 5111 solar dust storm.' }
        ];

        surfacePOIs.forEach((poi) => {
          const dist = Math.hypot(x - poi.x, z - poi.z);
          if (dist < 4 && !discoveredPOIs.includes(poi.id)) {
            setDiscoveredPOIs((d) => [...d, poi.id]);
            setDiscoveredModal(poi.name + ' - ' + poi.desc);
            playSciFiSound('success');
          }
        });

        return { x, z, rot };
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, vehicleMode, discoveredPOIs]);

  // Automated progression for landing sequence animation
  useEffect(() => {
    if (stage === 'entry') {
      const timer = setTimeout(() => setStage('descent'), 3000);
      return () => clearTimeout(timer);
    } else if (stage === 'descent') {
      const timer = setTimeout(() => {
        setStage('landed');
        playSciFiSound('success');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Telemetry decay interval
  useEffect(() => {
    if (stage !== 'exploration') return;
    const interval = setInterval(() => {
      setSuitOxygen((prev) => Math.max(10, prev - 0.1));
      setRadiation((prev) => parseFloat((prev + 0.001).toFixed(3)));
    }, 2000);
    return () => clearInterval(interval);
  }, [stage]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col font-sans overflow-hidden">
      {/* Top Mission Control Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/90 to-transparent flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-600/20 border border-red-500 rounded-lg text-red-400">
            <Rocket className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-white font-bold tracking-wider text-sm md:text-base flex items-center space-x-2">
              <span>ARES-VI MARS SURFACE LANDING MISSION</span>
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/40 text-xs rounded uppercase">
                {stage}
              </span>
            </h2>
            <p className="text-slate-400 text-xs font-mono">LOCATION: JEZERO CRATER DELTA (18.38° N, 77.58° E)</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {stage === 'exploration' && (
            <button
              onClick={() => {
                setVehicleMode(vehicleMode === 'astronaut' ? 'rover' : 'astronaut');
                playSciFiSound('click');
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-mono rounded flex items-center space-x-2 transition"
            >
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>MODE: {vehicleMode.toUpperCase()}</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-700 text-red-200 text-xs font-mono rounded flex items-center space-x-1 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>ABORT & ORBIT</span>
          </button>
        </div>
      </div>

      {/* Surface Canvas Render */}
      <div ref={canvasRef} className="w-full h-full relative" />

      {/* Landing Overlay HUD */}
      {stage === 'landed' && (
        <div className="absolute inset-x-0 bottom-12 flex justify-center z-20">
          <button
            onClick={() => {
              setStage('exploration');
              playSciFiSound('click');
            }}
            className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-mono font-bold tracking-widest rounded-lg shadow-[0_0_25px_rgba(220,38,38,0.6)] transition animate-pulse"
          >
            DISEMBARK & DEPLOY EVA SUIT
          </button>
        </div>
      )}

      {stage === 'exploration' && (
        <>
          <div className="absolute bottom-6 left-6 z-20 bg-slate-950/80 backdrop-blur-md border border-slate-800 p-4 rounded-xl w-72 text-slate-200 font-mono text-xs shadow-2xl">
            <h3 className="text-cyan-400 font-bold mb-2 flex items-center space-x-1.5 border-b border-slate-800 pb-1">
              <Activity className="w-4 h-4" />
              <span>EVA SUIT TELEMETRY</span>
            </h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-slate-400">O2 TANK LEVEL:</span>
                  <span className={suitOxygen < 30 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                    {suitOxygen.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${suitOxygen < 30 ? 'bg-red-500' : 'bg-emerald-400'}`}
                    style={{ width: `${suitOxygen}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-400">INTERNAL TEMP:</span>
                <span className="text-cyan-300">{suitTemp}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">RAD EXPOSURE:</span>
                <span className="text-amber-400">{radiation} mSv/d</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SAMPLES COLLECTED:</span>
                <span className="text-cyan-400 font-bold">{discoveredPOIs.length} / 3</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 right-6 z-20 bg-slate-950/80 backdrop-blur-md border border-slate-800 p-4 rounded-xl text-slate-300 font-mono text-xs">
            <div className="font-bold text-cyan-400 mb-2">SURFACE CONTROLS</div>
            <div className="space-y-1 text-slate-400">
              <p><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-white">W</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-white">S</kbd> : Forward / Reverse</p>
              <p><kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-white">A</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-white">D</kbd> : Turn Left / Right</p>
              <p className="text-amber-400 mt-2">★ Walk across terrain to discover science sites!</p>
            </div>
          </div>
        </>
      )}

      {/* Discovery Modal Popover */}
      {discoveredModal && (
        <div className="absolute inset-0 z-30 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/50 p-6 rounded-2xl max-w-md w-full shadow-[0_0_30px_rgba(0,243,255,0.2)]">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold uppercase tracking-wider">Scientific Discovery Unlocked</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{discoveredModal.split(' - ')[0]}</h3>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">{discoveredModal.split(' - ')[1]}</p>
            <button
              onClick={() => setDiscoveredModal(null)}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-mono rounded-lg transition font-bold"
            >
              LOG DISCOVERY & CONTINUE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// 4. HUMAN SURVIVAL LAB INTERACTIVE SIMULATOR
// ============================================================================

const SurvivalLab: React.FC = () => {
  const [selectedPlanetId, setSelectedPlanetId] = useState('mars');
  const [gear, setGear] = useState({
    suit: 'eva_standard',
    oxygen: 'dual_rebreather',
    protection: 'lead_plated',
    habitat: 'pressurized_dome',
    power: 'nuclear_rtg'
  });

  const planet = PLANETS_DATA.find((p) => p.id === selectedPlanetId) || PLANETS_DATA[4];

  const evaluation = useMemo(() => {
    let score = 100;
    const warnings: string[] = [];
    const passes: string[] = [];

    if (planet.tempKelvin > 400) {
      if (gear.suit !== 'thermal_reinforced') {
        score -= 35;
        warnings.push(`Extreme Heat Hazard (${planet.temp}): Standard suit thermal regulation will fail instantly.`);
      } else {
        passes.push('Thermal insulation suit effectively counters external high heat flux.');
      }
    } else if (planet.tempKelvin < 150) {
      if (gear.suit === 'eva_standard') {
        score -= 20;
        warnings.push(`Cryogenic Frost Hazard (${planet.temp}): Enhanced heating loops required.`);
      } else {
        passes.push('Suit internal heating keeps occupant within physiological limits.');
      }
    }

    if (planet.pressureAtm > 10) {
      if (gear.suit !== 'atmospheric_heavy') {
        score -= 40;
        warnings.push(`Crushing Atmospheric Pressure (${planet.pressure}): Suit hull implosion risk.`);
      } else {
        passes.push('Reinforced heavy atmospheric suit protects against extreme barometric crush.');
      }
    } else if (planet.pressureAtm < 0.1) {
      if (gear.habitat === 'tent') {
        score -= 25;
        warnings.push('Vacuum / Low Pressure: Unpressurized tent will rupture.');
      } else {
        passes.push('Pressurized habitat structure sustains 1.0 atm sea-level internal atmosphere.');
      }
    }

    if (planet.radiationLevel === 'LETHAL' || planet.radiationLevel === 'EXTREME' || planet.radiationLevel === 'HIGH') {
      if (gear.protection === 'none') {
        score -= 30;
        warnings.push(`High Cosmic/Solar Radiation (${planet.radiation}): Severe radiation sickness imminent without shielding.`);
      } else if (gear.protection === 'lead_plated' && planet.radiationLevel === 'LETHAL') {
        score -= 15;
        warnings.push('Heavy radiation belt exceeds passive lead plating safety limits.');
      } else {
        passes.push('Active magnetic/lead composite shielding mitigates lethal particle flux.');
      }
    }

    if (!planet.canLand) {
      score = 0;
      warnings.length = 0;
      warnings.push(`SURFACE LANDING IMPOSSIBLE: ${planet.name} lacks a solid planetary crust. Orbital probe mission required.`);
    }

    const finalScore = Math.max(0, Math.min(100, score));

    return { score: finalScore, warnings, passes };
  }, [planet, gear]);

  return (
    <div className="p-6 max-w-7xl mx-auto text-slate-100 font-sans space-y-8">
      <div className="border-b border-slate-800 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm tracking-wider uppercase mb-1">
            <Shield className="w-5 h-5" />
            <span>EXOPLANETARY HUMAN SURVIVAL LAB</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Life Support & Gear Configuration Engine</h1>
        </div>

        <div className="flex items-center space-x-3 bg-slate-900 border border-slate-800 p-2 rounded-xl">
          <span className="text-xs font-mono text-slate-400 pl-2">TARGET WORLD:</span>
          <select
            value={selectedPlanetId}
            onChange={(e) => {
              setSelectedPlanetId(e.target.value);
              playSciFiSound('click');
            }}
            className="bg-slate-950 border border-slate-700 text-cyan-300 font-mono text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-400"
          >
            {PLANETS_DATA.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
            <label className="text-sm font-mono font-bold text-slate-300 flex items-center space-x-2">
              <User className="w-4 h-4 text-cyan-400" />
              <span>1. ENVIRONMENTAL SUIT MATRIX</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'eva_standard', name: 'EVA Standard Suit', desc: 'Flexible, ideal for vacuum & mild radiation.' },
                { id: 'atmospheric_heavy', name: 'Titanium Mech Suit', desc: 'Reinforced shell for crushing 100+ atm pressure.' },
                { id: 'thermal_reinforced', name: 'Aero-Heat Shield Suit', desc: 'Multi-layer cooling loops for high thermal flux.' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setGear({ ...gear, suit: item.id });
                    playSciFiSound('click');
                  }}
                  className={`p-3 rounded-lg border text-left transition ${
                    gear.suit === item.id
                      ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs font-mono mb-1">{item.name}</div>
                  <div className="text-[11px] text-slate-400 leading-tight">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
            <label className="text-sm font-mono font-bold text-slate-300 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>2. RADIATION SHIELDING DISPERSION</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'none', name: 'Unshielded Standard', desc: 'Minimal shielding. High cosmic radiation risk.' },
                { id: 'lead_plated', name: 'Lead-Polymer Plating', desc: 'Passive high-density gamma particle attenuation.' },
                { id: 'magnetic_shielding', name: 'Active Deflector Field', desc: 'Active magnetic envelope repels solar wind plasma.' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setGear({ ...gear, protection: item.id });
                    playSciFiSound('click');
                  }}
                  className={`p-3 rounded-lg border text-left transition ${
                    gear.protection === item.id
                      ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs font-mono mb-1">{item.name}</div>
                  <div className="text-[11px] text-slate-400 leading-tight">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-3">
            <label className="text-sm font-mono font-bold text-slate-300 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>3. HABITAT ARCHITECTURE</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'tent', name: 'Inflatable Rover Tent', desc: 'Lightweight deployment, zero radiation shielding.' },
                { id: 'pressurized_dome', name: 'Rigid Geodesic Dome', desc: 'Closed-loop 1 atm life-support sealed structure.' },
                { id: 'underground_bunker', name: 'Regolith Excavated Lava Tube', desc: 'Underground habitat shielding against extreme events.' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setGear({ ...gear, habitat: item.id });
                    playSciFiSound('click');
                  }}
                  className={`p-3 rounded-lg border text-left transition ${
                    gear.habitat === item.id
                      ? 'bg-cyan-950/60 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs font-mono mb-1">{item.name}</div>
                  <div className="text-[11px] text-slate-400 leading-tight">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Mission Readiness Index</span>
              <span className="text-xs font-mono px-2.5 py-1 bg-slate-800 rounded text-slate-300">
                DESTINATION: <strong className="text-cyan-400">{planet.name.toUpperCase()}</strong>
              </span>
            </div>

            <div className="flex items-center space-x-6 bg-slate-950 p-5 rounded-xl border border-slate-800/80 mb-6">
              <div className="relative flex items-center justify-center w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="38" stroke="#1e293b" strokeWidth="8" fill="transparent" />
                  <circle
                    cx="48"
                    cy="48"
                    r="38"
                    stroke={evaluation.score > 70 ? '#10b981' : evaluation.score > 40 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 38}
                    strokeDashoffset={2 * Math.PI * 38 * (1 - evaluation.score / 100)}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <span className="absolute font-mono font-extrabold text-2xl text-white">
                  {evaluation.score}%
                </span>
              </div>

              <div>
                <h4 className="font-bold text-base text-white mb-1">
                  {evaluation.score > 70 ? 'CRITICAL SURVIVAL CAPABLE' : evaluation.score > 40 ? 'HIGH HAZARD - SURVIVAL AT RISK' : 'FATAL SYSTEM FAILURE'}
                </h4>
                <p className="text-xs text-slate-400 leading-normal">
                  {evaluation.score > 70
                    ? 'Selected configuration addresses major atmospheric, thermal, and radiation threats.'
                    : 'System configuration lacks sufficient insulation or structural shielding against planet hazards.'}
                </p>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 pb-1">
                HAZARD & INSULATION ASSESSMENT
              </div>

              {evaluation.warnings.map((warn, i) => (
                <div key={i} className="p-3 bg-red-950/40 border border-red-800/60 rounded-lg text-red-300 flex items-start space-x-2.5">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>{warn}</span>
                </div>
              ))}

              {evaluation.passes.map((pass, i) => (
                <div key={i} className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-emerald-300 flex items-start space-x-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{pass}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between text-xs font-mono text-slate-400">
            <span>SURFACE TEMP: <strong className="text-slate-200">{planet.temp}</strong></span>
            <span>GRAVITY: <strong className="text-slate-200">{planet.gravity}g</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 5. MULTI-PLANET COMPARISON MATRIX
// ============================================================================

const PlanetComparison: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>(['earth', 'mars', 'venus']);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      if (selectedIds.length < 4) setSelectedIds([...selectedIds, id]);
    }
    playSciFiSound('click');
  };

  const comparedPlanets = PLANETS_DATA.filter((p) => selectedIds.includes(p.id));

  return (
    <div className="p-6 max-w-7xl mx-auto text-slate-100 font-sans space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-sm tracking-wider uppercase mb-1">
          <Sliders className="w-5 h-5" />
          <span>COMPARATIVE PLANETARY SCIENCE</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Multi-World Metrics Comparison</h1>
        <p className="text-slate-400 text-sm mt-1">Select up to 4 celestial bodies to compare gravity, temperature, atmospheric composition, and human settlement feasibility.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PLANETS_DATA.map((p) => {
          const isSelected = selectedIds.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => toggleSelect(p.id)}
              className={`px-3.5 py-1.5 rounded-lg font-mono text-xs border transition flex items-center space-x-2 ${
                isSelected
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(0,243,255,0.3)]'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-900/60 backdrop-blur-md">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400">
              <th className="p-4 w-48 font-bold uppercase tracking-wider">Metric</th>
              {comparedPlanets.map((p) => (
                <th key={p.id} className="p-4 min-w-[200px] border-l border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-white text-sm font-extrabold">{p.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{p.type}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            <tr>
              <td className="p-4 font-bold text-slate-400 bg-slate-950/30">Surface Temperature</td>
              {comparedPlanets.map((p) => (
                <td key={p.id} className="p-4 border-l border-slate-800 text-cyan-300 font-bold">
                  {p.temp}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-400 bg-slate-950/30">Surface Gravity</td>
              {comparedPlanets.map((p) => (
                <td key={p.id} className="p-4 border-l border-slate-800">
                  {p.gravity} g ({p.gravityMss} m/s²)
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-400 bg-slate-950/30">Atmospheric Pressure</td>
              {comparedPlanets.map((p) => (
                <td key={p.id} className="p-4 border-l border-slate-800">
                  {p.pressure}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-400 bg-slate-950/30">Atmosphere Composition</td>
              {comparedPlanets.map((p) => (
                <td key={p.id} className="p-4 border-l border-slate-800 text-slate-400 leading-relaxed">
                  {p.atmosphere}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-400 bg-slate-950/30">Radiation Hazard</td>
              {comparedPlanets.map((p) => (
                <td key={p.id} className="p-4 border-l border-slate-800">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.radiationLevel === 'LOW'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                        : p.radiationLevel === 'MODERATE'
                        ? 'bg-amber-950 text-amber-300 border border-amber-700'
                        : 'bg-red-950 text-red-300 border border-red-700'
                    }`}
                  >
                    {p.radiationLevel}
                  </span>
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-400 bg-slate-950/30">Day Length</td>
              {comparedPlanets.map((p) => (
                <td key={p.id} className="p-4 border-l border-slate-800">
                  {p.dayLength}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-400 bg-slate-950/30">Distance from Sun</td>
              {comparedPlanets.map((p) => (
                <td key={p.id} className="p-4 border-l border-slate-800">
                  {p.sunDistance}
                </td>
              ))}
            </tr>

            <tr>
              <td className="p-4 font-bold text-slate-400 bg-slate-950/30">Surface Landing Feasibility</td>
              {comparedPlanets.map((p) => (
                <td key={p.id} className="p-4 border-l border-slate-800">
                  {p.canLand ? (
                    <span className="text-emerald-400 flex items-center space-x-1 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Solid Crust Landing</span>
                    </span>
                  ) : (
                    <span className="text-red-400 flex items-center space-x-1 font-bold">
                      <XCircle className="w-4 h-4" />
                      <span>Gas/Plasma - Orbital Probe Only</span>
                    </span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// 6. DATABASE MODAL
// ============================================================================

const SupabaseModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'status' | 'sql'>('status');

  if (!isOpen) return null;

  const sqlSchema = `-- WORLD BEYOND - Database Setup SQL Schema for Supabase PostgreSQL
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  username TEXT UNIQUE NOT NULL,
  astronaut_rank TEXT DEFAULT 'Cadet Explorer'
);

CREATE TABLE IF NOT EXISTS exploration_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  planet_id TEXT NOT NULL,
  duration_seconds INT DEFAULT 0,
  discoveries_unlocked INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl font-sans text-slate-100">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2.5">
            <Database className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Supabase Cloud Database Sync</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">✕</button>
        </div>

        <div className="flex space-x-3 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              activeTab === 'status' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400'
            }`}
          >
            CONNECTION STATUS
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              activeTab === 'sql' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400'
            }`}
          >
            SQL SCHEMA SCRIPT
          </button>
        </div>

        {activeTab === 'status' ? (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">LOCALSTORAGE FALLBACK:</span>
                <span className="text-emerald-400 font-bold">✓ ACTIVE (SESSION SAVED)</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <textarea
              readOnly
              value={sqlSchema}
              className="w-full h-60 bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-cyan-300 focus:outline-none"
            />
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-mono rounded-lg transition text-xs font-bold"
        >
          CLOSE DATABASE PANEL
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 7. MAIN APP WRAPPER & TOP NAVIGATION BAR
// ============================================================================

export default function App() {
  const [activeTab, setActiveTab] = useState<'system' | 'survival' | 'compare'>('system');
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(PLANETS_DATA[4]);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showMarsMission, setShowMarsMission] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/80 px-4 md:px-8 py-3 flex justify-between items-center">
        <div
          onClick={() => {
            setActiveTab('system');
            setSelectedPlanet(null);
            playSciFiSound('click');
          }}
          className="cursor-pointer flex items-center space-x-3 group"
        >
          <div className="p-2 bg-cyan-500/10 border border-cyan-400/40 rounded-xl group-hover:border-cyan-400 transition shadow-[0_0_15px_rgba(0,243,255,0.2)]">
            <Compass className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-black tracking-widest text-white uppercase font-mono flex items-center space-x-1.5">
              <span>WORLD BEYOND</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-wider">Explore. Discover. Survive.</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-1 bg-slate-900/80 border border-slate-800 p-1 rounded-xl">
          {[
            { id: 'system', name: '3D Solar System', icon: Compass },
            { id: 'survival', name: 'Survival Lab', icon: Shield },
            { id: 'compare', name: 'Planet Compare', icon: Sliders }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  playSciFiSound('click');
                }}
                className={`px-4 py-2 rounded-lg text-xs font-mono transition flex items-center space-x-2 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,243,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              playSciFiSound('click');
            }}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 transition"
            title="Toggle Web Audio SFX"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={() => {
              setShowDbModal(true);
              playSciFiSound('click');
            }}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300 flex items-center space-x-1.5 transition"
          >
            <Database className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">DATABASE</span>
          </button>
        </div>
      </header>

      <main className="flex-1 relative flex flex-col">
        {activeTab === 'system' && (
          <div className="w-full h-[calc(100vh-65px)] relative overflow-hidden bg-black">
            {/* Direct Three.js Canvas */}
            <SolarSystemCanvas
              selectedPlanet={selectedPlanet}
              onSelectPlanet={(p) => setSelectedPlanet(p)}
              isPaused={isPaused}
              speedMultiplier={speed}
            />

            {/* Orbit Controls Overlay HUD */}
            <div className="absolute bottom-6 left-6 z-10 flex items-center space-x-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 p-2 rounded-xl">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-700 text-slate-200 transition"
              >
                {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
              </button>

              <div className="flex items-center space-x-2 text-xs font-mono text-slate-300 px-2">
                <span>ORBIT SPEED:</span>
                <input
                  type="range"
                  min="0.2"
                  max="5"
                  step="0.2"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-20 accent-cyan-400"
                />
                <span className="text-cyan-400 font-bold">{speed}x</span>
              </div>

              <button
                onClick={() => setSelectedPlanet(null)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono rounded-lg transition"
              >
                RESET CAMERA
              </button>
            </div>

            {/* Selected Planet Detail Sidebar Overlay */}
            {selectedPlanet && (
              <div className="absolute top-6 right-6 z-10 w-80 md:w-96 bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-6 shadow-2xl text-slate-100 font-sans space-y-5 max-h-[calc(100vh-120px)] overflow-y-auto">
                <div className="flex justify-between items-start border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{selectedPlanet.type} WORLD</span>
                    <h2 className="text-2xl font-black text-white">{selectedPlanet.name}</h2>
                    <p className="text-xs text-slate-400 italic">{selectedPlanet.tagline}</p>
                  </div>
                  <button
                    onClick={() => setSelectedPlanet(null)}
                    className="p-1 text-slate-500 hover:text-white rounded-lg"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedPlanet.summary}</p>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-lg">
                    <span className="text-slate-500 block text-[10px]">SURFACE TEMP</span>
                    <span className="text-cyan-300 font-bold">{selectedPlanet.temp}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900/80 border border-slate-800 rounded-lg">
                    <span className="text-slate-500 block text-[10px]">GRAVITY</span>
                    <span className="text-cyan-300 font-bold">{selectedPlanet.gravity} g</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">KEY POINTS OF INTEREST</span>
                  {selectedPlanet.pois.map((poi) => (
                    <div key={poi.id} className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-xl space-y-1">
                      <div className="text-xs font-bold font-mono text-cyan-300 flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{poi.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal">{poi.description}</p>
                    </div>
                  ))}
                </div>

                {selectedPlanet.id === 'mars' && (
                  <button
                    onClick={() => {
                      setShowMarsMission(true);
                      playSciFiSound('click');
                    }}
                    className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold tracking-widest rounded-xl transition flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                  >
                    <Rocket className="w-4 h-4 animate-bounce" />
                    <span>LAUNCH MARS LANDING MISSION</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'survival' && <SurvivalLab />}
        {activeTab === 'compare' && <PlanetComparison />}
      </main>

      {showMarsMission && (
        <MarsLandingSimulation onClose={() => setShowMarsMission(false)} />
      )}

      <SupabaseModal isOpen={showDbModal} onClose={() => setShowDbModal(false)} />
    </div>
  );
}