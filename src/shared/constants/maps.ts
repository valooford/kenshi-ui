import { ItemSlot } from '../gamedata'
import { ItemType } from './enumCounterparts'

// some Misc-targeted slots might relate to character customization and were marked with (ch)
export const ItemTypeBySlot: Record<ItemSlot, IItemType> = {
  [ItemSlot.AttachWeapon]: ItemType.Weapon,
  [ItemSlot.AttachBack]: ItemType.Misc, // (ch)
  [ItemSlot.AttachHair]: ItemType.Misc, // (ch)
  [ItemSlot.AttachHat]: ItemType.Head,
  [ItemSlot.AttachEyes]: ItemType.Misc, // (ch)
  [ItemSlot.AttachBody]: ItemType.Armor,
  [ItemSlot.AttachLegs]: ItemType.Pants,
  [ItemSlot.AttachNone]: ItemType.Misc,
  [ItemSlot.AttachShirt]: ItemType.Shirt,
  [ItemSlot.AttachBoots]: ItemType.Boots,
  [ItemSlot.AttachGloves]: ItemType.Misc, // (ch)
  [ItemSlot.AttachNeck]: ItemType.Misc, // (ch)
  [ItemSlot.AttachBackpack]: ItemType.Backpack,
  [ItemSlot.AttachBeard]: ItemType.Misc, // (ch)
  [ItemSlot.AttachBelt]: ItemType.Belt,
  [ItemSlot.LeftArm]: ItemType.Misc,
  [ItemSlot.RightArm]: ItemType.Misc,
  [ItemSlot.LeftLeg]: ItemType.Misc,
  [ItemSlot.RightLeg]: ItemType.Misc,
}
