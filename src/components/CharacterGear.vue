<script lang="ts">
export default {}
</script>

<template>
  <div class="gear">
    <div>
      <em class="text">Total Weight:</em>
      <em class="text">0/57<br />-Weightless</em>
    </div>
    <div>
      <em class="text">Disguise:</em>
      <span class="text">Swamp Ninjas<br />3%</span>
    </div>
    <div>
      <i class="text">Slave of:</i>
      <i class="text">-</i>
    </div>
    <div>
      <i class="text">Looks like slave:</i>
      <i class="text">-</i>
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
  color: var(--color-main);
  font-family: Exo2, sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0.02em;
  white-space: pre;
}
em.text {
  color: #9c9c9c;
}
i.text {
  color: var(--color-greyed);
}
.text:nth-child(2n + 1) {
  float: left;
}
.text:nth-child(2n) {
  text-align: right;
}
</style>
