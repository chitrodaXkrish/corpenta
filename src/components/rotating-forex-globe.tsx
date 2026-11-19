"use client";

import dynamic from "next/dynamic";

const ThreeEarthScene = dynamic(() => import("./three-earth-scene"), {
  ssr: false,
  loading: () => null,
});

export function RotatingForexGlobe() {
  return <ThreeEarthScene />;
}
