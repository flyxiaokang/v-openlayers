/*
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2024-12-20 18:43:34
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-12-20 18:43:36
 */
export function geojsonToWkt(geojson) {
  switch (geojson.type) {
    case 'Point':
      return `POINT (${geojson.coordinates.join(' ')})`;
    case 'MultiPoint':
      return `MULTIPOINT (${geojson.coordinates.map(c => c.join(' ')).join(', ')})`;
    case 'LineString':
      return `LINESTRING (${geojson.coordinates.map(c => c.join(' ')).join(', ')})`;
    case 'MultiLineString':
      return `MULTILINESTRING (${geojson.coordinates.map(line => `(${line.map(c => c.join(' ')).join(', ')})`).join(', ')})`;
    case 'Polygon':
      return `POLYGON (${geojson.coordinates
        .map(ring => `(${ring.map(c => c.join(' ')).join(', ')})`)
        .join(', ')})`;
    case 'MultiPolygon':
      return `MULTIPOLYGON (${geojson.coordinates
        .map(polygon => `(${polygon.map(ring => `(${ring.map(c => c.join(' ')).join(', ')})`).join(', ')})`)
        .join(', ')})`;
    case 'GeometryCollection':
      return geojson.geometries.map(g => `GEOMETRYCOLLECTION (${geojsonToWkt(g)})`).join(', ');
    default:
      throw new Error(`Unsupported GeoJSON type: ${geojson.type}`);
  }
}
 
// // 示例使用
// const geojson = {
//   type: "Point",
//   coordinates: [125.6, 10.1]
// };
 
// const wkt = geojsonToWkt(geojson);
// console.log(wkt); // 输出: POINT (125.6 10.1)