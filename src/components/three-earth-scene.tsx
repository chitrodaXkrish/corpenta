"use client";

import * as THREE from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Component, type ErrorInfo, type ReactNode, useEffect, useMemo, useRef, useState } from "react";

const RADIUS = 1.12;
const ROTATION_SECONDS = 60;

const FINANCIAL_CENTRES = [
  { name: "London", region: "EUROPE", longitude: -0.1276, latitude: 51.5072 },
  { name: "New York", region: "NORTH AMERICA", longitude: -74.006, latitude: 40.7128 },
  { name: "Frankfurt", region: "EUROPE", longitude: 8.6821, latitude: 50.1109 },
  { name: "Dubai", region: "MIDDLE EAST", longitude: 55.2708, latitude: 25.2048 },
  { name: "Mumbai", region: "SOUTH ASIA", longitude: 72.8777, latitude: 19.076 },
  { name: "Delhi", region: "SOUTH ASIA", longitude: 77.209, latitude: 28.6139 },
  { name: "Singapore", region: "SOUTHEAST ASIA", longitude: 103.8198, latitude: 1.3521 },
  { name: "Hong Kong", region: "EAST ASIA", longitude: 114.1694, latitude: 22.3193 },
  { name: "Tokyo", region: "EAST ASIA", longitude: 139.6917, latitude: 35.6895 },
  { name: "Sydney", region: "AUSTRALIA", longitude: 151.2093, latitude: -33.8688 },
  { name: "Lagos", region: "AFRICA", longitude: 3.3792, latitude: 6.5244 },
  { name: "Johannesburg", region: "AFRICA", longitude: 28.0473, latitude: -26.2041 },
  { name: "Nairobi", region: "AFRICA", longitude: 36.8219, latitude: -1.2921 },
  { name: "Bogotá", region: "SOUTH AMERICA", longitude: -74.0721, latitude: 4.711 },
  { name: "São Paulo", region: "SOUTH AMERICA", longitude: -46.6333, latitude: -23.5505 },
  { name: "Buenos Aires", region: "SOUTH AMERICA", longitude: -58.3816, latitude: -34.6037 },
];

const NETWORK_LINKS = [
  [0, 1], // London — New York
  [0, 2], // London — Frankfurt
  [2, 3], // Frankfurt — Dubai
  [3, 4], // Dubai — Mumbai
  [4, 5], // Mumbai — Delhi
  [4, 6], // Mumbai — Singapore
  [6, 7], // Singapore — Hong Kong
  [7, 8], // Hong Kong — Tokyo
  [1, 3], // New York — Dubai
  [8, 9], // Tokyo — Sydney
  [9, 6], // Sydney — Singapore
  [1, 8], // New York — Tokyo
  [1, 7], // New York — Hong Kong
  [9, 1], // Sydney — New York
  [2, 7], // Frankfurt — Hong Kong
  [0, 10], // London — Lagos
  [10, 11], // Lagos — Johannesburg
  [11, 12], // Johannesburg — Nairobi
  [12, 3], // Nairobi — Dubai
  [1, 13], // New York — Bogotá
  [13, 14], // Bogotá — São Paulo
  [14, 15], // São Paulo — Buenos Aires
] as const;

const DOT_SPACING_DEGREES = 1;

