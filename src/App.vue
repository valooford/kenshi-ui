<script lang="ts">
import AudioLayer from './layers/AudioLayer.vue'
import DataLayer from './layers/DataLayer.vue'
import InterfaceLayer from './layers/InterfaceLayer.vue'

export default {
  components: { DataLayer, InterfaceLayer, AudioLayer },
}
</script>

<template>
  <DataLayer>
    <AudioLayer>
      <InterfaceLayer />
    </AudioLayer>
  </DataLayer>
</template>

<style scoped></style>
