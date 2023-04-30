<script lang="ts">
import DataLayer from './layers/DataLayer.vue'
import InterfaceLayer from './layers/InterfaceLayer.vue'

export default {
  components: { DataLayer, InterfaceLayer },
}
</script>

<template>
  <DataLayer>
    <InterfaceLayer />
  </DataLayer>
</template>

<style scoped></style>
