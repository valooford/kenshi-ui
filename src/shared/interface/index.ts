import type { CommonSound } from '../constants'

export interface IAudioDispatch {
  playTickSound: () => void
  playInventorySound: (
    sound: CommonSound.InventoryOpen | CommonSound.InventoryClose | CommonSound.InventoryCloseEsc
  ) => void
  playItemSound: (stringId: string, type: 'drag' | 'drop') => void
}
