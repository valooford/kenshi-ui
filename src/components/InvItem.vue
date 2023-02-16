<script lang="ts">
import { CELL_SIZE, CELL_HALF_SIZE, DRAG_PAYLOAD_SYMBOL } from './constants'

export default {
  props: {
    img: { type: String, required: true },
    w: { type: Number, required: true },
    h: { type: Number, required: true },
    type: { type: String },
    amount: { type: Number },
    scrap: { type: Boolean },
  },
  emits: {
    dragstart: null,
    drop: (dragPayload: any) => !!dragPayload,
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
      amountDragging: null as number | null,
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
    count() {
      if (!this.amount) return undefined
      return Math.ceil(this.amount - Number(this.amountDragging))
    },
    notEnoughToShowCount() {
      return !this.count || this.count <= 1
    },
    notEnoughAmountToShowItem() {
      return !this.count || this.count === 0
    },
    progressValue() {
      if (!this.amount) return undefined
      return this.isPreview || this.isDragging ? 100 : (this.amount % 1 || 1) * 100
    },
    progressScrap() {
      if (!this.amount) return undefined
      return (this.amount % 1 || 1) * 100
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
        if (this.type) e.dataTransfer.setData(`dnd/type;value=${this.type}`, '')
        let amount = 1
        if (this.amount) {
          if (e.shiftKey) amount = this.amount
          else amount = this.amount % 1 || 1
        }
        this.amountDragging = amount
        e.dataTransfer.setData(`dnd/amount;value=${amount}`, '')
        if (this.scrap) e.dataTransfer.setData(`dnd/scrap;value=${+this.scrap}`, '')
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
      this.isDragging = false
      this.amountDragging = null
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
  <!-- ITEM -->
  <div
    :class="[
      'item',
      isDragging && notEnoughAmountToShowItem && 'item_dragging',
      isPreview && notEnoughAmountToShowItem && 'item_preview',
    ]"
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
    <progress v-if="scrap && amount" :value="progressValue" max="100" class="scrap"></progress>
    <div v-if="!notEnoughToShowCount" class="count">
      {{ count }}
    </div>
  </div>
  <!-- ITEM PREVIEW -->
  <div
    class="preview"
    :style="{
      left: `${pivot.x}px`,
      top: `${pivot.y}px`,
    }"
  >
    <div class="preview__content">
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
      <progress v-if="scrap && amount" :value="progressScrap" max="100" class="scrap"></progress>
      <div v-if="amountDragging && amountDragging > 1" class="count">
        {{ Math.ceil(amountDragging) }}
      </div>
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
  z-index: 1;
}
.item,
.preview__content {
  position: relative;
  background-color: rgb(0 0 0 / 0.4);
}
.scrap {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
  height: 5px;
}
.scrap::-webkit-progress-bar {
  background-color: #000;
  background-clip: padding-box;
  border: 1px solid transparent;
  border-top: none;
}
.scrap::-webkit-progress-value {
  background-color: #fff;
}
.count {
  position: absolute;
  bottom: 5px;
  right: 0;
  color: #fff;
  font-weight: 600;
}
</style>
