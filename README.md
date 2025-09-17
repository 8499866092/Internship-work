# 🌾 Multi-Sensor Approach for Water Stress Monitoring and GPP Estimation in Agroecosystems  

## 📌 Project Overview  
This project was carried out as part of a Summer Internship (May–July 2025) at **National Remote Sensing Centre (NRSC), Hyderabad** and **IIT Kharagpur**.  
The study develops a **multi-sensor framework** to monitor **agricultural water stress** and estimate **Gross Primary Production (GPP)** in heterogeneous Indian agroecosystems using **remote sensing** and **machine learning**.  

---

## 📝 Abstract  
Water stress, a critical constraint on crop productivity, was assessed by integrating **optical (Sentinel-2)** vegetation indices (NDVI, EVI, LSWI) with **Synthetic Aperture Radar (Sentinel-1)** polarimetric features (VV, VH, RVI, and derived ratios).  
- Temporal water stress indicators (**WS1, WS2**) were derived using normalized LSWI and applied to diverse cropping systems in **Jodhpur (pearl millet, cumin)**, **Barrackpore (rice, wheat, jute)**, and **Nagpur (cotton)**.  
- To address optical data gaps caused by cloud cover, a **SAR-based machine learning framework** (MLR, Random Forest, XGBoost, Quantile Mapping) was implemented. **RF and XGB** achieved the best results (WS1: R² > 0.67; WS2: R² > 0.73).  
- **RVI** was identified as the most sensitive SAR metric for crop water status.  

For **GPP estimation**, five Light Use Efficiency (LUE) models (EC-LUE, MODIS-GPP, VPM, MVPM, TEC) were tested.  
- **VPM** showed the best correlation with **eddy covariance flux tower** observations at the Barrackpore site.  
- Machine learning–driven stress scalars (WS1, WS2) further improved GPP predictions during cloudy periods.  

✅ The integrated SAR–optical–ML framework provides continuous, spatially explicit stress and productivity monitoring, supporting **precision agriculture, irrigation management, and climate-resilient crop planning**.  

---

## 🎯 Objectives  
- Develop a **continuous water stress indicator** by integrating **optical indices (Sentinel-2)** with **SAR metrics (Sentinel-1)**.  
- Use **machine learning** to fill temporal gaps during cloudy/rainy conditions.  
- Estimate and validate **Gross Primary Production (GPP)** using satellite-based **LUE models** and **eddy covariance flux tower data**.  

---

## 🗂️ Methodology  
1. **Data Sources**  
   - Sentinel-1 (VV, VH polarizations; indices: VV/VH, VV–VH, RVI).  
   - Sentinel-2 (NDVI, EVI, LSWI).  
   - Flux tower meteorological data (ET, VPD, PAR, radiation).  

2. **Data Processing**  
   - Preprocessing in **Google Earth Engine (GEE)**.  
   - Feature engineering: NDVI, EVI, LSWI, WS1, WS2, SAR metrics.  
   - Temporal compositing & speckle filtering.  

3. **Machine Learning Models**  
   - Multiple Linear Regression (MLR)  
   - Random Forest (RF)  
   - XGBoost (XGB)  
   - Quantile Mapping (QM)  

4. **GPP Estimation**  
   - Models: EC-LUE, MODIS-GPP, VPM, MVPM, TEC.  
   - Focus on water stress scalars (temperature scalars minimal for Indian cropping).  
   - Validation against **eddy covariance flux tower data**.  

---

## 🛠️ Tech Stack  
- **Language**: Python 🐍  
- **Libraries**:  
  - `pandas`, `numpy` – data preprocessing  
  - `matplotlib`, `seaborn`, `plotly` – visualization  
  - `scikit-learn`, `xgboost` – machine learning  
  - `geopandas`, `rasterio`, `xarray` – geospatial processing  
  - `sentinelsat`, `earthengine-api` – satellite data access  

---

## 📊 Key Results  
- **RF and XGB** models effectively gap-filled optical stress indices using SAR (R² up to 0.75).  
- **VPM model** gave the best GPP estimates, especially under humid, multi-cropping conditions.  
- SAR-based RVI was the most reliable feature for water stress detection.  
- Spatial stress maps captured **intra-field variability** due to irrigation and rainfall patterns.  

---

## 🚀 How to Run  
1. Clone the repository:  
   ```bash
   git clone https://github.com/your-username/multisensor-waterstress-gpp.git
   cd multisensor-waterstress-gpp
