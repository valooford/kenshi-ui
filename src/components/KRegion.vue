<script lang="ts">
import type { PropType } from 'vue'
import {
  indexToCoords,
  isAmountItemId,
  isBackpackItemId,
  isItemId,
  emulateDragAndDropApi,
} from '@/shared/utils'
import { CELL_SIZE } from '@/shared/constants'

import KCell from './KCell.vue'
import KItem from './KItem/KItem.vue'
import AmountItem from './KItem/AmountItem.vue'
import BackpackItem from './KItem/BackpackItem.vue'

export default {
  components: { KCell, KItem, AmountItem, BackpackItem },
  inject: ['store', 'dispatch'],
  props: {
    id: { type: String as PropType<string> as PropType<IRegionObjId>, required: true },
  },
  data() {
    return {
      hoverCell: null as { x: number; y: number } | null,
      hoverItem: null as {
        w: number
        h: number
        gX: number
        gY: number
        oX?: number
        oY?: number
      } | null,
    }
  },
  computed: {
    s() {
      return this.store as IStore
    },
    d() {
      return this.dispatch as IDispatch
    },
    data() {
      return this.s.regions[this.id]!
    },
    /** Just an array of certain length to map elements from */
    cells() {
      return Array(this.data.w * this.data.h).fill(0)
    },
  },
  methods: {
    // type predicates
    isAmountItemId,
    isBackpackItemId,

    /** Finds out the parameters of hovering item and stores them */
    onDragEnter(e: DragEvent) {
      // dnd/[property];value=[property-value]
      const paramsRegex = /dnd\/(\S+);value=(.+)$/
      const types = e.dataTransfer?.types
      setTimeout(() => {
        let w: number | undefined = undefined
        let h: number | undefined = undefined
        // grab
        let gX: number | undefined = undefined
        let gY: number | undefined = undefined
        // origin
        let oX: number | undefined = undefined
        let oY: number | undefined = undefined
        types?.forEach((t) => {
          const [, prop, value] = paramsRegex.exec(t) || []
          if (!prop) return
          if (prop === 'w') w = +value!
          if (prop === 'h') h = +value!
          if (prop === 'x') gX = +value!
          if (prop === 'y') gY = +value!
          if (prop === 'ox') oX = +value!
          if (prop === 'oy') oY = +value!
        })
        if (w && h && gX !== undefined && gY !== undefined) {
          this.hoverItem = { w, h, gX, gY, oX, oY }
        }
      }, 0)
    },

    /** Stores coordinates of cell being hovered */
    onDragEnterCell(index: number) {
      this.hoverCell = indexToCoords(index, this.data.w)
    },

    /**
     * Checks if the hovering item is on top of certain cell
     * Enables to shadow such cells
     */
    isOverCell(cI: number) {
      if (!this.hoverCell || !this.hoverItem) return false
      const { x: cX, y: cY } = indexToCoords(cI, this.data.w)
      const left = this.hoverCell.x - this.hoverItem.gX
      const right = left + this.hoverItem.w - 1
      const top = this.hoverCell.y - this.hoverItem.gY
      const bottom = top + this.hoverItem.h - 1
      return !(cX < left || cX > right || cY < top || cY > bottom)
    },

    /** Clears the hover preview related parameters */
    onDragLeaveCell() {
      this.hoverCell = null
      this.hoverItem = null
    },

    /** Dispatches onItemMove action and rules the replace-related Drag-and-Drop emulation */
    async onDrop(e: DragEvent) {
      if (!this.hoverCell || !this.hoverItem) return

      const id = e.dataTransfer?.getData('dnd/id')
      if (!isItemId(id) && !isAmountItemId(id) && !isBackpackItemId(id)) {
        this.onDragLeaveCell()
        return
      }

      const all = !!+(e.dataTransfer?.getData('dnd/all') || '0')
      const iWillRelease = !!+(e.dataTransfer?.getData('dnd/button-will-release') || '0') // LMB next state

      const { lastCoords, lastIndex, isContinuous } =
        this.d.onItemMove(id, {
          regionId: this.id,
          pos: {
            x: this.hoverCell.x - this.hoverItem.gX,
            y: this.hoverCell.y - this.hoverItem.gY,
          },
          all,
        }) || {}

      let elementToEmulateDraggingOn: Element | null = null
      let elementPointX: number | null = null
      let elementPointY: number | null = null
      if (lastCoords) {
        elementPointX = e.clientX + (lastCoords.x - this.hoverCell.x) * CELL_SIZE
        elementPointY = e.clientY + (lastCoords.y - this.hoverCell.y) * CELL_SIZE
        const overlappedItemElement = (this.$refs.itemBoxes as HTMLDivElement[])[lastIndex!]!
        overlappedItemElement.style.pointerEvents = 'all'
        elementToEmulateDraggingOn = document.elementFromPoint(elementPointX, elementPointY)
        overlappedItemElement.style.pointerEvents = ''
      } else if (isContinuous) {
        // always catch top-left cell
        elementPointX = this.hoverItem.oX! - this.hoverItem.gX * CELL_SIZE
        elementPointY = this.hoverItem.oY! - this.hoverItem.gY * CELL_SIZE
        await new Promise((r) => setTimeout(r))
        elementToEmulateDraggingOn = document.elementFromPoint(elementPointX, elementPointY)
      }

      // replace
      if (elementToEmulateDraggingOn) {
        // let the previous item to catch the 'drop' event on the document
        setTimeout(async () => {
          const mousedownEvent = new MouseEvent('mousedown', {
            clientX: elementPointX!,
            clientY: elementPointY!,
            bubbles: true,
            detail: +!!iWillRelease, // 0 - drag ends when button pressed, 1 - when released
          })
          mousedownEvent.preventDefault() // signalize that we will emulate dragging by ourselves
          elementToEmulateDraggingOn?.dispatchEvent(mousedownEvent)

          // enables cells to be picked with document.elementFromPoint() calls
          ;(this.$refs.itemsWrapper as HTMLElement).style.pointerEvents = 'none'
          await emulateDragAndDropApi({
            element: elementToEmulateDraggingOn,
            elementPointX: elementPointX!,
            elementPointY: elementPointY!,
            clientX: e.clientX,
            clientY: e.clientY,
            iWillRelease,
          })
          ;(this.$refs.itemsWrapper as HTMLElement).style.pointerEvents = ''
        }, 0)
      }

      this.onDragLeaveCell() // cleanup
    },
  },
}
</script>

<template>
  <div
    class="region"
    :style="{
      width: `calc(var(--cell-size)*${data.w})`,
      height: `calc(var(--cell-size)*${data.h})`,
    }"
    @dragenter="onDragEnter"
    @drop="onDrop"
  >
    <KCell
      v-for="(cell, i) in cells"
      :is-over="isOverCell(i)"
      @dragenter="onDragEnterCell(i)"
      @dragleave="onDragLeaveCell"
      :key="i"
    />
    <div ref="itemsWrapper">
      <div
        v-for="itemId in data.items"
        :style="{ pointerEvents: hoverItem ? 'none' : undefined }"
        ref="itemBoxes"
        :key="itemId"
      >
        <AmountItem v-if="isAmountItemId(itemId)" :id="itemId" />
        <BackpackItem v-else-if="isBackpackItemId(itemId)" :id="itemId" />
        <KItem v-else :id="itemId" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.region {
  display: flex;
  flex-wrap: wrap;
  position: relative;
}
</style>
