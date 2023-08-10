<script lang="ts">
import KBox from '@/ui/KBox.vue'
import KIndicator from '@/ui/KIndicator.vue'
import KText from '@/ui/KText.vue'

export default {
  components: { KBox, KText, KIndicator },
  inject: ['store'],
  computed: {
    s() {
      return this.store as IStore
    },
    character() {
      return this.s.selectedCharacter ? this.s.characters[this.s.selectedCharacter]! : undefined
    },
  },
}
</script>

<template>
  <div class="container">
    <KBox>
      <div class="title">
        <KText v-if="character">Normal</KText>
      </div>
    </KBox>
    <KBox class="box_bottom">
      <div class="indicators">
        <template v-if="character">
          <KIndicator label="Blood" :value="100" />
          <KIndicator label="Head" :value="100" />
          <KIndicator label="Stomach" :value="100" />
          <KIndicator label="Chest" :value="100" />
          <KIndicator label="Left Arm" :value="100" />
          <KIndicator label="Right Arm" :value="100" />
          <KIndicator label="Left Leg" :value="100" />
          <KIndicator label="Right Leg" :value="100" />
          <KIndicator label="Hunger" :value="300" />
        </template>
      </div>
    </KBox>
  </div>
</template>

<style scoped>
.container {
  width: 296px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.box_bottom {
  border-bottom: none;
}
.title {
  min-height: 34px;
  padding: 7px 8px;
}
.indicators {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-height: 227px;
  margin: 0 1px;
  padding: 8px 10px 0 8px;
  box-shadow: inset 0 -2px 0 #1d1d1d;
}
</style>
