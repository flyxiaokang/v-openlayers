/*
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2022-01-21 10:19:06
 * @LastEditors: kangjinrui
 * @LastEditTime: 2022-04-28 15:56:55
 */

const timer = 100
export function calHeight(vue, offset = 0) {
    setTimeout(() => {
        vue.$nextTick(() => {
            // 使用getBoundingClientRect接口获取自适应区域的高度，设置为表格高度，可达到自适应高度和固定表头的效果。
            if (vue.$refs['container']) {
                const rect = vue.$refs.container.getBoundingClientRect()
                vue.tableMaxHeight = rect.height + offset
            }
        })
    }, timer)
}

/**
 *  
 * @param {*} param0 
 */
export function calcHeight({
    vue,
    parentRefName = 'container',
    offset = 0,
    tableHeightName = 'tableMaxHeight'
}) {
    setTimeout(() => {
        vue.$nextTick(() => {
            if (vue.$refs[parentRefName]) {
                const rect = vue.$refs[parentRefName].getBoundingClientRect()
                vue[tableHeightName] = rect.height + offset
            }
        })
    }, timer);
}