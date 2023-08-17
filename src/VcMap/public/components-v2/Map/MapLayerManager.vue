<!--
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2021-09-22 14:52:30
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-03-16 09:14:23
-->
<template>
    <el-tree
        :data="treeData"
        show-checkbox
        node-key="id"
        :default-expand-all="false"
        :default-checked-keys="checkedArr"
        :default-expanded-keys="checkedArr"
        :props="defaultProps"
        @check-change="checkedChange"
    />
</template>

<script>
import { getConfig } from "@/VcMap/ol/config";
export default {
    props: {
        defaultChecked: {
            type: Array,
            default() {
                return [];
            },
        },
    },
    data() {
        return {
            checkedArr: [],
            defaultProps: {
                children: "children",
                label: "label",
            },
            treeData: [],
        };
    },
    mounted() {
        // console.log("mapConfig...", getConfig());
        this.checkedArr = this.defaultChecked.map((e) => {
            return e;
        });
        this.treeData = getConfig().businessLayers;
    },
    methods: {
        checkedChange(data, checked, indeterminate) {
            this.$emit("on-checkchange", data, checked, indeterminate);
        },
        closeLayerPanel() {
            this.$emit("on-close");
        },
    },
};
</script>
<style scoped>
:deep(.el-tree) {
    height: 100%;
    overflow-y: auto;
}
</style>
