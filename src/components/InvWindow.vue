<script lang="ts">
import type { IPoint } from './interface'
import InvIconButton from './InvIconButton.vue'

export default {
  components: { InvIconButton },
  inject: ['cssVariables'],
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
      cssVariables: this.cssVariables,
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
      :style="[{ top: `${posY}px`, left: `${posX}px` }, cssVariables]"
      tabindex="-1"
      @focus="onFocus"
      @blur="onBlur"
      v-bind="$attrs"
    >
      <div
        class="header section"
        draggable="true"
        @dragstart="onDragStart"
        @drag="onDrag"
        @dragend="onDragEnd"
      >
        {{ title }}
        <div class="header__buttons">
          <!-- <InvIconButton variant="o" /> -->
          <InvIconButton variant="close" @click="onClose" />
        </div>
      </div>
      <div class="section">
        <slot></slot>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.window {
  position: fixed;
  background-color: #fff;
  border: 4px solid #000;
  z-index: 1000;
}
.window_active {
  z-index: 1100;
}
.section {
  background-color: #1d1d1d;
  box-shadow: inset 0 0 1px #000, inset 0 0 2px #fff;
}
.header {
  position: relative;
  line-height: 30px;
  color: #9c9c9c;
  text-align: center;
  font-family: Sentencia, sans-serif;
  font-size: 17px;
  text-shadow: 1px 1px 1px #000;
  background-image: linear-gradient(to bottom, #2c2c2c 50%, #272727 50%);
  border-bottom: 5px solid #000;
  user-select: none;
}
.header__buttons {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 6px;
  display: flex;
  align-items: center;
  gap: 5px;
}
</style>
