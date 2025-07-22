/***************************************************************
* Google Earth Engine Script: Sentinel-1 Radar Processing
* Author: [Palakuri chandu]
* Description: Applies Refined Lee filter on Sentinel-1 VV/VH,
*              clips to 100x100 km AOI, exports filtered images.
****************************************************************/

// ===============================
// SECTION 1: Define AOI
// ===============================

// Center point (Nagpur, replace with your coordinates if needed)
var center = ee.Geometry.Point([79.05837, 21.033656]);

// Buffer (50 km) to create 100 km × 100 km bounding box
var bufferDistance = 50000; // meters
var aoi = center.buffer(bufferDistance).bounds();

// Map visualization
Map.centerObject(aoi, 8);
Map.addLayer(aoi, {color: 'red'}, '100x100 km AOI');

// ===============================
// SECTION 2: Define Date Ranges
// ===============================

var dateRanges = [
  {start: '2019-12-02', end: '2019-12-07'},
  {start: '2019-12-08', end: '2019-12-11'},
  {start: '2019-12-12', end: '2019-12-20'},
  {start: '2019-12-22', end: '2019-12-25'},
  {start: '2019-12-26', end: '2020-12-31'},
];

// ===============================
// SECTION 3: Radar Processing Loop
// ===============================

dateRanges.forEach(function(dateRange) {
  
  var startDate = dateRange.start;
  var endDate = dateRange.end;
  var fileNameDate = startDate.replace(/-/g, '_');

  // Load Sentinel-1 ImageCollection and filter
  var filtered = ee.ImageCollection('COPERNICUS/S1_GRD')
                    .filterDate(startDate, endDate)
                    .filterBounds(aoi);
                    
  var coll_vv = filtered.select('VV');
  var coll_vh = filtered.select('VH');

  // Skip if no images found
  if (filtered.size().getInfo() === 0) {
    print('No images for: ' + startDate + ' to ' + endDate);
    return;
  }

  // Median Composite & Clip
  var vv_db = coll_vv.median().clip(aoi);
  var vh_db = coll_vh.median().clip(aoi);

  // Apply Refined Lee Filter
  var vv_lee_db = toDB(RefinedLee(toNatural(vv_db)));
  var vh_lee_db = toDB(RefinedLee(toNatural(vh_db)));

  // ===============================
  // Export to Google Drive
  // ===============================

  Export.image.toDrive({
    image: vv_lee_db,
    description: fileNameDate + '_Nagpur_vv',
    folder: 'Nagpur_vv',
    scale: 10,
    region: aoi,
    fileFormat: 'GeoTIFF',
    crs: 'EPSG:4326',
    maxPixels: 1e13
  });

  Export.image.toDrive({
    image: vh_lee_db,
    description: fileNameDate + '_Nagpur_vh',
    folder: 'Nagpur_vh',
    scale: 10,
    region: aoi,
    fileFormat: 'GeoTIFF',
    crs: 'EPSG:4326',
    maxPixels: 1e13
  });

});

// ===============================
// SECTION 4: Radar Helper Functions
// ===============================

/**
 * Converts dB image to natural (linear) scale.
 */
function toNatural(img) {
  return ee.Image(10.0).pow(img.divide(10.0));
}

/**
 * Converts image from natural scale to dB.
 */
function toDB(img) {
  return ee.Image(img).log10().multiply(10.0);
}

/**
 * Refined Lee Speckle Filter
 * Source: Guido Lemoine (GEE example)
 * Input image must be in natural units (not dB).
 */
