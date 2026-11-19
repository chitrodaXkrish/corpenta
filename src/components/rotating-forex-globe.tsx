"use client";

import { useEffect, useRef } from "react";

type Point = readonly [number, number];

// Simplified geographic coastlines for the hero illustration, using longitude/latitude.
const landmasses: Point[][] = [
  [[-168,70],[-150,72],[-137,68],[-128,59],[-124,50],[-127,42],[-123,34],[-117,32],[-111,28],[-106,24],[-98,22],[-92,18],[-87,16],[-84,10],[-80,8],[-78,15],[-82,20],[-80,25],[-78,31],[-74,37],[-70,42],[-66,45],[-60,48],[-57,53],[-61,58],[-69,61],[-78,66],[-92,70],[-108,73],[-126,73],[-145,72]],
  [[-81,12],[-76,8],[-73,3],[-77,-4],[-75,-12],[-71,-18],[-70,-27],[-67,-34],[-64,-42],[-69,-51],[-75,-55],[-79,-43],[-78,-30],[-81,-18]],
  [[-11,36],[-10,43],[-7,50],[-4,55],[2,58],[8,55],[14,55],[19,60],[27,65],[34,70],[44,70],[54,65],[61,69],[74,72],[89,72],[105,69],[121,67],[137,70],[153,66],[166,61],[178,60],[176,51],[167,48],[161,43],[151,44],[143,39],[137,35],[130,34],[124,29],[122,22],[116,19],[110,21],[106,17],[108,10],[104,2],[109,-5],[118,-8],[124,-7],[130,-4],[135,-5],[141,-9],[147,-7],[153,-4],[154,-10],[148,-16],[145,-23],[138,-27],[130,-34],[122,-34],[116,-31],[113,-24],[115,-19],[121,-16],[124,-11],[119,-7],[112,-8],[107,-6],[103,0],[98,5],[94,10],[88,17],[82,21],[77,27],[72,30],[68,24],[61,25],[57,19],[51,12],[46,12],[43,17],[39,22],[34,27],[30,31],[26,36],[21,40],[16,45],[12,46],[8,44],[4,43],[0,42],[-5,43],[-9,39]],
  [[-17,37],[-7,36],[4,37],[12,34],[20,33],[27,31],[33,30],[35,24],[42,12],[49,11],[51,2],[44,-4],[42,-12],[39,-17],[36,-23],[32,-29],[27,-34],[20,-35],[17,-29],[13,-24],[12,-18],[10,-5],[7,4],[2,5],[-4,5],[-9,10],[-13,16],[-17,21],[-16,28]],
  [[-24,64],[-20,66],[-17,64],[-19,61],[-23,61]],
  [[-8,58],[-5,59],[-3,57],[-5,55],[-7,55]],
  [[130,32],[134,34],[138,37],[141,42],[144,44],[146,42],[143,38],[139,35],[135,33]],
  [[47,-13],[50,-16],[49,-23],[46,-25],[44,-20]],
  [[-180,-72],[-150,-70],[-120,-73],[-90,-70],[-60,-73],[-30,-70],[0,-72],[30,-70],[60,-73],[90,-70],[120,-73],[150,-70],[180,-72],[180,-90],[-180,-90]],
];

const internalBorders: Point[][] = [
  [[-11,31],[-5,27],[0,22],[3,16],[0,10]], [[-5,15],[4,15],[10,12],[15,10]],
  [[8,5],[13,4],[17,0],[20,-5],[24,-9]], [[12,-5],[18,-4],[24,-3],[29,-2]],
  [[20,32],[23,25],[28,20],[31,12],[35,5]], [[29,31],[32,25],[36,22]],
  [[-1,11],[2,7],[7,5],[8,0],[11,-5]], [[25,-12],[29,-17],[31,-23],[28,-29]],
  [[-10,20],[-2,19],[4,19],[9,18]], [[20,15],[25,13],[30,13],[34,10]],
  [[-8,50],[0,49],[7,50],[12,48],[16,46]], [[-2,43],[3,43],[8,42],[13,43]],
  [[10,55],[14,53],[18,54],[22,52],[26,54]], [[23,45],[27,46],[30,44],[34,45]],
  [[35,40],[39,42],[43,41],[47,42]], [[47,30],[51,29],[55,27],[59,25]],
  [[68,23],[73,24],[78,27],[82,26]], [[78,9],[83,12],[87,16]],
  [[92,22],[96,20],[100,18],[104,16]], [[104,34],[108,33],[112,30],[117,31]],
  [[115,43],[120,41],[124,39],[129,38]], [[98,52],[104,50],[110,49],[116,50]],
];

