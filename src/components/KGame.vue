<script lang="ts">
import background from '@/assets/img/background.jpg'

export default {
  mounted() {
    const gameCanvas = this.$refs.game as HTMLCanvasElement
    gameCanvas.width = document.documentElement.clientWidth
    gameCanvas.height = document.documentElement.clientHeight
    const ctx = gameCanvas.getContext('2d')

    const img = new Image(1920, 1080)
    img.src = background

    const dw = gameCanvas.width
    const dh = gameCanvas.height
    const iw = img.width
    const ih = img.height
    const r = Math.min(gameCanvas.width / img.width, gameCanvas.height / img.height)

    let nw = iw * r
    let nh = ih * r
    let ar = 1

    if (nw < dw) ar = dw / nw
    if (Math.abs(ar - 1) < Number.EPSILON && nh < dh) ar = dh / nh
    nw *= ar
    nh *= ar

    let sw = iw / (nw / dw)
    let sh = ih / (nh / dh)

    let sx = (iw - sw) / 2
    let sy = (ih - sh) / 2

    if (sx < 0) sx = 0
    if (sy < 0) sy = 0
    if (sw > iw) sw = iw
    if (sh > ih) sh = ih

    if (ctx)
      img.addEventListener(
        'load',
        () => {
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh)
        },
        { once: true }
      )
  },
}
</script>

<template>
  <canvas ref="game"></canvas>
</template>

<style scoped></style>
