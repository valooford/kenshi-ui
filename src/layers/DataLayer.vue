<script lang="ts">
import { nanoid } from 'nanoid'
import {
  InventoryRegion,
  ItemType,
  RegionType,
  ItemTypeBySlot,
  NON_STACKABLE_FUNCTIONS,
  SCRAP_ITEM_FUNCTIONS,
} from '@/shared/constants'
import {
  isItemId,
  isAmountItemId,
  isBackpackItemId,
  isAmountItem,
  isBackpack,
  isRegionId,
  isBackpackRegionId,
  isCharacterId,
  isRegistryId,
} from '@/shared/utils'
import {
  GAMEDATA_ITEMS,
  GAMEDATA_ITEMS_LISTS,
  ItemType as GamedataItemType,
  type OpenConstructionSet,
  type ItemSlot,
} from '@/shared/gamedata'

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
        toggleRegistry: this.toggleRegistry,
        selectRegistrySection: this.selectRegistrySection,
        onItemMove: this.onItemMove,
        validateItemPosition: this.validateItemPosition,
        onItemFastMove: this.onItemFastMove,
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
      registry: {},
    } as unknown as IStore
  },
  methods: {
    // item
    createItem(attrs: Omit<IItem, 'id'>): IItemId {
      const rawId = `IItem_${nanoid()}` as const
      const id = rawId as IItemId
      this.items[id] = { ...attrs, id: rawId }
      return id
    },
    cloneItem(item: IItemObj) {
      if (isAmountItem(item)) {
        return this.createAmountItem(item)
      }
      if (isBackpack(item)) {
        const innerRegion = this.regions[item.innerRegionId as IRegionId]!
        return this.createBackpackItem(item as IBackpackItem, innerRegion)
      }
      return this.createItem(item)
    },
    createAmountItem(attrs: Omit<IAmountItem, 'id'>): IAmountItemId {
      const rawId = `IAmountItem_${nanoid()}` as const
      const id = rawId as IAmountItemId
      this.items[id] = { ...attrs, id: rawId }
      return id
    },
    createBackpackItem(
      attrs: Omit<IBackpackItem, 'id' | 'type' | 'innerRegionId'>,
      regionAttrs: Omit<IRegion, 'id' | 'items'>
    ): IBackpackItemId {
      const rawId = `IBackpackItem_${nanoid()}` as const
      const id = rawId as IBackpackItemId
      const innerRegionId = this.createRegion(regionAttrs)
      this.items[id] = { ...attrs, id: rawId, type: ItemType.Backpack, innerRegionId }
      return id
    },
    updateItem(id: IItemObjId, item: IItemObj) {
      if (isItemId(id)) {
        this.items[id] = { ...item, id: id as IItemIdRaw } as IItem
      } else if (isAmountItemId(id)) {
        this.items[id] = { ...item, id: id as IAmountItemIdRaw } as IAmountItem
      } else if (isBackpackItemId(id)) {
        this.items[id] = { ...item, id: id as IBackpackItemIdRaw } as IBackpackItem
      } else throw Error('ItemId of unknown type encountered')
    },
    recoverRegistryItem(item: IItemObj) {
      const region = this.regions[item.regionId]!
      const shouldRecover = isRegistryId(region.ownerId)
      if (shouldRecover) {
        if (isAmountItemId(item.id)) {
          const currentItem = this.items[item.id]
          if (currentItem && currentItem.regionId === item.regionId) {
            this.exhaustItem(item.id, true) // to make sure there's no excess left
          }
        }
        this.updateRegion(
          item.regionId,
          {
            ...region,
            items: [
              ...region.items.filter((itemId) => itemId !== item.id),
              this.cloneItem(item),
            ] as any, //! temp: any
          },
          true
        )
      }
      return shouldRecover
    },
    exhaustItem(id: IItemObjId, secure?: boolean) {
      const item = this.items[id]
      if (!item) return
      const region = this.regions[item.regionId]!
      this.updateRegion(
        item.regionId,
        {
          ...region,
          items: (region.items as any).filter((itemId: IItemObjId) => itemId !== id), //! temp: any
        },
        secure
      )
      delete this.items[id]

      if (isBackpack(item)) {
        const innerRegion = this.regions[item.innerRegionId]
        innerRegion?.items.forEach((itemId) => this.exhaustItem(itemId))
        delete this.regions[item.innerRegionId]
      }
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
    updateRegion(id: IRegionObjId, region: IRegionObj, secure?: boolean) {
      if (id === this.registry.regionId && !secure) return // prevent the unwanted updates of registry region

      if (isRegionId(id)) {
        this.regions[id] = region as IRegion
      } else if (isBackpackRegionId(id)) {
        this.regions[id] = region as IBackpackRegion
      } else throw Error('RegionId of unknown type encountered')
    },
    clearRegion(id: IRegionObjId, secure?: boolean) {
      const region = this.regions[id]!
      region.items.forEach((itemId) => this.exhaustItem(itemId, secure))
    },
    createCharacterRegions(ownerId: ISeamItemId): ICharacterRegions {
      return {
        armor: this.createRegion({ w: 4, h: 6, type: 'armor', ownerId }),
        backpack: this.createBackpackRegion({ w: 5, h: 4, type: 'backpack', ownerId }),
        belt: this.createRegion({ w: 2, h: 2, type: 'belt', ownerId }),
        boots: this.createRegion({ w: 4, h: 2, type: 'boots', ownerId }),
        head: this.createRegion({ w: 4, h: 3, type: 'head', ownerId }),
        inventory: this.createRegion({ w: 8, h: 10, type: 'misc', ownerId }),
        pants: this.createRegion({ w: 4, h: 5, type: 'pants', ownerId }),
        shirt: this.createRegion({ w: 4, h: 2, type: 'shirt', ownerId }),
        weapon1: this.createRegion({ w: 10, h: 2, type: 'weapon', ownerId }),
        weapon2: this.createRegion({ w: 7, h: 1, type: 'weapon', ownerId }),
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
        regions: this.createCharacterRegions(id),
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
    /** @public */
    toggleRegistry() {
      this.seam.registry = this.seam.registry ? null : this.registry.id
      if (this.seam.registry) this.selectRegistrySection(this.registry.section)
    },
    selectRegistrySection(section: OpenConstructionSet.Data.IItem.Type) {
      const { regionId } = this.registry
      this.clearRegion(regionId, true)
      const itemsList = GAMEDATA_ITEMS_LISTS[section]
      if (!itemsList) return
      const items = itemsList.map((itemId) => {
        const data = GAMEDATA_ITEMS[itemId]!
        const attrs: Omit<IItemObj, 'id'> = {
          stringId: data.StringId,
          w: data.Values['inventory footprint width'],
          h: data.Values['inventory footprint height'],
          x: 0,
          y: 0,
          img: new URL(`/src/assets/img/items/${data.Values.icon}`, import.meta.url).href,
          regionId,
          type: ItemTypeBySlot[data.Values.slot as ItemSlot],
        }
        if (
          data.Values.stackable &&
          !NON_STACKABLE_FUNCTIONS.includes(data.Values['item function'])
        ) {
          const scrap = SCRAP_ITEM_FUNCTIONS.includes(data.Values['item function'])
          return this.createAmountItem({
            ...attrs,
            amount: scrap ? 98.4 : 99,
            scrap: SCRAP_ITEM_FUNCTIONS.includes(data.Values['item function']),
          })
        }
        if (data.Type === (GamedataItemType.Container as number)) {
          const w = data.Values['storage size width']
          const h = data.Values['storage size height']
          const stackableBonusMinimum = data.Values['stackable bonus minimum'] ?? 1
          const stackableBonusMult = data.Values['stackable bonus mult'] ?? 1
          return this.createBackpackItem(
            { ...attrs, isOpened: false },
            {
              w,
              h,
              type: RegionType.Misc,
              //! todo: improve stack regions to account both bonuses (minimum and mult)
              stack:
                stackableBonusMinimum > 1 || stackableBonusMult > 1
                  ? [
                      {
                        type: ItemType.Misc,
                        max: stackableBonusMinimum * stackableBonusMult,
                      },
                    ]
                  : undefined,
              ownerId: this.registry.id,
            }
          )
        }
        return this.createItem(attrs)
      })

      const region = this.regions[regionId]!
      this.updateRegion(regionId, { ...region, items }, true)
      this.arrangeRegion(regionId)
      this.registry.section = section
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
        // result: extract piece (or take all the amount), merge it with an item and continue dragging the excess
        if (
          typeStackRestriction &&
          isAmountItem(overlappedItem) &&
          isAmountItem(item) &&
          isAmountItem(itemToMove) &&
          overlappedItem.stringId === itemToMove.stringId &&
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

          if (this.recoverRegistryItem(item)) return { success: true }

          return { success: true, isContinuous: !!excess }
        }

        // Case 2.3: overlap with an item when it can't be stack together
        // result: replace overlapped item with a fitting piece of the current one and continue dragging it in another place
        if (options.all && isAmountItemId(id)) {
          this.safePlaceAmountItem(id, regionId, pos)

          this.recoverRegistryItem(item)

          return { success: true, lastCoords: overlap.lastCoords, lastIndex: overlap.lastIndex }
        }

        // Case 2.4: same as Case 3.2, but the returning values are set
      }

      // Case 3.1: no overlap, but it's an amount item
      // result: place only piece of of it that fits in and continue dragging the rest of the amount to another place
      if (!overlap.ids.size && options.all && isAmountItemId(id) && isAmountItem(item)) {
        this.safePlaceAmountItem(id, regionId, pos)
        if (id in this.items && this.items[id]!.amount !== item.amount) {
          if (this.recoverRegistryItem(item)) return { success: true }

          return { success: true, isContinuous: true }
        }

        if (this.recoverRegistryItem(item)) return { success: true }

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
      if (itemPieceId && isAmountItem(item) && isAmountItem(itemToMove) && id in this.items) {
        this.updateItem(id as IAmountItemId, { ...item, amount: item.amount - itemToMove.amount })
      }

      // add owner inventory link (enables items fast moving, RMB)
      if (isBackpack(item)) {
        const innerRegion = this.regions[item.innerRegionId]!
        this.updateRegion(item.innerRegionId, { ...innerRegion, ownerId: region.ownerId })
      }

      this.recoverRegistryItem(item)

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
     * @description Finds the target region(s) and moves an item to it(them)
     */
    onItemFastMove(id: IItemObjId, options: { all?: boolean }): boolean {
      const item = this.items[id]!
      const region = this.regions[item.regionId]!
      const { ownerId } = region
      if (!ownerId) return false

      // cross-region
      let targetSeamItem = ownerId
      // or
      const isSeamMove = !!(this.seam.related || this.seam.registry)
      // cross-inventory
      if (isSeamMove) {
        targetSeamItem = ownerId === this.seam.main! ? this.seam.related! : this.seam.main!
      }

      if (isCharacterId(targetSeamItem)) {
        const character = this.characters[targetSeamItem]!
        const targetRegionTypes: IInventoryRegion[] = []
        const targetRegionIds: IRegionObjId[] = []

        const backpackItemId = this.regions[character.regions[InventoryRegion.Backpack]]!.items[0]
        const backpack = backpackItemId && this.items[backpackItemId]!

        const inventoryRegionId = character.regions[InventoryRegion.Inventory]
        // moving from InventoryRegion.Inventory or from the seam
        if (item.regionId === inventoryRegionId || isSeamMove) {
          switch (item.type) {
            case ItemType.Weapon: {
              const weapon2Region = this.regions[character.regions[InventoryRegion.Weapon2]]!
              if (item.h <= weapon2Region.h && item.w <= weapon2Region.w) {
                targetRegionTypes.push(InventoryRegion.Weapon2, InventoryRegion.Weapon1)
              } else {
                targetRegionTypes.push(InventoryRegion.Weapon1, InventoryRegion.Weapon2)
              }
              break
            }
            case ItemType.Backpack:
            case ItemType.Belt:
            case ItemType.Shirt:
            case ItemType.Pants:
            case ItemType.Boots:
            case ItemType.Head:
            case ItemType.Armor: {
              if (this.regions[character.regions[item.type]]!.items[0]) break
              targetRegionTypes.push(item.type)
              break
            }
            case ItemType.Misc:
            default:
          }
          targetRegionIds.push(...targetRegionTypes.map((rt) => character.regions[rt]))
          if (backpack?.isOpened) targetRegionIds.push(backpack.innerRegionId)
          if (isSeamMove) targetRegionIds.push(inventoryRegionId)
        } else {
          // moving from type-specific region (or backpack)
          if (item.type === ItemType.Weapon) {
            const weapon1RegionId = character.regions[InventoryRegion.Weapon1]
            const weapon2RegionId = character.regions[InventoryRegion.Weapon2]
            if (item.regionId !== weapon2RegionId) targetRegionIds.push(weapon2RegionId)
            if (item.regionId !== weapon1RegionId) targetRegionIds.push(weapon1RegionId)
          }
          targetRegionIds.push(inventoryRegionId)
          if (item.regionId !== backpack?.innerRegionId && backpack?.isOpened)
            targetRegionIds.push(backpack.innerRegionId)
        }

        let excess: number | undefined
        for (let i = 0; i < targetRegionIds.length; i++) {
          excess = this.distributeItem(id, targetRegionIds[i]!, options)
          if (!excess) break
        }

        // add owner inventory link (enables items fast moving, RMB)
        if (isBackpack(item)) {
          const innerRegion = this.regions[item.innerRegionId]!
          this.updateRegion(item.innerRegionId, { ...innerRegion, ownerId: targetSeamItem })
        }

        if (this.recoverRegistryItem(item)) return true

        return !excess
      }
      // other inventory owner types go here (storage boxes, animals, etc.)
      return false
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
      const items: Record<IItemObjId, IItemObj> = {}

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
            items[placedItem.id as IItemObjId] = {
              ...placedItem,
              x: i % region.w,
              y: Math.floor(i / region.w),
            }
          }
        }
      })

      // update item positions
      if (!itemsList.length) {
        processedItems.forEach((id) => {
          this.updateItem(id, items[id]!)
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
    distributeItem(id: IItemObjId, regionId: IRegionObjId, options: { all?: boolean }): number {
      const region = this.regions[regionId]!
      const item = this.items[id]!

      if (isAmountItem(item)) {
        const itemType = item.type || ItemType.Misc
        const typeStackRestriction = region.stack?.find(({ type }) => type === itemType)

        let amount = options.all ? item.amount : item.amount % 1 || 1
        const left = item.amount - amount
        // try to stack with the items of the same type
        if (typeStackRestriction) {
          const itemsOfSameType = (
            region.items
              .map((itemId) => this.items[itemId]!)
              .filter(
                ({ stringId }) => stringId === item.stringId && amount < typeStackRestriction.max
              ) as IAmountItem[]
          ).sort((itemA, itemB) => itemB.amount - itemA.amount)
          for (let i = 0; amount && i < itemsOfSameType.length; i++) {
            const targetItem = itemsOfSameType[i]!
            const distributedAmount = Math.min(targetItem.amount + amount, typeStackRestriction.max)
            if (isAmountItemId(targetItem.id)) {
              amount -= distributedAmount - targetItem.amount
              this.updateItem(targetItem.id, { ...targetItem, amount: distributedAmount })
            }
          }
          if (amount + left === 0) {
            this.exhaustItem(id)
            return 0
          }
          // fill the region with freshly created item pieces
        }
        if (amount) {
          const maxAmount = typeStackRestriction?.max ?? 1

          let pos: IPoint | null = null
          for (; amount > 0; ) {
            pos = this.findPlace({
              itemsMap: this.getItemsMap(regionId),
              w: item.w,
              h: item.h,
              from: pos?.y, // continue from the last row
            })
            if (!pos) break
            const itemPieceAmount = Math.min(amount, maxAmount)
            const itemPieceId = this.createAmountItem({
              ...item,
              ...pos,
              regionId,
              amount: itemPieceAmount,
            })
            const currentRegion = this.regions[regionId]!
            this.updateRegion(regionId, {
              ...currentRegion,
              items: [...(currentRegion.items as any), itemPieceId],
            })
            amount -= itemPieceAmount
          }

          if (amount + left === 0) {
            this.exhaustItem(id)
          } else {
            this.updateItem(id, { ...item, amount: amount + left })
          }
        }
        return amount
      }

      // try to move
      const pos = this.findPlace({ itemsMap: this.getItemsMap(regionId), w: item.w, h: item.h })
      if (pos) {
        this.unsafePlaceItem(id, regionId, pos)
        return 0
      }
      return isAmountItem(item) ? item.amount : 1
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
      for (let y = from; y <= maxY; y++) {
        const maxX = itemsMap[y]!.length - w
        for (let x = 0; x <= maxX; x++) {
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
    initRegistry() {
      const id = 'IRegistry_id' as IRegistryId
      const regionId = this.createRegion({
        w: 28,
        h: 10000,
        type: RegionType.Misc,
        stack: [{ type: ItemType.Misc, max: 99 }],
        ownerId: id,
      })
      this.registry = { id, regionId, section: GamedataItemType.Weapon }
    },
  },
  created() {
    this.initCharacters()
    this.initRegistry()
  },
}
</script>

<template>
  <slot />
</template>
