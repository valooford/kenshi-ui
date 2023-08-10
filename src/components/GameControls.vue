<script lang="ts">
import KBox from '@/ui/KBox.vue'
import KText from '@/ui/KText.vue'
import iconSprite from '@/assets/img/Kenshi_UI.png'

import IconButton from './IconButton.vue'

export default {
  components: { IconButton, KBox, KText },
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
        <IconButton variant="pause" />
        <IconButton variant="normal" selected />
        <IconButton variant="faster" />
        <IconButton variant="fastest" />
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
        <IconButton variant="construction" />
      </KBox>
      <div class="floor">
        <div class="floor__content">
          <IconButton variant="rhombus" />
          <IconButton variant="arrow-top" class="floor__up" />
          <IconButton variant="arrow-bottom" class="floor__down" />
          <KText class="floor__text">Floor 0</KText>
        </div>
      </div>
      <div class="running">
        <div class="runnung__content">
          <IconButton variant="rhombus" />
          <IconButton variant="arrow-left" class="running__prev" />
          <IconButton variant="arrow-right" class="running__next" />
          <IconButton variant="run-together" class="running__icon" />
        </div>
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
.runnung__content {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.running__prev {
  position: absolute;
  transform: scale(0.8);
  left: 6px;
}
.running__next {
  position: absolute;
  transform: scale(0.8);
  right: 6px;
}
.running__icon {
  position: absolute;
  transform: scale(0.7);
}
.floor {
  position: absolute;
  left: -61px;
  top: -78px;
}
.floor__content {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.floor__up {
  position: absolute;
  transform: scale(0.8);
  top: 6px;
}
.floor__down {
  position: absolute;
  transform: scale(0.8);
  bottom: 6px;
}
.floor__text {
  position: absolute;
}
.children {
  align-self: stretch;
}
</style>
