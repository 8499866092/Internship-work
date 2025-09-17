# 🌾 Multi-Sensor Remote Sensing for Water Stress and GPP Estimation  

## 📌 Introduction  

Agriculture, which consumes nearly **70% of the world’s freshwater resources**, is increasingly threatened by rising water scarcity (Porporato et al., 2014). As food demand grows alongside climate variability, the sustainability of agricultural systems hinges on how effectively we can monitor and respond to **crop water stress**.  

Water stress triggers a physiological chain reaction in plants, starting with **stomatal closure** to conserve water. While this reduces water loss, it limits CO₂ intake for photosynthesis and suppresses oxygen and vapor release, ultimately lowering crop productivity. These effects are influenced by multiple factors: **soil moisture, canopy temperature, evapotranspiration (ET), leaf water content, and water potential**.  

Traditional ground-based systems (e.g., lysimeters, eddy covariance towers, scintillometers) are accurate but expensive, labor-intensive, and spatially limited. In contrast, **remote sensing** provides continuous, spatially extensive, and timely data on vegetation stress. Optical sensors capture changes in pigments and water content through spectral indices (NDVI, EVI, LSWI/NDWI), while **thermal** data reflects canopy temperature anomalies. **SAR (Synthetic Aperture Radar)** adds cloud-penetrating, all-weather capability, providing valuable insights into vegetation structure and moisture.  

Monitoring vegetation water status is especially critical in agroecosystems, where **40% of the Earth’s vegetated land is water-limited**, and another 33% is constrained by cold/frozen conditions (Nemani et al., 2003). These stress responses influence plant water/nutrient transport, photosynthetic efficiency, and overall productivity, with broader implications for **carbon exchange** between land and atmosphere.  

**Gross Primary Production (GPP)** — the rate of CO₂ fixation through photosynthesis — is a key measure of vegetation health and the global carbon cycle (Mystakidis et al., 2016; Piao et al., 2020). GPP is strongly shaped by **soil moisture, radiation, vapor pressure deficit (VPD), and canopy structure**. Water stress reduces GPP via both supply-side (soil water availability) and demand-side (atmospheric dryness) constraints. Understanding this interaction under changing **climate and elevated CO₂ (eCO₂)** scenarios remains a central challenge.  

---

## 🎯 Research Gap  

Despite advancements in satellite monitoring:  

- **Optical sensors** (e.g., Sentinel-2) are limited by **cloud cover**, especially during monsoon-driven crop growth stages.  
- **SAR (Sentinel-1)** offers cloud-penetrating capabilities but is underutilized in stress and GPP estimation.  
- Few studies combine **SAR + optical indices** with **machine learning** to bridge temporal data gaps.  
- **Crop phenology, canopy structure, and cropping system diversity** introduce interpretation challenges.  
- Most **GPP models** use generalized temperature/water stress scalars, lacking region-specific calibration.  
- Limited validation exists against **eddy covariance flux towers**, reducing operational confidence.  

---

## 📝 Abstract  

This study presents a **multi-sensor approach** for monitoring agricultural water stress and estimating **Gross Primary Production (GPP)** in Indian agroecosystems using **remote sensing + machine learning**.  

- **Data Sources**:  
  - **Optical (Sentinel-2)** → NDVI, EVI, LSWI  
  - **SAR (Sentinel-1)** → VV, VH, RVI, and derived ratios  

- **Water Stress Indicators**:  
  - Temporal metrics (WS1, WS2) derived from normalized LSWI values.  
  - Seasonal profiles captured crop phenology and stress in **Jodhpur (pearl millet, cumin)**, **Barrackpore (rice, wheat, jute)**, and **Nagpur (cotton)**.  

- **Machine Learning Models**:  
  - Multiple Linear Regression (MLR)  
  - Random Forest (RF)  
  - XGBoost (XGB)  
  - Quantile Mapping (QM)  
  - **RF & XGB outperformed others** (WS1: R² > 0.67, RMSE – 0.02; WS2: R² > 0.73, RMSE – 0.14).  
  - **RVI** was the most sensitive SAR-based feature for stress mapping.  

- **GPP Estimation**:  
  - Five **Light Use Efficiency (LUE) models**: EC-LUE, MODIS-GPP, VPM, MVPM.  
  - Validated against **eddy covariance flux towers**.  
  - **VPM** showed highest correlation in humid multi-cropping conditions (Barrackpore).  
  - Integration of RF/XGB-based WS1 & WS2 improved continuous GPP estimation during cloudy periods.  

- **Key Findings**:  
  - Intra-field stress variability aligned with irrigation/rainfall patterns.  
  - SAR + optical + ML enabled **continuous monitoring across cloud-prone regions**.  
  - Supports **precision agriculture, irrigation scheduling, and productivity forecasting**.  

---

## 🎯 Objective  

To develop a **continuous water stress indicator** by integrating:  
- **Optical Remote Sensing** (vegetation & water stress indices)  
- **SAR-based Systems** (cloud-penetrating structural and moisture features)  

for improved **agricultural water management** and **GPP estimation**.  

---

## 🛠️ Methodology  

1. **Data Preprocessing**  
   - Soil moisture, weather, optical (Sentinel-2), SAR (Sentinel-1) datasets.  
   - Standardization and agricultural masking.  

2. **Data Analysis**  
   - Stress index derivation (WS1, WS2).  
   - ML model training (RF, XGB).  
   - GPP estimation via LUE models.  

3. **Validation**  
   - Comparison with **eddy covariance flux tower observations**.  
   - Accuracy assessment using R² and RMSE.  

4. **Visualization**  
   - Stress/GPP maps, seasonal dynamics, and spatial variability across sites.  

---

## 🛠️ Tech Stack  

- **Language**: Python 🐍  
- **Libraries**:  
  - `pandas`, `numpy` – data preprocessing  
  - `matplotlib`, `seaborn`, `plotly` – visualization  
  - `scikit-learn`, `xgboost` – machine learning  
  - `geopandas`, `rasterio`, `sentinelsat` – geospatial data handling  

---

## 📊 Outcomes  

- 🌱 **Accurate stress detection** across multiple crop types.  
- 📡 **SAR-based ML models** fill optical data gaps in cloudy regions.  
- 📈 Improved **GPP estimation** validated with flux tower data.  
- 🌍 Supports **precision agriculture** and **climate-resilient farm management**.  

---

## 🚀 How to Run  

1. Clone the repository:  
   ```bash
   git clone https://github.com/your-username/multisensor-waterstress-gpp.git
   cd multisensor-waterstress-gpp
