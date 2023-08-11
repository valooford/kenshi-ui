<script lang="ts">
import KText from '@/ui/KText.vue'

export default { components: { KText } }
</script>

<template>
  <div class="gear">
    <div>
      <KText>Total Weight:</KText>
      <KText>0/57<br />-Weightless</KText>
    </div>
    <div>
      <KText>Disguise:</KText>
      <KText color="attendant">Swamp Ninjas<br />3%</KText>
    </div>
    <div>
      <KText color="greyed">Slave of:</KText>
      <KText color="greyed">-</KText>
    </div>
    <div>
      <KText color="greyed">Looks like slave:</KText>
      <KText color="greyed">-</KText>
    </div>
  </div>
</template>

<style scoped>
.gear {
  margin: 1px 4px 0 0;
  padding: 6px 18px 32px 10px;
  background-color: #151515;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.2);
  border: 1px solid #000;
  border-radius: 2px;
}
.text {
  display: block;
  letter-spacing: 0.02em;
  white-space: pre;
}
.text:nth-child(2n + 1) {
  float: left;
}
.text:nth-child(2n) {
  text-align: right;
}
</style>