function makeLandPointGeometry(maskTexture: THREE.Texture) {
  const image = maskTexture.image as HTMLImageElement;
  const canvas = document.createElement("canvas");
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas is unavailable for reading the local Earth mask.");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  const positions: number[] = [];
  const colors: number[] = [];
  const continentDotColor = new THREE.Color("#ff7000");

  for (let latitude = -84; latitude <= 84; latitude += DOT_SPACING_DEGREES) {
    for (let longitude = -180; longitude < 180; longitude += DOT_SPACING_DEGREES) {
      const x = Math.min(canvas.width - 1, Math.max(0, Math.round(((longitude + 180) / 360) * canvas.width)));
      const y = Math.min(canvas.height - 1, Math.max(0, Math.round(((90 - latitude) / 180) * canvas.height)));
      const index = (y * canvas.width + x) * 4;
      if (data[index] < 128) continue;

      const point = locationOnEarth(longitude, latitude, RADIUS + 0.006);
      positions.push(point.x, point.y, point.z);

      colors.push(continentDotColor.r, continentDotColor.g, continentDotColor.b);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeBoundingSphere();
  return geometry;
}

function makeDotSprite() {
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable for drawing the Earth dot sprite.");
  context.fillStyle = "#ffffff";
  context.beginPath();
  context.arc(16, 16, 14.5, 0, Math.PI * 2);
  context.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function locationOnEarth(longitude: number, latitude: number, radius: number) {
  const longitudeRadians = THREE.MathUtils.degToRad(longitude);
  const latitudeRadians = THREE.MathUtils.degToRad(latitude);
  const horizontalRadius = radius * Math.cos(latitudeRadians);
  return new THREE.Vector3(
    horizontalRadius * Math.sin(longitudeRadians),
    radius * Math.sin(latitudeRadians),
    horizontalRadius * Math.cos(longitudeRadians),
  );
}

function makeNetwork(earthGroup: THREE.Group) {
  const routeMaterial = new THREE.MeshBasicMaterial({
    color: "#c9681e",
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
    depthTest: true,
    toneMapped: false,
  });
  const featuredRouteMaterial = new THREE.MeshBasicMaterial({
    color: "#ed8025",
    transparent: true,
    opacity: 1,
    depthWrite: false,
    depthTest: true,
    toneMapped: false,
  });
  const markerMaterial = new THREE.MeshBasicMaterial({ color: "#ffb56e", toneMapped: false });
  const haloMaterial = new THREE.MeshBasicMaterial({
    color: "#ed8025",
    transparent: true,
    opacity: 0.34,
    depthWrite: false,
    toneMapped: false,
  });
  const pulseMaterial = new THREE.MeshBasicMaterial({ color: "#ffb56e", toneMapped: false });
  const markerGeometry = new THREE.SphereGeometry(0.012, 12, 8);
  const haloGeometry = new THREE.SphereGeometry(0.027, 12, 8);
  const pulseGeometry = new THREE.SphereGeometry(0.0065, 10, 8);
  const nodes: THREE.Mesh[] = [];
  const flows: { mesh: THREE.Mesh; start: THREE.Vector3; rotation: THREE.Quaternion; height: number; offset: number; duration: number }[] = [];

  const routePoint = (start: THREE.Vector3, rotation: THREE.Quaternion, amount: number, height: number) => {
    const interpolation = new THREE.Quaternion().identity().slerp(rotation, amount);
    const direction = start.clone().applyQuaternion(interpolation).normalize();
    return direction.multiplyScalar(RADIUS + 0.024 + Math.sin(amount * Math.PI) * height);
  };

  NETWORK_LINKS.forEach(([from, to], routeIndex) => {
    const start = FINANCIAL_CENTRES[from];
    const end = FINANCIAL_CENTRES[to];
    const startPoint = locationOnEarth(start.longitude, start.latitude, 1).normalize();
    const endPoint = locationOnEarth(end.longitude, end.latitude, 1).normalize();
    const angle = startPoint.angleTo(endPoint);
    const rotation = new THREE.Quaternion().setFromUnitVectors(startPoint, endPoint);
    const height = 0.06 + angle * 0.055;
    const routePoints = Array.from({ length: 81 }, (_, index) =>
      routePoint(startPoint, rotation, index / 80, height),
    );
    const curve = new THREE.CatmullRomCurve3(routePoints);
    const geometry = new THREE.TubeGeometry(curve, 128, 0.0025, 6, false);
    const isMumbaiDelhiRoute = (start.name === "Mumbai" && end.name === "Delhi") ||
      (start.name === "Delhi" && end.name === "Mumbai");
    const line = new THREE.Mesh(geometry, isMumbaiDelhiRoute ? featuredRouteMaterial : routeMaterial);
    line.renderOrder = 3;
    earthGroup.add(line);

    const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
    pulse.renderOrder = 4;
    earthGroup.add(pulse);
    flows.push({ mesh: pulse, start: startPoint, rotation, height, offset: routeIndex / NETWORK_LINKS.length, duration: 8200 + routeIndex * 410 });
  });

  FINANCIAL_CENTRES.forEach(({ longitude, latitude }) => {
    const position = locationOnEarth(longitude, latitude, RADIUS + 0.024);
    const halo = new THREE.Mesh(haloGeometry, haloMaterial);
    halo.position.copy(position);
    halo.renderOrder = 4;
    earthGroup.add(halo);

    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.copy(position);
    marker.renderOrder = 5;
    earthGroup.add(marker);
    nodes.push(marker);
  });

  return { nodes, flows };
}

function disposeScene(scene: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
      geometries.add(object.geometry);
      const material = object.material;
      (Array.isArray(material) ? material : [material]).forEach((entry) => materials.add(entry));
    }
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
}

function GlobeScene({ reducedMotion }: { reducedMotion: boolean }) {
  const landMaskTexture = useLoader(THREE.TextureLoader, "/textures/earth-land-mask.png");
  const resources = useMemo(() => {
    const sceneGroup = new THREE.Group();
    const earthGroup = new THREE.Group();
    earthGroup.rotation.y = THREE.MathUtils.degToRad(-90);
    sceneGroup.add(earthGroup);
    const ocean = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 96, 72),
      new THREE.MeshBasicMaterial({ color: "#f5f1eb", depthWrite: true, depthTest: true }),
    );
    earthGroup.add(ocean);

    const dotTexture = makeDotSprite();
    const landDots = new THREE.Points(
      makeLandPointGeometry(landMaskTexture),
      new THREE.PointsMaterial({
        map: dotTexture,
        size: 0.0145,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        alphaTest: 0.15,
        depthWrite: false,
        toneMapped: false,
      }),
    );
    landDots.renderOrder = 2;
    earthGroup.add(landDots);

    const network = makeNetwork(earthGroup);
    return { sceneGroup, earthGroup, network, dotTexture };
  }, [landMaskTexture]);

  useEffect(() => () => {
    disposeScene(resources.sceneGroup);
    resources.dotTexture.dispose();
  }, [resources]);

  const elapsed = useRef(0);
  const routeInterpolation = useMemo(() => new THREE.Quaternion(), []);
  useFrame((_, frameDelta) => {
    const delta = Math.min(frameDelta, 0.05);
    const time = elapsed.current * 1000;
    if (!reducedMotion) {
      resources.earthGroup.rotation.y += delta * (Math.PI * 2 / ROTATION_SECONDS);
      elapsed.current += delta;
    }
    resources.network.nodes.forEach((node, index) => {
      const nodePulse = reducedMotion ? 1 : 1 + Math.sin(time / 1750 + index * 1.1) * 0.06;
      node.scale.setScalar(nodePulse);
    });
    resources.network.flows.forEach(({ mesh, start, rotation, height, offset, duration }) => {
      const progress = (time / duration + offset) % 1;
      mesh.position
        .copy(start)
        .applyQuaternion(routeInterpolation.identity().slerp(rotation, progress))
        .normalize()
        .multiplyScalar(RADIUS + 0.024 + Math.sin(progress * Math.PI) * height);
    });
  });

  return <>
    <primitive object={resources.sceneGroup} dispose={null} />
    <ambientLight color="#ffffff" intensity={0.58} />
    <directionalLight color="#fff0d8" intensity={1.65} position={[-3, 2.4, 4]} />
    <directionalLight color="#f4a261" intensity={0.25} position={[3, -1, -2]} />
  </>;
}

class GlobeErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    this.setState({ failed: true });
  }

  render() {
    if (this.state.failed) {
      return <div className="hero-globe-fallback" role="img" aria-label="Earth visualization is unavailable in this browser" />;
    }
    return this.props.children;
  }
}

export default function ThreeEarthScene() {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(preference.matches);
    preference.addEventListener("change", updatePreference);
    return () => preference.removeEventListener("change", updatePreference);
  }, []);

  return <GlobeErrorBoundary>
    <Canvas
      className="hero-globe-webgl"
      camera={{ position: [0, 0, 5.15], fov: 40, near: 0.1, far: 20 }}
      dpr={[1, 1.25]}
      frameloop={reducedMotion ? "demand" : "always"}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power", depth: true, stencil: false }}
      fallback={<div className="hero-globe-fallback" role="img" aria-label="Static Earth preview; 3D rendering is unavailable" />}
      aria-label="Rotating Earth with simulated financial-centre routes"
      role="img"
    >
      <GlobeScene reducedMotion={reducedMotion} />
    </Canvas>
  </GlobeErrorBoundary>;
}
