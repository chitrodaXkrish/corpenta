"use client";

import { useEffect, useRef } from "react";

type Scene = "network" | "currencies" | "pairs" | "candles" | "ticker" | "research";

const PAIRS = ["EUR/USD", "GBP/USD", "USD/JPY"] as const;
const SIGNS = ["$", "€", "£", "¥"] as const;
const GREEN = "#00c96b";
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
  // A tighter fixed grid gives the background a continuous market-terminal texture
  // while keeping each mark small and anchored in place.
  const cellWidth = Math.max(92, Math.min(124, width / 16));
  const cellHeight = Math.max(68, Math.min(88, height / 12));
  const columns = Math.ceil(width / cellWidth);
  const rows = Math.ceil(height / cellHeight);
  const left = (width - columns * cellWidth) / 2;
  const top = (height - rows * cellHeight) / 2;
  const phase = elapsed / 1000;

  context.textBaseline = "middle";
  context.font = '8px ui-monospace, "SFMono-Regular", Menlo, monospace';

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const index = row * columns + column;
      const gate = (column * 7 + row * 11 + column * row) % 9;
      if (gate > 7) continue;

      const x = left + column * cellWidth + 8;
      const y = top + row * cellHeight + 12;
      const pulse = 0.45 + (Math.sin(phase * 0.55 + index * 1.7) + 1) * 0.2;
      const mode = scene === "network"
        ? index % 4 === 0 ? "network" : index % 4 === 1 ? "pair" : "currency"
        : scene === "candles"
          ? index % 3 === 0 ? "candles" : index % 3 === 1 ? "volume" : "digits"
          : scene === "research"
            ? index % 3 === 0 ? "chart" : index % 3 === 1 ? "pair" : "digits"
            : scene === "ticker"
              ? index % 3 === 0 ? "ticker" : index % 3 === 1 ? "digits" : "currency"
              : scene === "pairs"
                ? index % 3 === 0 ? "pair" : index % 3 === 1 ? "chart" : "digits"
                : index % 3 === 0 ? "currency" : index % 3 === 1 ? "pair" : "chart";

      context.globalAlpha = 0.2 + pulse * 0.14;
      context.fillStyle = index % 5 === 0 ? IVORY : GREEN;
      context.strokeStyle = index % 5 === 0 ? IVORY : GREEN;

      if (mode === "currency") {
        const sign = SIGNS[(index + Math.floor(phase / (4 + index % 4))) % SIGNS.length];
        context.font = "11px ui-monospace, monospace";
        context.fillText(sign, x, y + 7);
        context.font = '8px ui-monospace, "SFMono-Regular", Menlo, monospace';
        context.fillText(`${(12.8 + ((index * 13) % 70) / 10).toFixed(2)}  ${index % 2 ? "↗" : "↘"}`, x + 16, y + 7);
      } else if (mode === "pair" || mode === "ticker") {
        const pair = PAIRS[(index + Math.floor(phase / (5 + index % 5))) % PAIRS.length];
        const value = 0.72 + Math.abs(Math.sin(index * 3.1 + phase * 0.32)) * 1.8;
        context.fillText(pair, x, y + 4);
        context.globalAlpha *= 0.72;
        context.fillText(`${value.toFixed(4)}  ${index % 2 ? "↑" : "↓"}`, x, y + 17);
        if (mode === "ticker") {
          context.globalAlpha *= 0.72;
          context.fillText("VOL  ▂▅▃▆▂", x, y + 30);
        }
      } else if (mode === "digits") {
        const value = (100 + Math.abs(Math.sin(index * 0.81 + phase * 0.25)) * 990).toFixed(3);
        context.fillText(`${index % 2 ? "−" : "+"}${value}`, x, y + 5);
        context.globalAlpha *= 0.65;
        context.fillText("·  ·  ·  ·  ·", x, y + 18);
      } else if (mode === "volume") {
        context.globalAlpha *= 0.78;
        for (let bar = 0; bar < 8; bar += 1) {
          const barHeight = 3 + ((bar * 7 + index * 3) % 11);
          context.fillRect(x + bar * 5, y + 19 - barHeight, 2, barHeight);
        }
      } else if (mode === "candles") {
        context.globalAlpha *= 0.84;
        for (let candle = 0; candle < 6; candle += 1) {
          const cx = x + candle * 7 + 2;
          const bodyTop = y + 7 + ((candle * 5 + index * 3) % 8);
          const bodyHeight = 4 + ((candle * 3 + index) % 7);
          context.beginPath();
          context.moveTo(cx, bodyTop - 4);
          context.lineTo(cx, bodyTop + bodyHeight + 4);
          context.stroke();
          context.fillRect(cx - 1.5, bodyTop, 3, bodyHeight);
        }
      } else if (mode === "chart") {
        context.globalAlpha *= 0.72;
        context.beginPath();
        context.moveTo(x, y + 18);
        for (let point = 1; point < 12; point += 1) {
          const px = x + point * 6;
          const py = y + 9 + Math.sin(point * 1.27 + index * 0.9 + phase * 0.28) * 7;
          context.lineTo(px, py);
        }
        context.stroke();
      } else {
        context.globalAlpha *= 0.72;
        const targetX = x + cellWidth * (index % 2 ? 0.34 : 0.52);
        const targetY = y + cellHeight * (index % 3 ? 0.35 : 0.52);
        context.beginPath();
        context.moveTo(x + 3, y + 12);
        context.quadraticCurveTo(x + 25, y - 2, targetX, targetY);
        context.stroke();
        context.globalAlpha *= 1.4;
        context.beginPath();
        context.arc(targetX, targetY, 1.3, 0, Math.PI * 2);
        context.fill();
      }
    }
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
      if (now - lastFrame >= 1000 / 30) {
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
      updateScene();
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
