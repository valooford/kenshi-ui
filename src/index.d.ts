// unions to implement enum-like objects
// no need to use const enums and disable isolatedModules flag
// ↓

declare type IItemType =
  | 'misc'
  | 'backpack'
  | 'weapon'
  | 'belt'
  | 'shirt'
  | 'pants'
  | 'boots'
  | 'head'
  | 'armor'

declare type IInventoryRegion = keyof ICharacterItems

declare type ISeamInventoryTypes = SeamInventory['type']

// interfaces
// ↓

declare interface IPoint {
  x: number
  y: number
}

declare interface IItem {
  w: number
  h: number
  x: number
  y: number
  img: string
  type?: IItemType
}
type WithAmount<T> = T & {
  amount: number
  scrap?: boolean
}
declare interface IAmountItem extends WithAmount<IItem> {}
declare interface IAmountDragPayload {
  amount: number
}
declare interface IBackpack extends IItem {
  region: IRegion
}
declare type ItemObj = IItem | WithAmount<IItem> | IBackpack
declare interface IStackItem {
  type: IItemType
  max: number
}

declare interface IRegion {
  w: number
  h: number
  items: ItemObj[]
  type?: IItemType
  stack?: IStackItem[]
}

declare interface ICharacter {
  id: string
  name: string
  items: ICharacterItems
}
declare interface ICharacterItems {
  inventory: ItemObj[]
  backpack: IBackpack[]
  weapon1: IItem[]
  weapon2: IItem[]
  belt: IItem[]
  shirt: IItem[]
  pants: IItem[]
  boots: IItem[]
  head: IItem[]
  armor: IItem[]
}

declare interface ISeam {
  main: SeamInventory | null
  related: SeamInventory | null
}
interface ISeamInventoryBase {
  id: string
  type: SeamInventoryTypes
  data: any
}
declare interface ICharacterInventoryData extends Pick<ICharacter, 'id' | 'name' | 'items'> {}
declare interface ICharacterSeamInventory extends ISeamInventoryBase {
  type: 'character'
  data: ICharacterInventoryData
}
declare interface IOtherSeamInventory extends ISeamInventoryBase {
  type: 'other'
  data: undefined
}
declare type SeamInventory = ICharacterSeamInventory | IOtherSeamInventory

declare interface IStore {
  characters: Record<ICharacter['id'], ICharacter>
  charactersList: ICharacter['id'][]
  selectedCharacter: ICharacter['id'] | null
  seamData: ISeam
}

declare interface IDispatch {
  selectCharacter: (characterId: string) => boid
  openMainSeamInventory: () => void
  closeMainSeamInventory: () => void
  openRelatedSeamInventory: (characterId: string) => void
  onSeamInventoryClose: (characterId: string) => void
  resetSelectedCharacter: () => void
  onItemsChange: (characterId: string, items: ICharacterItems) => void
}
