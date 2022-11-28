<script setup lang="ts">
import InvItem from './InvItem.vue'
import InvRegion from './InvRegion.vue'
</script>

<template>
  <InvRegion :w="8" :h="10" />
  <div class="itemsContainer">
    <InvItem :w="3" :h="3" img="src/assets/1288-gamedata.base.686-gamedata.base.png" />
    <InvItem :w="7" :h="1" img="src/assets/52295-rebirth.mod.913-gamedata.base.png" />
    <InvItem :w="1" :h="3" img="src/assets/Dried Fish.png" />
  </div>
</template>

<style scoped>
.itemsContainer {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: calc(var(--cell-size) * 9);
  height: calc(var(--cell-size) * 10);
  overflow-y: scroll;
  background-color: #f8f8f8;
}
</style>
