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
  gap: 4rem;
  width: 160rem;
}
.volume {
  align-self: stretch;
  display: flex;
  align-items: center;
  gap: 4rem;
  padding: 5rem;
}
.volume__icon {
  width: 32rem;
  height: 32rem;
  object-fit: cover;
}
.volume__icon_off {
  box-sizing: content-box;
  width: 22rem;
  padding-right: 10rem;
  object-position: calc(50% + 2rem) 50%;
}
</style>
