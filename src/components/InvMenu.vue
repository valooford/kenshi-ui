<script lang="ts">
import InvInventory from './InvInventory.vue'
import InvItem from './InvItem/InvItem.vue'
import InvAmountItem from './InvItem/InvAmountItem.vue'
import InvBackpack from './InvItem/InvBackpack.vue'
import { ItemType } from './interface'
import { CELL_SIZE } from './constants'

export default {
  components: { InvInventory, InvItem, InvAmountItem, InvBackpack },
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
  <div class="menu">
    <InvInventory />
    <div class="itemsContainer">
      <InvBackpack
        :type="ItemType.Backpack"
        :w="3"
        :h="3"
        :region="{ w: 8, h: 8, items: [] }"
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
  flex: 1;

  --cell-size: v-bind(`${CELL_SIZE}px`);
}
.itemsContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(var(--cell-size) * 9);
  height: 100vh;
  margin-left: auto;
  padding: 10px 0;
  gap: 10px;
  overflow-y: scroll;
  background-color: #f8f8f8;
  user-select: none;
}
</style>

<style></style>
