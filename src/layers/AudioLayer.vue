<script lang="ts">
import { mobileCheck } from '@/shared/utils'
import { CommonSound, SoundMilestone, BEDS, FRAMES, CANOPY } from '@/shared/constants'
import type { IAudioContext } from '@/shared/interface'
import { GAMEDATA_ITEMS, InventorySound, ItemType, MaterialType } from '@/shared/gamedata'
import gui from '@/assets/audio/gui.mp3'

const AMBIENT_SOUND_SETTINGS = {
  startAfter: 5000,
  startMaxDelay: 5000,
  retryEvery: 10000,
  scheduleAfter: 15000,
  scheduleMaxDelay: 15000,
  bedsChance: 0.35,
  framesChance: 0.5,
  canopyChance: 0.5,
  maxDelayBeforeFrames: 20000,
  maxDelayBeforeCanopy: 10000,
  maxDefaultDelayBeforeFrames: 10000,
  maxDefaultDelayBeforeCanopy: 10000,
  extraDelayBeforeSubsequentFrames: 15000,
  extraDelayBeforeSubsequentCanopy: 5000,
  framesLeftMinThreshold: 20000,
  canopyLeftMinThreshold: 10000,
  attemptFramesEvery: 15000,
  attemptCanopyEvery: 15000,
  defaultVolume: 0.5,
}

