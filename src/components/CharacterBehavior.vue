<script lang="ts">
import KBox from '@/ui/KBox.vue'
import KText from '@/ui/KText.vue'
import KButton from '@/ui/KButton.vue'
import RadioButton from '@/ui/RadioButton.vue'

export default {
  components: { KButton, KBox, KText, RadioButton },
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
  <KBox class="box_corner">
    <div class="container">
      <template v-if="character">
        <div class="radio-buttons">
          <RadioButton>BLOCK</RadioButton>
          <RadioButton>HOLD</RadioButton>
          <RadioButton>PASSIVE</RadioButton>
          <RadioButton>JOBS</RadioButton>
          <RadioButton>RANGED</RadioButton>
          <RadioButton>TAUNT</RadioButton>
          <RadioButton>SNEAK</RadioButton>
        </div>
        <div class="jobs">
          <div class="jobs__current">
            <KText color="greyed"
              >[No jobs assigned]<br />[To add jobs, hold shift key when giving an order]
            </KText>
          </div>
          <div class="jobs__buttons">
            <KButton disabled full-width>RESCUE</KButton>
            <KButton disabled full-width>MEDIC</KButton>
            <KButton disabled full-width>PROSPECT</KButton>
          </div>
        </div>
      </template>
    </div>
  </KBox>
</template>

<style scoped>
.box_corner {
  border-right: none;
  border-bottom: none;
}
.container {
  display: flex;
  gap: 5px;
  min-height: 188px;
  margin-top: 1px;
  margin-left: 1px;
  padding: 3px 8px 4px 3px;
  box-shadow: inset -2px -2px 0 #1d1d1d;
}
.radio-buttons {
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: 118px;
}
.jobs {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 3px 0 0;
}
.jobs__current {
  flex: 1;
  padding: 12px;
  background-color: #151515;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.2);
  border: 1px solid #000;
  border-radius: 2px;
}
.jobs__buttons {
  display: flex;
  gap: 6px;
}
</style>
