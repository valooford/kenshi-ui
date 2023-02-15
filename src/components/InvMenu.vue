<script lang="ts">
import { CELL_SIZE } from './constants'
import InvItem from './InvItem.vue'
import InvInventory from './InvInventory.vue'

export default {
  components: { InvItem, InvInventory },
  data() {
    return { cellSize: CELL_SIZE }
  },
  methods: {
    emulateDefaultCursorEverywhere(e: DragEvent) {
      e.preventDefault()
    },
  },
  mounted() {
    document.addEventListener('dragover', this.emulateDefaultCursorEverywhere)
  },
  unmounted() {
    document.removeEventListener('dragover', this.emulateDefaultCursorEverywhere)
  },
}
</script>

<template>
  <div class="menu" :style="{ '--cell-size': `${cellSize}px` }">
    <InvInventory />
    <div class="itemsContainer">
      <InvItem :w="3" :h="3" img="src/assets/1288-gamedata.base.686-gamedata.base.png" />
      <InvItem :w="7" :h="1" img="src/assets/52295-rebirth.mod.913-gamedata.base.png" />
      <InvItem :w="1" :h="3" img="src/assets/Dried Fish.png" />
    </div>
  </div>
</template>

<style scoped>
.menu {
  display: flex;
}
.itemsContainer {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: calc(var(--cell-size) * 9);
  overflow-y: scroll;
  background-color: #f8f8f8;
  user-select: none;
}
</style>
