<script lang="ts">
import type { IPoint } from './interface'
import { CELL_SIZE } from './constants'

export default {
  props: {
    title: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  emits: {
    close: null,
    drag: (diff: IPoint) => !!diff,
    move: (pos: IPoint) => !!pos,
  },
  data() {
    const emptyImage = new Image()
    emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
    return {
      CELL_SIZE,
      emptyImage,
      shiftX: 0,
      shiftY: 0,
      pX: -1000,
      pY: -1000,
      focused: false,
    }
  },
  computed: {
    posX() {
      return this.x + this.shiftX
    },
    posY() {
      return this.y + this.shiftY
    },
  },
  methods: {
    onClose() {
      this.$emit('close')
    },
    onDragStart(e: DragEvent) {
      this.pX = e.clientX
      this.pY = e.clientY
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move' // selects closest to default cursor
        e.dataTransfer.setDragImage(this.emptyImage, 0, 0) // removes ghost
      }
    },
    onDrag(e: DragEvent) {
      if (e.screenX === 0 && e.screenY === 0) return // handle incorrect last drag event
      const shiftX = e.clientX - this.pX
      const shiftY = e.clientY - this.pY
      const diffX = shiftX - this.shiftX
      const diffY = shiftY - this.shiftY
      this.shiftX = shiftX
      this.shiftY = shiftY
      this.$emit('drag', { x: diffX, y: diffY })
    },
    onDragEnd() {
      this.$emit('move', { x: this.posX, y: this.posY })
      this.shiftX = 0
      this.shiftY = 0
      this.pX = -1000
      this.pY = -1000
    },
    onFocus() {
      this.focused = true
    },
    onBlur() {
      this.focused = false
    },
  },
  inheritAttrs: false,
}
</script>

<template>
  <teleport to="#root">
    <div
      :class="['window', focused && 'window_active']"
      :style="{ top: `${posY}px`, left: `${posX}px` }"
      tabindex="-1"
      @focus="onFocus"
      @blur="onBlur"
      v-bind="$attrs"
    >
      <div
        class="header"
        draggable="true"
        @dragstart="onDragStart"
        @drag="onDrag"
        @dragend="onDragEnd"
      >
        {{ title }}
        <button class="close-button" @click="onClose">X</button>
      </div>
      <slot></slot>
    </div>
  </teleport>
</template>

<style scoped>
.window {
  position: fixed;
  padding: 5px;
  background-color: #fff;
  border: 2px solid #000;
  z-index: 1000;

  /* necessary because of the teleport usage () */
  /* window teleports outside the app so used CSS properties become inaccessible */
  --cell-size: v-bind(`${CELL_SIZE}px`);
}
.window_active {
  z-index: 1100;
}
.header {
  position: relative;
  line-height: 26px;
  margin-bottom: 5px;
  text-align: center;
  border-bottom: 1px solid #000;
  user-select: none;
}
.close-button {
  position: absolute;
  right: 0;
}
</style>