export default {
  provide() {
    return {
      audio: {
        ambientVolume: this.ambientVolume,
        setAmbientVolume: this.setAmbientVolume,
        playTickSound: this.playTickSound,
        playCommonSound: this.playCommonSound,
        playItemSound: this.playItemSound,
      } as IAudioContext,
    }
  },
  data() {
    return {
      ambientVolume: { value: AMBIENT_SOUND_SETTINGS.defaultVolume },
      prevAmbientVolume: AMBIENT_SOUND_SETTINGS.defaultVolume,
      audio: new Audio(gui),
      timeoutId: null as number | null,
      bedsAudio: new Audio(),
      framesAudio: new Audio(),
      canopyAudio: new Audio(),
      isAmbientScheduled: false,
      isBedsInactive: true,
      isFramesInactive: true,
      isCanopyInactive: true,
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
    playCommonSound(sound: Parameters<IAudioContext['playCommonSound']>[0]) {
      this.audio.currentTime = SoundMilestone.Common + sound
      this.play()
    },
    playItemSound(stringId: string, type: 'drag' | 'drop') {
      const item = GAMEDATA_ITEMS[stringId]!
      let inventorySound: InventorySound | undefined = item.Values['inventory sound']
      if (inventorySound === undefined) {
        if (
          item.Type === (ItemType.Weapon as number) ||
          item.Type === (ItemType.Crossbow as number)
        )
          inventorySound = InventorySound.Weapon
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
    // Ambient sound
    setAmbientVolume(volume = AMBIENT_SOUND_SETTINGS.defaultVolume) {
      if (this.ambientVolume.value && !volume) {
        // mute
        this.bedsAudio.pause()
        this.framesAudio.pause()
        this.canopyAudio.pause()
      } else if (!this.ambientVolume.value && volume) {
        // umnute
        this.scheduleNextAmbientSoundPlay()
      }
      this.ambientVolume.value = volume
      this.bedsAudio.volume = volume
      this.framesAudio.volume = volume
      this.canopyAudio.volume = volume
    },
    onVisibilityChange() {
      if (!mobileCheck()) return // keep playing ambient music in background for non-mobile devices
      if (document.hidden) {
        this.prevAmbientVolume = this.ambientVolume.value
        this.setAmbientVolume(0)
      } else {
        this.setAmbientVolume(this.prevAmbientVolume)
      }
    },
    async playAmbientSound() {
      try {
        this.isAmbientScheduled = false
        await Promise.all([this.playBedsSound(), this.playFramesSound(), this.playCanopySound()])
      } catch (e) {
        setTimeout(() => {
          this.scheduleNextAmbientSoundPlay()
        }, AMBIENT_SOUND_SETTINGS.retryEvery)
      }
    },
    scheduleNextAmbientSoundPlay(
      after = AMBIENT_SOUND_SETTINGS.scheduleAfter,
      delay = AMBIENT_SOUND_SETTINGS.scheduleMaxDelay
    ) {
      if (this.isAmbientScheduled) return
      this.isAmbientScheduled = true
      const timeToStart = Math.round(after + delay * Math.random())
      setTimeout(this.playAmbientSound, timeToStart)
    },
    // - (1) Beds
    async playBedsSound() {
      const isSoundNeeded = Math.random() < AMBIENT_SOUND_SETTINGS.bedsChance
      if (isSoundNeeded) {
        this.isBedsInactive = false
        const ambientBed = BEDS[Math.floor(BEDS.length * Math.random())]!
        this.bedsAudio.src = ambientBed
        await this.bedsAudio.play()
      }
    },
    async onBedsSoundEnd() {
      this.isBedsInactive = true
      await Promise.resolve(0)
      if (this.isFramesInactive && this.isCanopyInactive) {
        this.scheduleNextAmbientSoundPlay()
      }
    },
    // - (2) Frames
    async playFramesSound(
      maxDelay = AMBIENT_SOUND_SETTINGS.maxDefaultDelayBeforeFrames,
      extraDelay = 0
    ) {
      const isSoundNeeded = Math.random() < AMBIENT_SOUND_SETTINGS.framesChance
      if (isSoundNeeded) {
        this.isFramesInactive = false
        const delay = Math.round(extraDelay + Math.random() * maxDelay)
        await new Promise((res) => setTimeout(res, delay))
        const ambientFrame = FRAMES[Math.floor(FRAMES.length * Math.random())]!
        this.framesAudio.src = ambientFrame
        await this.framesAudio.play()
      } else {
        setTimeout(() => {
          this.onFramesSoundEnd()
        }, AMBIENT_SOUND_SETTINGS.attemptFramesEvery)
      }
    },
    async onFramesSoundEnd() {
      this.isFramesInactive = true
      if (!this.ambientVolume.value) return
      await Promise.resolve(0)
      if (this.isBedsInactive && this.isCanopyInactive) {
        this.scheduleNextAmbientSoundPlay()
        return
      }
      if (!this.isBedsInactive && this.bedsAudio.src) {
        const left = (this.bedsAudio.duration - this.bedsAudio.currentTime) * 1000
        if (left < AMBIENT_SOUND_SETTINGS.framesLeftMinThreshold) return
        this.playFramesSound(
          Math.min(left / 2, AMBIENT_SOUND_SETTINGS.maxDelayBeforeFrames),
          AMBIENT_SOUND_SETTINGS.extraDelayBeforeSubsequentFrames
        )
      }
    },
    // - (3) Canopy
    async playCanopySound(
      maxDelay = AMBIENT_SOUND_SETTINGS.maxDefaultDelayBeforeCanopy,
      extraDelay = 0
    ) {
      const isSoundNeeded = Math.random() < AMBIENT_SOUND_SETTINGS.canopyChance
      if (isSoundNeeded) {
        this.isCanopyInactive = false
        const delay = Math.round(extraDelay + Math.random() * maxDelay)
        await new Promise((res) => setTimeout(res, delay))
        const ambientCanopy = CANOPY[Math.floor(CANOPY.length * Math.random())]!
        this.canopyAudio.src = ambientCanopy
        await this.canopyAudio.play()
      } else {
        setTimeout(() => {
          this.onCanopySoundEnd()
        }, AMBIENT_SOUND_SETTINGS.attemptCanopyEvery)
      }
    },
    async onCanopySoundEnd() {
      this.isCanopyInactive = true
      if (!this.ambientVolume.value) return
      if (this.isBedsInactive && this.isFramesInactive) {
        this.scheduleNextAmbientSoundPlay()
        return
      }
      const leftBed = this.bedsAudio.duration - this.bedsAudio.currentTime || 0
      const leftFrame = this.framesAudio.duration - this.framesAudio.currentTime || 0
      const left = Math.max(leftBed, leftFrame) * 1000
      if (left < AMBIENT_SOUND_SETTINGS.canopyLeftMinThreshold) return
      this.playCanopySound(
        Math.min(left / 2, AMBIENT_SOUND_SETTINGS.maxDelayBeforeCanopy),
        AMBIENT_SOUND_SETTINGS.extraDelayBeforeSubsequentCanopy
      )
    },
  },
  created() {
    this.setAmbientVolume()
    this.bedsAudio.addEventListener('ended', this.onBedsSoundEnd)
    this.framesAudio.addEventListener('ended', this.onFramesSoundEnd)
    this.canopyAudio.addEventListener('ended', this.onCanopySoundEnd)
    document.addEventListener('visibilitychange', this.onVisibilityChange)
  },
  mounted() {
    this.scheduleNextAmbientSoundPlay(
      AMBIENT_SOUND_SETTINGS.startAfter,
      AMBIENT_SOUND_SETTINGS.startMaxDelay
    )
  },
  beforeUnmount() {
    this.bedsAudio.removeEventListener('ended', this.onBedsSoundEnd)
    this.framesAudio.removeEventListener('ended', this.onFramesSoundEnd)
    this.canopyAudio.removeEventListener('ended', this.onCanopySoundEnd)
    document.removeEventListener('visibilitychange', this.onVisibilityChange)
  },
}
</script>

<template>
  <slot />
</template>

<style scoped></style>
