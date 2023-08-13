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
  width: 296rem;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}
.box_bottom {
  border-bottom: none;
}
.title {
  min-height: 34rem;
  padding: 7rem 8rem;
}
.indicators {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  min-height: 227rem;
  margin: 0 1rem;
  padding: 8rem 10rem 0 8rem;
  box-shadow: inset 0 -2rem 0 #1d1d1d;
}

@media (max-width: 1320px) {
  .container {
    width: 100%;
  }
}
@media (max-width: 1060px) {
  .box_bottom {
    border-bottom: 4rem solid #000;
  }
}
</style>
