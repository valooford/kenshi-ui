<script lang="ts">
import InvCell from './InvCell.vue'
import InvItem from './InvItem.vue'

interface IItem {
  w: number
  h: number
  x: number
  y: number
  img: string
}

export default {
  components: { InvCell, InvItem },
  props: {
    w: { type: Number, required: true },
    h: { type: Number, required: true },
  },
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
          switch (prop) {
            case 'w':
              this.iW = +value
              break
            case 'h':
              this.iH = +value
              break
            case 'x':
              this.iX = +value
              break
            case 'y':
              this.iY = +value
              break
            case 'img':
              this.iImg = value
              break
            default:
          }
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
    },
    onItemDragStart(itemIndex: number) {
      this.draggingItemIndex = itemIndex
    },
    onItemDrop(itemIndex: number) {
      // local item is being dragged somewhere
      this.items.splice(itemIndex, 1)
    },
    onItemDragEnd() {
      this.draggingItemIndex = null
    },
    onDrop(e: DragEvent) {
      const item: IItem = {
        w: this.iW!,
        h: this.iH!,
        x: this.hvrX! - this.iX!,
        y: this.hvrY! - this.iY!,
        img: this.iImg!,
      }
      this.onDragLeaveCell()
      if (item.x < 0 || item.y < 0 || item.x + item.w > this.w || item.y + item.h > this.h) {
        return
      }

      const overlap = this.getItemOverlap(item)
      if (overlap.size) {
        return
      }

      e.preventDefault() // mark drop as successful
      this.items.push(item)
    },
    getItemOverlap(item: IItem) {
      const overlappedItemsIndexes = new Set<number>()
      for (let i = 0; i < item.h; i++) {
        for (let j = 0; j < item.w; j++) {
          const itemIndex = this.itemsMap[item.y + i][item.x + j]
          if (typeof itemIndex === 'number' && this.draggingItemIndex !== itemIndex) {
            overlappedItemsIndexes.add(itemIndex)
          }
        }
      }
      return overlappedItemsIndexes
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
      :key="`${item.x};${item.y}`"
    >
      <InvItem
        :w="item.w"
        :h="item.h"
        :img="item.img"
        @dragstart="onItemDragStart(i)"
        @drop="onItemDrop(i)"
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
