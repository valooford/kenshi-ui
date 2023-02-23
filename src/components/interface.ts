export enum ItemType {
  Misc = 'misc',
  Backpack = 'backpack',
  Weapon = 'weapon',
  Belt = 'belt',
  Shirt = 'shirt',
  Pants = 'pants',
  Boots = 'boots',
  Head = 'head',
  Armor = 'armor',
}

export enum InventoryRegion {
  Inventory = 'inventory',
  Backpack = 'backpack',
  Weapon1 = 'weapon1',
  Weapon2 = 'weapon2',
  Belt = 'belt',
  Shirt = 'shirt',
  Pants = 'pants',
  Boots = 'boots',
  Head = 'head',
  Armor = 'armor',
}

export interface IItem {
  w: number
  h: number
  x: number
  y: number
  img: string
  type?: ItemType
}

export interface IStackItem {
  type: ItemType
  max: number
}

export interface IRegion {
  w: number
  h: number
  items: ItemObj[]
  type?: ItemType
  stack?: IStackItem[]
}

export interface IPoint {
  x: number
  y: number
}

// there is no need to pass in-region coordinates to the item itself
export type Propsify<T> = Omit<T, 'x' | 'y'>

type WithAmount<T> = T & {
  amount: number
  scrap?: boolean
}

export interface IAmountItem extends WithAmount<IItem> {}

export interface IAmountDragPayload {
  amount: number
}

export interface IBackpack extends IItem {
  region: IRegion
}

export type ItemObj = IItem | WithAmount<IItem> | IBackpack
