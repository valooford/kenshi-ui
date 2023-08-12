<script lang="ts">
import KBox from './KBox.vue'
import KText from './KText.vue'

export default { components: { KBox, KText } }
</script>

<template>
  <div class="paused-container">
    <KBox>
      <KText variant="huge">PAUSED</KText>
    </KBox>
  </div>
</template>

<style scoped>
.paused-container {
  position: fixed;
  top: 6px;
  left: 50%;
}
.box {
  position: relative;
  left: -50%;
  padding: 48px 42px 16px;
}
</style>
