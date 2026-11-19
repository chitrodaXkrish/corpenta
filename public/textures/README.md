# Earth visualization assets

`earth-land-mask.png` is a locally stored 2,048 × 1,024 equirectangular land mask derived from NASA's Blue Marble: Next Generation base map. It is sampled on a regular latitude/longitude grid to place the individual points that form the 3D continents. `earth-dot-fallback.svg` is a static, orthographic dot globe used only when WebGL is unavailable.

NASA source page: https://science.nasa.gov/earth/earth-observatory/blue-marble-next-generation/base-map/

Regenerate the mask and fallback from a source image with:

```sh
node scripts/generate-earth-dot-mask.cjs path/to/world.200401.3x5400x2700.jpg public/textures/earth-land-mask.png public/textures/earth-dot-fallback.svg
```

The visualization depicts simulated financial-centre routes and illustrative market context. It is not a live data service.
