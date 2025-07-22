/************************************************************
 * AOI Creation Script - Google Earth Engine
 * 
 * 📍 Purpose:
 * Creates 10km buffer (20×20 km AOI box) around center points
 * for Nagpur, Jodhpur, and Barrackpore.
 * 
 * 📦 Output:
 * AOIs exported as Shapefiles to Google Drive.
 * 
 * 🗺️ AOI Cities:
 * - Nagpur
 * - Jodhpur
 * - Barrackpore
 ************************************************************/

// === BUFFER DISTANCE (meters) ===
var bufferDistance = 10000; // 10 km radius → 20x20 km AOI

// === DEFINE CENTER POINTS ===
var centers = {
  'Nagpur': ee.Geometry.Point([79.05837, 21.033656]),
  'Jodhpur': ee.Geometry.Point([72.9954576, 26.253559]),
  'Barrackpore': ee.Geometry.Point([88.428009, 22.758522])
};

// === LOOP THROUGH CITIES ===
Object.keys(centers).forEach(function(city) {
  
  var center = centers[city];
  
  // Create square AOI from buffered point
  var aoi = center.buffer(bufferDistance).bounds();
  
  // Convert to FeatureCollection for export
  var aoiFeature = ee.Feature(aoi).set('City', city);
  var aoiCollection = ee.FeatureCollection([aoiFeature]);

  // Add to map for visual reference
  Map.addLayer(aoi, {color: 'green'}, city + ' AOI');

  // Export shapefile to Google Drive
  Export.table.toDrive({
    collection: aoiCollection,
    description: city + '_AOI_10x10km',
    folder: 'SHAPE_FILES(10x10KM)',
    fileFormat: 'SHP'
  });
});

// === OPTIONAL: CENTER MAP VIEW ===
Map.centerObject(centers['Nagpur'], 6);
