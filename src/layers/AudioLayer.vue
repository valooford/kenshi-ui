<script lang="ts">
import { GAMEDATA_ITEMS, InventorySound, ItemType, MaterialType } from '@/shared/gamedata'
import { CommonSound, SoundMilestone } from '@/shared/constants'
import type { IAudioDispatch } from '@/shared/interface'

export default {
  provide() {
    return {
      audio: {
        playTickSound: this.playTickSound,
        playInventorySound: this.playInventorySound,
        playItemSound: this.playItemSound,
      } as IAudioDispatch,
    }
  },
  data() {
    return {
      audio: new Audio('src/assets/audio/gui.mp3'),
      timeoutId: null as number | null,
    }
  },
  methods: {
    play(ms = 900) {
      if (this.timeoutId) clearTimeout(this.timeoutId)
      else this.audio.play()
      this.timeoutId = setTimeout(() => {
        this.audio.pause()
        this.timeoutId = null
      }, ms)
    },
    playTickSound() {
      this.audio.currentTime = SoundMilestone.Common + CommonSound.Tick
      this.play()
    },
    playInventorySound(sound: Parameters<IAudioDispatch['playInventorySound']>[0]) {
      this.audio.currentTime = SoundMilestone.Common + sound
      this.play()
    },
    playItemSound(stringId: string, type: 'drag' | 'drop') {
      const item = GAMEDATA_ITEMS[stringId]!
      let inventorySound: InventorySound | undefined = item.Values['inventory sound']
      if (inventorySound === undefined) {
        if (item.Type === (ItemType.Weapon as number)) inventorySound = InventorySound.Weapon
        else {
          const materialType: MaterialType | undefined = item.Values['material type']
          switch (materialType) {
            case MaterialType.MaterialCloth:
              inventorySound = InventorySound.Fabric
              break
            case MaterialType.MaterialLeather:
              inventorySound = InventorySound.Leather
              break
            case MaterialType.MaterialChain:
            case MaterialType.MaterialMetalPlate:
              inventorySound = InventorySound.SteelBar
              break
            default:
              inventorySound = InventorySound.Misc
          }
        }
      }
      const startTime = inventorySound * 2 + (type === 'drop' ? 1 : 0)
      this.audio.currentTime = SoundMilestone.Items + startTime
      this.play()
    },
  },
}
</script>

<template>
  <slot />
</template>

<style scoped></style>
