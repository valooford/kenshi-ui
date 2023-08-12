// (1)
// unions marked with "union -> enum" are the unions to implement enum-like objects
// so there is no need to use const enums and disable isolatedModules flag

/*
  MIT License

  Copyright (c) 2017 Wil Lee

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
 */

type Brand<Base, Branding, ReservedName extends string = '__type__'> = Base & {
  [K in ReservedName]: Branding
} & { __witness__: Base }
/* ---------- */

type NotBrand<T> = T & { __type__?: never }

declare interface IPoint {
  x: number
  y: number
}

type Tail<T extends any[]> = ((...t: T) => any) extends (_: any, ...tail: infer TT) => any
  ? TT
  : never

type IRawId = `${string}_${string}`
declare type IBrandedId = Brand<IRawId, any>
declare type GetBrandedIdPrefix<T extends IBrandedId> = T extends Brand<`${infer P}_${string}`, any>
  ? `${P}_`
  : never

// item
interface IItemBase {
  readonly id: NotBrand<IRawId>
  readonly stringId: string
  readonly w: number
  readonly h: number
  x: number
  y: number
  readonly img: string
  regionId: IRegionObjId
  readonly type?: IItemType
}
type IItemType =
  | 'misc'
  | 'backpack'
  | 'weapon'
  | 'belt'
  | 'shirt'
  | 'pants'
  | 'boots'
  | 'head'
  | 'armor' // union -> enum (1)
// https://github.com/microsoft/TypeScript/issues/53165
// try Atom or WebStorm because it's bugged in VS Code (works here https://www.typescriptlang.org/play)
type IItemObjId = IItemId | IAmountItemId | IBackpackItemId

// - basic item
declare type IItemIdRaw = `IItem_${string}`
declare type IItemId = Brand<IItemIdRaw, IItem>
declare type IItem = IItemBase & {
  readonly id: NotBrand<IItemIdRaw>
}

// - amount item
declare type IAmountItemIdRaw = `IAmountItem_${string}`
declare type IAmountItemId = Brand<IAmountItemIdRaw, IAmountItem>
declare interface IAmountItem extends WithAmount<IItemBase, IAmountItemIdRaw> {}
type WithAmount<T, RawIdTemplate = IItemIdRaw> = T & {
  readonly id: NotBrand<RawIdTemplate>
  amount: number
  readonly scrap?: boolean
}

// - backpack item
declare type IBackpackItemIdRaw = `IBackpackItem_${string}`
declare type IBackpackItemId = Brand<IBackpackItemIdRaw, IBackpackItem>
declare interface IBackpackItem extends IItemBase {
  readonly id: NotBrand<IBackpackItemIdRaw>
  readonly innerRegionId: IBackpackInnerRegionId
  isOpened: boolean
}

// region
type IRegionBase = WithTypeMappedItems<{
  readonly id: NotBrand<IRegionObjIdRaw>
  readonly w: number
  readonly h: number
  items: unknown // IItemObjId[]
  readonly type: IRegionType
  readonly stack?: Array<{ type: IItemType; max: number }>
  ownerId: ISeamItemId | IRegistryId
}>
type IRegionType =
  | 'misc'
  | 'backpack'
  | 'weapon'
  | 'belt'
  | 'shirt'
  | 'pants'
  | 'boots'
  | 'head'
  | 'armor' // union -> enum (1)

type ConstructRegionItemMap<RegionId extends IRawId, RegionType, ItemId extends IBrandedId> = {
  readonly id: NotBrand<RegionId>
  readonly type: RegionType
  items: ItemId[]
}

//! compiler issue https://stackoverflow.com/questions/62699531/typescript-narrowing-type-from-generic-union-type
// https://stackoverflow.com/questions/70347606/why-doesnt-typeof-narrow-a-union-type-when-the-type-of-a-property-is-a-discri
// Branded type is can't be discriminant properties of string literal (+template)/null/undefined/?number/?boolean types
// So they sucks at union discrimination

// todo: use template literals as ids:
// type IRegionId2Template = `IRegionId2_${string}`
// type IRegionId2 = Brand<IRegionId2Template, 'IRegionId2'>
// if (region.id === ('IRegionId2_123456' as IRegionId2)) {}

// maybe use combination of template literals and branded types, excluding literals from brand to type properly:
// type IRegionId2 = Brand<`IRegionId2_${string}`, 'IRegionId2'>
// type GetTemplateFromBrand<T> = T extends Brand<infer TS, any> ? TS : never

// v1
// todo: switch to this type as soon as the indicated ↑↑↑ issue is fixed

// type IRegionTypeByRegionIdMap = {
//   [regionId: IRegionId]: IRegionType
//   [regionId: IBackpackRegionId]: 'backpack'
// }
// type IItemIdByRegionTypeMap = {
//   backpack: IBackpackId
// }
// type WithTypeMappedItems<
//   T extends { id: IRegionObjId; type?: IRegionType },
//   RegionId extends T['id'] = T['id'],
//   RegionType extends T['type'] = T['type']
// > = T &
//   (RegionId extends any
//     ? RegionType extends IRegionTypeByRegionIdMap[RegionId]
//       ? ConstructRegionItemMap<
//           RegionId,
//           RegionType,
//           RegionType extends keyof IItemIdByRegionTypeMap
//             ? IItemIdByRegionTypeMap[RegionType]
//             : IItemObj['id'] // default
//         >
//       : never
//     : never)

