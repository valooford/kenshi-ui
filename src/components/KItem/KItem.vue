<script lang="ts">
import type { PropType } from 'vue'
import { CELL_SIZE, CELL_HALF_SIZE } from '@/shared/constants'
import { emulateDragAndDropApi } from '@/shared/utils'
import type { IAudioDispatch } from '@/shared/interface'

export default {
  inject: ['store', 'dispatch', 'audio'],
  props: {
    id: { type: String as PropType<string> as PropType<IItemObjId>, required: true },
    visible: { type: Boolean },
    //! todo: callbacks --> @events
    handleDragStart: { type: Function as PropType<(e: DragEvent) => void> },
    handleDragEnd: { type: Function as PropType<() => void> },
    handleFastMove: { type: Function as PropType<() => void> },
  },
  emits: ['iteminfoshow', 'iteminfohide'],
  data() {
    const emptyImage = new Image()
    emptyImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
    return {
      stringId: null as string | null,
      isPreview: false,
      isDragging: false,
      emptyImage,
      gX: 0,
      gY: 0,
      pX: -1000,
      pY: -1000,
      vecO: null as IPoint | null,
      cleanupEventName: null as string | null,
    }
  },
  computed: {
    s() {
      return this.store as IStore
    },
    d() {
      return this.dispatch as IDispatch
    },
    a() {
      return this.audio as IAudioDispatch
    },
    data() {
      return this.s.items[this.id]!
    },
    width() {
      return `${this.data.w * CELL_SIZE}px`
    },
    height() {
      return `${this.data.h * CELL_SIZE}px`
    },
    pivot() {
      const x = this.pX - this.gX * CELL_SIZE - CELL_HALF_SIZE
      const y = this.pY - this.gY * CELL_SIZE - CELL_HALF_SIZE
      return { x, y }
    },
  },
  methods: {
    onMouseEnter(e: MouseEvent) {
      const event = new CustomEvent('ki-iteminfoshow', {
        bubbles: true,
        detail: this.data.stringId,
      })
      e.target?.dispatchEvent(event)
    },
    onMouseLeave(e: MouseEvent) {
      const event = new CustomEvent('ki-iteminfohide', {
        bubbles: true,
        detail: this.data.stringId,
      })
      e.target?.dispatchEvent(event)
    },
    onMouseLeftDown(e: MouseEvent) {
      const el = e.target as HTMLElement
      const rect = el.getBoundingClientRect()
      // find out what cell of an item are meant to be dragged
      const x = Math.floor((e.clientX - rect.left) / CELL_SIZE)
      const y = Math.floor((e.clientY - rect.top) / CELL_SIZE)
      this.isPreview = true
      this.gX = x
      this.gY = y
      this.pX = e.clientX
      this.pY = e.clientY
      // vector to the center of the item
      this.vecO = {
        x: this.pivot.x + rect.width / 2 - this.pX,
        y: this.pivot.y + rect.height / 2 - this.pY,
      }

      const buttonHeld = !!e.detail
      this.cleanupEventName = buttonHeld ? 'mouseup' : 'mousedown'
      setTimeout(() => {
        document.addEventListener(this.cleanupEventName!, this.cleanup)
      }, 0)

      // Since draggable=false we need to handle Drag-and-Drop logic manually.
      // Commenting out this block and setting draggable=true on item's <img /> tag
      // (not the preview one) will enable us to use native Drag-and-Drop once again.
      if (!e.defaultPrevented) {
        // emulate Drag-and-Drop API
        emulateDragAndDropApi({
          element: el,
          elementPointX: e.clientX,
          elementPointY: e.clientY,
          screenX: e.clientX,
          screenY: e.clientY,
          pointerShift: this.vecO,
          shiftKey: e.shiftKey,
          iWillRelease: buttonHeld,
        })
      }
      e.preventDefault() // prevent user-select

      this.a.playItemSound(this.stringId!, 'drag')
    },
    onDragStart(e: DragEvent) {
      if (this.handleDragStart) this.handleDragStart(e)
      if (e.dataTransfer) {
        // selects cursor which is most similar to the default one
        e.dataTransfer.effectAllowed = 'move'
        // using MIME types to pass data to 'dragenter' event handlers
        // because retrieving data via getData() is only accessible in 'drop' event handlers
        // also 'dataTransfer.types' might seem to be empty in debug console, but it's not
        // dnd/[property];value=[property-value]
        e.dataTransfer.setData(`dnd/w;value=${this.data.w}`, '')
        e.dataTransfer.setData(`dnd/h;value=${this.data.h}`, '')
        e.dataTransfer.setData(`dnd/x;value=${this.gX}`, '')
        e.dataTransfer.setData(`dnd/y;value=${this.gY}`, '')

        e.dataTransfer.setData('dnd/id', this.id)
        // removes ghost
        e.dataTransfer.setDragImage(this.emptyImage, 0, 0)
      }

      requestAnimationFrame(() => {
        // prevents immediate 'dragend' event
        this.isDragging = true
      })
    },
    onDragEnd(e: DragEvent) {
      const success = !!+(e.dataTransfer?.getData('dnd/success') || '0')
      if (!success) this.d.validateItemPosition(this.id)
      if (this.handleDragEnd) this.handleDragEnd()
      this.isDragging = false
      this.cleanup()

      this.a.playItemSound(this.stringId!, 'drop')
    },
    cleanup() {
      this.isPreview = false
      this.gX = 0
      this.gY = 0
      this.pX = -1000
      this.pY = -1000
      this.vecO = null
      document.removeEventListener(this.cleanupEventName!, this.cleanup)
      this.cleanupEventName = null
    },
    onDrag(e: DragEvent) {
      this.pX = e.clientX - this.vecO!.x
      this.pY = e.clientY - this.vecO!.y
    },
    onMouseRightClick(e: MouseEvent) {
      // https://stackoverflow.com/questions/41993508/vuejs-bubbling-custom-events
      const all = e.shiftKey || e.ctrlKey
      this.d.onItemFastMove(this.id, { all })
      if (this.handleFastMove) this.handleFastMove()

      this.a.playItemSound(this.stringId!, 'drop')
    },
  },
  created() {
    this.stringId = this.data.stringId
  },
}
</script>

<template>
  <!-- ITEM -->
  <div
    :class="[
      'item',
      isDragging && !visible && 'item_dragging',
      isPreview && !visible && 'item_preview',
    ]"
    :style="{
      height,
      top: `calc(var(--cell-size)*${data.y})`,
      left: `calc(var(--cell-size)*${data.x})`,
    }"
  >
    <img
      :src="data.img"
      alt=""
      draggable="false"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @mousedown.left="onMouseLeftDown"
      @mousedown.right="onMouseLeave"
      @click.right="onMouseRightClick"
      @dragstart="onDragStart"
      @drag="onDrag"
      @dragend="onDragEnd"
      @contextmenu.prevent
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
        :src="data.img"
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
  position: absolute;
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
  user-select: none;
  z-index: 1200;
}
.preview__content {
  position: relative;
}
.item,
.preview__content {
  background-color: rgb(0 0 0 / 0.6);
}
</style>
