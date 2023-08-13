<script lang="ts">
import { DAY_MS } from '@/shared/constants'
import type { IAudioContext } from '@/shared/interface'
import KBox from '@/ui/KBox.vue'
import KText from '@/ui/KText.vue'
import { SpriteIconButton } from '@/ui/SpriteIcon'
import { CommonSound, GameSpeed } from '@/shared/constants'
import iconSprite from '@/assets/img/Kenshi_UI.png'

import RunningModeSelector from './RunningModeSelector.vue'
import FloorSelector from './FloorSelector.vue'

const UPDATE_TIME_EVERY = 200 // ms

export default {
  components: { SpriteIconButton, KBox, KText, RunningModeSelector, FloorSelector },
  inject: ['store', 'dispatch', 'audio'],
  data() {
    return { GameSpeed, iconSprite, intervalId: null as number | null }
  },
  computed: {
    s() {
      return this.store as IStore
    },
    d() {
      return this.dispatch as IDispatch
    },
    a() {
      return this.audio as IAudioContext
    },
    gameSpeed() {
      return this.s.gameParameters.gameSpeed
    },
  },
  methods: {
    selectGameSpeed(speed: GameSpeed) {
      if (this.gameSpeed === speed) return
      if (!speed) {
        this.a.playCommonSound(CommonSound.TimeStop)
      } else if (this.gameSpeed) {
        this.a.playTickSound()
      } else {
        this.a.playCommonSound(CommonSound.TimeStart)
      }
      this.d.setGameSpeed(speed)
    },
    onVisibilityChange() {
      if (document.hidden) {
        this.d.setGameSpeed(GameSpeed.Pause)
      }
    },
  },
  created() {
    document.addEventListener('visibilitychange', this.onVisibilityChange)
  },
  mounted() {
    const dayEl = this.$refs.day as HTMLElement
    const timeEl = this.$refs.time as HTMLElement
    const updateTime = () => {
      const { time, gameTime, gameSpeed } = this.s.gameParameters
      const currentGameTime = gameTime + (Date.now() - time) * gameSpeed

      const gameDate = new Date(currentGameTime * this.s.gameParameters.gameSpeedCf)
      const dayCount = Math.ceil(gameDate.getTime() / DAY_MS)
      let hours = gameDate.getUTCHours().toString()
      if (hours.length < 2) hours = `0${hours}`
      let minutes = gameDate.getUTCMinutes().toString()
      if (minutes.length < 2) minutes = `0${minutes}`

      dayEl.innerText = `${dayCount}`
      timeEl.innerText = `${hours}:${minutes}`
    }
    this.intervalId = setInterval(updateTime, UPDATE_TIME_EVERY)
    updateTime()
  },
  unmounted() {
    if (typeof this.intervalId === 'number') {
      clearInterval(this.intervalId)
    }
    document.removeEventListener('visibilitychange', this.onVisibilityChange)
  },
}
</script>

<template>
  <div class="wrapper">
    <div class="outpost">
      <slot name="outpost" />
    </div>
    <div class="controls">
      <div class="running">
        <RunningModeSelector />
      </div>
      <div class="floor">
        <FloorSelector />
      </div>
      <div class="time-controls">
        <SpriteIconButton
          variant="pause"
          :selected="gameSpeed === GameSpeed.Pause"
          @click="selectGameSpeed(GameSpeed.Pause)"
        />
        <SpriteIconButton
          variant="normal"
          :selected="gameSpeed === GameSpeed.Normal"
          @click="selectGameSpeed(GameSpeed.Normal)"
        />
        <SpriteIconButton
          variant="faster"
          :selected="gameSpeed === GameSpeed.Faster"
          @click="selectGameSpeed(GameSpeed.Faster)"
        />
        <SpriteIconButton
          variant="fastest"
          :selected="gameSpeed === GameSpeed.Fastest"
          @click="selectGameSpeed(GameSpeed.Fastest)"
        />
      </div>
      <KBox class="info">
        <div class="pair">
          <KText>Money</KText>
          <KText>c.31,761</KText>
        </div>
        <div class="pair">
          <KText>Day: <span ref="day" /></KText>
          <KText><span ref="time" /></KText>
        </div>
      </KBox>
      <KBox class="construction">
        <SpriteIconButton variant="construction" />
      </KBox>
    </div>
    <div class="children">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4rem;
  width: 483rem;
}
.outpost {
  display: flex;
  align-items: flex-end;
  gap: 5rem;
}
.controls {
  position: relative;
  align-self: stretch;
  display: flex;
  gap: 5rem;
}
.time-controls {
  display: flex;
  width: 200rem;
  padding: 8rem 0 6rem 8rem;
  background-image: v-bind('`url("${iconSprite}")`');
  background-size: 1920rem 1080rem;
  background-position: -1423rem -735rem;
}
.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding: 4rem 8rem;
}
.pair {
  display: flex;
  justify-content: space-between;
  gap: 16rem;
}
.construction {
  padding: 4rem 4rem 2rem;
}
.running {
  position: absolute;
  left: -101rem;
  top: -10rem;
}
.floor {
  position: absolute;
  left: -61rem;
  top: -78rem;
}
.children {
  align-self: stretch;
}

@media (max-width: 1060px) {
  .wrapper {
    width: auto;
  }
  .outpost {
    flex-direction: column;
  }
  .controls {
    width: 256rem;
    justify-content: flex-start;
    align-self: flex-end;
    flex-direction: row-reverse;
    flex-wrap: wrap;
  }
  .running,
  .floor {
    position: static;
  }
  .info {
    flex: unset;
    gap: 0;
  }
  .children {
    align-self: unset;
  }
}
</style>
