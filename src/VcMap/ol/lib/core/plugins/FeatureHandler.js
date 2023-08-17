// import {
//     extend
// } from '../../../utils/extend'

import CircleStyle from 'ol/style/Circle';

import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

import {
    Circle,
    Fill,
    Style,
    Stroke,
    Text
} from 'ol/style';

import Geojson from 'ol/format/GeoJSON'

const layerCollection = []

const defaultCircleStyle = new Style({
    image: new Circle({
        radius: 5,
        fill: new Fill({
            color: 'red'
        })
    })
});

const defaultPolygonStyle = new Style({
    // stroke: new Stroke({
    //   color: 'blue',
    //   width: 3,
    // }),
    fill: new Fill({
        color: 'rgba(0, 0, 255, 1)',
    }),
})

const GEOMETRY_TYPE_ENUM = {
    POINT: 'Point',
    LINE_STRING: 'LineString',
    POLYGON: 'Polygon',
    CIRCLE: 'Circle',
}


export function getFeaturesFromGeojson(geojson, options = {
    style: defaultCircleStyle,
}) {
    let {
        field,
        style,
        labelField
    } = options
    let geojsonIns = new Geojson()
    const features = geojsonIns.readFeatures(geojson)

    features.forEach(feature => {
        let fieldValue = '',
            labelValue = ''
        if (field) {
            fieldValue = feature.getProperties()[field] //value取值0~255之间
            // console.log(field,fieldValue)
        }
        if (labelField) {
            labelValue = feature.getProperties()[labelField]
        }
        let type = feature.getGeometry().getType()
        switch (type) {
            case GEOMETRY_TYPE_ENUM.POINT:
                if (field) {
                    style = new Style({
                        image: new Circle({
                            radius: 15,
                            fill: new Fill({
                                color: `rgba(255, ${fieldValue}, ${fieldValue}, 1)`
                            })
                        }),
                        text: labelField ? new Text({
                            // textAlign: 'Center',
                            // textBaseline: 'Alphabetic',
                            font: '14 Arial',
                            text: labelValue.toString() || '',
                            fill: new Fill({
                                color: 'white'
                            }),
                            stroke: new Stroke({
                                color: 'orange',
                                width: '2'
                            }),
                            offsetX: 0,
                            offsetY: -10
                            // placement: placement,
                            // maxAngle: maxAngle,
                            // overflow: overflow,
                            // rotation: rotation
                        }) : null
                    })
                } else {
                    style = defaultCircleStyle
                }
                break
            case GEOMETRY_TYPE_ENUM.POLYGON:
                if (field) {
                    style = new Style({
                        // stroke: new Stroke({
                        //     color: 'blue',
                        //     width: 1,
                        // }),
                        fill: new Fill({
                            color: `rgba(255, ${fieldValue}, ${fieldValue}, 1)`,
                        }),
                    })
                } else {
                    style = defaultPolygonStyle
                }
                break
            default:
                style = defaultCircleStyle
                break
        }
        feature.setStyle(style)
    });

    return features
}

export function getFeatureClusterFromGeojson(geojson){

}


// export function createPointsByGeojson({
//     style = this.defaultCircleStyle,
//     featureId = 'point_feature_id',
//     layerId = 'point_layer_id',
//     points,
// }) {
//     if (this.layerCollection[layerId]) {
//         this.removeLayerById(layerId);
//         this.layerCollection[layerId] = null;
//     }
//     let map = this.getMap();

//     const iconFeatures = [];
//     points.forEach((point, index) => {
//         if (point.lgtd && point.lttd) {
//             const iconFeature = new ol.Feature({
//                 geometry: new ol.geom.Point([point.lgtd, point.lttd]),
//                 layerId: `${featureId}_${point.code}`,
//                 properties: point
//             });
//             iconFeature.setStyle(style);
//             iconFeatures.push(iconFeature);
//         }
//     });

//     let vectorSource = new ol.source.Vector({
//         features: iconFeatures
//     });
//     let vectorLayer = new ol.layer.Vector({
//         id: layerId,
//         source: vectorSource,
//         visible: true
//         // style:getIconStyle
//     });

//     this.layerCollection[layerId] = vectorLayer;
//     map.addLayer(vectorLayer);
// }