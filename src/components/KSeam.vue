<script lang="ts">
import { isCharacterId } from '@/shared/utils'

import CharacterInventory from './CharacterInventory.vue'

export default {
  components: { CharacterInventory },
  inject: ['store', 'dispatch'],
  data() {
    return { isCharacterId }
  },
  computed: {
    s() {
      return this.store as IStore
    },
    d() {
      return this.dispatch as IDispatch
    },
  },
}
</script>

<template>
  <div class="seam" :key="String(s.seam.related)">
    <CharacterInventory v-if="isCharacterId(s.seam.main)" :id="s.seam.main" :key="s.seam.main" />
    <CharacterInventory
      v-if="isCharacterId(s.seam.related)"
      :id="s.seam.related"
      :key="s.seam.related"
    />
  </div>
</template>

<style scoped>
.seam {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: flex-start;
  gap: 4px;
  padding: 56px;
}
</style>
