<script lang="ts">
import type { PropType } from 'vue'

import InvCell from './InvCell.vue'
import InvItem from './InvItem/InvItem.vue'
import InvAmountItem from './InvItem/InvAmountItem.vue'
import { ItemType } from './interface'
import type { IAmountDragPayload, IAmountItem, IItem, ItemObj } from './interface'
import { isAmountItem } from './predicates'
import { CELL_SIZE, DRAG_PAYLOAD_SYMBOL } from './constants'

export default {
  components: { InvCell, InvItem, InvAmountItem },
  props: {
    w: { type: Number, required: true },
    h: { type: Number, required: true },
    type: { type: String as PropType<ItemType> },
    stack: { type: Array<{ type: ItemType; max: number }> },
  },
  expose: ['arrange'],
  data() {
    return {
      hoverCell: null as { index: number; x: number; y: number } | null,
      hoverItem: null as { w: number; h: number; x: number; y: number } | null,
      items: [] as ItemObj[],
      draggingItemIndex: null as number | null,
    }
  },
  computed: {
    cells() {
      return Array(this.w * this.h).fill(0)
    },
    itemsMap() {
      return this.items.reduce(
        (acc, item, itemIndex) => {
          for (let i = 0; i < item.h; i++) {
            for (let j = 0; j < item.w; j++) {
              acc[item.y + i][item.x + j] = itemIndex
            }
          }
          return acc
        },
        [
          ...Array(this.h)
            .fill(0)
            .map(() => []),
        ] as number[][]
      )
    },
  },
  methods: {
    isAmountItem,
    onDragEnter(e: DragEvent) {
      // dnd/[property];value=[property-value]
      const paramsRegex = /dnd\/(\S+);value=(.+)$/
      const types = e.dataTransfer?.types
      setTimeout(() => {
        let w: number | undefined = undefined
        let h: number | undefined = undefined
        let x: number | undefined = undefined
        let y: number | undefined = undefined
        types?.forEach((t) => {
          const [, prop, value] = paramsRegex.exec(t) || []
          if (!prop) return
          if (prop === 'w') w = +value
          if (prop === 'h') h = +value
          if (prop === 'x') x = +value
          if (prop === 'y') y = +value
        })
        if (w && h && x !== undefined && y !== undefined) {
          this.hoverItem = { w, h, x, y }
        }
      }, 0)
    },
    onDragEnterCell(index: number) {
      const { x, y } = this.toCoords(index, this.w)
      this.hoverCell = { index, x, y }
    },
    toCoords(i: number, w: number) {
      const x = i % w
      const y = Math.floor(i / w)
      return { x, y }
    },
    // enables to shadow cells under the dragged item
    isOverCell(cI: number) {
      if (!this.hoverCell || !this.hoverItem) return false
      const { x: cX, y: cY } = this.toCoords(cI, this.w)
      const left = this.hoverCell.x - this.hoverItem.x
      const right = left + this.hoverItem.w - 1
      const top = this.hoverCell.y - this.hoverItem.y
      const bottom = top + this.hoverItem.h - 1
      return !(cX < left || cX > right || cY < top || cY > bottom)
    },
    onDragLeaveCell() {
      this.hoverCell = null
      this.hoverItem = null
    },
    onItemDragStart(itemIndex: number) {
      this.draggingItemIndex = itemIndex
    },
    onItemDrop(itemIndex: number, data?: IAmountDragPayload) {
      const item = this.items[itemIndex]
      if (data && isAmountItem(item)) {
        // local item is being dragged somewhere
        const amount = item.amount - data.amount
        if (amount > 0) {
          item.amount = amount
          return
        }
      }
      this.items.splice(itemIndex, 1)
      this.onItemDragEnd()
    },
    onItemDragEnd() {
      this.draggingItemIndex = null
    },
    getItemOverlap(item: IItem) {
      const overlappedItemsIndexes = new Set<number>()
      const overlappedCellsShift: Array<{ x: number; y: number }> = []
      if (this.hoverCell) {
        for (let i = 0; i < item.h; i++) {
          for (let j = 0; j < item.w; j++) {
            const itemIndex = this.itemsMap[item.y + i][item.x + j]
            if (typeof itemIndex === 'number' && this.draggingItemIndex !== itemIndex) {
              overlappedItemsIndexes.add(itemIndex)
              overlappedCellsShift.push({
                x: item.x + j - this.hoverCell.x,
                y: item.y + i - this.hoverCell.y,
              })
            }
          }
        }
      }
      return { indexes: overlappedItemsIndexes, cellsShift: overlappedCellsShift }
    },
    onDrop(e: DragEvent) {
      if (!this.hoverCell || !this.hoverItem) return

      const img = e.dataTransfer?.getData('dnd/img') || './fallback.png'
      const type = e.dataTransfer?.getData('dnd/type')
      const amount = e.dataTransfer?.getData('dnd/amount')
      const scrap = e.dataTransfer?.getData('dnd/scrap')
      const iWillRelease = !!+(e.dataTransfer?.getData('dnd/button-will-release') || '0')

      const item: ItemObj = {
        w: this.hoverItem.w,
        h: this.hoverItem.h,
        x: this.hoverCell.x - this.hoverItem.x,
        y: this.hoverCell.y! - this.hoverItem.y,
        img,
      }
      if (type) item.type = type as ItemType

      if (amount) {
        ;(item as IAmountItem).amount = +amount
        if (scrap) (item as IAmountItem).scrap = !!+scrap
      }

      if (
        // do not match the type of region
        (this.type && item.type !== this.type) ||
        // or do not fit in the region rectangle
        item.x < 0 ||
        item.y < 0 ||
        item.x + item.w > this.w ||
        item.y + item.h > this.h
      ) {
        this.onDragLeaveCell()
        return
      }

      const overlap = this.getItemOverlap(item)

      this.onDragLeaveCell() // this.hoverXXX properties are reset, don't use them below

      if (overlap.indexes.size > 1) {
        //! todo: try to place an item with the current items arrangement first
        if (this.arrange([...this.items, item])) {
          e.preventDefault() // mark drop as successful
        }
        return
      }
      if (overlap.indexes.size === 1) {
        const overlappedItemIndex = overlap.indexes.values().next()
          .value as typeof overlap.indexes extends Set<infer T> ? T : never
        const overlappedItem = this.items[overlappedItemIndex]
        if (this.stack && isAmountItem(overlappedItem) && isAmountItem(item)) {
          // try to stack
          const typeStackRestriction = this.stack.find(({ type }) =>
            overlappedItem.type ? type === overlappedItem.type : type === ItemType.Misc
          )
          if (
            typeStackRestriction &&
            overlappedItem.img === item.img &&
            overlappedItem.amount <= typeStackRestriction.max
          ) {
            let amount = overlappedItem.amount + item.amount
            const excess = Math.max(0, amount - typeStackRestriction.max)
            if (excess) {
              amount = typeStackRestriction.max
            }

            if (amount === overlappedItem.amount) {
              return
            }

            const dragPayload: IAmountDragPayload = { amount: item.amount - excess }
            Object.defineProperty(e, DRAG_PAYLOAD_SYMBOL, { value: dragPayload })

            e.preventDefault() // mark drop as successful
            const newItem = { ...overlappedItem, amount }
            this.items[overlappedItemIndex] = newItem
            return
          }
        }

        // replace

        const cellRealShift = {
          x: overlap.cellsShift[0].x * CELL_SIZE,
          y: overlap.cellsShift[0].y * CELL_SIZE,
        }

        const overlappedItemElement = (this.$refs.itemWrappers as HTMLDivElement[])[
          overlappedItemIndex
        ]
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
              cancelable: true, // setting cancelable=true is crucial because it allows to check defaultPrevented property to see if the drop was successful
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

      // place the item (same when replacing)

      if (isAmountItem(item)) {
        const dragPayload: IAmountDragPayload = { amount: item.amount }
        Object.defineProperty(e, DRAG_PAYLOAD_SYMBOL, { value: dragPayload })
      }

      e.preventDefault() // mark drop as successful
      this.items.push(item)
    },
    /** @returns {boolean} was items arrangement successful or not */
    arrange(possibleItems?: IItem[]) {
      const itemsList = [...(possibleItems || this.items)]
      const items: IItem[] = []

      const mapSize = this.w * this.h
      const flatItemsMap = Array(mapSize).fill(false)
      flatItemsMap.forEach((isOccupied, i, map) => {
        if (isOccupied) return
        const [itemToPlaceIndex, occupiedIndexes] =
          itemsList.reduce((res: [number, number[]] | undefined, item, itemIndex) => {
            if (res) return res

            const itemCellsIndexes = this.getItemCellsIndexes(item, i)
            if (
              itemCellsIndexes.length !== item.w * item.h ||
              itemCellsIndexes.some((ci) => map[ci])
            ) {
              return undefined
            }

            return [itemIndex, itemCellsIndexes]
          }, undefined) || []
        if (occupiedIndexes && typeof itemToPlaceIndex === 'number') {
          occupiedIndexes.forEach((ci) => {
            map[ci] = true
          })
          const [placedItem] = itemsList.splice(itemToPlaceIndex, 1)
          items.push({
            ...placedItem,
            x: i % this.w,
            y: Math.floor(i / this.w),
          })
        }
      })
      if (!itemsList.length) {
        this.items = items
        return true
      }
      return false
    },
    getItemCellsIndexes(item: IItem, cornerIndex: number) {
      const cornerX = cornerIndex % this.w
      const cornerY = Math.floor(cornerIndex / this.w)
      const indexes: number[] = []
      outer: for (let i = cornerY; i < cornerY + item.h; i++) {
        for (let j = cornerX; j < cornerX + item.w; j++) {
          const index = i * this.w + j
          if (index / this.w >= i + 1) {
            // do not fit in this position
            break outer
          }
          indexes.push(index)
        }
      }
      return indexes
    },
  },
}
</script>

<template>
  <div
    class="region"
    :style="{
      width: `calc(var(--cell-size)*${w})`,
      height: `calc(var(--cell-size)*${h})`,
    }"
    @dragenter="onDragEnter"
    @drop="onDrop"
  >
    <InvCell
      v-for="(cell, i) in cells"
      :is-over="isOverCell(i)"
      @dragenter="onDragEnterCell(i)"
      @dragleave="onDragLeaveCell"
      :key="i"
    />
    <div
      v-for="({ x, y, ...item }, i) in items"
      class="itemWrapper"
      :style="{
        top: `calc(var(--cell-size)*${y})`,
        left: `calc(var(--cell-size)*${x})`,
        pointerEvents: hoverItem ? 'none' : 'auto',
      }"
      ref="itemWrappers"
      :key="`${x};${y}`"
    >
      <InvAmountItem
        v-if="isAmountItem(item)"
        v-bind="item"
        @dragstart="onItemDragStart(i)"
        @drop="onItemDrop(i, $event)"
        @dragend="onItemDragEnd"
      />
      <InvItem
        v-else
        v-bind="item"
        @dragstart="onItemDragStart(i)"
        @drop="onItemDrop(i, $event)"
        @dragend="onItemDragEnd"
      />
    </div>
  </div>
</template>

<style scoped>
.region {
  display: flex;
  flex-wrap: wrap;
  position: relative;
}
.itemWrapper {
  position: absolute;
}
</style>
