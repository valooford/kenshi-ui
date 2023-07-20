<script lang="ts">
import type { PropType } from 'vue'
import { indexToCoords, isAmountItemId, isBackpackItemId, isItemId } from '@/shared/utils'
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
      hoverItem: null as { w: number; h: number; gX: number; gY: number } | null,
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
        let gX: number | undefined = undefined
        let gY: number | undefined = undefined
        types?.forEach((t) => {
          const [, prop, value] = paramsRegex.exec(t) || []
          if (!prop) return
          if (prop === 'w') w = +value!
          if (prop === 'h') h = +value!
          if (prop === 'x') gX = +value!
          if (prop === 'y') gY = +value!
        })
        if (w && h && gX !== undefined && gY !== undefined) {
          this.hoverItem = { w, h, gX, gY }
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
    onDrop(e: DragEvent) {
      if (!this.hoverCell || !this.hoverItem) return

      const id = e.dataTransfer?.getData('dnd/id')
      if (!isItemId(id) && !isAmountItemId(id) && !isBackpackItemId(id)) {
        this.onDragLeaveCell()
        return
      }

      const all = !!+(e.dataTransfer?.getData('dnd/all') || '0')
      const iWillRelease = !!+(e.dataTransfer?.getData('dnd/button-will-release') || '0') // LMB next state

      const { lastCoords, lastIndex } =
        this.d.onItemMove(id, {
          regionId: this.id,
          pos: {
            x: this.hoverCell.x - this.hoverItem.gX,
            y: this.hoverCell.y - this.hoverItem.gY,
          },
          all,
        }) || {}

      const cellRealShift: typeof lastCoords = lastCoords && {
        x: (lastCoords.x - this.hoverCell.x) * CELL_SIZE,
        y: (lastCoords.y - this.hoverCell.y) * CELL_SIZE,
      }

      this.onDragLeaveCell() // this.hoverXXX properties are reset, don't use them below

      // replace
      if (cellRealShift) {
        const overlappedItemElement = (this.$refs.itemWrappers as HTMLDivElement[])[lastIndex!]!
        overlappedItemElement.style.pointerEvents = 'all'
        //! todo: select most appropriate cell index
        const overlappedItemInnerElement = document.elementFromPoint(
          e.clientX + cellRealShift.x,
          e.clientY + cellRealShift.y
        )
        overlappedItemElement.style.pointerEvents = ''

        const dataTransfer = new DataTransfer()
        dataTransfer.setData(`dnd/button-will-release`, `${iWillRelease ? 0 : 1}`)

        let elementToOver: Element | null
        const onMouseMove = (e: MouseEvent) => {
          const clientX = e.clientX
          const clientY = e.clientY
          overlappedItemInnerElement?.dispatchEvent(
            new DragEvent('drag', { clientX, clientY, bubbles: true })
          )
          const newElementToOver = document.elementFromPoint(clientX, clientY)
          if (elementToOver !== newElementToOver) {
            elementToOver?.dispatchEvent(new DragEvent('dragleave', { bubbles: true }))
            newElementToOver?.dispatchEvent(
              new DragEvent('dragenter', { dataTransfer, bubbles: true })
            )
            //! fix: overlapping over items but not cells
            // const a = newElementToOver as HTMLElement
            // a.style.border = '1px solid red'
            elementToOver = newElementToOver
          }
          elementToOver?.dispatchEvent(
            new DragEvent('dragover', { clientX, clientY, bubbles: true })
          )
        }

        const mouseDropEvent = iWillRelease ? 'mouseup' : 'mousedown'
        const onMouseDropEvent = (e: MouseEvent) => {
          const elementToDrop = document.elementFromPoint(e.clientX, e.clientY)
          elementToDrop?.dispatchEvent(
            new DragEvent('drop', {
              clientX: e.clientX,
              clientY: e.clientY,
              dataTransfer,
              bubbles: true,
              // setting cancelable=true is crucial because it allows to check
              // defaultPrevented property to see if the drop was successful
              cancelable: true,
            })
          )
          overlappedItemInnerElement?.dispatchEvent(new DragEvent('dragend', { bubbles: true }))
          document.removeEventListener('mousemove', onMouseMove)
          document.removeEventListener(mouseDropEvent, onMouseDropEvent)
        }

        setTimeout(() => {
          // let the previous item to catch the 'drop' event on the document
          overlappedItemInnerElement?.dispatchEvent(
            new MouseEvent('mousedown', {
              clientX: e.clientX + cellRealShift.x,
              clientY: e.clientY + cellRealShift.y,
              bubbles: true,
              detail: +!!iWillRelease, // 0 - drag ends when button  pressed, 1 - when released
            })
          )
          overlappedItemInnerElement?.dispatchEvent(
            new DragEvent('dragstart', { dataTransfer, bubbles: true, shiftKey: true })
          )
          setTimeout(() => {
            // prevent handling the freshly programmatically triggered 'mousedown' event
            document.addEventListener('mousemove', onMouseMove)
            document.addEventListener(mouseDropEvent, onMouseDropEvent)
          }, 0)
        }, 0)
      }
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
    <div
      v-for="itemId in data.items"
      :style="{
        pointerEvents: hoverItem ? 'none' : 'auto',
      }"
      ref="itemWrappers"
      :key="itemId"
    >
      <AmountItem v-if="isAmountItemId(itemId)" :id="itemId" />
      <BackpackItem v-else-if="isBackpackItemId(itemId)" :id="itemId" />
      <KItem v-else :id="itemId" />
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
