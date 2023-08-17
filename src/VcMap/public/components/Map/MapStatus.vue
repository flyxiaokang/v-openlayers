<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-04-19 14:32:40
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-03-16 22:30:32
-->

<template>
    <div class="map-status-bar">
        <div class="lat" style="width:150px;text-align: left;">
            {{ parseLonLat[0] }}
        </div>
        <div class="lon" style="width:150px;">
            {{ parseLonLat[1] }}
        </div>
    </div>
</template>


<script setup>
import { computed } from "vue";
import VcUtils from '../../utils/base'

const props = defineProps({
    latlon: {
        type: Array,
        default() {
            return [-1, -1];
        },
    },
});


const parseLonLat = computed(() => {
    let [lon, lat] = props.latlon;
    let labelX = "X ";
    let labelY = "Y ";
    let unit = "米";
    if (lon < 180 && lon > -180) {
        labelX = "经度 ";
        labelY = "纬度 ";
        unit = "";
    }
    if (VcUtils.isString(lon) || VcUtils.isString(lat)) {
        return [
            labelX + parseFloat(lon).toFixed(4) + unit,
            labelY + parseFloat(lat).toFixed(4) + unit,
        ];
    } else {
        return [labelX + lon.toFixed(4) + unit, labelY + lat.toFixed(4) + unit];
    }
});
</script>


<style scope>
@import url("../../static/css/toolbar.css");
</style>