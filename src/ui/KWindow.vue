<script lang="ts">
import type { PropType } from 'vue'
import { emulateDragAndDropApi, throttle } from '@/shared/utils'
import { SpriteIconButton } from '@/ui/SpriteIcon'
import KText from '@/ui/KText.vue'

export const THROTTLE_MS = 16 // ~60 fps
const EMPTY_IMAGE = new Image()
EMPTY_IMAGE.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='

export default {
  components: { SpriteIconButton, KText },
  inject: ['store', 'cssVariables'],
  props: {
    title: { type: String, required: true },
    shift: {
      type: Object as PropType<IPoint>,
      default(): IPoint {
        return { x: 0, y: 0 }
      },
    },
    centered: { type: Boolean },
    autoFocus: { type: Boolean },
  },
  emits: {
    drag: (diff: IPoint) => !!diff,
    move: null,
    close: null,
  },
  data() {
    return {
      THROTTLE_MS,
      cssVariables: this.cssVariables,
      pos: { x: -9999, y: -9999 } as IPoint,
      pointer: { x: -9999, y: -9999 } as IPoint,
      initialized: false,
      focused: false,
      hoveredObjectId: null as IItemObjId | null,
      isFreeSpaceBlockedRight: false,
      updatePosThrottled: throttle(this.updatePos as () => void, THROTTLE_MS),
    }
  },
  computed: {
    rem() {
      return (this.store as IStore).uiParameters.rem
    },
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
      this.updatePosThrottled()
    },
  },
  methods: {
    onClose() {
      this.$emit('close')
    },
    onPointerMainDown(e: PointerEvent) {
      if (e.pointerType === 'mouse' && e.button !== 0) return // LMB/touch only
      // emulate Drag-and-Drop API
      // motivation: custom cursor
      emulateDragAndDropApi({
        element: e.target as Element,
        elementPointX: e.clientX,
        elementPointY: e.clientY,
        screenX: e.clientX,
        screenY: e.clientY,
        shiftKey: e.shiftKey,
        iWillRelease: true,
        disableDragover: true,
      })
      e.preventDefault()
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
      this.pointer = { x: -9999, y: -9999 }
    },
    onFocus() {
      if (this.focused) return
      this.focused = true
      ;(this.$refs.window as Element).dispatchEvent(
        new CustomEvent('ki-windowfocus', { bubbles: true })
      )
      document.addEventListener('ki-windowfocus', this.onBlur, { once: true })
    },
    onBlur() {
      this.focused = false
    },
    updatePos() {
      const windowEl = this.$refs.window as HTMLDivElement
      const x = this.finalPos.x
      const y = this.finalPos.y

      requestAnimationFrame(() => {
        windowEl.style.left = `${x}px`
        windowEl.style.top = `${y}px`
      })
    },
    onShowItemInfo(e: CustomEvent) {
      e.stopPropagation()
      this.hoveredObjectId = e.detail
      const rect = (this.$refs.window as HTMLDivElement).getBoundingClientRect()
      const right = document.documentElement.clientWidth - rect.right
      this.isFreeSpaceBlockedRight = right < 323 * this.rem
    },
    onHideItemInfo(e: CustomEvent) {
      e.stopPropagation()
      this.hoveredObjectId = null
    },
  },
  inheritAttrs: false,
  mounted() {
    const rect = (this.$refs.window__content as HTMLDivElement).getBoundingClientRect()
    if (this.centered) {
      this.pos = {
        x: (document.documentElement.clientWidth - rect.width) / 2,
        y: (document.documentElement.clientHeight - rect.height) / 2,
      }
    } else {
      this.pos = { x: rect.left, y: rect.top }
    }
    if (this.autoFocus) this.onFocus()
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
        hoveredObjectId && 'window_info',
      ]"
      :style="cssVariables as any"
      @ki-iteminfoshow="onShowItemInfo"
      @ki-iteminfohide="onHideItemInfo"
      ref="window"
    >
      <div class="window__content" @pointerdown="onFocus" v-bind="$attrs" ref="window__content">
        <div
          class="header section"
          @pointerdown="onPointerMainDown"
          @dragstart="onDragStart"
          @drag="onDrag"
          @dragend="onDragEnd"
        >
          <KText variant="alt">{{ title }}</KText>
          <div class="header__buttons">
            <!-- <SpriteIconButton variant="o" /> -->
            <SpriteIconButton variant="close" @click="onClose" />
          </div>
        </div>
        <div class="section">
          <slot></slot>
        </div>
      </div>
      <div class="left-aligned">
        <div class="left-aligned__inner">
          <slot name="left-aligned" />
        </div>
      </div>
      <div :class="['free-space-aligned', isFreeSpaceBlockedRight && 'free-space-aligned_left']">
        <div v-if="hoveredObjectId" class="section free-space-aligned__inner">
          <slot name="free-space-aligned" :id="hoveredObjectId" />
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
  /* THROTTLE_MS */
  transition: top linear 16ms, left linear 16ms;
}
.window_active,
.window_info {
  z-index: 1100;
}
.window_has-aligned {
  gap: 4rem;
}
.window_active .window {
  z-index: 1050;
}
.window__content {
  border: 4rem solid #000;
}
.section {
  background-color: #1d1d1d;
  box-shadow: inset 0 0 1rem #000, inset 0 0 2rem #fff;
}
.header {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 35rem;
  background-image: linear-gradient(to bottom, #2c2c2c 50%, #272727 50%);
  border-bottom: 5rem solid #000;
  user-select: none;
  touch-action: none;
}
.header__buttons {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 6rem;
  display: flex;
  align-items: center;
  gap: 5rem;
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
  margin-right: 4rem;
  display: flex;
  flex-wrap: nowrap;
  white-space: nowrap;
  gap: 4rem;
}
.left-aligned__inner > * {
  pointer-events: all;
}
.window_initialized .free-space-aligned {
  position: absolute;
  top: 0;
  right: 0;
  pointer-events: none;
}
.window_initialized .free-space-aligned__inner {
  position: relative;
  right: calc(-100% - 4rem);
  margin-right: 4rem;
  display: flex;
  flex-wrap: nowrap;
  border: 4rem solid #000;
  gap: 4rem;
}
.window_initialized .free-space-aligned_left {
  left: 0;
  right: unset;
}
.window_initialized .free-space-aligned_left .free-space-aligned__inner {
  left: calc(-100% - 4rem);
  right: unset;
}
.free-space-aligned__inner > * {
  pointer-events: all;
}
</style>
