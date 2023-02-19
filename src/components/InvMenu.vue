<script lang="ts">
import InvItem from './InvItem/InvItem.vue'
import InvAmountItem from './InvItem/InvAmountItem.vue'
import InvInventory from './InvInventory.vue'
import { ItemType } from './interface'
import { CELL_SIZE } from './constants'

export default {
  components: { InvItem, InvAmountItem, InvInventory },
  data() {
    return { ItemType, CELL_SIZE }
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
  <div class="menu" :style="{ '--cell-size': `${CELL_SIZE}px` }">
    <InvInventory />
    <div class="itemsContainer">
      <InvItem
        :type="ItemType.Backpack"
        :w="3"
        :h="3"
        img="src/assets/1288-gamedata.base.686-gamedata.base.png"
      />
      <InvItem
        :type="ItemType.Weapon"
        :w="7"
        :h="1"
        img="src/assets/52295-rebirth.mod.913-gamedata.base.png"
      />
      <InvAmountItem :w="1" :h="3" img="src/assets/Dried Fish.png" :amount="1.4" :scrap="true" />
    </div>
  </div>
</template>

<style scoped>
.menu {
  display: flex;
}
.itemsContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: calc(var(--cell-size) * 9);
  overflow-y: scroll;
  background-color: #f8f8f8;
  user-select: none;
}
</style>
