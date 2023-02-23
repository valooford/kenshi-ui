<script lang="ts">
import type { PropType } from 'vue'
import { CELL_SIZE, CELL_HALF_SIZE, DRAG_PAYLOAD_SYMBOL } from '../constants'
import type { ItemType } from '../interface'

export default {
  props: {
    w: { type: Number, required: true },
    h: { type: Number, required: true },
    img: { type: String, required: true },
    type: { type: String as PropType<ItemType> },
    hidden: { type: Boolean },
    handleDragStart: { type: Function as PropType<(e: DragEvent) => void> },
    handleDragEnd: { type: Function as PropType<() => void> },
  },
  emits: {
    dragstart: null,
    drop: (dragPayload?: any) => true || dragPayload,
    dragend: null,
  },
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
      cleanupEventName: null as string | null,
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

      const buttonHeld = !!e.detail
      this.cleanupEventName = buttonHeld ? 'mouseup' : 'mousedown'
      setTimeout(() => {
        document.body.addEventListener(this.cleanupEventName!, this.cleanup)
      }, 0)
    },
    onDragStart(e: DragEvent) {
      if (this.handleDragStart) this.handleDragStart(e)
      if (e.dataTransfer) {
        // selects closest to default cursor
        e.dataTransfer.effectAllowed = 'move'
        // using MIME types to pass data to 'dragenter' event handlers
        // because retrieving data via getData() is only accessible in 'drop' event handlers
        // also 'dataTransfer.types' might seem to be empty in debug console, but it's not
        // dnd/[property];value=[property-value]
        e.dataTransfer.setData(`dnd/w;value=${this.w}`, '')
        e.dataTransfer.setData(`dnd/h;value=${this.h}`, '')
        e.dataTransfer.setData(`dnd/x;value=${this.cX}`, '')
        e.dataTransfer.setData(`dnd/y;value=${this.cY}`, '')

        e.dataTransfer.setData('dnd/img', this.img)
        if (this.type) e.dataTransfer.setData('dnd/type', this.type)

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
        const dragPayload = Object.getOwnPropertyDescriptor(e, DRAG_PAYLOAD_SYMBOL)?.value
        this.$emit('drop', dragPayload)
      }
    },
    onDragEnd() {
      if (this.handleDragEnd) this.handleDragEnd()
      this.isDragging = false
      this.cleanup()
      document.body.removeEventListener('drop', this.onDrop)

      this.$emit('dragend')
    },
    cleanup() {
      this.isPreview = false
      this.cX = 0
      this.cY = 0
      this.pX = -1000
      this.pY = -1000
      document.body.removeEventListener(this.cleanupEventName!, this.cleanup)
      this.cleanupEventName = null
    },
    onDrag(e: DragEvent) {
      this.pX = e.clientX
      this.pY = e.clientY
    },
  },
}
</script>

<template>
  <!-- ITEM -->
  <div
    :class="[
      'item',
      isDragging && hidden && 'item_dragging',
      isPreview && hidden && 'item_preview',
    ]"
    :style="{ height }"
  >
    <img
      :src="img"
      alt=""
      draggable="true"
      @mousedown="onMouseDown"
      @dragstart="onDragStart"
      @drag="onDrag"
      @dragend="onDragEnd"
      :style="{
        width,
        height,
      }"
    />
    <slot name="item"></slot>
  </div>
  <!-- ITEM PREVIEW -->
  <div
    class="preview"
    :style="{
      left: `${pivot.x}px`,
      top: `${pivot.y}px`,
    }"
  >
    <div class="preview__content" :style="{ height }">
      <img
        v-if="isPreview"
        :src="img"
        alt=""
        draggable="false"
        :style="{
          width,
          height,
        }"
      />
      <slot name="preview"></slot>
    </div>
  </div>
</template>

<style scoped>
.item {
  user-select: none;
}
.item_dragging {
  visibility: hidden;
}
.item_preview {
  opacity: 0;
}
.preview {
  position: fixed;
  pointer-events: none;
  z-index: 1200;
}
.item,
.preview__content {
  position: relative;
  background-color: rgb(0 0 0 / 0.4);
}
</style>
