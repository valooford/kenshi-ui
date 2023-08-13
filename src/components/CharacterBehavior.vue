<script lang="ts">
import { BREAKPOINT_MD } from '@/shared/constants'
import KBox from '@/ui/KBox.vue'
import KText from '@/ui/KText.vue'
import KButton from '@/ui/KButton.vue'
import RadioButton from '@/ui/RadioButton.vue'
import { SpriteIconButton } from '@/ui/SpriteIcon'

export default {
  components: { KButton, KBox, KText, RadioButton, SpriteIconButton },
  inject: ['store'],
  data() {
    return { isExpanded: false }
  },
  computed: {
    s() {
      return this.store as IStore
    },
    character() {
      return this.s.selectedCharacter ? this.s.characters[this.s.selectedCharacter]! : undefined
    },
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded
    },
    onResize() {
      if (this.isExpanded && !window.matchMedia(`(max-width: ${BREAKPOINT_MD}px)`).matches) {
        this.isExpanded = false
      }
    },
  },
  mounted() {
    window.addEventListener('resize', this.onResize)
  },
  unmounted() {
    window.removeEventListener('resize', this.onResize)
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
          <div class="expand">
            <SpriteIconButton
              :variant="isExpanded ? 'expand-less' : 'expand-more'"
              @click="toggleExpand"
            />
          </div>
        </div>
        <div :class="['jobs', isExpanded && 'jobs_expanded']">
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
  gap: 5rem;
  min-height: 188rem;
  margin-top: 1rem;
  margin-left: 1rem;
  padding: 3rem 8rem 4rem 3rem;
  box-shadow: inset -2rem -2rem 0 #1d1d1d;
}
.radio-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 118rem;
}
.jobs {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding: 3rem 0 0;
}
.jobs__current {
  flex: 1;
  padding: 12rem;
  background-color: #151515;
  box-shadow: inset 0 0 0 1rem rgb(255 255 255 / 0.2);
  border: 1rem solid #000;
  border-radius: 2rem;
}
.jobs__buttons {
  display: flex;
  gap: 6rem;
}

.expand {
  display: none;
}

@media (max-width: 1060px) {
  .box_corner {
    border-right: 4rem solid #000;
    border-bottom: 4rem solid #000;
  }
  .container {
    gap: 0;
    padding-right: 3rem;
  }
  .jobs {
    width: 0;
    transition: width 0.4s ease-in-out;
  }
  .jobs:not(.jobs_expanded) > *:not(.expand) {
    display: none;
  }
  .jobs_expanded {
    width: 300rem;
    margin-left: 5rem;
  }
  @keyframes display-delay {
    0% {
      display: none;
    }
    50% {
      opacity: 0;
      display: none;
    }
    100% {
      opacity: 1;
      display: flex;
    }
  }
  .jobs_expanded > * {
    display: flex;
    animation: display-delay 0.8s;
  }
  .jobs__current {
    white-space: pre-wrap;
  }
  .expand {
    display: block;
    transform: rotate(-90deg);
    align-self: center;
  }
}
</style>
