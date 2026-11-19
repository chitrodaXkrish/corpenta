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
] as const;

const DOT_SPACING_DEGREES = 0.8;

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
  const baseColor = new THREE.Color("#087f43");
  const primaryColor = new THREE.Color("#00b95b");
  const highlightColor = new THREE.Color("#39d98a");

  for (let latitude = -84; latitude <= 84; latitude += DOT_SPACING_DEGREES) {
    for (let longitude = -180; longitude < 180; longitude += DOT_SPACING_DEGREES) {
      const x = Math.min(canvas.width - 1, Math.max(0, Math.round(((longitude + 180) / 360) * canvas.width)));
      const y = Math.min(canvas.height - 1, Math.max(0, Math.round(((90 - latitude) / 180) * canvas.height)));
      const index = (y * canvas.width + x) * 4;
      if (data[index] < 128) continue;

      const point = locationOnEarth(longitude, latitude, RADIUS + 0.006);
      positions.push(point.x, point.y, point.z);

      const terrainTone = data[index + 2] / 255;
      const color = baseColor.clone()
        .lerp(primaryColor, 0.2 + terrainTone * 0.3)
        .lerp(highlightColor, terrainTone * 0.24);
      colors.push(color.r, color.g, color.b);
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

function makeGrid(earthGroup: THREE.Group) {
  const material = new THREE.LineBasicMaterial({
    color: "#087f43",
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
  });
  const gridRadius = RADIUS + 0.004;
  const segments = 96;

  for (let latitude = -75; latitude <= 75; latitude += 25) {
    const points: THREE.Vector3[] = [];
    const ringRadius = gridRadius * Math.cos(THREE.MathUtils.degToRad(latitude));
    const y = gridRadius * Math.sin(THREE.MathUtils.degToRad(latitude));
    for (let step = 0; step < segments; step += 1) {
      const angle = (step / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(ringRadius * Math.cos(angle), y, ringRadius * Math.sin(angle)));
    }
    earthGroup.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), material));
  }

  for (let longitude = 0; longitude < 180; longitude += 30) {
    const points: THREE.Vector3[] = [];
    const meridian = THREE.MathUtils.degToRad(longitude);
    for (let step = 0; step <= segments; step += 1) {
      const latitude = -Math.PI / 2 + (step / segments) * Math.PI;
      points.push(new THREE.Vector3(
        -gridRadius * Math.cos(latitude) * Math.sin(meridian),
        gridRadius * Math.sin(latitude),
        gridRadius * Math.cos(latitude) * Math.cos(meridian),
      ));
    }
    earthGroup.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material));
  }
}

