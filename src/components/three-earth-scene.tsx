"use client";

import * as THREE from "three";
import { useEffect, useRef, useState } from "react";

const RADIUS = 1.12;
const ROTATION_SECONDS = 60;
const FINANCIAL_CENTRES = [
  { name: "London", longitude: -0.12, latitude: 51.5 },
  { name: "New York", longitude: -74, latitude: 40.7 },
  { name: "Dubai", longitude: 55.3, latitude: 25.2 },
  { name: "Mumbai", longitude: 72.9, latitude: 19.1 },
  { name: "Singapore", longitude: 103.8, latitude: 1.3 },
  { name: "Tokyo", longitude: 139.7, latitude: 35.7 },
];
const NETWORK_LINKS = [[0, 1], [0, 2], [2, 3], [2, 4], [4, 5], [1, 2]] as const;

function locationOnEarth(longitude: number, latitude: number, radius: number) {
  const phi = THREE.MathUtils.degToRad(longitude + 180);
  const theta = THREE.MathUtils.degToRad(90 - latitude);
  return new THREE.Vector3(
    -radius * Math.sin(theta) * Math.sin(phi),
    radius * Math.cos(theta),
    radius * Math.sin(theta) * Math.cos(phi),
  );
}

function makeGrid(scene: THREE.Group) {
  const material = new THREE.LineBasicMaterial({
    color: "#4b7450",
    transparent: true,
    opacity: 0.19,
    depthWrite: false,
  });
  const gridRadius = RADIUS + 0.006;
  const segments = 96;

  for (let latitude = -75; latitude <= 75; latitude += 25) {
    const points: THREE.Vector3[] = [];
    const ringRadius = gridRadius * Math.cos(THREE.MathUtils.degToRad(latitude));
    const y = gridRadius * Math.sin(THREE.MathUtils.degToRad(latitude));
    for (let step = 0; step < segments; step += 1) {
      const angle = (step / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(ringRadius * Math.cos(angle), y, ringRadius * Math.sin(angle)));
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.LineLoop(geometry, material);
    line.renderOrder = 2;
    scene.add(line);
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
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    line.renderOrder = 2;
    scene.add(line);
  }
}

function makeNetwork(scene: THREE.Group) {
  const lineMaterial = new THREE.LineBasicMaterial({
    color: "#68906b",
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
  });
  const nodeMaterial = new THREE.MeshBasicMaterial({ color: "#96b795", toneMapped: false });
  const nodeGeometry = new THREE.SphereGeometry(0.012, 12, 8);
  const nodes: THREE.Mesh[] = [];

  for (const [from, to] of NETWORK_LINKS) {
    const start = FINANCIAL_CENTRES[from];
    const end = FINANCIAL_CENTRES[to];
    const startPoint = locationOnEarth(start.longitude, start.latitude, RADIUS + 0.012);
    const endPoint = locationOnEarth(end.longitude, end.latitude, RADIUS + 0.012);
    const midpoint = startPoint.clone().add(endPoint).normalize().multiplyScalar(RADIUS + 0.075);
    const curve = new THREE.QuadraticBezierCurve3(startPoint, midpoint, endPoint);
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(40));
    const line = new THREE.Line(geometry, lineMaterial);
    line.renderOrder = 3;
    scene.add(line);
  }

  FINANCIAL_CENTRES.forEach(({ longitude, latitude }) => {
    const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
    node.position.copy(locationOnEarth(longitude, latitude, RADIUS + 0.016));
    node.renderOrder = 4;
    scene.add(node);
    nodes.push(node);
  });

  return { nodes, nodeGeometry, nodeMaterial, lineMaterial };
}

function disposeScene(scene: THREE.Scene) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
      geometries.add(object.geometry);
      const material = object.material;
      (Array.isArray(material) ? material : [material]).forEach((entry) => materials.add(entry));
    }
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
}

export default function ThreeEarthScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglUnavailable, setWebglUnavailable] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
        depth: true,
        stencil: false,
      });
    } catch {
      setWebglUnavailable(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = "hero-globe-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.style.pointerEvents = "none";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 20);
    camera.position.set(0, 0, 3.65);

    const earthGroup = new THREE.Group();
    // Center the Atlantic and Africa initially, matching the reference composition.
    earthGroup.rotation.y = Math.PI;
    scene.add(earthGroup);

    const textureLoader = new THREE.TextureLoader();
    let disposed = false;
    let textureFailed = false;
    const dotTexture = textureLoader.load(
      "/textures/earth-dots.svg",
      () => { if (!disposed) renderer.render(scene, camera); },
      undefined,
      () => { if (!disposed) { textureFailed = true; setWebglUnavailable(true); } },
    );
    dotTexture.colorSpace = THREE.SRGBColorSpace;
    dotTexture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);

    const earthGeometry = new THREE.SphereGeometry(RADIUS, 96, 64);
    const earth = new THREE.Mesh(earthGeometry, new THREE.MeshBasicMaterial({ color: "#030806" }));
    earthGroup.add(earth);
    const dottedLand = new THREE.Mesh(earthGeometry, new THREE.MeshBasicMaterial({
      map: dotTexture,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    }));
    dottedLand.scale.setScalar(1.002);
    dottedLand.renderOrder = 1;
    earthGroup.add(dottedLand);

    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS * 1.035, 64, 48),
      new THREE.MeshBasicMaterial({
        color: "#3f6745",
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
      }),
    );
    atmosphere.renderOrder = 5;
    earthGroup.add(atmosphere);

    makeGrid(earthGroup);
    const network = makeNetwork(earthGroup);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let previousTime: number | null = null;
    let isAnimating = !reducedMotion.matches;
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    const render = (time: number) => {
      if (textureFailed) return;
      if (previousTime !== null && !reducedMotion.matches) {
        earthGroup.rotation.y += ((time - previousTime) / 1000) * (Math.PI * 2 / ROTATION_SECONDS);
      }
      previousTime = time;
      const pulse = reducedMotion.matches ? 1 : 1 + Math.sin(time / 1650) * 0.1;
      network.nodes.forEach((node, index) => {
        const nodePulse = 1 + Math.sin(time / 1450 + index * 1.4) * 0.11;
        node.scale.setScalar(nodePulse * pulse);
      });
      renderer.render(scene, camera);
      if (isAnimating) animationFrame = window.requestAnimationFrame(render);
    };
    if (isAnimating) animationFrame = window.requestAnimationFrame(render);
    else render(performance.now());

    const onMotionPreferenceChange = () => {
      previousTime = null;
      isAnimating = !reducedMotion.matches;
      window.cancelAnimationFrame(animationFrame);
      if (isAnimating) animationFrame = window.requestAnimationFrame(render);
      else render(performance.now());
    };
    reducedMotion.addEventListener("change", onMotionPreferenceChange);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      reducedMotion.removeEventListener("change", onMotionPreferenceChange);
      resizeObserver.disconnect();
      dotTexture.dispose();
      disposeScene(scene);
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  if (webglUnavailable) {
    return <div className="hero-globe-fallback" role="img" aria-label="Static Earth map preview; 3D globe rendering is unavailable" />;
  }

  return <div ref={containerRef} className="hero-globe-webgl" aria-label="Rotating Earth visualization" role="img" />;
}
