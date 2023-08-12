<script lang="ts">
import { throttle } from '@/shared/utils'
import type { IAudioContext } from '@/shared/interface'
import KButton from '@/ui/KButton.vue'
import KRange from '@/ui/KRange.vue'
import KBox from '@/ui/KBox.vue'
import volumeIcon from '@/assets/img/volume.png'

export default {
  components: { KRange, KButton, KBox },
  inject: ['dispatch', 'audio'],
  data() {
    return {
      volumeIcon,
      onVolumeChangeThrottled: throttle(this.onVolumeInput as (...args: any[]) => void, 100),
    }
  },
  computed: {
    d() {
      return this.dispatch as IDispatch
    },
    a() {
      return this.audio as IAudioContext
    },
  },
  methods: {
    onVolumeInput(e: UIEvent) {
      this.a.setAmbientVolume(+(e.target as HTMLInputElement).value)
    },
    onVolumeChange() {
      this.a.setAmbientVolume(this.a.ambientVolume.value ? 0 : 1)
    },
  },
}
</script>

<template>
  <div class="container">
    <KButton size="default" @click="d.toggleRegistry">REGISTRY</KButton>
    <KBox class="volume">
      <button type="button" @click="onVolumeChange">
        <img
          :src="volumeIcon"
          :class="['volume__icon', !a.ambientVolume.value && 'volume__icon_off']"
        />
      </button>
      <KRange
        :value="a.ambientVolume.value"
        min="0"
        max="1"
        step="0.05"
        @input="onVolumeChangeThrottled"
      />
    </KBox>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  width: 160px;
}
.volume {
  display: flex;
  gap: 4px;
  padding: 5px;
}
.volume__icon {
  height: 32px;
  object-fit: none;
}
.volume__icon_off {
  box-sizing: content-box;
  width: 22px;
  padding-right: 10px;
  object-position: calc(50% + 2px) 50%;
}
</style>
