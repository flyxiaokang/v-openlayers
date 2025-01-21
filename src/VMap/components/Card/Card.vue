<!--
 * @Description: 
 * @Version: 
 * @Author: kangjinrui
 * @Date: 2022-04-22 14:16:25
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-04-23 22:09:34
-->
<template>
    <div class="search_result_card icon-lists">
        <el-row :gutter="10">
            <el-col
                v-for="(item,index) in listData"
                :key="index"
                class="box"
                :xs="8"
                :sm="8"
                :md="6"
                :lg="4"
                :xl="3"
            >
                <el-card
                    :class="{'box-card':true,'active': item.checked ? true : false}"
                    shadow="always"
                >
                    <div
                        slot="header"
                        class="clearfix"
                    >
                        <span class="card-title"><i class="el-icon-menu"></i>{{ item.name }}</span>
                    </div>

                    <el-form
                        :label-position="'right'"
                        label-width="80px"
                        :model="item"
                    >
                        <!-- <el-form-item label="作者:">
                            <span>{{ item.provider }}</span>
                        </el-form-item> -->
                        <el-form-item label="创建日期:">
                            {{ item.date }}
                        </el-form-item>
                    </el-form>
                </el-card>

                <div class="mask">
                    <CardHandle :currentCard="item" v-bind="$attrs" />
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import CardHandle from "./Handler.vue";

defineProps({
    listData:{
        type:Array,
        default(){
            return []
        }
    }
})
</script>


<style scoped>
.search_result_card {
    width: 100%;
}

.search_result_card .abstact {
    margin-top: 10px;
}

.search_result_card .active {
    /* border: 2px solid #6eebe4; */
    background-color: #cde4e9;
}

.result-item {
    width: 100%;
    height: 100px;
    background-color: aqua;
}

.box {
    position: relative;
    overflow: hidden;
    z-index: 1;
}

.box .card-title{
    font-size: 28px;
}

/* .box i, */
.box .mask {
    display: block;
    width: calc(100% - 10px);
    border-radius: 5px;
    color: black;
}

.box .mask {
    position: absolute;
    height: 250px;
    margin-top: 5px;
    bottom: 5px;
    top: 355px;
    /* height: 255px; */
    z-index: 2;
    background: hsl(206deg 100% 73% / 44%);
    /* color: #fff; */
    /* text-align: center; */
    /* line-height: 350px; */
    -webkit-transition: top 0.2s ease-in;
    -moz-transition: top 0.2s ease-in;
    transition: top 0.2s ease-in;
    border-radius: 5px;
    cursor: pointer;
}

.box:hover > .mask {
    top: 0;
}

.box .mask .title {
    width: 100%;
    text-align: center;
    margin-top: 0px;
    font-size: 24px;
    margin-bottom: 25px;
    height: 250px;
    line-height: 250px;
    cursor: pointer;
    word-wrap: break-word;
}

.box .mask .title:hover {
    color: rgb(66, 127, 219);
}

.box .mask .deal {
    margin-top: 10px;
    margin-left: 110px;
}

.box .bottom {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    position: absolute;
    left: 0px;
    bottom: 35px;
    border-top: 1px solid #dddddd;
    color: rgb(66, 127, 219);
}

.box i {
    /* width: 100px;
    height: 40px;
    line-height: 40px;
    padding-left: 10px; */
    font-size: 14px;
    margin-right: 10px;
}

/deep/ .el-card__header {
    padding: 8px 6px;
    background-color: aliceblue;
    font-size: 14px;
}

/deep/ .el-card__body {
    padding: 15px 2px;
}

/deep/ .el-card__header .clearfix {
    width: 180px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}
</style>

<style scoped>
.el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.el-col {
    border-radius: 4px;
}

.bg-purple-dark {
    background: #99a9bf;
}

.bg-purple {
    background: #d3dce6;
}

.bg-purple-light {
    background: #e5e9f2;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}

.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}

.text {
    font-size: 14px;
}

/* .item {
    padding: 18px 0;
  } */

.box-card {
    width: 100%;
    height: 250px;
    margin: 5px 0px;
    background-color: hsl(180deg 36% 75%);
    color: black;
}
</style>