const hubs = [
  { name: "London", point: [-0.12, 51.5] as Point },
  { name: "New York", point: [-74, 40.7] as Point },
  { name: "Dubai", point: [55.3, 25.2] as Point },
  { name: "Mumbai", point: [72.9, 19.1] as Point },
  { name: "Singapore", point: [103.8, 1.3] as Point },
  { name: "Tokyo", point: [139.7, 35.7] as Point },
];
const connections = [[0, 1], [0, 2], [2, 3], [2, 4], [4, 5], [1, 2]] as const;

function vector([longitude, latitude]: Point, rotation: number, lift = 1) {
  const lon = (longitude + rotation) * Math.PI / 180;
  const lat = latitude * Math.PI / 180;
  const cosLat = Math.cos(lat);
  return { x: Math.sin(lon) * cosLat * lift, y: -Math.sin(lat) * lift, z: Math.cos(lon) * cosLat * lift };
}

export function RotatingForexGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    const motionOff = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let rotation = -20;
    let width = 0;
    let height = 0;
    let radius = 0;
    let pixelRatio = 1;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = bounds.width;
      height = bounds.height;
      radius = Math.min(width, height) * 0.46;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const project = (point: Point, lift = 1) => {
      const v = vector(point, rotation, lift);
      return { x: width / 2 + radius * v.x, y: height / 2 + radius * v.y, z: v.z };
    };

    const drawLine = (points: Point[], stroke: string, lineWidth: number, lift = 1) => {
      context.beginPath();
      let drawing = false;
      for (const point of points) {
        const projected = project(point, lift);
        if (projected.z > 0.015) {
          if (!drawing) context.moveTo(projected.x, projected.y);
          else context.lineTo(projected.x, projected.y);
          drawing = true;
        } else {
          drawing = false;
        }
      }
      context.strokeStyle = stroke;
      context.lineWidth = lineWidth;
      context.stroke();
    };

    const drawLandmass = (boundary: Point[]) => {
      const closeToLimb = (start: Point, end: Point) => {
        let deltaLongitude = end[0] - start[0];
        if (deltaLongitude > 180) deltaLongitude -= 360;
        if (deltaLongitude < -180) deltaLongitude += 360;
        let low = 0;
        let high = 1;
        for (let step = 0; step < 12; step += 1) {
          const middle = (low + high) / 2;
          const point: Point = [start[0] + deltaLongitude * middle, start[1] + (end[1] - start[1]) * middle];
          if ((project(point).z > 0) === (project(start).z > 0)) low = middle;
          else high = middle;
        }
        const fraction = (low + high) / 2;
        const limbPoint: Point = [start[0] + deltaLongitude * fraction, start[1] + (end[1] - start[1]) * fraction];
        const point = project(limbPoint);
        return { x: point.x, y: point.y };
      };
      const sections: { x: number; y: number }[][] = [];
      let section: { x: number; y: number }[] = [];
      const points = [...boundary, boundary[0]];
      for (let index = 1; index < points.length; index += 1) {
        const previous = points[index - 1];
        const current = points[index];
        const previousPoint = project(previous);
        const currentPoint = project(current);
        const previousVisible = previousPoint.z > 0;
        const currentVisible = currentPoint.z > 0;
        if (previousVisible && section.length === 0) section.push({ x: previousPoint.x, y: previousPoint.y });
        if (previousVisible && currentVisible) section.push({ x: currentPoint.x, y: currentPoint.y });
        if (previousVisible && !currentVisible) {
          section.push(closeToLimb(previous, current));
          sections.push(section);
          section = [];
        } else if (!previousVisible && currentVisible) {
          section = [closeToLimb(previous, current), { x: currentPoint.x, y: currentPoint.y }];
        }
      }
      if (section.length > 2) sections.push(section);
      for (const pointsInSection of sections) {
        context.beginPath();
        context.moveTo(pointsInSection[0].x, pointsInSection[0].y);
        pointsInSection.slice(1).forEach(point => context.lineTo(point.x, point.y));
        context.closePath();
        context.fillStyle = "rgba(17, 37, 24, .78)";
        context.fill();
        context.strokeStyle = "rgba(83, 145, 91, .9)";
        context.lineWidth = 1.35;
        context.stroke();
      }
    };

    const drawGeoCurve = (start: Point, end: Point, progress: number) => {
      const a = vector(start, rotation);
      const b = vector(end, rotation);
      const dot = Math.max(-1, Math.min(1, a.x * b.x + a.y * b.y + a.z * b.z));
      const angle = Math.acos(dot);
      const sinAngle = Math.sin(angle) || 1;
      const points: { x: number; y: number; z: number }[] = [];
      for (let step = 0; step <= 42; step += 1) {
        const t = step / 42;
        const left = Math.sin((1 - t) * angle) / sinAngle;
        const right = Math.sin(t * angle) / sinAngle;
        const lift = 1 + Math.sin(Math.PI * t) * 0.065;
        points.push({ x: (a.x * left + b.x * right) * lift, y: (a.y * left + b.y * right) * lift, z: (a.z * left + b.z * right) * lift });
      }
      context.beginPath();
      let drawing = false;
      points.forEach((point, index) => {
        if (point.z > 0.015) {
          const x = width / 2 + radius * point.x;
          const y = height / 2 + radius * point.y;
          if (!drawing) context.moveTo(x, y);
          else context.lineTo(x, y);
          drawing = true;
        } else drawing = false;
        if (index === Math.floor(progress * points.length) && point.z > 0) {
          context.save();
          context.beginPath();
          context.arc(width / 2 + radius * point.x, height / 2 + radius * point.y, 2.1, 0, Math.PI * 2);
          context.fillStyle = "#a1c99e";
          context.shadowColor = "#84c481";
          context.shadowBlur = 12;
          context.fill();
          context.restore();
        }
      });
      context.strokeStyle = "rgba(88, 146, 103, .58)";
      context.lineWidth = 0.8;
      context.stroke();
    };

    const render = (time: number) => {
      context.clearRect(0, 0, width, height);
      if (!motionOff) rotation += 0.11;

      const cx = width / 2;
      const cy = height / 2;
      const sphere = context.createRadialGradient(cx - radius * 0.28, cy - radius * 0.35, radius * 0.06, cx, cy, radius * 1.13);
      sphere.addColorStop(0, "#12251a");
      sphere.addColorStop(0.66, "#09150e");
      sphere.addColorStop(1, "#030806");
      context.beginPath();
      context.arc(cx, cy, radius, 0, Math.PI * 2);
      context.fillStyle = sphere;
      context.fill();
      context.save();
      context.beginPath();
      context.arc(cx, cy, radius - 0.4, 0, Math.PI * 2);
      context.clip();

      // Longitude and latitude lines give the globe a spherical reference frame.
      for (let latitude = -75; latitude <= 75; latitude += 25) {
        const line: Point[] = [];
        for (let longitude = -180; longitude <= 180; longitude += 4) line.push([longitude, latitude]);
        drawLine(line, "rgba(57, 104, 69, .27)", 0.65);
      }
      for (let longitude = -180; longitude < 180; longitude += 30) {
        const line: Point[] = [];
        for (let latitude = -88; latitude <= 88; latitude += 3) line.push([longitude, latitude]);
        drawLine(line, "rgba(57, 104, 69, .25)", 0.65);
      }

      for (const landmass of landmasses) drawLandmass(landmass);
      for (const border of internalBorders) drawLine(border, "rgba(67, 119, 76, .58)", 0.7);

      connections.forEach(([from, to], index) => drawGeoCurve(hubs[from].point, hubs[to].point, ((time / 2600 + index * 0.19) % 1)));
      hubs.forEach((hub, index) => {
        const point = project(hub.point, 1.004);
        if (point.z <= 0) return;
        const pulse = 1 + Math.sin(time / 570 + index * 1.3) * 0.7;
        context.beginPath();
        context.arc(point.x, point.y, 2.2 * pulse, 0, Math.PI * 2);
        context.fillStyle = "#9fc99b";
        context.shadowColor = "#70bd7a";
        context.shadowBlur = 8 + pulse * 3;
        context.fill();
        context.shadowBlur = 0;
      });

      const shade = context.createRadialGradient(cx - radius * 0.5, cy - radius * 0.35, radius * 0.1, cx, cy, radius * 1.03);
      shade.addColorStop(0, "rgba(0,0,0,0)");
      shade.addColorStop(0.65, "rgba(0,0,0,.04)");
      shade.addColorStop(1, "rgba(0,0,0,.72)");
      context.beginPath();
      context.arc(cx, cy, radius, 0, Math.PI * 2);
      context.fillStyle = shade;
      context.fill();
      context.restore();

      context.beginPath();
      context.arc(cx, cy, radius, 0, Math.PI * 2);
      context.strokeStyle = "rgba(72, 122, 78, .7)";
      context.lineWidth = 1;
      context.stroke();
      if (!motionOff) frame = window.requestAnimationFrame(render);
    };

    resize();
    render(0);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    if (!motionOff) frame = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-globe-canvas" aria-hidden="true" />;
}
