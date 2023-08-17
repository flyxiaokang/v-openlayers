<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-04-22 14:16:41
 * @LastEditors: kangjinrui
 * @LastEditTime: 2022-04-22 15:24:19
-->
<template>
    <div class="deal-server-panel">
        <div
            class="handle"
            @click="handleView"
        >
            <el-icon>
                <eleme />
            </el-icon>点我查看
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    currentCard: {
        type: Object,
        default() {
            return {};
        },
    },
});
const emit = defineEmits(["event:handleView"]);

const handleView = () => {
    emit("event:handleView", props.currentCard);
};
</script>

<style scoped>
.deal-server-panel {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 100%;
    height: 100%;
    display: flex;
}

.deal-server-panel .handle {
    margin: auto;
    padding: 10px;
}

.deal-server-panel .menu {
    float: right;
}

.deal-server-panel i {
    cursor: pointer;
    margin: 5px 7px;
    color: black;
    font-size: 22px;
}

.deal-server-panel i:hover {
    color: rgb(56, 117, 231);
}

.el-icon-star-on {
    color: rgb(66, 127, 219) !important;
}
</style>