function RefinedLee(img) {
  var weights3 = ee.List.repeat(ee.List.repeat(1,3),3);
  var kernel3 = ee.Kernel.fixed(3,3, weights3, 1, 1, false);

  var mean3 = img.reduceNeighborhood(ee.Reducer.mean(), kernel3);
  var variance3 = img.reduceNeighborhood(ee.Reducer.variance(), kernel3);

  var sample_weights = ee.List([
    [0,0,0,0,0,0,0], [0,1,0,1,0,1,0], [0,0,0,0,0,0,0],
    [0,1,0,1,0,1,0], [0,0,0,0,0,0,0], [0,1,0,1,0,1,0],
    [0,0,0,0,0,0,0]
  ]);
  var sample_kernel = ee.Kernel.fixed(7,7, sample_weights, 3,3, false);

  var sample_mean = mean3.neighborhoodToBands(sample_kernel);
  var sample_var = variance3.neighborhoodToBands(sample_kernel);

  var gradients = sample_mean.select(1).subtract(sample_mean.select(7)).abs();
  gradients = gradients.addBands(sample_mean.select(6).subtract(sample_mean.select(2)).abs());
  gradients = gradients.addBands(sample_mean.select(3).subtract(sample_mean.select(5)).abs());
  gradients = gradients.addBands(sample_mean.select(0).subtract(sample_mean.select(8)).abs());

  var max_gradient = gradients.reduce(ee.Reducer.max());
  var gradmask = gradients.eq(max_gradient).addBands(gradients.eq(max_gradient));

  var directions = sample_mean.select(1).subtract(sample_mean.select(4)).gt(sample_mean.select(4).subtract(sample_mean.select(7))).multiply(1);
  directions = directions.addBands(sample_mean.select(6).subtract(sample_mean.select(4)).gt(sample_mean.select(4).subtract(sample_mean.select(2))).multiply(2));
  directions = directions.addBands(sample_mean.select(3).subtract(sample_mean.select(4)).gt(sample_mean.select(4).subtract(sample_mean.select(5))).multiply(3));
  directions = directions.addBands(sample_mean.select(0).subtract(sample_mean.select(4)).gt(sample_mean.select(4).subtract(sample_mean.select(8))).multiply(4));
  directions = directions.addBands(directions.select(0).not().multiply(5));
  directions = directions.addBands(directions.select(1).not().multiply(6));
  directions = directions.addBands(directions.select(2).not().multiply(7));
  directions = directions.addBands(directions.select(3).not().multiply(8));

  directions = directions.updateMask(gradmask);
  directions = directions.reduce(ee.Reducer.sum());

  var sample_stats = sample_var.divide(sample_mean.multiply(sample_mean));
  var sigmaV = sample_stats.toArray().arraySort().arraySlice(0,0,5).arrayReduce(ee.Reducer.mean(), [0]);

  var rect_weights = ee.List.repeat(ee.List.repeat(0,7),3).cat(ee.List.repeat(ee.List.repeat(1,7),4));
  var diag_weights = ee.List([
    [1,0,0,0,0,0,0], [1,1,0,0,0,0,0], [1,1,1,0,0,0,0],
    [1,1,1,1,0,0,0], [1,1,1,1,1,0,0], [1,1,1,1,1,1,0], [1,1,1,1,1,1,1]
  ]);
  var rect_kernel = ee.Kernel.fixed(7,7, rect_weights, 3, 3, false);
  var diag_kernel = ee.Kernel.fixed(7,7, diag_weights, 3, 3, false);

  var dir_mean = img.reduceNeighborhood(ee.Reducer.mean(), rect_kernel).updateMask(directions.eq(1));
  var dir_var = img.reduceNeighborhood(ee.Reducer.variance(), rect_kernel).updateMask(directions.eq(1));

  dir_mean = dir_mean.addBands(img.reduceNeighborhood(ee.Reducer.mean(), diag_kernel).updateMask(directions.eq(2)));
  dir_var = dir_var.addBands(img.reduceNeighborhood(ee.Reducer.variance(), diag_kernel).updateMask(directions.eq(2)));

  for (var i = 1; i < 4; i++) {
    dir_mean = dir_mean.addBands(img.reduceNeighborhood(ee.Reducer.mean(), rect_kernel.rotate(i)).updateMask(directions.eq(2*i+1)));
    dir_var = dir_var.addBands(img.reduceNeighborhood(ee.Reducer.variance(), rect_kernel.rotate(i)).updateMask(directions.eq(2*i+1)));
    dir_mean = dir_mean.addBands(img.reduceNeighborhood(ee.Reducer.mean(), diag_kernel.rotate(i)).updateMask(directions.eq(2*i+2)));
    dir_var = dir_var.addBands(img.reduceNeighborhood(ee.Reducer.variance(), diag_kernel.rotate(i)).updateMask(directions.eq(2*i+2)));
  }

  dir_mean = dir_mean.reduce(ee.Reducer.sum());
  dir_var = dir_var.reduce(ee.Reducer.sum());

  var varX = dir_var.subtract(dir_mean.multiply(dir_mean).multiply(sigmaV)).divide(sigmaV.add(1.0));
  var b = varX.divide(dir_var);
  var result = dir_mean.add(b.multiply(img.subtract(dir_mean)));
  return(result.arrayFlatten([['sum']]));
}
 