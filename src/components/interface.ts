export enum ItemType {
  Misc = 'misc',
  Backpack = 'backpack',
  Weapon = 'weapon',
  Shirt = 'shirt',
  Pants = 'pants',
  Boots = 'boots',
  Belt = 'belt',
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
  items: ItemObj[]
}

export type ItemObj = IItem | WithAmount<IItem> | IBackpack
