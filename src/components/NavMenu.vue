<script lang="ts">
import KBox from '@/ui/KBox.vue'
import KButton from '@/ui/KButton.vue'

export default {
  components: { KBox, KButton },
  inject: ['store', 'dispatch'],
  computed: {
    s() {
      return this.store as IStore
    },
    d() {
      return this.dispatch as IDispatch
    },
  },
  methods: {
    toggleInventory() {
      if (this.s.seam.main) {
        this.d.closeSeamInventory()
      } else {
        this.d.openMainSeamInventory()
      }
    },
  },
}
</script>

<template>
  <KBox class="box_bottom">
    <ul class="buttons">
      <KButton size="md" :disabled="!s.selectedCharacter" @click="toggleInventory">INV</KButton>
      <KButton size="md" disabled>STA</KButton>
      <KButton size="md" disabled>MAP</KButton>
      <KButton size="md" disabled>TEC</KButton>
      <KButton size="md" disabled>SQD</KButton>
      <KButton size="md" disabled>HLP</KButton>
    </ul>
  </KBox>
</template>

<style scoped>
.box_bottom {
  min-height: 165rem;
  border-bottom: none;
}
.buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 0 1rem;
  padding: 3rem 3rem 4rem;
  box-shadow: inset 0 -2rem 0 #1d1d1d;
}
</style>
