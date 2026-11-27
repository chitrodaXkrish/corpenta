"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type FinancialGlobeProps = {
  className?: string;
  rotationSpeed?: number;
  glowIntensity?: number;
  globeSize?: number;
};

type LandDot = { position: THREE.Vector3; normal: THREE.Vector3; size: number };
type MarketQuote = { symbol: string; name: string; price: number; change: number };
let cachedLandDots: LandDot[] | null = null;

function buildLandDots(image: HTMLImageElement): LandDot[] {
  if (cachedLandDots) return cachedLandDots;
  const canvas = document.createElement("canvas");
  const width = canvas.width = image.naturalWidth || image.width;
  const height = canvas.height = image.naturalHeight || image.height;
  const context = canvas.getContext("2d", { willReadFrequently: true })!;
  context.drawImage(image, 0, 0, width, height);
  const pixels = context.getImageData(0, 0, width, height).data;
  const dots: LandDot[] = [];
  // A tighter geographic sampling interval gives the continents a compact,
  // detailed dot field while preserving the source mask's coastlines.
  const latStep = .92;

  for (let lat = -89.5; lat <= 89.5; lat += latStep) {
    const latitude = THREE.MathUtils.degToRad(lat);
    const cosLat = Math.cos(latitude);
    const lonStep = Math.min(16, latStep / Math.max(cosLat, .16));
    const row = Math.round((lat + 89.5) / latStep);
    const offset = row % 2 ? lonStep / 2 : 0;
    for (let lon = -180 + offset; lon < 180; lon += lonStep) {
      const x = Math.min(width - 1, Math.max(0, Math.round((lon + 180) / 360 * (width - 1))));
      const y = Math.min(height - 1, Math.max(0, Math.round((90 - lat) / 180 * (height - 1))));
      if (pixels[(y * width + x) * 4] < 128) continue;

      const longitude = THREE.MathUtils.degToRad(lon);
      const normal = new THREE.Vector3(cosLat * Math.sin(longitude), Math.sin(latitude), cosLat * Math.cos(longitude)).normalize();
      dots.push({ position: normal.clone().multiplyScalar(1.008), normal, size: .0028 + .0004 * (1 - Math.abs(Math.sin(latitude))) });
    }
  }
  cachedLandDots = dots;
  return dots;
}

