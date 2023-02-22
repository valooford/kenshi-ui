import {
  ItemType,
  type IBackpack,
  type ItemObj,
  type Propsify,
  type IAmountItem,
} from './interface'

export const isAmountItem = (item: ItemObj | Propsify<ItemObj>): item is IAmountItem =>
  typeof (item as IAmountItem).amount !== 'undefined'

export const isBackpack = (item: ItemObj | Propsify<ItemObj>): item is IBackpack =>
  item.type === ItemType.Backpack
