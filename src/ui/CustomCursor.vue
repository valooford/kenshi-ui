<script lang="ts">
import iconSprite from '@/assets/img/Kenshi_UI.png'

export default {
  data() {
    return { iconSprite, initialized: false }
  },
  methods: {
    onMouseMove(e: PointerEvent) {
      if (e.pointerType !== 'mouse') return
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
    // note: pointer* events being handled instead of mouse* ones because there is a case
    //       when pointer shows up on touch which is an unwanted behavior
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
  <div class="cursor" ref="cursor" />
</template>

<style scoped>
.cursor {
  display: none;
  position: absolute;
  width: 25rem;
  height: 25rem;
  background-image: v-bind('`url("${iconSprite}")`');
  background-size: 1920rem 1080rem;
  background-position: -14rem -12rem;
  z-index: 1400;
  pointer-events: none;
}
</style>
