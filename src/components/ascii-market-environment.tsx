"use client";

import { useEffect, useRef } from "react";

type Scene = "network" | "currencies" | "pairs" | "candles" | "ticker" | "research";

const PAIRS = ["EUR/USD", "GBP/USD", "USD/JPY"] as const;
const SIGNS = ["$", "€", "£", "¥"] as const;
const ORANGE = "#ed8025";
const IVORY = "#e5ebe5";

function readScene(path: string): Scene {
  const marked = document.elementFromPoint(window.innerWidth * 0.52, window.innerHeight * 0.52)?.closest<HTMLElement>("[data-market-scene]")?.dataset.marketScene;
  if (marked && ["network", "currencies", "pairs", "candles", "ticker", "research"].includes(marked)) return marked as Scene;
  if (path.startsWith("/founders-desk")) return "network";
  if (path.startsWith("/courses")) return "candles";
  if (path.startsWith("/scenarios")) return "research";
  if (path.startsWith("/student")) return "ticker";
  if (path.startsWith("/admin")) return "pairs";
  return "currencies";
}

function drawCanvas(canvas: HTMLCanvasElement, width: number, height: number, elapsed: number, scene: Scene) {
  const context = canvas.getContext("2d", { alpha: true });
  if (!context) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 1.35);
  const pixelWidth = Math.round(width * dpr);
  const pixelHeight = Math.round(height * dpr);
  if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
    canvas.width = pixelWidth;
    canvas.height = pixelHeight;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }

  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  context.clearRect(0, 0, width, height);
  const phase = elapsed / 1000;
  // Sparse, anchored data studies keep the environment composed instead of tiled.
  const compact = width < 700;
  const anchors = compact
    ? [{ x: .07, y: .16 }, { x: .73, y: .28 }, { x: .08, y: .76 }, { x: .69, y: .84 }]
    : [{ x: .045, y: .19 }, { x: .79, y: .16 }, { x: .035, y: .73 }, { x: .82, y: .77 }, { x: .42, y: .91 }];
  const label = scene === "network" ? "LONDON · SINGAPORE" : scene === "research" ? "MARKET STUDY" : scene === "candles" ? "PRICE STRUCTURE" : scene === "ticker" ? "SESSION FLOW" : "GLOBAL FX";
  const chartMode = scene === "candles" || scene === "research" || scene === "pairs";
  context.textBaseline = "middle";
  context.font = '8px ui-monospace, "SFMono-Regular", Menlo, monospace';

  anchors.forEach((anchor, index) => {
    const x = anchor.x * width;
    const y = anchor.y * height;
    const alpha = .16 + (Math.sin(phase * .38 + index * 1.9) + 1) * .035;
    context.globalAlpha = alpha;
    context.fillStyle = index % 3 === 0 ? IVORY : ORANGE;
    context.strokeStyle = context.fillStyle;
    context.font = '7px ui-monospace, "SFMono-Regular", Menlo, monospace';
    context.fillText(index === 0 && scene === "network" ? label : PAIRS[(index + Math.floor(phase / 12)) % PAIRS.length], x, y);
    context.fillText(`${(1.04 + Math.sin(phase * .08 + index) * .0024).toFixed(4)}  ${index % 2 ? "↘" : "↗"}`, x, y + 13);
    context.globalAlpha = alpha * .8;
    context.beginPath();
    context.moveTo(x, y + 31);
    for (let point = 0; point < 11; point += 1) {
      const px = x + point * (compact ? 4 : 6);
      const py = y + 31 + Math.sin(point * .82 + index * 1.3 + phase * .17) * (compact ? 4 : 6);
      if (point === 0) context.moveTo(px, py); else context.lineTo(px, py);
    }
    context.stroke();
    if (chartMode) {
      for (let candle = 0; candle < 5; candle += 1) {
        const cx = x + candle * (compact ? 9 : 12) + 6;
        const top = y + 48 + Math.sin(candle * 1.4 + index + phase * .12) * 5;
        context.globalAlpha = alpha * .65;
        context.beginPath(); context.moveTo(cx, top - 5); context.lineTo(cx, top + 7); context.stroke();
        context.fillRect(cx - 1.5, top, 3, 4 + (candle % 2) * 2);
      }
    } else {
      context.globalAlpha = alpha * .65;
      context.fillText(`VOL ▂▅▃▆▂  ${SIGNS[index % SIGNS.length]}`, x, y + 49);
    }
  });
  if (scene === "network" && anchors.length > 2) {
    context.globalAlpha = .08;
    context.strokeStyle = ORANGE;
    context.setLineDash([2, 8]);
    context.beginPath(); context.moveTo(anchors[0].x * width + 4, anchors[0].y * height + 5); context.quadraticCurveTo(width * .46, height * .34, anchors[1].x * width, anchors[1].y * height + 5); context.stroke();
    context.setLineDash([]);
  }
  context.globalAlpha = 1;
}

export function AsciiMarketEnvironment() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastFrame = 0;
    let lastSceneCheck = 0;
    let lastScrollAt = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let startedAt = performance.now();
    let activeScene = readScene(window.location.pathname);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      drawCanvas(canvas, width, height, performance.now() - startedAt, activeScene);
    };

    const updateScene = () => {
      const nextScene = readScene(window.location.pathname);
      if (nextScene !== activeScene) {
        activeScene = nextScene;
        startedAt = performance.now();
      }
    };

    const animate = (now: number) => {
      if (document.hidden || reducedMotion.matches) {
        frame = 0;
        return;
      }
      if (now - lastFrame >= 1000 / 15 && now - lastScrollAt > 140) {
        if (now - lastSceneCheck >= 250) {
          updateScene();
          lastSceneCheck = now;
        }
        drawCanvas(canvas, width, height, now - startedAt, activeScene);
        lastFrame = now;
      }
      frame = window.requestAnimationFrame(animate);
    };

    const start = () => {
      if (!frame && !document.hidden && !reducedMotion.matches) frame = window.requestAnimationFrame(animate);
    };
    const visibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      } else start();
    };
    const motionChange = () => {
      if (reducedMotion.matches) {
        window.cancelAnimationFrame(frame);
        frame = 0;
        drawCanvas(canvas, width, height, 0, activeScene);
      } else start();
    };
    const onScroll = () => {
      lastScrollAt = performance.now();
      if (lastScrollAt - lastSceneCheck > 250) {
        updateScene();
        lastSceneCheck = lastScrollAt;
      }
      if (reducedMotion.matches) drawCanvas(canvas, width, height, 0, activeScene);
    };

    drawCanvas(canvas, width, height, 0, activeScene);
    start();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", visibilityChange);
    reducedMotion.addEventListener("change", motionChange);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", visibilityChange);
      reducedMotion.removeEventListener("change", motionChange);
    };
  }, []);

  return <>
    <canvas ref={canvasRef} className="ascii-market-environment" aria-hidden="true" />
    <span className="sr-only">Decorative simulated market typography and chart motion. Values are illustrative and are not live market data.</span>
  </>;
}