function makeNetwork(earthGroup: THREE.Group) {
  const routeMaterial = new THREE.LineBasicMaterial({
    color: "#087f43",
    transparent: true,
    opacity: 0.62,
    depthWrite: false,
    toneMapped: false,
  });
  const featuredRouteMaterial = new THREE.LineBasicMaterial({
    color: "#00b95b",
    transparent: true,
    opacity: 0.84,
    depthWrite: false,
    toneMapped: false,
  });
  const markerMaterial = new THREE.MeshBasicMaterial({ color: "#39d98a", toneMapped: false });
  const haloMaterial = new THREE.MeshBasicMaterial({
    color: "#00b95b",
    transparent: true,
    opacity: 0.2,
    depthWrite: false,
    toneMapped: false,
  });
  const pulseMaterial = new THREE.MeshBasicMaterial({ color: "#39d98a", toneMapped: false });
  const markerGeometry = new THREE.SphereGeometry(0.012, 12, 8);
  const haloGeometry = new THREE.SphereGeometry(0.027, 12, 8);
  const pulseGeometry = new THREE.SphereGeometry(0.0065, 10, 8);
  const nodes: THREE.Mesh[] = [];
  const flows: { mesh: THREE.Mesh; start: THREE.Vector3; rotation: THREE.Quaternion; height: number; offset: number; duration: number }[] = [];

  const routePoint = (start: THREE.Vector3, rotation: THREE.Quaternion, amount: number, height: number) => {
    const interpolation = new THREE.Quaternion().identity().slerp(rotation, amount);
    const direction = start.clone().applyQuaternion(interpolation).normalize();
    return direction.multiplyScalar(RADIUS + 0.018 + Math.sin(amount * Math.PI) * height);
  };

  NETWORK_LINKS.forEach(([from, to], routeIndex) => {
    const start = FINANCIAL_CENTRES[from];
    const end = FINANCIAL_CENTRES[to];
    const startPoint = locationOnEarth(start.longitude, start.latitude, 1).normalize();
    const endPoint = locationOnEarth(end.longitude, end.latitude, 1).normalize();
    const angle = startPoint.angleTo(endPoint);
    const rotation = new THREE.Quaternion().setFromUnitVectors(startPoint, endPoint);
    const height = 0.045 + angle * 0.055;
    const routePoints = Array.from({ length: 81 }, (_, index) =>
      routePoint(startPoint, rotation, index / 80, height),
    );
    const geometry = new THREE.BufferGeometry().setFromPoints(routePoints);
    const isMumbaiDelhiRoute = (start.name === "Mumbai" && end.name === "Delhi") ||
      (start.name === "Delhi" && end.name === "Mumbai");
    const line = new THREE.Line(geometry, isMumbaiDelhiRoute ? featuredRouteMaterial : routeMaterial);
    line.renderOrder = 3;
    earthGroup.add(line);

    const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
    pulse.renderOrder = 4;
    earthGroup.add(pulse);
    flows.push({ mesh: pulse, start: startPoint, rotation, height, offset: routeIndex / NETWORK_LINKS.length, duration: 8200 + routeIndex * 410 });
  });

  FINANCIAL_CENTRES.forEach(({ longitude, latitude }) => {
    const position = locationOnEarth(longitude, latitude, RADIUS + 0.016);
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
    const earthGroup = new THREE.Group();
    earthGroup.rotation.y = THREE.MathUtils.degToRad(-90);
    const ocean = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 96, 72),
      new THREE.MeshBasicMaterial({ color: "#050806" }),
    );
    earthGroup.add(ocean);

    const dotTexture = makeDotSprite();
    const landDots = new THREE.Points(
      makeLandPointGeometry(landMaskTexture),
      new THREE.PointsMaterial({
        map: dotTexture,
        size: 0.0115,
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

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS * 1.035, 72, 48),
      new THREE.MeshBasicMaterial({
        color: "#38523c",
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
      }),
    );
    atmosphere.renderOrder = 6;
    earthGroup.add(atmosphere);
    makeGrid(earthGroup);
    const network = makeNetwork(earthGroup);
    return { earthGroup, network, dotTexture };
  }, [landMaskTexture]);

  useEffect(() => () => {
    disposeScene(resources.earthGroup);
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
    resources.earthGroup.updateMatrixWorld(true);

    resources.network.nodes.forEach((node, index) => {
      const nodePulse = reducedMotion ? 1 : 1 + Math.sin(time / 1750 + index * 1.1) * 0.06;
      node.scale.setScalar(nodePulse);
    });
    resources.network.flows.forEach(({ mesh, start, rotation, height, offset, duration }) => {
      const progress = (time / duration + offset) % 1;
      const direction = start.clone()
        .applyQuaternion(routeInterpolation.identity().slerp(rotation, progress))
        .normalize();
      mesh.position.copy(direction.multiplyScalar(RADIUS + 0.018 + Math.sin(progress * Math.PI) * height));
    });
  });

  return <>
    <primitive object={resources.earthGroup} dispose={null} />
    <ambientLight color="#849187" intensity={0.58} />
    <directionalLight color="#fff0d8" intensity={1.65} position={[-3, 2.4, 4]} />
    <directionalLight color="#6d8b73" intensity={0.48} position={[3, -1, -2]} />
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
      camera={{ position: [0, 0, 3.65], fov: 40, near: 0.1, far: 20 }}
      dpr={[1, 1.5]}
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
