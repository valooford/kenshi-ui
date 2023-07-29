<script lang="ts">
import { nanoid } from 'nanoid'
import { ItemType, RegionType } from '@/shared/constants'
import {
  isItemId,
  isAmountItemId,
  isBackpackItemId,
  isAmountItem,
  isRegionId,
  isBackpackRegionId,
} from '@/shared/utils'

type IItemsMap = [string, number][][]

export default {
  provide() {
    return {
      store: this.$data,
      dispatch: {
        selectCharacter: this.selectCharacter,
        resetSelectedCharacter: this.resetSelectedCharacter,
        openMainSeamInventory: this.openMainSeamInventory,
        openRelatedSeamInventory: this.openRelatedSeamInventory,
        closeSeamInventory: this.closeSeamInventory,
        onItemMove: this.onItemMove,
        validateItemPosition: this.validateItemPosition,
        arrangeRegion: this.arrangeRegion,
        openBackpack: this.openBackpack,
        closeBackpack: this.closeBackpack,
      } as IDispatch,
    }
  },
  data() {
    return {
      items: {},
      regions: {},
      characters: {},
      charactersList: [],
      selectedCharacter: null,
      seam: { main: null, related: null },
    } as IStore
  },
  methods: {
    // item
    createItem(attrs: Omit<IItem, 'id'>): IItemId {
      const rawId = `IItem_${nanoid()}` as const
      const id = rawId as IItemId
      this.items[id] = { ...attrs, id: rawId }
      return id
    },
    createAmountItem(attrs: Omit<IAmountItem, 'id'>): IAmountItemId {
      const rawId = `IAmountItem_${nanoid()}` as const
      const id = rawId as IAmountItemId
      this.items[id] = { ...attrs, id: rawId }
      return id
    },
    createBackpackItem(
      attrs: Omit<IBackpackItem, 'id' | 'innerRegionId'>,
      regionAttrs: Omit<IRegion, 'id' | 'items'>
    ): IBackpackItemId {
      const rawId = `IBackpackItem_${nanoid()}` as const
      const id = rawId as IBackpackItemId
      const innerRegionId = this.createRegion(regionAttrs)
      this.items[id] = { ...attrs, id: rawId, innerRegionId }
      return id
    },
    updateItem(id: IItemObjId, item: IItemObj) {
      if (isItemId(id)) {
        this.items[id] = item as IItem
      } else if (isAmountItemId(id)) {
        this.items[id] = item as IAmountItem
      } else if (isBackpackItemId(id)) {
        this.items[id] = item as IBackpackItem
      } else throw Error('ItemId of unknown type encountered')
    },
    exhaustItem(id: IItemObjId) {
      const item = this.items[id]!
      const region = this.regions[item.regionId]!
      this.updateRegion(item.regionId, {
        ...region,
        items: (region.items as any).filter((itemId: IItemObjId) => itemId !== id), //! temp: any
      })
      delete this.items[id]
    },
    /** @public */
    openBackpack(id: IBackpackItemId) {
      const item = this.items[id]!
      this.updateItem(id, { ...item, isOpened: true })
    },
    /** @public */
    closeBackpack(id: IBackpackItemId) {
      const item = this.items[id]!
      this.updateItem(id, { ...item, isOpened: false })
    },

    // region
    createRegion(attrs: Omit<IRegion, 'id' | 'items'>): IRegionId {
      const rawId = `IRegion_${nanoid()}` as const
      const id = rawId as IRegionId
      this.regions[id] = { ...attrs, id: rawId, items: [] }
      return id
    },
    createBackpackRegion(attrs: Omit<IBackpackRegion, 'id' | 'items'>): IBackpackRegionId {
      const rawId = `IBackpackRegion_${nanoid()}` as const
      const id = rawId as IBackpackRegionId
      this.regions[id] = { ...attrs, id: rawId, items: [] }
      return id
    },
    updateRegion(id: IRegionObjId, region: IRegionObj) {
      if (isRegionId(id)) {
        this.regions[id] = region as IRegion
      } else if (isBackpackRegionId(id)) {
        this.regions[id] = region as IBackpackRegion
      } else throw Error('RegionId of unknown type encountered')
    },
    createCharacterRegions(): ICharacterRegions {
      return {
        armor: this.createRegion({ w: 4, h: 6, type: 'armor' }),
        backpack: this.createBackpackRegion({ w: 5, h: 4, type: 'backpack' }),
        belt: this.createRegion({ w: 2, h: 2, type: 'belt' }),
        boots: this.createRegion({ w: 4, h: 2, type: 'boots' }),
        head: this.createRegion({ w: 4, h: 3, type: 'head' }),
        inventory: this.createRegion({ w: 8, h: 10, type: 'misc' }),
        pants: this.createRegion({ w: 4, h: 5, type: 'pants' }),
        shirt: this.createRegion({ w: 4, h: 2, type: 'shirt' }),
        weapon1: this.createRegion({ w: 10, h: 2, type: 'weapon' }),
        weapon2: this.createRegion({ w: 7, h: 1, type: 'weapon' }),
      }
    },

    // inventory owner

    // - character
    createCharacter(name: string): ICharacterId {
      const rawId = `ICharacter_${nanoid()}` as const
      const id = rawId as ICharacterId
      this.characters[id] = {
        id: rawId,
        name,
        regions: this.createCharacterRegions(),
      }
      this.charactersList.push(id)
      return id
    },
    /** @public */
    selectCharacter(id: ICharacterId) {
      this.selectedCharacter = id

      if (this.seam.related === id) {
        this.closeSeamInventory()
      } else if (this.seam.main) {
        this.openMainSeamInventory()
      }
    },
    /** @public */
    resetSelectedCharacter() {
      this.selectedCharacter = null
      if (this.seam.main) {
        this.closeSeamInventory()
      }
    },

    // seam
    /** @public */
    openMainSeamInventory() {
      this.seam.main = this.selectedCharacter
    },
    /** @public */
    openRelatedSeamInventory(id: ICharacterId) {
      this.seam.related = id
      if (!this.seam.main) {
        this.openMainSeamInventory()
      }
    },
    /** @public */
    closeSeamInventory() {
      this.seam.main = null
      this.seam.related = null
    },

    /**
     * @public
     * @description Handles item movement-related logic with different cases for multiple scenarios
     */
    onItemMove(
      id: IItemObjId,
      options: { regionId?: IRegionObjId; pos?: IPoint; all?: boolean }
    ): ReturnType<IDispatch['onItemMove']> {
      //! temp: if no regionId passed, then find id of linked region in current or seam inventory
      const regionId = options.regionId || ('' as IRegionObjId)
      //! temp: if no pos passed, then find suitable stack or vacant place
      const pos = options.pos || { x: 0, y: 0 }

      const item = this.items[id]!
      const region = this.regions[regionId]!

      if (
        // do not match the type of region
        (region.type !== RegionType.Misc && item.type !== region.type) ||
        // or do not fit in the region rectangle
        pos.x < 0 ||
        pos.y < 0 ||
        pos.x + item.w > region.w ||
        pos.y + item.h > region.h
      )
        return { success: false }

      const itemsMap = this.getItemsMap(regionId)

      const itemType = item.type || ItemType.Misc
      const typeStackRestriction = region.stack?.find(({ type }) => type === itemType)

      const overlap = this.getOverlap({
        itemsMap,
        item,
        pos,
        isAmount: isAmountItem(item) && !!typeStackRestriction,
      })

      let itemPieceId: IAmountItemId | undefined = undefined
      if (isAmountItem(item) && !options.all && item.amount > 1) {
        itemPieceId = this.createAmountItem({ ...item, amount: item.amount % 1 || 1 })
      }
      const itemToMoveId = itemPieceId || id
      const itemToMove = this.items[itemToMoveId]!

      // Case 1: overlap with 2 or more items
      // result: movement rejection
      if (overlap.ids.size > 1) {
        if (itemPieceId) this.exhaustItem(itemPieceId)
        return { success: false }
      }

      // Case 2: overlap with exactly 1 item
      if (overlap.ids.size === 1) {
        const overlappedItemId = overlap.ids.values().next()
          .value as typeof overlap.ids extends Set<infer T> ? T : never

        // Case 2.1: overlap with itself
        // result: update item coordinates
        if (overlappedItemId === id) {
          this.updateItem(id, { ...item, ...pos })
          if (itemPieceId) this.exhaustItem(itemToMoveId)
          return { success: true }
        }

        const overlappedItem = this.items[overlappedItemId as IItemObjId]!

        // Case 2.2: overlap with amount item of the same type (and not full)
        // result: extract piece (or take all the amount), merge it with an item and return the excess if exists
        if (
          typeStackRestriction &&
          isAmountItem(overlappedItem) &&
          isAmountItem(item) &&
          isAmountItem(itemToMove) &&
          overlappedItem.img === itemToMove.img &&
          overlappedItem.amount < typeStackRestriction.max
        ) {
          let amount = overlappedItem.amount + itemToMove.amount
          const excess = Math.max(0, amount - typeStackRestriction.max)
          if (excess) {
            amount = typeStackRestriction.max
            this.updateItem(id, { ...item, amount: item.amount - itemToMove.amount + excess })
            if (itemPieceId) this.exhaustItem(itemPieceId)
          } else {
            this.updateItem(id, { ...item, amount: item.amount - itemToMove.amount })
            this.exhaustItem(itemToMoveId)
          }

          this.updateItem(overlappedItemId as IAmountItemId, {
            ...overlappedItem,
            ...pos,
            amount,
          })

          return { success: true, isContinuous: !!excess }
        }

        // Case 2.3: overlap with an item when it can't be stack together
        // result: replace overlapped item with a fitting piece of the current one and continue dragging it in another place
        if (options.all && isAmountItemId(id)) {
          this.safePlaceAmountItem(id, regionId, pos)
          return { success: true, lastCoords: overlap.lastCoords, lastIndex: overlap.lastIndex }
        }

        // Case 2.4: same as Case 3.2, but the returning values are set
      }

      // Case 3.1: no overlap, but it's an amount item
      // result: place only piece of of it that fits in and continue dragging the rest of the amount to another place
      if (!overlap.ids.size && options.all && isAmountItemId(id) && isAmountItem(item)) {
        this.safePlaceAmountItem(id, regionId, pos)
        if (id in this.items && this.items[id]!.amount !== item.amount) {
          return { success: true, isContinuous: true }
        }
        return { success: true }
      }

      // Case 3.2: no/some overlap, just a regular movement or replacement
      // result: place the item and return the replace-related values if they were set
      if (item.regionId !== regionId || itemPieceId) {
        const prevRegion = this.regions[item.regionId]!
        this.updateRegion(item.regionId as IRegionObjId, {
          ...prevRegion,
          items: prevRegion.items.filter((itemId) => itemId !== itemToMoveId) as any, //! temp: any
        })
        this.updateRegion(regionId, { ...region, items: [...(region.items as any), itemToMoveId] }) //! temp: any
      }
      this.updateItem(itemToMoveId, { ...itemToMove, ...pos, regionId })
      if (itemPieceId && isAmountItem(item) && isAmountItem(itemToMove))
        this.updateItem(id as IAmountItemId, { ...item, amount: item.amount - itemToMove.amount })

      return { success: true, lastCoords: overlap.lastCoords, lastIndex: overlap.lastIndex }
    },
    /** @description Builds the region matrix with id-index value pairs for occupied cells */
    getItemsMap(id: IRegionObjId, ignoredItemId?: IItemObjId) {
      const region = this.regions[id]!
      const itemsList = region.items.map((itemId) => this.items[itemId]!)
      return itemsList.reduce(
        (acc, item, index) => {
          if (ignoredItemId && item.id === ignoredItemId) return acc
          for (let i = 0; i < item.h; i++) {
            for (let j = 0; j < item.w; j++) {
              acc[item.y + i]![item.x + j] = [item.id, index]
            }
          }
          return acc
        },
        [
          ...Array(region.h)
            .fill(0)
            .map(() => Array(region.w).fill(undefined)),
        ] as IItemsMap
      )
    },
    /**
     * @description Defines if the item is overlapping some other items in the region
     * @returns The set of overlapped item ids and some info about the last overlap
     */
    getOverlap({
      itemsMap,
      item,
      pos,
      isAmount,
    }: {
      itemsMap: IItemsMap
      item: IItemObj
      pos: IPoint
      isAmount: boolean
    }) {
      const overlap = {
        ids: new Set<string>(),
        lastCoords: undefined as IPoint | undefined,
        lastIndex: undefined as number | undefined,
      }
      for (let i = 0; i < item.h; i++) {
        for (let j = 0; j < item.w; j++) {
          const [itemId, itemIndex] = itemsMap[pos.y + i]![pos.x + j] || []
          if (typeof itemId === 'string' && (isAmount || itemId !== item.id)) {
            overlap.ids.add(itemId)
            overlap.lastCoords = { x: pos.x + j, y: pos.y + i }
            overlap.lastIndex = itemIndex!
          }
        }
      }
      return overlap
    },
    /**
     * @public
     * @description Checks if the item position is correct and fixes it if it's not
     */
    validateItemPosition(id: IItemObjId) {
      const item = this.items[id]!

      let itemsMap = this.getItemsMap(item.regionId, id)
      let pos: IPoint | null = null

      for (let i = item.y; i < item.y + item.h; i++) {
        for (let j = item.x; j < item.x + item.w; j++) {
          if (itemsMap[i]![j]) {
            // try to find the new place
            pos = this.findPlace({ itemsMap, w: item.w, h: item.h })
            if (pos) {
              this.unsafePlaceItem(id, item.regionId, pos)
              return
            }
            // arrange target region and try to find the new place
            this.arrangeRegion(item.regionId, id)
            itemsMap = this.getItemsMap(item.regionId, id)
            pos = this.findPlace({ itemsMap, w: item.w, h: item.h })
            if (pos) {
              this.unsafePlaceItem(id, item.regionId, pos)
              return
            }
            // try to place in in the registry
            itemsMap = this.getItemsMap('IRegion_registry' as IRegionId, id)
            pos = this.findPlace({ itemsMap, w: item.w, h: item.h })
            if (pos) {
              this.unsafePlaceItem(id, 'IRegion_registry' as IRegionId, pos)
              return
            }
            // exhaust the item (drop it to the ground)
            this.exhaustItem(id)
            return
          }
        }
      }
    },
    /**
     * @public
     * @description Tries to optimise items placement by filling the region from the top left corner to the bottom right one
     */
    arrangeRegion(id: IRegionObjId, ignoredItemId?: IItemObjId) {
      const region = this.regions[id]!

      const processedItems = ignoredItemId
        ? region.items.filter((itemId) => itemId !== ignoredItemId)
        : region.items
      const itemsList = processedItems.map((itemId) => this.items[itemId]!) // itemId[] --> item[]
      const items: IItemObj[] = []

      const mapSize = region.w * region.h
      const itemsFlatMap = Array(mapSize).fill(false)
      itemsFlatMap.forEach((isOccupied, i, map) => {
        if (isOccupied) return
        // get indexes and cells of the first suitable item
        const [itemToPlaceIndex, occupiedIndexes] =
          itemsList.reduce((res: [number, number[]] | undefined, item, itemIndex) => {
            if (res) return res

            const itemCellsIndexes = this.getItemCellsIndexes(item, region.w, i)
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
          if (placedItem) {
            items.push({
              ...placedItem,
              x: i % region.w,
              y: Math.floor(i / region.w),
            })
          }
        }
      })

      // update item positions
      if (!itemsList.length) {
        processedItems.forEach((id, i) => {
          this.updateItem(id, items[i]!)
        })
      }
    },
    /** @description For a given item and region finds indexes of each cell as if an item were placed in the specified corner */
    getItemCellsIndexes(item: IItemObj, regionW: number, cornerIndex: number) {
      const cornerX = cornerIndex % regionW
      const cornerY = Math.floor(cornerIndex / regionW)
      const indexes: number[] = []
      outer: for (let i = cornerY; i < cornerY + item.h; i++) {
        for (let j = cornerX; j < cornerX + item.w; j++) {
          const index = i * regionW + j
          if (index / regionW >= i + 1) {
            // do not fit in this position
            break outer
          }
          indexes.push(index)
        }
      }
      return indexes
    },
    unsafePlaceItem(id: IItemObjId, regionId: IRegionObjId, pos: IPoint) {
      const region = this.regions[regionId]!
      const item = this.items[id]!
      if (regionId !== item.regionId) {
        // remove from previous region
        const prevRegion = this.regions[item.regionId]!
        this.updateRegion(item.regionId, {
          ...prevRegion,
          items: (prevRegion.items as any).filter((iId: IItemObjId) => iId !== id),
        }) //! temp: any
        // place onto new region
        this.updateRegion(regionId, { ...region, items: [...(region.items as any), id] }) //! temp: any
      }
      this.updateItem(id, { ...item, ...pos, regionId: regionId })
    },
    /** @description Places an item or its fitting piece to the specified position */
    safePlaceAmountItem(id: IAmountItemId, regionId: IRegionObjId, pos: IPoint) {
      const region = this.regions[regionId]!
      const item = this.items[id]!

      const itemType = item.type || ItemType.Misc
      const typeStackRestriction = region.stack?.find(({ type }) => type === itemType)
      if (!typeStackRestriction || item.amount > typeStackRestriction.max) {
        const maxAmount = typeStackRestriction?.max ?? 1
        const itemPieceAmount = Math.min(item.amount, maxAmount)
        const itemPieceId = this.createAmountItem({
          ...item,
          ...pos,
          regionId: regionId,
          amount: itemPieceAmount,
        })
        this.updateRegion(regionId, { ...region, items: [...(region.items as any), itemPieceId] }) //! temp: any
        if (itemPieceAmount === item.amount) {
          this.exhaustItem(id)
        } else {
          this.updateItem(id, { ...item, amount: item.amount - itemPieceAmount })
        }
        return
      }

      if (regionId !== item.regionId) {
        // remove from previous region
        const prevRegion = this.regions[item.regionId]!
        this.updateRegion(item.regionId, {
          ...prevRegion,
          items: (prevRegion.items as any).filter((iId: IItemObjId) => iId !== id),
        }) //! temp: any
        // place onto new region
        this.updateRegion(regionId, { ...region, items: [...(region.items as any), id] }) //! temp: any
      }
      this.updateItem(id, { ...item, ...pos, regionId: regionId })
    },
    /** @description Distributes an item over a region, performs all the necessary updates */
    distributeItem(id: IRegionObjId, itemId: IItemObjId) {
      const region = this.regions[id]!
      const item = this.items[itemId]!

      if (isAmountItem(item) && item.amount > 1) {
        const itemType = item.type || ItemType.Misc
        const typeStackRestriction = region.stack?.find(({ type }) => type === itemType)
        if (!typeStackRestriction || item.amount > typeStackRestriction.max) {
          // try to place by pieces

          const maxAmount = typeStackRestriction?.max ?? 1
          let { amount } = item
          const itemPieces: IAmountItemId[] = []

          let pos: IPoint | null = null
          for (; amount > 0; ) {
            pos = this.findPlace({
              itemsMap: this.getItemsMap(id),
              w: item.w,
              h: item.h,
              from: pos?.y, // continue from the last row
            })
            if (!pos) break
            const itemPieceAmount = Math.min(amount, maxAmount)
            itemPieces.push(
              this.createAmountItem({
                ...item,
                ...pos,
                regionId: id,
                amount: itemPieceAmount,
              })
            )
            amount -= itemPieceAmount
          }

          if (amount === 0) {
            this.exhaustItem(itemId)
          } else {
            this.updateItem(itemId, { ...item, amount })
          }
          if (itemPieces.length) {
            this.updateRegion(id, { ...region, items: [...(region.items as any), ...itemPieces] }) //! temp: any
          }
          return
        }
      }

      // try to move
      const pos = this.findPlace({ itemsMap: this.getItemsMap(id), w: item.w, h: item.h })
      if (pos) this.unsafePlaceItem(itemId, id, pos)
    },
    /**
     * @description Finds a free area of specified size in the region
     * @returns A top left cell coordinates of the area or null if nothing found
     */
    findPlace({
      itemsMap,
      w,
      h,
      from = 0,
    }: {
      itemsMap: IItemsMap
      w: number
      h: number
      from?: number
    }): IPoint | null {
      const maxY = itemsMap.length - h
      for (let y = from; y < maxY; y++) {
        const maxX = itemsMap[y]!.length - w
        for (let x = 0; x < maxX; x++) {
          cells: for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
              if (itemsMap[y + i]![x + j]) break cells
              if (h - i === 1 && w - j === 1) return { x, y }
            }
          }
        }
      }
      return null
    },
    initCharacters() {
      this.createCharacter('Character 1')
      this.createCharacter('Character 2')
      this.createCharacter('Character 3')
    },
    initItemsRegistry() {
      const registryRegionId = 'IRegion_registry' as IRegionId
      const registryItemId = 'IItem_registry' as IItemId
      const registryAmountItemId = 'IAmountItem_registry' as IAmountItemId
      const registryBackpackRegionId = 'IRegion_IBackpackItem_registry' as IRegionId
      const registryBackpackItemId = 'IBackpackItem_registry' as IBackpackItemId

      this.regions[registryRegionId] = {
        id: 'IRegion_registry',
        w: 8,
        h: 20,
        items: [registryItemId, registryAmountItemId, registryBackpackItemId],
        type: RegionType.Misc,
        stack: [{ type: ItemType.Misc, max: 99 }],
      }
      this.items[registryItemId] = {
        id: 'IItem_registry',
        w: 7,
        h: 1,
        x: 0,
        y: 0,
        regionId: registryRegionId,
        img: 'src/assets/52295-rebirth.mod.913-gamedata.base.png',
        type: ItemType.Weapon,
      }
      this.items[registryAmountItemId] = {
        id: 'IAmountItem_registry',
        w: 1,
        h: 3,
        x: 1,
        y: 2,
        regionId: registryRegionId,
        img: 'src/assets/Dried Fish.png',
        type: ItemType.Misc,
        amount: 10.4,
        scrap: true,
      }
      this.regions[registryBackpackRegionId] = {
        id: 'IRegion_IBackpackItem_registry',
        w: 8,
        h: 8,
        items: [],
        type: RegionType.Misc,
        stack: [{ type: ItemType.Misc, max: 3 }],
      }
      this.items[registryBackpackItemId] = {
        id: 'IBackpackItem_registry',
        w: 3,
        h: 3,
        x: 4,
        y: 2,
        regionId: registryRegionId,
        img: 'src/assets/1288-gamedata.base.686-gamedata.base.png',
        type: ItemType.Backpack,
        innerRegionId: registryBackpackRegionId,
        isOpened: false,
      }
    },
  },
  created() {
    this.initCharacters()
    this.initItemsRegistry()
  },
}
</script>

<template>
  <slot />
</template>
