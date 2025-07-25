# -*- coding: utf-8 -*-
"""Raster_clipping_aoi.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1_eVkFcyzE2flT1n_OUF-zmh5era3ev7c
"""

# === Step 1: Mount Google Drive ===
from google.colab import drive
drive.mount('/content/drive')

# === Step 2: Install Required Packages ===
!pip install geopandas rasterio fiona

import os
import glob
import rasterio
from rasterio.mask import mask
import geopandas as gpd

# === Step 3: Set Paths ===
aoi_shapefile_path ='/content/drive/MyDrive/Barrackpore/Sentinel_Barrackpore_features/AOI_Barrackpore.shp'
input_folder = '/content/drive/MyDrive/S2_HARMONIDED_DATA/BARRACKPORE_WaterStress/Output_Stress_Maps'
output_folder = '/content/drive/MyDrive/S2_HARMONIDED_DATA/BARRACKPORE_WaterStress/Output_Stress_Maps/WaterStress_Clipped20m'

os.makedirs(output_folder, exist_ok=True)

# === Step 4: Load AOI ===
aoi = gpd.read_file(aoi_shapefile_path)
aoi = aoi.to_crs("EPSG:4326")  # Optional: convert to EPSG:4326


# === Step 5: Filter WS1 and WS2 Files ===
ws_files = glob.glob(os.path.join(input_folder, "*.tif"))
ws_files = [f for f in ws_files if "LSWI_WS1" in f or "LSWI_WS2" in f]

# === Step 6: Clip Each File ===
for tif_path in ws_files:
    with rasterio.open(tif_path) as src:
        aoi_proj = aoi.to_crs(src.crs)  # match CRS
        out_image, out_transform = mask(src, aoi_proj.geometry, crop=True)
        out_meta = src.meta.copy()
        out_meta.update({
            "height": out_image.shape[1],
            "width": out_image.shape[2],
            "transform": out_transform
        })

        out_name = os.path.basename(tif_path).replace(".tif", "_clipped.tif")
        out_path = os.path.join(output_folder, out_name)

        with rasterio.open(out_path, "w", **out_meta) as dest:
            dest.write(out_image)

        print(f"✅ Clipped: {out_name}")