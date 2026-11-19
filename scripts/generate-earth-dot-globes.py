#!/usr/bin/env python3
"""Build an equirectangular dotted Earth texture and a static WebGL fallback.

Input: Natural Earth country polygons in GeoJSON format.
The runtime only loads the generated SVGs; no map-data request is made.
"""

import json
import math
import sys
from pathlib import Path


def unwrap_ring(ring, reference_lon):
    points = []
    previous = None
    for longitude, latitude, *_ in ring:
        if previous is None:
            unwrapped = longitude
        else:
            delta = (longitude - previous + 180) % 360 - 180
            unwrapped = points[-1][0] + delta
        points.append((unwrapped, latitude))
        previous = longitude
    center = sum(point[0] for point in points) / max(1, len(points))
    shift = 360 * round((reference_lon - center) / 360)
    return [(longitude + shift, latitude) for longitude, latitude in points]


def point_in_ring(longitude, latitude, ring):
    points = unwrap_ring(ring, longitude)
    inside = False
    previous = points[-1]
    for current in points:
        x1, y1 = previous
        x2, y2 = current
        if (y1 > latitude) != (y2 > latitude):
            crossing = (x2 - x1) * (latitude - y1) / (y2 - y1) + x1
            if longitude < crossing:
                inside = not inside
        previous = current
    return inside


def polygons_from_geojson(data):
    polygons = []
    for feature in data["features"]:
        geometry = feature.get("geometry") or {}
        kind = geometry.get("type")
        coordinates = geometry.get("coordinates", [])
        if kind == "Polygon":
            coordinates = [coordinates]
        elif kind != "MultiPolygon":
            continue
        for polygon in coordinates:
            if not polygon:
                continue
            outer = polygon[0]
            lats = [point[1] for point in outer]
            lons = [point[0] for point in outer]
            polygons.append((min(lons), max(lons), min(lats), max(lats), polygon))
    return polygons


def land_at(longitude, latitude, polygons):
    for min_lon, max_lon, min_lat, max_lat, polygon in polygons:
        if latitude < min_lat or latitude > max_lat:
            continue
        if max_lon - min_lon <= 180 and not min_lon <= longitude <= max_lon:
            continue
        if not point_in_ring(longitude, latitude, polygon[0]):
            continue
        if any(point_in_ring(longitude, latitude, hole) for hole in polygon[1:]):
            continue
        return True
    return False


def main():
    if len(sys.argv) != 4:
        raise SystemExit("usage: generate-earth-dot-globes.py input.geojson output-texture.svg output-fallback.svg")
    source = json.loads(Path(sys.argv[1]).read_text())
    polygons = polygons_from_geojson(source)
    # Two-degree sampling keeps the coastline detailed while avoiding oversized points.
    columns, rows = 180, 90
    points = []
    for row in range(rows):
        latitude = 90 - (row + 0.5) * 180 / rows
        row_polygons = [polygon for polygon in polygons if polygon[2] <= latitude <= polygon[3]]
        for column in range(columns):
            longitude = -180 + (column + 0.5) * 360 / columns
            if land_at(longitude, latitude, row_polygons):
                points.append((longitude, latitude))

    texture = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 512" width="1024" height="512">',
        '<g fill="#38834c">',
    ]
    for longitude, latitude in points:
        x = (longitude + 180) * 1024 / 360
        y = (90 - latitude) * 512 / 180
        texture.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="1.55"/>')
    texture.extend(["</g>", "</svg>"])
    Path(sys.argv[2]).write_text("\n".join(texture))

    fallback = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">',
        '<circle cx="256" cy="256" r="232" fill="#030806" stroke="#28402d" stroke-width="1.5"/>',
        '<g fill="#38834c">',
    ]
    radius = 230
    for longitude, latitude in points:
        lon = math.radians(longitude)
        lat = math.radians(latitude)
        depth = math.cos(lat) * math.cos(lon)
        if depth <= 0:
            continue
        x = 256 - radius * math.cos(lat) * math.sin(lon)
        y = 256 - radius * math.sin(lat)
        dot_radius = 0.8 + 0.55 * math.sqrt(depth)
        opacity = 0.34 + 0.58 * depth
        fallback.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{dot_radius:.2f}" opacity="{opacity:.2f}"/>')
    fallback.extend(["</g>", "</svg>"])
    Path(sys.argv[3]).write_text("\n".join(fallback))
    print(f"Wrote {len(points)} accurate land dots to {sys.argv[2]} and the static fallback.")


if __name__ == "__main__":
    main()
