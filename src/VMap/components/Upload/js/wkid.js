/*
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-11-21 15:44:03
 * @LastEditors: kangjinrui
 * @LastEditTime: 2022-11-21 15:45:52
 */
/*
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2019-12-26 14:52:14
 * @LastEditTime: 2020-11-23 16:28:10
 */

const WKT2WKID = [{
    wkt: 'PROJCS["CGCS2000_3_Degree_GK_Zone_35",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",35500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",105.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]',
    wkid: '4523'
}, {
    wkt: 'PROJCS["CGCS2000_3_Degree_GK_Zone_36",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",36500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",108.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]',
    wkid: '4524'
}, {
    wkt: 'PROJCS["CGCS2000_3_Degree_GK_Zone_37",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",37500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",111.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]',
    wkid: '4525'
}, {
    wkt: 'PROJCS["CGCS2000_3_Degree_GK_Zone_38",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",38500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",114.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]',
    wkid: '4526'
}, {
    wkt: 'PROJCS["CGCS2000_3_Degree_GK_Zone_39",GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]],PROJECTION["Gauss_Kruger"],PARAMETER["False_Easting",39500000.0],PARAMETER["False_Northing",0.0],PARAMETER["Central_Meridian",117.0],PARAMETER["Scale_Factor",1.0],PARAMETER["Latitude_Of_Origin",0.0],UNIT["Meter",1.0]]',
    wkid: '4527'
}, {
    wkt: 'GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]',
    wkid: '4326'
}, {
    wkt: 'GEOGCS["GCS_China_Geodetic_Coordinate_System_2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]',
    wkid: '4490'
}, {
    wkt: 'GEOGCS["China Geodetic Coordinate System 2000", DATUM["China 2000", SPHEROID["CGCS2000", 6378137.0, 298.257222101, AUTHORITY["EPSG","1024"]], AUTHORITY["EPSG","1043"]], PRIMEM["Greenwich", 0.0, AUTHORITY["EPSG","8901"]], UNIT["degree", 0.017453292519943295], AXIS["Geodetic longitude", EAST], AXIS["Geodetic latitude", NORTH], AUTHORITY["EPSG","4490"]]',
    wkid: '4490'
}, {
    wkt: 'GEOGCS["China Geodetic Coordinate System 2000",DATUM["D_China_2000",SPHEROID["CGCS2000",6378137,298.257222101]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]]',
    wkid: '4490'
}, {
    wkt: 'GEOGCS["China Geodetic Coordinate System 2000",DATUM["China 2000",SPHEROID["CGCS2000",6378137.0,298.257222101]],PRIMEM["Greenwich",0.0],UNIT["degree",0.0174532925199433]]',
    wkid: '4490'
}]

export default WKT2WKID