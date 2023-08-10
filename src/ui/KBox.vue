<template>
  <div class="box">
    <slot />
  </div>
</template>

<style scoped>
.box {
  background-color: #1d1d1d;
  border: 4px solid #000;
  box-shadow: inset 0 0 1px #000, inset 0 0 2px #fff;
}
</style>
