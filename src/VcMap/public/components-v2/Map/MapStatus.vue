<!--
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2021-10-19 08:57:07
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-03-27 15:44:29
-->
<template>
    <div class="map-status-bar">
        <div style="width:150px;text-align: left;">
            经度：{{ latlon[0] }}
        </div>
        <div style="width:150px;text-align: left;">
            纬度：{{ latlon[1] }}
        </div>
    </div>
</template>

<script>
export default {
    name: "MapStatus",
    components: {},
    props: {
        latlon: {
            type: Array,
            default() {
                return [0, 0];
            },
        },
    },
    data() {
        return {
            curLatlon: [...this.latlon],
        };
    },
};
</script>

<style scoped>
.map-status-bar {
    display: flex;
	justify-content: flex-end;
    position: absolute;
    width: 100%;
    height: 30px;
    line-height: 30px;
    left: 0px;
    bottom: 0px;
    font-size: 14px;
    background-color: #ebeef58c;
    border-radius: 5px;
    text-align: right;
	font-family: monospace;
    user-select:none;
}

@media screen and (max-width: 1366px) {
    .map-status-bar {
        font-size: 12px;
    }
}
</style>

