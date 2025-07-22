# Sentinel-1 Radar Processing and Export using Google Earth Engine

This Google Earth Engine (GEE) script processes Sentinel-1 radar images (VV and VH polarizations) over a 100 km × 100 km area centered around Nagpur, India. It applies the **Refined Lee Speckle Filter** to reduce noise, creates median composites for multiple date ranges, and exports the filtered images as GeoTIFFs to Google Drive.

---

## 📍 Area of Interest (AOI)

- **Center**: `[79.05837, 21.033656]` (Nagpur region)
- **Extent**: 100 km × 100 km (buffer of 50 km in each direction)

---

## 📅 Date Ranges Processed

The script processes Sentinel-1 images for the following date ranges:

- 2019-12-02 to 2019-12-07  
- 2019-12-08 to 2019-12-11  
- 2019-12-12 to 2019-12-20  
- 2019-12-22 to 2019-12-25  
- 2019-12-26 to 2020-12-31  

---

## 🔧 Workflow Summary

1. Define the AOI using a buffer around a central point.
2. Filter Sentinel-1 ImageCollection for VV and VH bands.
3. Compute the **median composite** for each date range.
4. Apply the **Refined Lee Speckle Filter** to reduce noise.
5. Convert filtered output to decibels (dB).
6. Export each processed image (VV and VH) to Google Drive as GeoTIFF.

---

## 🛰️ Input Dataset

- **Sentinel-1 Ground Range Detected (GRD)**:  
  `COPERNICUS/S1_GRD`

---

## 📤 Output

For each date range:
- 1 GeoTIFF file for filtered **VV** band
- 1 GeoTIFF file for filtered **VH** band

Each image is:
- **Scale**: 10 meters
- **CRS**: EPSG:4326
- **Export Folder**:  
  - `Nagpur_vv` (for VV images)  
  - `Nagpur_vh` (for VH images)  

---

## 📁 File Structure

```plaintext
sentinel1_refined_lee_export.js  # GEE JavaScript code
README.md                        # This file