function buildMarketRibbon(radius = 1.018): THREE.BufferGeometry {
  const segments = 512;
  const halfWidth = THREE.MathUtils.degToRad(2.5);
  const centreLatitude = THREE.MathUtils.degToRad(20);
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let index = 0; index <= segments; index += 1) {
    const longitude = (index / segments) * Math.PI * 2;
    for (const offset of [-halfWidth, halfWidth]) {
      const latitude = centreLatitude + offset;
      positions.push(
        radius * Math.cos(latitude) * Math.sin(longitude),
        radius * Math.sin(latitude),
        radius * Math.cos(latitude) * Math.cos(longitude),
      );
      uvs.push(index / segments, offset === -halfWidth ? 0 : 1);
    }
    if (index < segments) {
      const start = index * 2;
      indices.push(start, start + 1, start + 2, start + 1, start + 3, start + 2);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function createMarketTickerTexture(quotes: MarketQuote[] | null) {
  const canvas = document.createElement("canvas");
  // Match the texture's aspect ratio to the 20° latitude ribbon surface.
  // This prevents horizontal glyph stretching as the canvas wraps around it.
  canvas.width = 6144;
  canvas.height = 90;
  const context = canvas.getContext("2d")!;
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (!quotes?.length) {
    context.font = "600 18px Arial, sans-serif";
    context.fillStyle = "#f5f4fc";
    context.fillText("LIVE FX MARKET DATA · UPDATING", 30, 52);
  }

  let x = 32;
  const drawQuote = (quote: MarketQuote) => {
    const precision = quote.price >= 100 ? 3 : quote.price >= 10 ? 2 : 4;
    const change = `${quote.change >= 0 ? "▲" : "▼"} ${quote.change >= 0 ? "+" : ""}${quote.change.toFixed(2)}%`;
    context.fillStyle = "#ed8025";
    context.beginPath();
    context.arc(x, 45, 7, 0, Math.PI * 2);
    context.fill();
    x += 18;
    context.font = "700 20px Arial, sans-serif";
    context.fillStyle = "#f5f4fc";
    context.fillText(quote.symbol, x, 52);
    x += context.measureText(quote.symbol).width + 21;
    context.font = "500 19px Arial, sans-serif";
    context.fillStyle = "#c9c8ce";
    const price = quote.price.toFixed(precision);
    context.fillText(price, x, 52);
    x += context.measureText(price).width + 17;
    context.fillStyle = quote.change >= 0 ? "#26c79f" : "#ff4961";
    context.fillText(change, x, 52);
    x += context.measureText(change).width + 40;
    context.strokeStyle = "rgba(255,255,255,.27)";
    context.beginPath();
    context.moveTo(x, 18);
    context.lineTo(x, 72);
    context.stroke();
    x += 34;
  };
  if (quotes?.length) while (x < canvas.width + 560) quotes.forEach(drawQuote);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.repeat.set(1, 1);
  texture.needsUpdate = true;
  return texture;
}

function DottedEarth({ rotationSpeed, glowIntensity, globeSize, reducedMotion, active }: Required<Omit<FinancialGlobeProps, "className">> & { reducedMotion: boolean; active: boolean }) {
  const earth = useRef<THREE.Group>(null);
  const dotsRef = useRef<THREE.InstancedMesh>(null);
  const ribbonMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const landMask = useLoader(THREE.TextureLoader, "/textures/earth-land-mask.png");
  const dots = useMemo(() => buildLandDots(landMask.image as HTMLImageElement), [landMask]);
  const marketRibbon = useMemo(() => buildMarketRibbon(), []);
  const marketTickerSurface = useMemo(() => buildMarketRibbon(1.021), []);
  const [marketQuotes, setMarketQuotes] = useState<MarketQuote[] | null>(null);
  const [tickerTexture, setTickerTexture] = useState<THREE.CanvasTexture | null>(null);
  const dotColor = useMemo(() => new THREE.Color("#ed8025").multiplyScalar(glowIntensity), [glowIntensity]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;
    const updateQuotes = async () => {
      try {
        const response = await fetch("/api/market-quotes", { cache: "no-store" });
        if (!response.ok) throw new Error("Market data is unavailable");
        const payload = await response.json() as { quotes?: MarketQuote[] };
        if (payload.quotes?.length) setMarketQuotes(payload.quotes);
      } catch {
        // Preserve the last verified market data while the next refresh retries.
      } finally {
        if (!cancelled) timer = setTimeout(updateQuotes, 30_000);
      }
    };
    updateQuotes();
    return () => { cancelled = true; if (timer) clearTimeout(timer); };
  }, []);

  useEffect(() => {
    const texture = createMarketTickerTexture(marketQuotes);
    setTickerTexture(texture);
    return () => texture.dispose();
  }, [marketQuotes]);

  useEffect(() => {
    const material = ribbonMaterialRef.current;
    if (!material || !tickerTexture) return;
    material.map = tickerTexture;
    material.needsUpdate = true;
  }, [tickerTexture]);

  useLayoutEffect(() => {
    if (!earth.current) return;
    // Start with Asia facing the camera while keeping the geographic axis level.
    earth.current.rotation.set(0, 1.4, 0);
  }, []);

  useLayoutEffect(() => {
    const mesh = dotsRef.current;
    if (!mesh) return;
    const marker = new THREE.Object3D();
    const forward = new THREE.Vector3(0, 0, 1);
    dots.forEach(({ position, normal, size }, index) => {
      marker.position.copy(position);
      marker.quaternion.setFromUnitVectors(forward, normal);
      marker.scale.setScalar(size);
      marker.updateMatrix();
      mesh.setMatrixAt(index, marker.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [dots]);

  useFrame((_, delta) => {
    if (active && !reducedMotion && earth.current) earth.current.rotation.y += rotationSpeed * delta;
    if (active && !reducedMotion && tickerTexture) {
      tickerTexture.offset.x = (tickerTexture.offset.x - delta * .008 + 1) % 1;
    }
  });

  return <>
    <group ref={earth} scale={globeSize}>
      <mesh>
        <sphereGeometry args={[1, 96, 64]}/>
        <meshBasicMaterial color="#f5f4fc"/>
      </mesh>
      <instancedMesh ref={dotsRef} args={[undefined, undefined, dots.length]}>
        <circleGeometry args={[1, 8]}/>
        <meshBasicMaterial color={dotColor} toneMapped={false}/>
      </instancedMesh>
    </group>
    <group scale={globeSize}>
      <mesh geometry={marketRibbon} renderOrder={3}>
        <meshBasicMaterial color="#08090b" side={THREE.DoubleSide} toneMapped={false}/>
      </mesh>
      <mesh geometry={marketTickerSurface} renderOrder={4}>
        <meshBasicMaterial ref={ribbonMaterialRef} key={tickerTexture?.uuid ?? "ticker-loading"} map={tickerTexture ?? undefined} color="#ffffff" transparent depthWrite={false} side={THREE.DoubleSide} toneMapped={false}/>
      </mesh>
    </group>
  </>;
}

export function FinancialGlobe({ className, rotationSpeed = .018, glowIntensity = 1, globeSize = 1 }: FinancialGlobeProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: .01 });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return <div ref={containerRef} className={className} aria-label="Rotating dotted Earth globe and currency market ticker" role="group">
    <Canvas dpr={[1, 1.25]} frameloop={isVisible ? "always" : "demand"} camera={{ position: [0, 2.057, 2.451], fov: 38 }} gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}>
      <DottedEarth rotationSpeed={rotationSpeed} glowIntensity={glowIntensity} globeSize={globeSize} reducedMotion={reducedMotion} active={isVisible}/>
    </Canvas>
  </div>;
}
