<script lang="ts">
import InvCell from './InvCell.vue'

export default {
  components: { InvCell },
  props: {
    w: { type: Number, required: true },
    h: { type: Number, required: true },
  },
  data() {
    return {
      hvrI: null as number | null,
      hvrX: null as number | null,
      hvrY: null as number | null,
      iW: null as number | null,
      iH: null as number | null,
      iX: null as number | null,
      iY: null as number | null,
    }
  },
  computed: {
    cells() {
      return Array(this.w * this.h).fill(0)
    },
  },
  methods: {
    onDragEnter(e: DragEvent) {
      // dnd/[property];value=[property-value]
      const paramsRegex = /dnd\/(\S+);value=(\S+)$/
      const types = e.dataTransfer?.types
      setTimeout(() => {
        types?.forEach((t) => {
          const [, prop, value] = paramsRegex.exec(t) || []
          switch (prop) {
            case 'w':
              this.iW = +value
              break
            case 'h':
              this.iH = +value
              break
            case 'x':
              this.iX = +value
              break
            case 'y':
              this.iY = +value
              break
            default:
          }
        })
      }, 0)
    },
    onDragEnterCell(cI: number) {
      this.hvrI = cI
      const { x: cX, y: cY } = this.toCoords(cI, this.w)
      this.hvrX = cX
      this.hvrY = cY
    },
    toCoords(i: number, w: number) {
      const x = i % w
      const y = Math.floor(i / w)
      return { x, y }
    },
    isOver(cI: number) {
      if (this.hvrI === null) return false
      const { x: cX, y: cY } = this.toCoords(cI, this.w)
      const left = this.hvrX! - this.iX!
      const right = left + this.iW! - 1
      const top = this.hvrY! - this.iY!
      const bottom = top + this.iH! - 1
      return !(cX < left || cX > right || cY < top || cY > bottom)
    },
    onDragLeaveCell() {
      this.hvrI = null
      this.hvrX = null
      this.hvrY = null
      this.iW = null
      this.iH = null
      this.iX = null
      this.iY = null
    },
    onDrop() {
      this.onDragLeaveCell()
    },
  },
}
</script>

<template>
  <div
    class="region"
    :style="{
      width: `calc(var(--cell-size)*${w})`,
      height: `calc(var(--cell-size)*${h})`,
    }"
    @dragenter="onDragEnter"
    @drop="onDrop"
  >
    <InvCell
      v-for="(c, i) in cells"
      :is-over="isOver(i)"
      @dragenter="onDragEnterCell(i)"
      @dragleave="onDragLeaveCell"
      :key="i"
    />
  </div>
</template>

<style scoped>
.region {
  display: flex;
  flex-wrap: wrap;
}
</style>
