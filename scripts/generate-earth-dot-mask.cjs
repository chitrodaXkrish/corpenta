const sharp = require("sharp");
const fs = require("node:fs");

const [source, maskOutput, fallbackOutput] = process.argv.slice(2);

if (!source || !maskOutput || !fallbackOutput) {
  throw new Error("Usage: node scripts/generate-earth-dot-mask.cjs source.jpg mask.png fallback.svg");
}

async function main() {
  const { data, info } = await sharp(source)
    .resize(2048, 1024, { fit: "fill", kernel: "lanczos3" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  const land = new Uint8Array(info.width * info.height);

  for (let pixel = 0; pixel < land.length; pixel += 1) {
    const sourceOffset = pixel * info.channels;
    const red = data[sourceOffset];
    const green = data[sourceOffset + 1];
    const blue = data[sourceOffset + 2];
    const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
    const ocean = blue > red * 1.4 && blue > green * 1.12;
    const isLand = luminance > 18 && !ocean;
    land[pixel] = isLand ? 1 : 0;
    const outputOffset = pixel * 4;
    rgba[outputOffset] = isLand ? 255 : 0;
    rgba[outputOffset + 1] = green;
    rgba[outputOffset + 2] = luminance;
    rgba[outputOffset + 3] = 255;
  }

  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(maskOutput);

  const step = 0.8;
  const centerX = 256;
  const centerY = 256;
  const radius = 224;
  const circles = [];
  for (let latitude = -84; latitude <= 84; latitude += step) {
    for (let longitude = -90; longitude <= 90; longitude += step) {
      const mapX = Math.min(info.width - 1, Math.max(0, Math.round(((longitude + 180) / 360) * info.width)));
      const mapY = Math.min(info.height - 1, Math.max(0, Math.round(((90 - latitude) / 180) * info.height)));
      if (!land[mapY * info.width + mapX]) continue;
      const lat = latitude * Math.PI / 180;
      const lon = longitude * Math.PI / 180;
      const x = centerX + Math.sin(lon) * Math.cos(lat) * radius;
      const y = centerY - Math.sin(lat) * radius;
      circles.push(`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="1.05"/>`);
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><defs><radialGradient id="shade"><stop offset="73%" stop-color="#050806" stop-opacity="0"/><stop offset="100%" stop-color="#050806" stop-opacity=".8"/></radialGradient></defs><circle cx="256" cy="256" r="226" fill="#050806"/><g fill="#00b95b">${circles.join("")}</g><circle cx="256" cy="256" r="226" fill="url(#shade)"/></svg>`;
  fs.writeFileSync(fallbackOutput, svg);
  console.log(`Created ${land.reduce((total, value) => total + value, 0)} land pixels and ${circles.length} fallback dots.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
