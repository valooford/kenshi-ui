<script lang="ts">
// import background from '@/assets/img/background.jpg'
import timelapse from '@/assets/video/background-timelapse.mp4'

const BLUR_RADIUS = 4
const PLAYBACK_RATE = 0.5
const VIDEO_WIDTH = 1280
const VIDEO_HEIGHT = 720

export default {
  data() {
    return { timelapse, BLUR_RADIUS }
  },
  mounted() {
    // const gameCanvas = this.$refs.game as HTMLCanvasElement
    // gameCanvas.width = document.documentElement.clientWidth
    // gameCanvas.height = document.documentElement.clientHeight
    // const ctx = gameCanvas.getContext('2d')
    //
    // const img = new Image(1920, 1080)
    // img.src = background
    //
    // const dw = gameCanvas.width
    // const dh = gameCanvas.height
    // const iw = img.width
    // const ih = img.height
    // const r = Math.min(gameCanvas.width / img.width, gameCanvas.height / img.height)
    //
    // let nw = iw * r
    // let nh = ih * r
    // let ar = 1
    //
    // if (nw < dw) ar = dw / nw
    // if (Math.abs(ar - 1) < Number.EPSILON && nh < dh) ar = dh / nh
    // nw *= ar
    // nh *= ar
    //
    // let sw = iw / (nw / dw)
    // let sh = ih / (nh / dh)
    //
    // let sx = (iw - sw) / 2
    // let sy = (ih - sh) / 2
    //
    // if (sx < 0) sx = 0
    // if (sy < 0) sy = 0
    // if (sw > iw) sw = iw
    // if (sh > ih) sh = ih
    //
    // if (ctx)
    //   img.addEventListener(
    //     'load',
    //     () => {
    //       ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh)
    //     },
    //     { once: true }
    //   )

    const w = document.documentElement.clientWidth + BLUR_RADIUS * 2
    const h = document.documentElement.clientHeight + BLUR_RADIUS * 2
    const cfW = w / VIDEO_WIDTH
    const cfH = h / VIDEO_HEIGHT
    const maxCf = Math.max(cfW, cfH)
    const timelapse = this.$refs.game as HTMLVideoElement
    timelapse.width = VIDEO_WIDTH * maxCf
    timelapse.height = VIDEO_HEIGHT * maxCf
    const shiftX = -BLUR_RADIUS - Math.max(0, (timelapse.width - w) / 2)
    const shiftY = -BLUR_RADIUS - Math.max(0, (timelapse.height - h) / 2)
    timelapse.style.left = `${shiftX}px`
    timelapse.style.top = `${shiftY}px`
    timelapse.playbackRate = PLAYBACK_RATE
  },
}
</script>

<template>
  <!-- <canvas ref="game"></canvas> -->
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
  backdrop-filter: blur(v-bind('`${BLUR_RADIUS}px`'));
}
</style>
