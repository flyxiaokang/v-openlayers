/*
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2019-10-08 17:56:55
 * @LastEditTime: 2020-07-16 11:52:29
 */
import axios from 'axios'
import {
  getToken
} from '@/utils/auth'

$.ajaxSetup({
  headers: {
    Authorization: getToken()
  }
});

export function getSingleLayerFromWMS(url) {
  let name = ''
  let extentObj = {}
  $.ajax({
    url: url + '?SERVICE=WMS&REQUEST=GetCapabilities', //'http://localhost:8080/geoserver/kjr/wms?REQUEST=GetCapabilities',
    type: 'get',
    dataType: 'xml',
    async: false,
    data: {},
    success: function (res) {
      var xmlObj = res // $.parseXML(res)
      var layers = $(xmlObj).find('Layer')
      for (let index = 0; index < layers.length; index++) {
        const element = layers[index];
        // console.log($(element).find('Name').text())
        var Names = $(element).find('Name').eq(0)
        for (let index = 0; index < Names.length; index++) {
          const element3 = Names[index];
          name = element3.innerHTML
          console.log(element3.innerHTML, name)
        }
        var BoundingBoxs = $(element).find('BoundingBox')
        for (let index = 0; index < BoundingBoxs.length; index++) {
          const element2 = BoundingBoxs[index];
          var crs = element2.getAttribute('SRS') || element2.getAttribute('CRS')
          extentObj[crs] = {
            xmax: element2.getAttribute('maxx'),
            xmin: element2.getAttribute('minx'),
            ymax: element2.getAttribute('maxy'),
            ymin: element2.getAttribute('miny')
          }
        }
      }
    },
    error: function () {
      name = 'dltb'
    }
  })
  return {
    name,
    extentObj
  }
}

export function getSingleLayerFromWMTS(url) {
  let name = ''
  let extent = {}
  $.ajax({
    url: url + '?SERVICE=WMTS&REQUEST=GetCapabilities',
    type: 'get',
    dataType: 'xml',
    async: false,
    data: {},
    success: function (res) {
      var xmlObj = res // $.parseXML(res)
      var layers = $(xmlObj).find('Layer')
      for (let index = 0; index < layers.length; index++) {
        const element = layers[index];
        for (var i = 0; i < element.children.length; i++) {
          let a = element.children[i]
          if (a.nodeName === 'ows:Identifier') {
            name = a.innerHTML
          }
          if (a.nodeName === 'style') {
            console.log(a)
          }
          if (a.nodeName === 'ows:WGS84BoundingBox') {
            let lower = []
            let upper = []
            for (let index = 0; index < a.children.length; index++) {
              const element2 = a.children[index];
              if (element2.nodeName === 'ows:LowerCorner') {
                lower = element2.innerHTML.split(' ')
              }
              if (element2.nodeName === 'ows:UpperCorner') {
                upper = element2.innerHTML.split(' ')
              }
            }
            extent['EPSG:84'] = {
              xmax: upper[0],
              xmin: lower[0],
              ymax: upper[1],
              ymin: lower[1]
            }
          }
        }
      }
    },
    error: function () {
      name = 'dltb'
    }
  })

  return {
    name,
    extent
  }
}

export function getExtentFromWMSByName(url, name) {
  let layerName = name
  let extentObj = {}
  $.ajax({
    url: url + '?SERVICE=WMS&REQUEST=GetCapabilities',
    type: 'get',
    dataType: 'xml',
    async: false,
    data: {},
    success: function (res) {
      var xmlObj = res // $.parseXML(res)
      var layers = $(xmlObj).find('Layer')
      for (let index = 0; index < layers.length; index++) {
        const element = layers[index];
        // console.log($(element).find('Name').text())
        var Names = $(element).find('Name').eq(0)
        for (let index = 0; index < Names.length; index++) {
          const element3 = Names[index];
          var name = element3.innerHTML
          // console.log(element3.innerHTML, layerName)
          if (name.trim() == layerName.trim()) {
            var BoundingBoxs = $(element).find('BoundingBox')
            for (let index = 0; index < BoundingBoxs.length; index++) {
              const element2 = BoundingBoxs[index];
              var crs = element2.getAttribute('SRS') || element2.getAttribute('CRS')
              extentObj[crs] = {
                xmax: element2.getAttribute('maxx'),
                xmin: element2.getAttribute('minx'),
                ymax: element2.getAttribute('maxy'),
                ymin: element2.getAttribute('miny')
              }
            }
          }
        }
      }
    },
    error: function () {}
  })

  return extentObj
}

export function getExtentFromWMTSByName(url, name) {
  var layerName = name
  let extentObj = {}
  $.ajax({
    url: url + '?SERVICE=WMS&REQUEST=GetCapabilities', //'http://localhost:8080/geoserver/kjr/wms?REQUEST=GetCapabilities',
    type: 'get',
    dataType: 'xml',
    async: false,
    data: {},
    success: function (res) {
      var xmlObj = res // $.parseXML(res)
      var layers = $(xmlObj).find('Layer')
      for (let index = 0; index < layers.length; index++) {
        const element = layers[index];
        // console.log($(element).find('Name').text())
        var Names = $(element).find('Name').eq(0)
        for (let index = 0; index < Names.length; index++) {
          const element3 = Names[index];
          var name = element3.innerHTML
          if (name.trim() == layerName.trim()) {
            var BoundingBoxs = $(element).find('BoundingBox')
            for (let index = 0; index < BoundingBoxs.length; index++) {
              const element2 = BoundingBoxs[index];
              var crs = element2.getAttribute('SRS') || element2.getAttribute('CRS')
              extentObj[crs] = {
                xmax: element2.getAttribute('maxx'),
                xmin: element2.getAttribute('minx'),
                ymax: element2.getAttribute('maxy'),
                ymin: element2.getAttribute('miny')
              }
            }
          }
        }
      }
    },
    error: function () {}
  })

  return extentObj
}

export function getLegendFromWMS(url, name) {
  return url.split("?")[0] + '?isShare=true&service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=' + name
}

export function getLegendFromWMTS(url, name) {
  return url.split("?")[0] + '?isShare=true&service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=' + name
}