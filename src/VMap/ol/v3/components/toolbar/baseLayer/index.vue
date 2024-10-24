<!--
 * @Description:
 * @Version:
 * @Author: kangjinrui
 * @Date: 2021-09-22 19:52:30
 * @LastEditors: kangjinrui
 * @LastEditTime: 2024-10-24 17:42:57
-->
<template>
  <div class="vmap-base-layer" :style="getStyle">
    <img
      class="vmap-layer-btn"
      :src="basemapSrc"
      @mouseover="handleMouseover"
    />
    <transition name="fade" mode="out-in" appear>
      <div
        class="vmap-layers"
        v-show="showLayers"
        @mouseleave="showLayers = false"
      >
        <div v-for="(item, index) in baseLayers" :key="index" class="item">
          <label for="">{{ item.label }}</label>
          <div class="image">
            <div class="image-2">
              <img
                :src="item.children[0].image"
                alt=""
                :class="curLayerIndex === item.id ? 'active' : ''"
                @click="handleToggleLayer(item)"
              />
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, toRefs, computed, inject } from 'vue'
import basemapSrc from '../../../assets/image/toolbar/basemap.png'
import { useProps, useEmits, usePosition } from '../baseBar'

const olHandler = inject('olHandler')
const mapConfig = inject('mapConfig')

const props = defineProps({
  ...useProps,
})
const emits = defineEmits(['change'])

const getStyle = usePosition(toRefs(props))

let defaultId = mapConfig.defaultBaseLayerId
let curLayerIndex = ref(defaultId)
let showLayers = ref(false)

let picBase = ref('')
let baseLayers = ref(mapConfig.baseLayers)

const handleMouseover = () => {
  showLayers.value = true
}

const handleToggleLayer = (item) => {
  // let ids = []
  // if (layer.hasOwnProperty('children') && layer.children.length > 0) {
  //   layer.children.forEach((element) => {
  //     ids.push(element.id)
  //   })
  // } else {
  //   ids.push(layer.id)
  // }
  curLayerIndex.value = item.id
  toggleMap(item)
}

const toggleMap = (item) => {
  // olHandler.toggleBaseLayer(item)
  const layers = olHandler.getBaseLayer(item)
  layers.forEach((layer) => {
    olHandler.map.addLayer(layer)
  })
  emits('change', item.id)
}
</script>

<script>
export default {
  name: 'OlBasemap',
}
</script>
<style scoped>
.vmap-base-layer {
  padding: 2px 4px 0px 3px;
  background: white;
  border-radius: 5px;
  box-shadow: 2px 1px 3px #888888;
}

/* .layer-btn-vcmap {
  width: 34px;
  height: 34px;
  background-color: #eeeeee;
  border-radius: 5px;
  color: white;
  line-height: 35px;
  text-align: center;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAvVJREFUeF7tWkFrE1EQ/qYbvUoSxQp6sGSrtAfxLIIgKPXqTcWbQjc0XvRsz9WLDdnSq6hHj4qCCGp/gkWyi3powVY3wbubkY0m7gZsd/e9xTw7e37zvZlv5s28fXwEjd+B5ofjVsm6DqbzQG8GoKpGeAUoDoCJdRC/Cn+ED78vnPw0ACMF1IRppeXfBvE9XXiF4jDd6dRr96M9tBBgVPADZn+ToExAv+wt62OhGSsIPAzDKWUCKiveXTAWC/KxWFjCojoBrv8G4LPFeloUOr3VQED72/h0+6xEcaCBAI+zbjtO64UA1WxUXKkAOQKqVfQv7aUHqLIvPUCa4H82BcquPwf05gh0AoxTIBxWPSbjbJ9ogtWW94gJV8fZYd2+DQkwvZnlJaZPQHXFbzDzg7wgJttRecU/Q8zvRoLYJOaGtb+0tn1jamunAE2vHCq3vBYRnGGQjI1O3T6WNqvmE+B6rwk49+eVlBqBU2vuHQJa3jYRDg0C7jh2puux8RUwGoAQIBUgR0B6QNoJEK2TJmj677BMgZEMyhiUMShjUMagjMEMDMg9QO4Bhj+Ly0VILkLJEs5+EzRcIqN+BAwXSSkTYLpMTpUA44WSqgT0H0VM0gkPLnkDqawOAowjIS6W1kVARIKRcnmdBGT4hci9VLe/pBswd2QpDXX7KwToZjRlInMv0+2vVIBuRnOnNqWhbn+lAnQzmjKRuZfp9pcqLe9LXAtY2mdN7qYLyu29BsMEAYytTt2eVIGNjsALABeGEhnmy0F9+qkKaFG2Zde/SeDVGP7LjmNfVNmPym57mUALMZDNjmMfVQEtyrbitgOAKsP/GXCz60w3VPajSBpL4GcJEMYGES1lEUupOLGT7cHVz0dCDk9Tr7cEYDa+lkGXuk7tucrev4SSBkpkifE4qNvXVIKPbI2VymZ9u/wbUUmxtAGSWSK6FczXllUzP2z6o0CRdBY9vgLCDBizcQ2hrk2z4DDjKwjvwVjHBD3pztfWstjvtvYnDdnMOGaAf7EAAAAASUVORK5CYII=);
  background-repeat: no-repeat;
  background-size: 96% 96%;
  border: 2px solid #e6e6d900;
  box-shadow: 2px 1px 3px #888888;
  padding: 5px;
} */

.vmap-layer-btn {
  width: 26px;
  height: 26px;
  background-color: white;
  border-radius: 5px;
  color: white;
  /* line-height: 35px; */
  text-align: center;
  /* border: 2px solid #e6e6d900; */
  box-shadow: 2px 1px 3px #888888;
  /* padding: 2px; */
}

.vmap-layers {
  position: absolute;
  right: 40px;
  top: 0px;
  color: black;
  background-color: white;
  padding: 5px;
  border-radius: 5px;
  box-shadow: 5px 5px 8px 1px rgba(0, 0, 0, 0.3);
  font-size: 14px;
}

.vmap-layers .item {
  width: 100%;
}

.vmap-layers .image {
  display: flex;
}

.vmap-layers .image-2 {
  display: flex;
}

.vmap-layers img {
  width: 45px;
  height: 45px;
  margin: 2px;
  border: 1px solid #dddddd;
}

.vmap-layers img:hover {
  background-color: aliceblue;
  /* border: 0px solid #dddddd; */
  cursor: pointer;
}

.vmap-layers .active {
  /* border: 0px solid #dddddd; */
  cursor: pointer;
  box-shadow: 0px 0px 0px 2px #409eff;
}
</style>
