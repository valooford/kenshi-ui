<script lang="ts">
import InvCell from './InvCell.vue'
import InvItem from './InvItem.vue'
import { CELL_SIZE, DRAG_PAYLOAD_SYMBOL } from './constants'

interface IItem {
  w: number
  h: number
  x: number
  y: number
  img: string
  amount: number
  type?: string
  scrap?: boolean
}

interface IDragPayload {
  amount: number
}

export default {
  components: { InvCell, InvItem },
  props: {
    w: { type: Number, required: true },
    h: { type: Number, required: true },
    type: { type: String },
    stack: { type: Array<{ type: string; max: number }> },
  },
  expose: ['arrange'],
  data() {
    return {
      hvrI: null as number | null,
      hvrX: null as number | null,
      hvrY: null as number | null,
      iW: null as number | null,
      iH: null as number | null,
      iX: null as number | null,
      iY: null as number | null,
      iImg: null as string | null,
      iType: null as string | null,
      iAmount: null as number | null,
      iScrap: null as boolean | null,
      iWillRelease: null as boolean | null,
      items: [] as IItem[],
      draggingItemIndex: null as number | null,
    }
  },
  computed: {
    cells() {
      return Array(this.w * this.h).fill(0)
    },
    isItemOver() {
      return !!this.iW
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
    onDragEnter(e: DragEvent) {
      // dnd/[property];value=[property-value]
      const paramsRegex = /dnd\/(\S+);value=(.+)$/
      const types = e.dataTransfer?.types
      setTimeout(() => {
        types?.forEach((t) => {
          const [, prop, value] = paramsRegex.exec(t) || []
          if (prop === 'w') this.iW = +value
          if (prop === 'h') this.iH = +value
          if (prop === 'x') this.iX = +value
          if (prop === 'y') this.iY = +value
          if (prop === 'img') this.iImg = value
          if (prop === 'type') this.iType = value
          if (prop === 'amount') this.iAmount = +value
          if (prop === 'scrap') this.iScrap = !!+value
          if (prop === 'button-will-release') this.iWillRelease = !!+value
        })
      }, 0)
    },
    onDragEnterCell(cI: number) {
      this.hvrI = cI
      const { x: cX, y: cY } = this.toCoords(cI, this.w)
      this.hvrX = cX
      this.hvrY = cY
    },
    toCoords(i: number, w: number) {
      const x = i % w
      const y = Math.floor(i / w)
      return { x, y }
    },
    // enables to shadow cells under the dragged item
    isOverCell(cI: number) {
      if (this.hvrI === null) return false
      const { x: cX, y: cY } = this.toCoords(cI, this.w)
      const left = this.hvrX! - this.iX!
      const right = left + this.iW! - 1
      const top = this.hvrY! - this.iY!
      const bottom = top + this.iH! - 1
      return !(cX < left || cX > right || cY < top || cY > bottom)
    },
    onDragLeaveCell() {
      this.hvrI = null
      this.hvrX = null
      this.hvrY = null
      this.iW = null
      this.iH = null
      this.iX = null
      this.iY = null
      this.iImg = null
      this.iType = null
      this.iAmount = null
      this.iScrap = null
      this.iWillRelease = null
    },
    onItemDragStart(itemIndex: number) {
      this.draggingItemIndex = itemIndex
    },
    onItemDrop(itemIndex: number, data: IDragPayload) {
      // local item is being dragged somewhere
      const amount = this.items[itemIndex].amount - data.amount
      if (amount > 0) {
        this.items[itemIndex].amount = amount
      } else {
        this.items.splice(itemIndex, 1)
      }
      this.onItemDragEnd()
    },
    onItemDragEnd() {
      this.draggingItemIndex = null
    },
    getItemOverlap(item: IItem) {
      const overlappedItemsIndexes = new Set<number>()
      const overlappedCellsShift: Array<{ x: number; y: number }> = []
      for (let i = 0; i < item.h; i++) {
        for (let j = 0; j < item.w; j++) {
          const itemIndex = this.itemsMap[item.y + i][item.x + j]
          if (typeof itemIndex === 'number' && this.draggingItemIndex !== itemIndex) {
            overlappedItemsIndexes.add(itemIndex)
            overlappedCellsShift.push({
              x: item.x + j - this.hvrX!,
              y: item.y + i - this.hvrY!,
            })
          }
        }
      }
      return { indexes: overlappedItemsIndexes, cellsShift: overlappedCellsShift }
    },
    onDrop(e: DragEvent) {
      const item: IItem = {
        w: this.iW!,
        h: this.iH!,
        x: this.hvrX! - this.iX!,
        y: this.hvrY! - this.iY!,
        img: this.iImg!,
        amount: this.iAmount!,
      }
      if (this.iType) item.type = this.iType
      if (this.iScrap) item.scrap = this.iScrap

      if (
        (this.type && item.type !== this.type) ||
        item.x < 0 ||
        item.y < 0 ||
        item.x + item.w > this.w ||
        item.y + item.h > this.h
      ) {
        this.onDragLeaveCell()
        return
      }

      const iWillRelease = this.iWillRelease
      const overlap = this.getItemOverlap(item)

      this.onDragLeaveCell() // this.iXXX properties are reset, don't use them below

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
        if (this.stack) {
          // try to stack
          const typeStackRestriction = this.stack.find(({ type }) =>
            overlappedItem.type ? type === overlappedItem.type : type === 'misc'
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

            const dragPayload: IDragPayload = { amount: item.amount - excess }
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
        dataTransfer.setData(`dnd/button-will-release;value=${iWillRelease ? 0 : 1}`, '')

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

      const dragPayload: IDragPayload = { amount: item.amount }
      Object.defineProperty(e, DRAG_PAYLOAD_SYMBOL, { value: dragPayload })

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
      v-for="(item, i) in items"
      class="itemWrapper"
      :style="{
        top: `calc(var(--cell-size)*${item.y})`,
        left: `calc(var(--cell-size)*${item.x})`,
        pointerEvents: isItemOver ? 'none' : 'auto',
      }"
      ref="itemWrappers"
      :key="`${item.x};${item.y}`"
    >
      <InvItem
        :w="item.w"
        :h="item.h"
        :img="item.img"
        :type="item.type"
        :amount="item.amount"
        :scrap="item.scrap"
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
