import { ItemType } from '@/constants'

// there is no need to pass in-region coordinates to the item itself
declare type Propsify<T> = Omit<T, 'x' | 'y'>

export const isAmountItem = (item: ItemObj | Propsify<ItemObj>): item is IAmountItem =>
  typeof (item as IAmountItem).amount !== 'undefined'

export const isBackpack = (item: ItemObj | Propsify<ItemObj>): item is IBackpack =>
  item.type === ItemType.Backpack
