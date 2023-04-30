<script lang="ts">
import type { PropType } from 'vue'

import IconButton from './IconButton.vue'

export const DEBOUNCE_MS = 16 // ~60 fps
const EMPTY_IMAGE = new Image()
EMPTY_IMAGE.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='

export default {
  components: { IconButton },
  inject: ['cssVariables'],
  props: {
    title: { type: String, required: true },
    shift: {
      type: Object as PropType<IPoint>,
      default(): IPoint {
        return { x: 0, y: 0 }
      },
    },
  },
  emits: {
    drag: (diff: IPoint) => !!diff,
    move: null,
    close: null,
  },
  data() {
    return {
      cssVariables: this.cssVariables,
      pos: { x: -1000, y: -1000 } as IPoint,
      pointer: { x: -1000, y: -1000 } as IPoint,
      initialized: false,
      focused: false,
      cooldown: false,
      updateRequested: false,
    }
  },
  computed: {
    finalPos(): IPoint {
      return { x: this.pos.x + this.shift.x, y: this.pos.y + this.shift.y }
    },
    hasAlignedSlots() {
      return !!(this.$slots['left-aligned'] && this.$slots['left-aligned']().length > 0)
    },
  },
  watch: {
    finalPos(newPos: IPoint, prevPos: IPoint) {
      if (newPos.x === prevPos.x && newPos.y === prevPos.y) return
      if (this.cooldown) {
        this.updateRequested = true
        return
      }
      this.updatePos()
      this.cooldown = true
      setTimeout(() => {
        this.cooldown = false
        if (this.updateRequested) {
          this.updateRequested = false
          this.updatePos()
        }
      }, DEBOUNCE_MS)
    },
  },
  methods: {
    onClose() {
      this.$emit('close')
    },
    onDragStart(e: DragEvent) {
      this.pointer = { x: e.clientX, y: e.clientY }
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move' // selects closest to default cursor
        e.dataTransfer.setDragImage(EMPTY_IMAGE, 0, 0) // removes ghost
      }
    },
    onDrag(e: DragEvent) {
      if (e.screenX === 0 && e.screenY === 0) return // handle incorrect last drag event
      const diff: IPoint = { x: e.clientX - this.pointer.x, y: e.clientY - this.pointer.y }
      this.pointer = { x: e.clientX, y: e.clientY }
      this.pos = { x: this.pos.x + diff.x, y: this.pos.y + diff.y }
      this.$emit('drag', diff)
    },
    onDragEnd() {
      this.$emit('move')
      this.pointer = { x: -1000, y: -1000 }
    },
    onFocus() {
      this.focused = true
    },
    onBlur() {
      this.focused = false
    },
    updatePos() {
      const windowEl = this.$refs.window as HTMLDivElement
      requestAnimationFrame(() => {
        windowEl.style.left = `${this.finalPos.x}px`
        windowEl.style.top = `${this.finalPos.y}px`
      })
    },
  },
  inheritAttrs: false,
  mounted() {
    const rect = (this.$refs.window__content as HTMLDivElement).getBoundingClientRect()
    this.pos = { x: rect.left, y: rect.top }
    this.initialized = true
  },
}
</script>

<template>
  <teleport to="#root" :disabled="!initialized">
    <div
      :class="[
        'window',
        initialized && 'window_initialized',
        focused && 'window_active',
        hasAlignedSlots && 'window_has-aligned',
      ]"
      :style="cssVariables as any"
      ref="window"
    >
      <div
        class="window__content"
        tabindex="-1"
        @focus="onFocus"
        @blur="onBlur"
        v-bind="$attrs"
        ref="window__content"
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
            <!-- <IconButton variant="o" /> -->
            <IconButton variant="close" @click="onClose" />
          </div>
        </div>
        <div class="section">
          <slot></slot>
        </div>
      </div>
      <div class="left-aligned">
        <div class="left-aligned__inner">
          <slot name="left-aligned"></slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.window {
  display: flex;
  flex-direction: row-reverse;
  z-index: 1000;
}
.window_initialized {
  position: fixed;
  /* DEBOUNCE_MS */
  transition: top linear 16ms, left linear 16ms;
}
.window_active {
  z-index: 1100;
}
.window_has-aligned {
  gap: 4px;
}
.window_active .window {
  z-index: -1;
}
.window ~ .window {
  /**
   * problem: next windows are always on top even if aligned slots are active
   * todo: consider @focus and @blur on aligned slots to upscale/reset own z-index
   */
}
.window__content {
  border: 4px solid #000;
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
.window_initialized .left-aligned {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
.window_initialized .left-aligned__inner {
  position: relative;
  left: calc(-100%);
  margin-right: 4px;
  display: flex;
  flex-wrap: nowrap;
  white-space: nowrap;
  gap: 4px;
}
.left-aligned__inner > * {
  pointer-events: all;
}
</style>
