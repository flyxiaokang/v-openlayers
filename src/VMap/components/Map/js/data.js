/*
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-10-28 17:38:59
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-08-25 15:15:42
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
        label: 'geoserverwmts',
        url: 'http://localhost:8080/geoserver/gwc/service/wmts?layer=kjr%3AChina&style=&tilematrixset=EPSG%3A3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng',
        url: 'http://localhost:8080/geoserver/gwc/service/wmts?layer=kjr%3Acountries&style=&tilematrixset=EPSG%3A4326&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng',
        serverType: 'geoserverwmts'
    }]
}, {
    id: '5',
    label: 'supermapwmts',
    children: [{
        id: '4-1',
        label: 'supermapwmts',
        url: "http://10.1.3.199:8090/iserver/services/dem30m/wmts100?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetTile&LAYER=dem30m&STYLE=Default&FORMAT=image/png&TILEMATRIXSET=Custom_dem30m",
        serverType: 'supermapwmts'
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
    label: 'geoserverwmts',
    children: [{
        id: '2-1',
        label: 'geoserverwmts',
        url: 'http://localhost:8080/geoserver/gwc/service/wmts?layer=kjr%3Acountries&style=&tilematrixset=EPSG%3A3857&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image%2Fpng',
        serverType: 'geoserverwmts'
    }]
}, {
    id: '3',
    label: 'arcgisimagetile',
    children: [{
        id: '3-1',
        label: 'arcgisimagetile',
        url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Terrain_Base/MapServer',
        serverType: 'arcgisimagetile'
    }]
}, {
    id: '4',
    label: 'arcgisimage',
    children: [{
        id: '4-1',
        label: 'arcgisimage',
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer',
        serverType: 'arcgisimage'
    }, {
        id: '4-2',
        label: 'arcgisfeature',
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer/0',
        serverType: 'arcgisfeature'
    }]
}]