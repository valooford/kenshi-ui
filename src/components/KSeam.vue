<script lang="ts">
import { isCharacterId } from '@/shared/utils'

import CharacterInventory from './CharacterInventory.vue'
import KRegistry from './KRegistry.vue'

export default {
  components: { CharacterInventory, KRegistry },
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
    <KRegistry v-if="s.seam.registry" />
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
  gap: 4rem;
  padding: 56rem;
}

@media (max-width: 700px) {
  .seam {
    flex-direction: column;
    padding: 80rem 3% 0;
  }
}
</style>
