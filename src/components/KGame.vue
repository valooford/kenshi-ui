<script lang="ts">
import { DAY_S, GameSpeed } from '@/shared/constants'
import timelapse from '@/assets/video/background-timelapse.mp4'

const BLUR_RADIUS = 4

export default {
  inject: ['store', 'audio'],
  data() {
    return {
      timelapse,
      BLUR_RADIUS,
      initialized: false,
      playbackRateCf: 1,
      timelapseDimensions: { w: window.innerWidth, h: window.innerHeight },
    }
  },
  computed: {
    s() {
      return this.store as IStore
    },
    gameSpeed() {
      return this.s.gameParameters.gameSpeed
    },
  },
  watch: {
    gameSpeed(speed: number) {
      if (!this.initialized) return
      const timelapse = this.$refs.game as HTMLVideoElement
      timelapse.playbackRate = speed * this.playbackRateCf
    },
  },
  methods: {
    /**
     * @description Covers the screen with the element, preserves the propotions
     * Similar to CSS's object-fit: cover; value
     */
    onResize() {
      const timelapse = this.$refs.game as HTMLVideoElement
      const { w: sourceW, h: sourceH } = this.timelapseDimensions

      // avoid blur artifacts on edges
      const targetW = window.innerWidth + BLUR_RADIUS * 2
      const targetH = window.innerHeight + BLUR_RADIUS * 2

      // cover
      const cf = Math.max(targetW / sourceW, targetH / sourceH)
      timelapse.width = sourceW * cf
      timelapse.height = sourceH * cf

      // center the element
      const shiftX = Math.max(0, (timelapse.width - targetW) / 2)
      const shiftY = Math.max(0, (timelapse.height - targetH) / 2)
      timelapse.style.left = `${-shiftX - BLUR_RADIUS}px`
      timelapse.style.top = `${-shiftY - BLUR_RADIUS}px`
    },
  },
  mounted() {
    const timelapse = this.$refs.game as HTMLVideoElement

    const timelapseTargetDurationS = DAY_S / this.s.gameParameters.gameSpeedCf

    timelapse.addEventListener(
      'loadeddata',
      () => {
        this.initialized = true
        this.playbackRateCf = timelapse.duration / timelapseTargetDurationS
        timelapse.playbackRate = GameSpeed.Normal * this.playbackRateCf
        this.timelapseDimensions = { w: timelapse.videoWidth, h: timelapse.videoHeight }

        window.addEventListener('resize', this.onResize)
        this.onResize()
      },
      { once: true }
    )
  },
  unmounted() {
    window.removeEventListener('resize', this.onResize)
  },
}
</script>

<template>
  <video autoplay muted loop class="game" ref="game">
    <source :src="timelapse" type="video/mp4" />
  </video>
  <div class="blur" />
</template>

<style scoped>
.game {
  position: relative;
}
.blur {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  backdrop-filter: blur(v-bind('`${BLUR_RADIUS}rem`'));
}
</style>
