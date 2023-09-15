<!--
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2021-09-22 14:52:30
 * @LastEditors: kangjinrui
 * @LastEditTime: 2023-04-06 22:01:51
-->
<template>
    <div class="base-map-container">
        <div class="layers-btn" @mouseover="handleMouseover"></div>
        <transition name="fade" mode="out-in" appear>
            <div class="layers-container" v-show="showLayers" @mouseleave="showLayers = false">
                <div
                    v-for="(item, index) in baseLayers"
                    :key="index"
                    class="item"
                >
                    <label for="">{{ item.label }}</label>
                    <div class="image">
                        <div class="image-2">
                            <img
                                v-for="(layer, layerIndex) in item.children"
                                :key="layerIndex"
                                :src="
                                    (layer.image && picBase + layer.image) ||
                                    (layer.children
                                        ? picBase + layer.children[0].image
                                        : '')
                                "
                                :class="
                                    curLayerIndex ===
                                        `${index}_${layerIndex}` ||
                                    layer.visible === '1'
                                        ? 'active'
                                        : ''
                                "
                                alt=""
                                @click="
                                    handleToggleLayer(
                                        layer,
                                        `${index}_${layerIndex}`
                                    )
                                "
                            />
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { getConfig } from '@/VMap/ol/config'

export default {
    data() {
        return {
            curLayerIndex: '0_0',
            baseLayers: [],
            showLayers: false,
        }
    },
    computed: {},
    watch: {},
    created() {
        this.picBase = '' //getPicture();
        this.baseLayers = getConfig().baseLayers
    },
    mounted() {
        // this.initEvent();
    },
    methods: {
        handleMouseover() {
            console.log(1)
            this.showLayers = true
        },

        // initEvent() {
        //     $('.base-map-container').hover(
        //         () => {
        //             $('.layers-container').fadeIn()
        //             $('.layers-btn').fadeOut()
        //         },
        //         () => {
        //             $('.layers-container').fadeOut()
        //             $('.layers-btn').fadeIn()
        //         }
        //     )
        // },
        toggle() {
            this.isCollapse = !this.isCollapse
        },
        handleClick(item, index) {
            this.curToolIndex = index
            let { key } = item
            this.$emit('event:activeTool', key)
        },
        handleToggleLayer(layer, index) {
            let ids = []
            if (layer.hasOwnProperty('children') && layer.children.length > 0) {
                layer.children.forEach((element) => {
                    ids.push(element.id)
                })
            } else {
                ids.push(layer.id)
            }
            this.curLayerIndex = index
            this.$emit('on-toggle', ids)
        },
    },
}
</script>
<style scoped>
.base-map-container {
    position: absolute;
    top: 22px;
    right: 20px;
}

.layers-btn {
    width: 30px;
    height: 30px;
    background-color: #eeeeee;
    border-radius: 5px;
    color: white;
    line-height: 35px;
    text-align: center;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAvVJREFUeF7tWkFrE1EQ/qYbvUoSxQp6sGSrtAfxLIIgKPXqTcWbQjc0XvRsz9WLDdnSq6hHj4qCCGp/gkWyi3powVY3wbubkY0m7gZsd/e9xTw7e37zvZlv5s28fXwEjd+B5ofjVsm6DqbzQG8GoKpGeAUoDoCJdRC/Cn+ED78vnPw0ACMF1IRppeXfBvE9XXiF4jDd6dRr96M9tBBgVPADZn+ToExAv+wt62OhGSsIPAzDKWUCKiveXTAWC/KxWFjCojoBrv8G4LPFeloUOr3VQED72/h0+6xEcaCBAI+zbjtO64UA1WxUXKkAOQKqVfQv7aUHqLIvPUCa4H82BcquPwf05gh0AoxTIBxWPSbjbJ9ogtWW94gJV8fZYd2+DQkwvZnlJaZPQHXFbzDzg7wgJttRecU/Q8zvRoLYJOaGtb+0tn1jamunAE2vHCq3vBYRnGGQjI1O3T6WNqvmE+B6rwk49+eVlBqBU2vuHQJa3jYRDg0C7jh2puux8RUwGoAQIBUgR0B6QNoJEK2TJmj677BMgZEMyhiUMShjUMagjMEMDMg9QO4Bhj+Ly0VILkLJEs5+EzRcIqN+BAwXSSkTYLpMTpUA44WSqgT0H0VM0gkPLnkDqawOAowjIS6W1kVARIKRcnmdBGT4hci9VLe/pBswd2QpDXX7KwToZjRlInMv0+2vVIBuRnOnNqWhbn+lAnQzmjKRuZfp9pcqLe9LXAtY2mdN7qYLyu29BsMEAYytTt2eVIGNjsALABeGEhnmy0F9+qkKaFG2Zde/SeDVGP7LjmNfVNmPym57mUALMZDNjmMfVQEtyrbitgOAKsP/GXCz60w3VPajSBpL4GcJEMYGES1lEUupOLGT7cHVz0dCDk9Tr7cEYDa+lkGXuk7tucrev4SSBkpkifE4qNvXVIKPbI2VymZ9u/wbUUmxtAGSWSK6FczXllUzP2z6o0CRdBY9vgLCDBizcQ2hrk2z4DDjKwjvwVjHBD3pztfWstjvtvYnDdnMOGaAf7EAAAAASUVORK5CYII=);
    background-repeat: no-repeat;
    background-size: 96% 96%;
    border: 1.5px solid #e6e6d900;
    box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 52%);
    padding: 4px;
}

.layers-container {
    position: absolute;
    right: 0px;
    top: 0px;
    color: black;
    background-color: white;
    padding: 5px;
    border-radius: 5px;
    box-shadow: 5px 5px 8px 1px rgba(0, 0, 0, 0.3);
}

.layers-container .item {
    width: 100%;
}

.layers-container .image {
    display: flex;
}

.layers-container .image-2 {
    display: flex;
}

.layers-container img {
    width: 50px;
    height: 50px;
    margin: 5px;
    border: 4px solid #dddddd;
}

.layers-container img:hover {
    background-color: aliceblue;
    /* border: 0px solid #dddddd; */
    cursor: pointer;
}

.layers-container .active {
    /* border: 0px solid #dddddd; */
    cursor: pointer;
    box-shadow: 0px 0px 0px 2px #409eff;
}
</style>
