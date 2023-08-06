type EnumLikeFromUnion<Union extends string> = { [type in Capitalize<Union>]: Lowercase<type> }

export const ItemType: EnumLikeFromUnion<IItemType> = {
  Misc: 'misc',
  Backpack: 'backpack',
  Weapon: 'weapon',
  Belt: 'belt',
  Shirt: 'shirt',
  Pants: 'pants',
  Boots: 'boots',
  Head: 'head',
  Armor: 'armor',
}

export const RegionType: EnumLikeFromUnion<IRegionType> = {
  Misc: 'misc',
  Backpack: 'backpack',
  Weapon: 'weapon',
  Belt: 'belt',
  Shirt: 'shirt',
  Pants: 'pants',
  Boots: 'boots',
  Head: 'head',
  Armor: 'armor',
}

export const InventoryRegion: EnumLikeFromUnion<IInventoryRegion> = {
  Inventory: 'inventory',
  Backpack: 'backpack',
  Weapon1: 'weapon1',
  Weapon2: 'weapon2',
  Belt: 'belt',
  Shirt: 'shirt',
  Pants: 'pants',
  Boots: 'boots',
  Head: 'head',
  Armor: 'armor',
}
