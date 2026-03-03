# Leaflet Assets

This folder should contain the Leaflet marker icons:

- marker-icon.png
- marker-icon-2x.png  
- marker-shadow.png

For development, you can:

1. Download from Leaflet CDN:
   - https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png
   - https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png
   - https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png

2. Or install leaflet and copy from node_modules:
   ```bash
   cp node_modules/leaflet/dist/images/marker-*.png public/leaflet/
   ```

The MapPicker component will fallback gracefully if these are missing.