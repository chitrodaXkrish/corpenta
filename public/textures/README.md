# Dotted Earth assets

`earth-dots.svg` is a locally hosted equirectangular field of dots sampled every two degrees from Natural Earth country polygons. The Three.js sphere wraps this denser texture directly, so coastlines and land distribution follow real geographic data without rendering satellite terrain.

`earth-dot-globe.svg` is a static orthographic projection of the same dots used when WebGL is unavailable.

Source data: [datasets/geo-countries](https://github.com/datasets/geo-countries), derived from Natural Earth public-domain data.

Regenerate with Python's standard library:

```sh
python3 scripts/generate-earth-dot-globes.py input.geojson public/textures/earth-dots.svg public/textures/earth-dot-globe.svg
```
