// ------------------------------------------------------------------
// Sentinel-2 Vegetation Indices Export for Nagpur AOI (100x100 km)
// ------------------------------------------------------------------

// Define Area of Interest (AOI): 100 km x 100 km bounding box around Jodhpur
var center = ee.Geometry.Point([79.05837, 21.033656]);
var bufferDistance = 50000;  // 50 km in meters
var aoi = center.buffer(bufferDistance).bounds();
Map.centerObject(aoi, 8);
Map.addLayer(aoi, {color: 'red'}, '100x100 km AOI');

// Visualization palettes
var palette = [
  'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718',
  '74A901', '66A000', '529400', '3E8601', '207401', '056201',
  '004C00', '023B01', '012E01', '011D01', '011301'
];
var ndvi_vis = {min: 0, max: 1.0, palette: palette};
var rgb_vis = {min: 0, max: 3000, bands: ['B8', 'B4', 'B3']};
var evi_vis = {min: 0, max: 1.0, palette: palette};

// NDVI band addition
function addNDVI(image) {
  var ndvi = image.normalizedDifference(['B8', 'B4']).rename('nd');
  return image.addBands(ndvi);
}

// Cloud masking function using QA60 band
function cloudmask(image) {
  var qa = image.select('QA60');
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
              .and(qa.bitwiseAnd(cirrusBitMask).eq(0));
  return mask;
}

// Define time ranges
var dateRanges = [
  {start: '2019-06-06', end: '2019-06-10'},
  {start: '2019-06-11', end: '2019-06-15'},
  {start: '2019-06-16', end: '2019-06-20'},
  {start: '2019-07-18', end: '2019-10-13'},
  {start: '2019-10-14', end: '2019-11-04'},
];

// Main processing loop
dateRanges.forEach(function(dateRange) {
  var startDate = dateRange.start;
  var endDate = dateRange.end;
  var fileNameDate = startDate.replace(/-/g, '_');

  // Load Sentinel-2 image collection
  var filtered = ee.ImageCollection("COPERNICUS/S2_HARMONIZED")
                    .filterDate(startDate, endDate)
                    .filterBounds(aoi);

  var ndvi = filtered.map(addNDVI);
  var greenest = ndvi.qualityMosaic('nd');
  var clipped = greenest.clip(aoi);
  Map.addLayer(clipped, rgb_vis, 'Greenest ' + startDate);

  var cldmask = cloudmask(clipped);

  // NDVI calculation
  var ndvi1 = clipped.normalizedDifference(["B8", "B4"]);
  var ndvi_int = ndvi1.multiply(1000).int16();

  // LSWI calculation
  var lswi = clipped.normalizedDifference(["B8", "B12"]);
  var lswi_int = lswi.multiply(1000).int16();

  // EVI calculation
  var nir = clipped.select('B8');
  var red = clipped.select('B4');
  var blue = clipped.select('B2');
  var denominator = nir.add(red.multiply(6)).subtract(blue.multiply(7.5)).add(1);
  var evi = nir.subtract(red).divide(denominator).multiply(2.5).rename('EVI');
  var evi_int = evi.multiply(1000).int16();

  // Export NDVI
  Export.image.toDrive({
    image: ndvi_int,
    description: fileNameDate + '_Nagpur_H_NDVI',
    scale: 10,
    folder: 'NAGPUR_HARMONIZED_NDVI',
    region: aoi,
    maxPixels: 1e13,
    fileFormat: 'GeoTIFF',
    crs: 'EPSG:4326'
  });

  // Export LSWI
  Export.image.toDrive({
    image: lswi_int,
    description: fileNameDate + '_Nagpur_H_LSWI',
    scale: 20,
    folder: 'NAGPUR_HARMONIZED_LSWI',
    region: aoi,
    maxPixels: 1e13,
    fileFormat: 'GeoTIFF',
    crs: 'EPSG:4326'
  });

  // Export EVI
  Export.image.toDrive({
    image: evi_int,
    description: fileNameDate + '_Nagpur_H_EVI',
    scale: 10,
    folder: 'NAGPUR_HARMONIZED_EVI',
    region: aoi,
    maxPixels: 1e13,
    fileFormat: 'GeoTIFF',
    crs: 'EPSG:4326'
  });

  // Optional: Export all bands
  // var exportImage = clipped.select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B11', 'B12']);
  // Export.image.toDrive({...});
});
