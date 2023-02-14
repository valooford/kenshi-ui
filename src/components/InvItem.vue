<script lang="ts">
import { CELL_SIZE, CELL_HALF_SIZE } from './constants'

export default {
  props: {
    img: { type: String, required: true },
    w: { type: Number, required: true },
    h: { type: Number, required: true },
  },
  emits: ['dragstart', 'drop', 'dragend'],
  data() {
    const emptyImage = new Image()
    emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
    return {
      isPreview: false,
      isDragging: false,
      emptyImage,
      cX: 0,
      cY: 0,
      pX: -1000,
      pY: -1000,
    }
  },
  computed: {
    width() {
      return `${this.w * CELL_SIZE}px`
    },
    height() {
      return `${this.h * CELL_SIZE}px`
    },
    pivot() {
      const x = this.pX - this.cX * CELL_SIZE - CELL_HALF_SIZE
      const y = this.pY - this.cY * CELL_SIZE - CELL_HALF_SIZE
      return { x, y }
    },
  },
  methods: {
    onMouseDown(e: MouseEvent) {
      const el = e.target as HTMLElement
      const rect = el.getBoundingClientRect()
      // find out what cell of an item are meant to be dragged
      const x = Math.floor((e.clientX - rect.left) / CELL_SIZE)
      const y = Math.floor((e.clientY - rect.top) / CELL_SIZE)
      this.isPreview = true
      this.cX = x
      this.cY = y
      this.pX = e.clientX
      this.pY = e.clientY
      document.body.addEventListener('mouseup', this.onMouseUp)
    },
    onDragStart(e: DragEvent) {
      if (e.dataTransfer) {
        // selects closest to default cursor
        e.dataTransfer.effectAllowed = 'move'
        // using MIME types to pass data to 'dragenter' event handlers
        // because retrieving data via getData() is only accessible in 'drop' event handlers
        // also 'dataTransfer.types' might seem to be empty in debug console, but it's not
        // dnd/[property];value=[property-value]
        e.dataTransfer.clearData()
        e.dataTransfer.setData(`dnd/w;value=${this.w}`, '')
        e.dataTransfer.setData(`dnd/h;value=${this.h}`, '')
        e.dataTransfer.setData(`dnd/x;value=${this.cX}`, '')
        e.dataTransfer.setData(`dnd/y;value=${this.cY}`, '')
        e.dataTransfer.setData(`dnd/img;value=${this.img}`, '')
        // removes ghost
        e.dataTransfer.setDragImage(this.emptyImage, 0, 0)
      }

      document.body.addEventListener('drop', this.onDrop)

      requestAnimationFrame(() => {
        // prevents immediate 'dragend' event
        this.isDragging = true
      })

      this.$emit('dragstart')
    },
    onDrop(e: DragEvent) {
      if (e.defaultPrevented) {
        this.$emit('drop')
      }
    },
    onDragEnd() {
      this.isDragging = false
      this.onMouseUp()
      document.body.removeEventListener('drop', this.onDrop)

      this.$emit('dragend')
    },
    onMouseUp() {
      this.isPreview = false
      this.cX = 0
      this.cY = 0
      this.pX = -1000
      this.pY = -1000
      document.body.removeEventListener('mouseup', this.onMouseUp)
    },
    onDrag(e: DragEvent) {
      this.pX = e.clientX
      this.pY = e.clientY
    },
  },
}
</script>

<template>
  <img
    :src="img"
    alt=""
    draggable="true"
    @mousedown="onMouseDown"
    @dragstart="onDragStart"
    @drag="onDrag"
    @dragend="onDragEnd"
    class="item"
    :style="{
      width,
      height,
      visibility: isDragging ? 'hidden' : undefined,
      opacity: isPreview ? 0 : 1,
    }"
  />
  <img
    v-if="isPreview"
    :src="img"
    alt=""
    draggable="false"
    class="preview"
    :style="{
      width,
      height,
      left: `${pivot.x}px`,
      top: `${pivot.y}px`,
    }"
  />
</template>

<style scoped>
.item {
  user-select: none;
}
.preview {
  position: fixed;
  pointer-events: none;
  z-index: 1;
}
</style>
