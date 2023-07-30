import { RegionType } from '@/shared/constants'

const isCertainId =
  <T extends IBrandedId>(prefix: GetBrandedIdPrefix<T> | GetBrandedIdPrefix<T>[]) =>
  (id: any): id is T => {
    if (typeof id !== 'string') return false
    return Array.isArray(prefix) ? prefix.some((p) => id.startsWith(p)) : id.startsWith(prefix)
  }

export const isItemId = isCertainId<IItemId>('IItem_')
export const isAmountItemId = isCertainId<IAmountItemId>('IAmountItem_')
export const isBackpackItemId = isCertainId<IBackpackItemId>('IBackpackItem_')

export const isAmountItem = (item: IItemObj): item is IAmountItem =>
  typeof (item as IAmountItem).amount === 'number'
export const isBackpack = (item: IItemObj): item is IBackpackItem =>
  item.type === RegionType.Backpack

export const isRegionId = isCertainId<IRegionId>('IRegion_')
export const isBackpackRegionId = isCertainId<IBackpackRegionId>('IBackpackRegion_')

export const isCharacterId = isCertainId<ICharacterId>('ICharacter_')
export const isRegistryId = (id: any): id is IRegistryId => id === 'IRegistry_id'
