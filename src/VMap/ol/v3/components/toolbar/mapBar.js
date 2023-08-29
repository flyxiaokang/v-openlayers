/*
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-03-14 14:52:25
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-03-14 14:52:27
 */

const toolbar = [
    {
        label: "地图选择",
        image: new URL(
            "../assets/image/toolbar/arrow.png",
            import.meta.url
        ).href,
        key: "pointer",
    },
    {
        label: "放大",
        image: new URL(
            "../assets/image/toolbar/zoomout.png",
            import.meta.url
        ).href,
        key: "zoomIn",
    },
    {
        label: "缩小",
        image: new URL(
            "../assets/image/toolbar/zoomin.png",
            import.meta.url
        ).href,
        key: "zoomOut",
    },
    {
        label: "全图",
        image: new URL(
            "../assets/image/toolbar/home.png",
            import.meta.url
        ).href,
        key: "fullExtent",
    },
    {
        label: "行政区划",
        image: new URL(
            "../assets/image/toolbar/localed.png",
            import.meta.url
        ).href,
        key: "xzq",
    },
    {
        label: "图层",
        image: new URL(
            "../assets/image/toolbar/layerC.png",
            import.meta.url
        ).href,
        key: "layer",
    },
    {
        label: "搜索",
        image: new URL(
            "../assets/image/toolbar/search123.png",
            import.meta.url
        ).href,
        key: "search",
        hasChild: true,
    },
    {
        label: "清除",
        image: new URL(
            "../assets/image/toolbar/clear.png",
            import.meta.url
        ).href,
        key: "clear",
    },
    {
        label: "测距",
        image: new URL(
            "../assets/image/toolbar/distance-new.png",
            import.meta.url
        ).href,
        key: "LineString",
    },
    {
        label: "测面",
        image: new URL(
            "../assets/image/toolbar/area-new.png",
            import.meta.url
        ).href,
        key: "Polygon",
    },
]