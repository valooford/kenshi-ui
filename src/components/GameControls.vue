<script lang="ts">
import KBox from '@/ui/KBox.vue'
import KText from '@/ui/KText.vue'
import { SpriteIconButton } from '@/ui/SpriteIcon'
import iconSprite from '@/assets/img/Kenshi_UI.png'
import RunningModeSelector from './RunningModeSelector.vue'
import FloorSelector from './FloorSelector.vue'

export default {
  components: { SpriteIconButton, KBox, KText, RunningModeSelector, FloorSelector },
  data() {
    return { iconSprite }
  },
}
</script>

<template>
  <div class="wrapper">
    <div class="outpost">
      <slot name="outpost" />
    </div>
    <div class="controls">
      <div class="time">
        <SpriteIconButton variant="pause" />
        <SpriteIconButton variant="normal" selected />
        <SpriteIconButton variant="faster" />
        <SpriteIconButton variant="fastest" />
      </div>
      <KBox class="info">
        <div class="pair">
          <KText>Money</KText>
          <KText>c.31,761</KText>
        </div>
        <div class="pair">
          <KText>Day: 85</KText>
          <KText>22:18</KText>
        </div>
      </KBox>
      <KBox class="construction">
        <SpriteIconButton variant="construction" />
      </KBox>
      <div class="running">
        <RunningModeSelector />
      </div>
      <div class="floor">
        <FloorSelector />
      </div>
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
  gap: 4px;
  width: 483px;
}
.outpost {
  display: flex;
  align-items: flex-end;
  gap: 4px;
}
.controls {
  position: relative;
  align-self: stretch;
  display: flex;
  gap: 5px;
}
.time {
  display: flex;
  width: 200px;
  padding: 8px 0 6px 8px;
  background-image: v-bind('`url("${iconSprite}")`');
  background-position: -1423px -735px;
}
.info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px 8px;
}
.pair {
  display: flex;
  justify-content: space-between;
}
.construction {
  padding: 4px 4px 2px;
}
.running {
  position: absolute;
  left: -101px;
  top: -10px;
}
.floor {
  position: absolute;
  left: -61px;
  top: -78px;
}
.children {
  align-self: stretch;
}
</style>
