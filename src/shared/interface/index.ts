import type { CommonSound } from '../constants'

export interface IAudioContext {
  ambientVolume: { value: number }
  setAmbientVolume: (volume: number) => void
  playTickSound: () => void
  playCommonSound: (
    sound:
      | CommonSound.TimeStart
      | CommonSound.TimeStop
      | CommonSound.InventoryOpen
      | CommonSound.InventoryClose
      | CommonSound.InventoryCloseEsc
  ) => void
  playItemSound: (stringId: string, type: 'drag' | 'drop') => void
}
