<template>
  <div :id="popupId" class="vmap-popup" :style="getStyle">
    <div v-if="showTitle" class="vmap-popuptitle">
      <span class="vmap-popuptitle-span">{{ title }}</span>
      <span class="vmap-popup-closer" @click="handleClose"></span>
    </div>
    <!-- <div :id="contentId" class="popup-content" v-html="contentHtml"> -->
    <div :id="contentId" class="popup-content" :style="getStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs ,computed} from 'vue'
import { V_THEME } from '@/VMap/global'

const props = defineProps({
  theme: {
    type: String,
    default: V_THEME.light,
  },
  popupId: {
    require: true,
    type: String,
    default: '',
  },
  showTitle: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: '标题',
  },
  content: {
    type: Object,
    default() {
      return {}
    },
  },
  contentHtml: {
    type: String,
    default: '',
  },
})

const { theme, popupId } = toRefs(props)
const emits = defineEmits(['on-close'])

let contentId = ref(popupId.value + '_content')

const handleClose = () => {
  emits('on-close')
}

const getHtml = (data) => {
  let html = '<div>'
  data.forEach((element) => {
    const { value, label } = element
    html += `<div style="display:flex;padding:5px;"><div style="width:70px;text-align:center;">${label}：</div><div style="width:auto;text-align:left;">${value}</div></div>`
  })

  html += '</div>'
  return html
}

const getStyle = computed(() => {
  if (theme.value === V_THEME.light) {
    return {}
  } else if (theme.value === V_THEME.custom) {
    return {
      background: 'rgba(255, 255, 255, 0)',
      'box-shadow': '0 0 0 rgba(0, 0, 0, 0)',
      border: '0',
    }
  }
})
</script>

<style lang="scss" scoped>
.vmap-popup {
  position: absolute;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  /* padding: 15px; */
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 150px;

  .vmap-popuptitle {
    width: 100%;
    height: 30px;
    line-height: 30px;
    background-color: #409eff;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
  }

  .vmap-popup-closer {
    text-decoration: none;
    position: absolute;
    top: 2px;
    right: 8px;
    color: white;
    font-size: 20px;
    cursor: pointer;
  }

  .vmap-popup-closer:after {
    content: '✖';
  }

  .vmap-popuptitle-span {
    position: absolute;
    color: white;
    font-weight: bold;
    top: 0px;
    left: 8px;
  }

  .popup-content {
    // padding: 10px 10px 0 10px;
    background: white;
    display: flex;
    justify-content: center;
  }
}

.vmap-popup:after,
.vmap-popup:before {
  top: 100%;
  border: solid transparent;
  content: ' ';
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}

.vmap-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 50%;
  margin-left: -10px;
}

.vmap-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 50%;
  margin-left: -11px;
}
</style>
