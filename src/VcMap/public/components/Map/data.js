/*
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-10-28 17:38:59
 * @LastEditors: kangjinrui
 * @LastEditTime: 2022-10-31 11:19:07
 */
// 4326
export const layerTreeData2 = [{
    id: '1',
    label: 'wms',
    children: [{
        id: '1-1',
        label: 'wms1',
        url: 'http://localhost:8080/geoserver/jinshui/wms?layers=jinshui:BAS1',
        serverType: 'wms'
    }]
}, {
    id: '2',
    label: 'wmts',
    children: [{
        id: '2-1',
        label: 'geoserverWmts',
        url: 'http://localhost:8080/geoserver/gwc/service/wmts?layer=kjr%3AChina&style=&tilematrixset=EPSG%3A3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng',
        url: 'http://localhost:8080/geoserver/gwc/service/wmts?layer=kjr%3Acountries&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng',
        serverType: 'geoserverWmts'
    }]
}, {
    id: '5',
    label: 'superMapWmts',
    children: [{
        id: '4-1',
        label: 'superMapWmts',
        url: "http://10.1.3.199:8090/iserver/services/dem30m/wmts100?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=dem30m&STYLE=Default&FORMAT=image/png&TILEMATRIXSET=Custom_dem30m",
        serverType: 'superMapWmts'
    }]
}]

// 3857
export const layerTreeData = [{
    id: '1',
    label: 'wms',
    children: [{
        id: '1-1',
        label: 'wms1',
        url: 'http://localhost:8080/geoserver/jinshui/wms?layers=jinshui:BAS1',
        serverType: 'wms'
    }]
}, {
    id: '2',
    label: 'geoserverWmts',
    children: [{
        id: '2-1',
        label: 'geoserverWmts',
        url: 'http://localhost:8080/geoserver/gwc/service/wmts?layer=kjr%3Acountries&style=&tilematrixset=EPSG%3A3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng',
        serverType: 'geoserverWmts'
    }]
}, {
    id: '3',
    label: 'arcgis_mapTile',
    children: [{
        id: '3-1',
        label: 'arcgis_mapTile',
        url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer',
        serverType: 'arcgis_mapTile'
    }]
}, {
    id: '4',
    label: 'arcgis_mapImage',
    children: [{
        id: '4-1',
        label: 'arcgis_mapImage',
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
        serverType: 'arcgis_mapImage'
    }, {
        id: '4-2',
        label: 'arcgis_featureLayer',
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0',
        serverType: 'arcgis_featureLayer'
    }]
}]