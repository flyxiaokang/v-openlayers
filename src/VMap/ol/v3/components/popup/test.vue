<template>
  <div style="display: none">
    <!-- Clickable label for Vienna -->
    <a
      class="overlay"
      id="vienna"
      target="_blank"
      href="https://en.wikipedia.org/wiki/Vienna"
      >Vienna</a
    >
    <div id="marker" title="Marker"></div>
    <!-- Popup -->
    <div id="popup" title="Welcome to OpenLayers"></div>
  </div>
</template>

<script>
export default {
  props: {
    overlay: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  methods: {
    handleClose() {
      this.overlay.setPosition(undefined)
      return false
    },
  },
}
</script>

<style scoped>
#marker {
  width: 20px;
  height: 20px;
  border: 1px solid #088;
  border-radius: 10px;
  background-color: #0ff;
  opacity: 0.5;
}

#vienna {
  text-decoration: none;
  color: white;
  font-size: 11pt;
  font-weight: bold;
  text-shadow: black 0.1em 0.1em 0.2em;
}

.popover-body {
  min-width: 276px;
}
</style>
