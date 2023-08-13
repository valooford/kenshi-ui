<template>
  <div class="box">
    <slot />
  </div>
</template>

<style scoped>
.box {
  background-color: #1d1d1d;
  border: 4rem solid #000;
  box-shadow: inset 0 0 1rem #000, inset 0 0 2rem #fff;
}
</style>
