export * from './audio'
export * from './cssVariables'
export * from './enumCounterparts'
export * from './lists'
export * from './maps'

//! note: this block is being used to determine TypeScript language support progression in IDE of use
const region: IRegionBase = {} as any
region.id
region.type
if (region.type === 'backpack') {
  region.type
  region.id
  region.items
}
if (region.id === ('backpack' as IBackpackRegionIdRaw)) {
  region.id
  region.type
  region.items
}
// ---
