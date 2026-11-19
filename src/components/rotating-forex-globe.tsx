"use client";

import dynamic from "next/dynamic";

const ThreeEarthScene = dynamic(() => import("./three-earth-scene"), {
  ssr: false,
  loading: () => <div className="hero-globe-fallback" role="img" aria-label="Earth globe loading" />,
});

export function RotatingForexGlobe() {
  return <ThreeEarthScene />;
}