// v0
// todo: remove it and use the type declarations above ↑↑↑

type IRegionAndItemIdByRegionTypeMap = {
  backpack: [IBackpackRegionIdRaw, IBackpackItemId]
}
type WithTypeMappedItems<
  T extends { id: IRegionObjIdRaw; type?: IRegionType },
  RegionType extends T['type'] = T['type']
> = T &
  (RegionType extends keyof IRegionAndItemIdByRegionTypeMap
    ? ConstructRegionItemMap<
        IRegionAndItemIdByRegionTypeMap[RegionType][0],
        RegionType,
        IRegionAndItemIdByRegionTypeMap[RegionType][1]
      >
    : ConstructRegionItemMap<IRegionIdRaw, RegionType, IItemObjId>) // default
// -------------

type IRegionObjId = IRegionId | IBackpackRegionId | IBackpackInnerRegionId
type IRegionObjIdRaw = IRegionIdRaw | IBackpackRegionIdRaw | IBackpackInnerRegionIdRaw

// - basic region
declare type IRegionIdRaw = `IRegion_${string}`
declare type IRegionId = Brand<IRegionIdRaw, 'IRegion'>
declare type IRegion = IRegionBase & {
  readonly id: NotBrand<IRegionIdRaw>
  readonly type: Exclude<IRegionType, keyof IRegionAndItemIdByRegionTypeMap>
}

// - backpack region
declare type IBackpackRegionIdRaw = `IBackpackRegion_${string}`
declare type IBackpackRegionId = Brand<IBackpackRegionIdRaw, 'IBackpackRegion'>
declare type IBackpackRegion = IRegionBase & {
  readonly id: NotBrand<IBackpackRegionIdRaw>
  readonly type: 'backpack'
}

// - backpack inner region
declare type IBackpackInnerRegionIdRaw = `IBackpackInnerRegion_${string}`
declare type IBackpackInnerRegionId = Brand<IBackpackInnerRegionIdRaw, 'IBackpackInnerRegion'>
declare type IBackpackInnerRegion = IRegionBase & {
  readonly id: NotBrand<IBackpackInnerRegionIdRaw>
  readonly type: Exclude<IRegionType, keyof IRegionAndItemIdByRegionTypeMap>
}

// inventory owner

// - character
declare type ICharacterIdRaw = `ICharacter_${string}`
declare type ICharacterId = Brand<ICharacterIdRaw, ICharacter>
declare interface ICharacter {
  readonly id: NotBrand<ICharacterIdRaw>
  name: string
  regions: ICharacterRegions
}
declare interface ICharacterRegions {
  inventory: IRegionId
  backpack: IBackpackRegionId
  weapon1: IRegionId
  weapon2: IRegionId
  belt: IRegionId
  shirt: IRegionId
  pants: IRegionId
  boots: IRegionId
  head: IRegionId
  armor: IRegionId
}
declare type IInventoryRegion = keyof ICharacterRegions // union -> enum (1)

// - registry
declare type IRegistryId = Brand<'IRegistry_id', IRegistry>
declare interface IRegistry {
  readonly id: IRegistryId
  // itemTypes: IItemType[]
  readonly regionId: IRegionId
  section: number
}

// seam
declare type ISeamItemId = ICharacterId // | OtherInventoryOwnerId
declare interface ISeam {
  main: ISeamItemId | null
  related: ISeamItemId | null
  registry: IRegistryId | null
}

// store
declare interface IStore {
  gameParameters: {
    gameSpeed: number
    gameSpeedCf: number
    gamePrevSpeed: number
    time: number
    gameTime: number
  }
  items: {
    // on the contrary, the prohibition of branded keys
    // [id: Brand<string, any>]: never
    [id: IItemId]: IItem
    [id: IAmountItemId]: IAmountItem
    [id: IBackpackItemId]: IBackpackItem
  }
  regions: {
    // [id: Brand<string, any>]: never
    [id: IRegionId]: IRegion
    [id: IBackpackRegionId]: IBackpackRegion
    [id: IBackpackInnerRegionId]: IRegion
  }
  characters: {
    // [id: Brand<string, any>]: never
    [id: ICharacterId]: ICharacter
  }
  charactersList: ICharacterId[]
  selectedCharacter: ICharacterId | null
  registry: IRegistry
  seam: ISeam
}

declare type IItemObj = IStore['items'][keyof IStore['items']]
declare type IRegionObj = IStore['regions'][keyof IStore['regions']]

// dispatch actions
declare interface IDispatch {
  setGameSpeed: (speed: number) => void
  revertGameSpeed: () => void
  selectCharacter: (id: ICharacterId) => void
  resetSelectedCharacter: () => void
  openMainSeamInventory: () => void
  openRelatedSeamInventory: (id: ICharacterId) => void
  closeSeamInventory: () => void
  toggleRegistry: () => void
  selectRegistrySection: (id: number) => void
  onItemMove: (
    id: IItemObjId,
    options: { regionId?: IRegionObjId; pos?: IPoint; all?: boolean }
  ) => { success: boolean; lastCoords?: IPoint; lastIndex?: number; isContinuous?: boolean }
  validateItemPosition: (id: IItemObjId) => void
  onItemFastMove: (id: IItemObjId, options: { all?: boolean }) => boolean
  arrangeRegion: (id: IRegionObjId) => void
  openBackpack: (id: IBackpackItemId) => void
  closeBackpack: (id: IBackpackItemId) => void
}
