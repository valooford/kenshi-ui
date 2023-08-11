<script lang="ts">
import iconSprite from '@/assets/img/Kenshi_UI.png'

export default {
  data() {
    return { iconSprite, initialized: false }
  },
  methods: {
    onMouseMove(e: PointerEvent) {
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
    //! todo: catch scrolling with mouse and move the cursor accordingly
    // onScrollDrag(e: Event) {
    //   setTimeout(() => {
    //     // ...
    //   }, 0)
    // },
    onMouseLeave(e: PointerEvent) {
      if (e.defaultPrevented) return
      const cursor = this.$refs.cursor as HTMLElement
      cursor.style.display = 'none'
    },
    onMouseEnter(e: PointerEvent) {
      if (e.defaultPrevented) return
      const cursor = this.$refs.cursor as HTMLElement
      cursor.style.display = 'block'
      this.onMouseMove(e)
    },
  },
  mounted() {
    document.addEventListener('pointermove', this.onMouseMove)
    // document.addEventListener('scroll', this.onScrollDrag, { capture: true })
    document.addEventListener('pointerleave', this.onMouseLeave)
    document.addEventListener('pointerenter', this.onMouseEnter)
  },
  unmounted() {
    document.removeEventListener('pointermove', this.onMouseMove)
    // document.removeEventListener('scroll', this.onScrollDrag, { capture: true })
    document.removeEventListener('pointerleave', this.onMouseLeave)
    document.removeEventListener('pointerenter', this.onMouseEnter)
  },
}
</script>

<template>
  <div class="cursor" :style="{ backgroundImage: `url(${iconSprite})` }" ref="cursor" />
</template>

<style scoped>
.cursor {
  display: none;
  position: absolute;
  width: 25px;
  height: 25px;
  background-position: -14px -12px;
  z-index: 1400;
  pointer-events: none;
}
</style>
