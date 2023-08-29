<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-07-05 15:50:45
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-03-27 23:06:02
-->
<template>
    <div
        class="map-tools"
        id="esri-map-tool-id"
    >
        <el-radio-group
            size="small"
            v-model="curIndex"
            @change="handleSelChange"
        >
            <el-radio-button
                v-for="(item,index) in myTools"
                :key="index"
                :label="item.label"
            ><i :class="item.iconClass"></i>{{item.label}}</el-radio-button>
        </el-radio-group>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";

import VcUtils from '../../utils/base'
import { mapTools, mapToolsClosed } from "./tools";
let myTools = reactive(VcUtils.deepClone(mapTools));

const curIndex = ref(-1);

let isOpen = true;

const emits = defineEmits(["tool-change"]);

const props =  defineProps({
    
})

const handleSelChange = (e) => {
    emits("tool-change", e);
    if (e === "工具条") {
        curIndex.value = -1;
        isOpen = !isOpen;
        if (isOpen) {
            myTools.splice(0);
            mapTools.forEach((element) => {
                myTools.push(element);
            });
        } else {
            myTools.splice(0);
            myTools.push(VcUtils.deepClone(mapToolsClosed));
        }
    }
};

function releaseTool() {
    curIndex.value = -1;
}

defineExpose({
    releaseTool,
});
</script>

<style>
@import url("../../static/css/iconfont/iconfont.css");
@import url("../../static/css/iconfont2/iconfont.css");
</style>

<style scoped>
.map-tools {
    display: flex;
    z-index: 1999;
}

.map-tools .cur {
    background-color: rgb(231, 229, 229);
}

.map-tools > div {
    color: aquamarine;
}

.map-tools .transition-box {
    color: rgb(46, 44, 44) !important;
}

.map-tools span {
    position: absolute;
    right: 0px;
    bottom: 0px;
}

.transition-box {
    cursor: pointer;
    width: 120px;
    height: 30px;
    color: black;
    background-color: rgba(3, 0, 0, 0);
    text-align: center;
    color: #fff;
    padding: 8px 5px 6px;
    box-sizing: border-box;
}

.transition-box:hover {
    background-color: rgb(231, 229, 229);
}

.highlight {
    font-weight: bold;
}

.el-icon-d-arrow-right {
    border-radius: 5px 0px 0px 5px;
}

.icon-tuceng {
    border-radius: 0px 5px 5px 0px;
}

.el-icon-box {
    border-radius: 5px 5px 5px 5px;
}

.tool-name {
    margin-top: 1px;
    text-rendering: optimizeLegibility;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
        Microsoft YaHei, Arial, sans-serif;
}
</style>
