<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2023-04-19 15:03:21
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-04-20 21:40:29
-->

<template>
    <div :class="tableClass" style="width: 100%; height: 100%">
        <el-table
            :data="tableData"
            :height="tableHeight"
            style="width: 100%"
            :show-header="showHeader"
            border
            :header-cell-style="handleHeaderStyle"
        >
            <!-- <el-table-column
                type="index"
                label="序号"
                width="80"
                align="center"
            >
            </el-table-column> -->
            <el-table-column
                v-for="(item, index) in tableHeader"
                :type="item.type || ''"
                :key="index"
                :prop="item.value"
                :label="item.label"
                :width="item.width || 'auto'"
                :align="item.align || 'center'"
                show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
                v-for="(column, index) in tableHandler"
                :key="index"
                :label="column.label"
                align="center"
            >
                <template #default="{ row }">
                    <template v-for="(item, index) in column.children">
                        <el-icon
                            v-if="item.type === 'icon'"
                            @click="handleClick(item, row)"
                        >
                            <component :is="item.value"></component>
                        </el-icon>

                        <el-button
                            v-else
                            link
                            @click="handleClick(item, row)"
                            >{{ item.label }}</el-button
                        >
                    </template>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            v-if="showPagination"
            small
            background
            layout="prev, pager, next"
            :total="1000"
            style="margin: 5px 0; float: right"
        />
    </div>
</template>

<script setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { layoutUpdate } from '@/VcMap/public/utils/advanced/layout'

const props = defineProps({
    showPagination: {
        type: Boolean,
        default: false,
    },
    showHeader: {
        type: Boolean,
        default: false,
    },
    tableData: {
        type: Array,
        default() {
            return []
        },
    },
    tableHeader: {
        type: Array,
        default() {
            return []
        },
    },
    tableHandler: {
        type: Array,
        default() {
            return []
        },
    },
})

const emits = defineEmits(['on-handler'])

const { tableData, tableHeader, tableHandler, showPagination } = toRefs(props)

let tableClass = ref('table-' + parseInt(Math.random() * 10e8))
let tableHeight = ref(100)
const handleHeaderStyle = () => {
    return {
        'background-color': '#e4f0fd',
        color: '#547d9b',
    }
}

onMounted(() => {
    layoutUpdate({ tableHeight, container: tableClass.value, offset: -30 })
})

const handleClick = (item, row) => {
    emits('on-handler', item.method, row)
}
</script>

<script>
    export default {
        name:'VTable'
    }
</script>
<style lang="scss" scoped>
.el-icon {
    cursor: pointer;
    font-size: 18px;
    margin-right: 5px;
}
</style>
