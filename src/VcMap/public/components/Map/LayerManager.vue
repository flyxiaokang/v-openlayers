<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-10-27 16:30:42
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-04-27 17:39:38
-->
<template>
    <Draggable
        title="图层管理"
        :initTop="50"
        :initRight="20"
        :initWidth="250"
        :initHeight="450"
        @closeDraggable="handleClose"
    >
        <el-tree
            :data="data"
            :props="defaultProps"
            show-checkbox
            default-expand-all	
            @check-change="handleCheckChange"
        />
    </Draggable>
</template>
<script setup>
import {layerTreeData,layerTreeData2} from './data.js'
import Draggable from "../../export/Draggable/index.vue";

import { defineEmits } from "vue";

const emit = defineEmits(['on-checkchange','on-close'])

const defaultProps = {
    label: "label",
    children: "children",
};

// const data = layerTreeData2
const data = layerTreeData

const handleCheckChange = (data,checked,indeterminate)=>{
    emit('on-checkchange',{data,checked,indeterminate})
}

const handleClose = () =>{
    emit('on-close')
}
</script>
<style lang="">
</style>