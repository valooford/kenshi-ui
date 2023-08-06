<script lang="ts">
export default {
  data() {
    return { initialized: false }
  },
  methods: {
    onMouseMove(e: MouseEvent) {
      const cursor = this.$refs.cursor as HTMLElement
      requestAnimationFrame(() => {
        cursor.style.left = `${e.pageX}px`
        cursor.style.top = `${e.pageY}px`
      })
      if (!this.initialized) {
        this.initialized = true
        cursor.style.display = 'block'
      }
    },
    onMouseLeave(e: MouseEvent) {
      if (e.defaultPrevented) return
      const cursor = this.$refs.cursor as HTMLElement
      cursor.style.display = 'none'
    },
    onMouseEnter(e: MouseEvent) {
      if (e.defaultPrevented) return
      const cursor = this.$refs.cursor as HTMLElement
      cursor.style.display = 'block'
      this.onMouseMove(e)
    },
  },
  mounted() {
    window.addEventListener('mousemove', this.onMouseMove)
    document.addEventListener('mouseleave', this.onMouseLeave)
    document.addEventListener('mouseenter', this.onMouseEnter)
  },
  unmounted() {
    window.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseleave', this.onMouseLeave)
    document.removeEventListener('mouseenter', this.onMouseEnter)
  },
}
</script>

<template>
  <div class="cursor" ref="cursor" />
</template>

<style scoped>
.cursor {
  display: none;
  position: absolute;
  width: 25px;
  height: 25px;
  background-image: url('src/assets/Kenshi_UI.png');
  background-position: -14px -12px;
  z-index: 1400;
  pointer-events: none;
}
</style>
