<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-03-14 14:09:37
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-03-14 14:29:40
-->

<template>
    <div>
        <el-button-group>
            <el-button
                type="primary"
                @click="handleDraw('Point')"
            >
                <el-icon
                    class="custom-class"
                    size="22"
                >
                    <IconIcBaseline5g />
                </el-icon>
            </el-button>
            <el-button
                type="primary"
                :icon="Share"
                @click="handleDraw('LineString')"
            />
            <el-button
                type="primary"
                :icon="Delete"
                @click="handleDraw('Polygon')"
            />
            <el-button
                type="primary"
                :icon="Delete"
                @click="handleDraw('End')"
            />
            <el-button
                type="primary"
                :icon="Delete"
                @click="handleDraw('Clear')"
            />
        </el-button-group>
    </div>
</template>
<script>

export default {
    data() {
        return {
        };
    },
    methods: {
        handleDraw(type) {
            this.$emit('on-drawchange',type,false,false)
        },
    },
};
</script>
<style>
</style>