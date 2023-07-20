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
        arrangeRegion: this.arrangeRegion,
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
      this.items[id] = { id: rawId, ...attrs }
      return id
    },
    createAmountItem(attrs: Omit<IAmountItem, 'id'>): IAmountItemId {
      const rawId = `IAmountItem_${nanoid()}` as const
      const id = rawId as IAmountItemId
      this.items[id] = { id: rawId, ...attrs }
      return id
    },
    createBackpackItem(
      attrs: Omit<IBackpackItem, 'id' | 'innerRegionId'>,
      regionAttrs: Omit<IRegion, 'id' | 'items'>
    ): IBackpackItemId {
      const rawId = `IBackpackItem_${nanoid()}` as const
      const id = rawId as IBackpackItemId
      const innerRegionId = this.createRegion(regionAttrs)
      this.items[id] = { id: rawId, innerRegionId, ...attrs }
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

    // region
    createRegion(attrs: Omit<IRegion, 'id' | 'items'>): IRegionId {
      const rawId = `IRegion_${nanoid()}` as const
      const id = rawId as IRegionId
      this.regions[id] = { id: rawId, items: [], ...attrs }
      return id
    },
    createBackpackRegion(attrs: Omit<IBackpackRegion, 'id' | 'items'>): IBackpackRegionId {
      const rawId = `IBackpackRegion_${nanoid()}` as const
      const id = rawId as IBackpackRegionId
      this.regions[id] = { id: rawId, items: [], ...attrs }
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
        inventory: this.createRegion({
          w: 8,
          h: 10,
          type: 'misc',
          stack: [{ type: ItemType.Misc, max: 5 }],
        }),
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
    selectCharacter(id: ICharacterId) {
      this.selectedCharacter = id

      if (this.seam.related === id) {
        this.closeSeamInventory()
      } else if (this.seam.main) {
        this.openMainSeamInventory()
      }
    },
    resetSelectedCharacter() {
      this.selectedCharacter = null
      if (this.seam.main) {
        this.closeSeamInventory()
      }
    },

    // seam
    openMainSeamInventory() {
      this.seam.main = this.selectedCharacter
    },
    openRelatedSeamInventory(id: ICharacterId) {
      this.seam.related = id
      if (!this.seam.main) {
        this.openMainSeamInventory()
      }
    },
    closeSeamInventory() {
      this.seam.main = null
      this.seam.related = null
    },

    // operations
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
        return

      const itemsMap = this.getItemsMap(regionId)

      const overlap = this.getOverlap({ itemsMap, item, pos })

      let itemPieceId: IAmountItemId | undefined = undefined
      if (isAmountItem(item) && !options.all && item.amount > 1) {
        const itemAtts: Omit<IAmountItem, 'id'> = { ...item, amount: item.amount % 1 || 1 }
        delete (itemAtts as Record<any, any>).id
        itemPieceId = this.createAmountItem(itemAtts)
      }
      const itemToMoveId = itemPieceId || id
      const itemToMove = this.items[itemToMoveId]!

      if (overlap.ids.size > 1) {
        //! todo: try to place an item with the current items arrangement first
        if (this.arrangeRegion(regionId, itemToMoveId)) {
          if (itemPieceId && isAmountItem(item) && isAmountItem(itemToMove))
            this.updateItem(id as IAmountItemId, {
              ...item,
              amount: item.amount - itemToMove.amount,
            })
          return
        }
        if (itemPieceId) this.exhaustItem(itemPieceId)
        return
      }

      if (overlap.ids.size === 1) {
        const overlappedItemId = overlap.ids.values().next()
          .value as typeof overlap.ids extends Set<infer T> ? T : never
        const overlappedItem = this.items[overlappedItemId as IItemObjId]!

        // try to stack
        if (
          region.stack &&
          isAmountItem(overlappedItem) &&
          isAmountItem(item) &&
          isAmountItem(itemToMove)
        ) {
          const typeStackRestriction = region.stack.find(({ type }) =>
            overlappedItem.type ? type === overlappedItem.type : type === ItemType.Misc
          )

          if (
            typeStackRestriction &&
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

            this.updateItem(overlappedItemId as IAmountItemId, { ...overlappedItem, amount })
            return
          }
        }

        // replace
      }

      // place the item (same when replacing)

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

      return { lastCoords: overlap.lastCoords, lastIndex: overlap.lastIndex }
    },
    getItemsMap(id: IRegionObjId) {
      const region = this.regions[id]!
      const itemsList = region.items.map((itemId) => this.items[itemId]!)
      return itemsList.reduce(
        (acc, item, index) => {
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
            .map(() => []),
        ] as [string, number][][]
      )
    },
    getOverlap({
      itemsMap,
      item,
      pos,
    }: {
      itemsMap: [string, number][][]
      item: IItemObj
      pos: IPoint
    }) {
      const overlap = {
        ids: new Set<string>(),
        lastCoords: undefined as IPoint | undefined,
        lastIndex: undefined as number | undefined,
      }
      for (let i = 0; i < item.h; i++) {
        for (let j = 0; j < item.w; j++) {
          const [itemId, itemIndex] = itemsMap[pos.y + i]![pos.x + j] || []
          if (typeof itemId === 'string' && itemId !== item.id) {
            overlap.ids.add(itemId)
            overlap.lastCoords = { x: pos.x + j, y: pos.y + i }
            overlap.lastIndex = itemIndex!
          }
        }
      }
      return overlap
    },
    /** @returns {boolean} was items arrangement successful or not */
    arrangeRegion(id: IRegionObjId, possibleItemId?: IItemObjId): boolean {
      const region = this.regions[id]!
      if (!region) return false

      const itemsList = region.items.map((id) => this.items[id]!).filter((i) => i)
      if (possibleItemId) {
        const possibleItem = this.items[possibleItemId]
        if (possibleItem) {
          itemsList.push(possibleItem)
        }
      }
      const items: IItemObj[] = []

      const mapSize = region.w * region.h
      const flatItemsMap = Array(mapSize).fill(false)
      flatItemsMap.forEach((isOccupied, i, map) => {
        if (isOccupied) return
        const [itemToPlaceIndex, occupiedIndexes] =
          itemsList.reduce((res: [number, number[]] | undefined, item, itemIndex) => {
            if (res) return res

            const itemCellsIndexes = this.getItemCellsIndexes(item, region, i)
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
      if (!itemsList.length) {
        region.items.forEach((id, i) => {
          this.updateItem(id, items[i]!)
        })
        if (possibleItemId) {
          const possibleItem = this.items[possibleItemId]!
          const possibleItemPrevRegion = this.regions[possibleItem.regionId]!
          // remove from previous region
          this.updateRegion(possibleItem.regionId, {
            ...possibleItemPrevRegion,
            items: (possibleItemPrevRegion.items as any).filter(
              (itemId: IItemObjId) => itemId !== possibleItemId
            ),
          }) //! temp: any
          // place onto new region
          this.updateItem(possibleItemId, { ...items[items.length - 1]!, regionId: id })
          this.updateRegion(id, { ...region, items: [...(region.items as any), possibleItemId] }) //! temp: any
        }

        return true
      }
      return false
    },
    getItemCellsIndexes(item: IItemObj, region: IRegionObj, cornerIndex: number) {
      const cornerX = cornerIndex % region.w
      const cornerY = Math.floor(cornerIndex / region.w)
      const indexes: number[] = []
      outer: for (let i = cornerY; i < cornerY + item.h; i++) {
        for (let j = cornerX; j < cornerX + item.w; j++) {
          const index = i * region.w + j
          if (index / region.w >= i + 1) {
            // do not fit in this position
            break outer
          }
          indexes.push(index)
        }
      }
      return indexes
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
        stack: [{ type: ItemType.Misc, max: 5 }],
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
        amount: 2.4,
        scrap: true,
      }
      this.regions[registryBackpackRegionId] = {
        id: 'IRegion_IBackpackItem_registry',
        w: 8,
        h: 8,
        items: [],
        type: RegionType.Misc,
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
