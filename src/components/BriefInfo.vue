<script lang="ts">
import KBox from '@/ui/KBox.vue'
import KText from '@/ui/KText.vue'
import { SpriteIconButton } from '@/ui/SpriteIcon'

export default {
  components: { KBox, KText, SpriteIconButton },
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
  watch: {
    character() {
      if (this.isExpanded && !this.character) {
        this.isExpanded = false
      }
    },
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded
    },
  },
}
</script>

<template>
  <div class="brief-container">
    <KBox v-if="character" class="box_wide">
      <div class="title">
        <KText color="title">{{ character.name }}</KText>
        <KText color="title">Nameless</KText>
      </div>
    </KBox>
    <KBox class="box_bottom">
      <div class="info">
        <ul class="state">
          <template v-if="character">
            <li class="pair">
              <KText>State:</KText>
              <KText>Normal</KText>
            </li>
            <li class="pair">
              <KText>Goal:</KText>
              <KText>Aimless</KText>
            </li>
            <li class="pair">
              <KText>Encumbrance:</KText>
              <KText>0%</KText>
            </li>
            <li class="pair">
              <KText>Accuracy Error:</KText>
              <KText>3.49 degrees</KText>
            </li>
          </template>
        </ul>
        <div :class="['collapse', isExpanded && 'collapse_expanded']">
          <ul class="collapse__content">
            <template v-if="character">
              <li class="pair">
                <KText variant="alt">ATHLETICS XP:</KText>
                <KText>150%</KText>
              </li>
              <li class="pair">
                <KText variant="alt">STRENGTH XP:</KText>
                <KText>0%</KText>
              </li>
              <li class="pair">
                <KText variant="alt">TOUGHNESS XP:</KText>
                <KText>3x</KText>
              </li>
              <li class="pair">
                <KText variant="alt">KO POINT:</KText>
                <KText>-26</KText>
              </li>
              <li class="pair">
                <KText variant="alt">RUN SPEED:</KText>
                <KText color="bad">27 (+1)mph</KText>
              </li>
              <li class="pair">
                <KText variant="alt">HUNGER RATE:</KText>
                <KText>100%</KText>
              </li>
            </template>
          </ul>
        </div>
        <div v-if="character" class="expand">
          <SpriteIconButton
            :variant="isExpanded ? 'expand-less' : 'expand-more'"
            @click="toggleExpand"
          />
        </div>
        <ul class="stats">
          <template v-if="character">
            <li class="pair">
              <KText variant="alt">CROSSBOWS:</KText>
              <KText color="good">49 (+2)</KText>
            </li>
            <li class="pair">
              <KText variant="alt">PRECISION:</KText>
              <KText>15</KText>
            </li>
            <li class="pair">
              <KText variant="alt">PERCEPTION:</KText>
              <KText color="bad">41 (-3)</KText>
            </li>
            <li class="pair">
              <KText variant="alt">STRENGTH:</KText>
              <KText>42</KText>
            </li>
            <li class="pair">
              <KText variant="alt">DEXTERITY:</KText>
              <KText>33</KText>
            </li>
            <li class="pair">
              <KText variant="alt">TOUGHNESS:</KText>
              <KText>21</KText>
            </li>
          </template>
        </ul>
      </div>
    </KBox>
  </div>
</template>

<style scoped>
.brief-container {
  width: 256rem;
  display: flex;
  flex-direction: column;
  gap: 4rem;
}
.box_wide {
  align-self: flex-start;
}
.box_bottom {
  border-left: none;
  border-bottom: none;
}
.title {
  display: flex;
  justify-content: space-between;
  width: 396rem;
  padding: 6rem;
}
.pair {
  display: flex;
  justify-content: space-between;
}
.state {
  min-height: 106rem;
  margin-top: 1rem;
  padding: 6rem 10rem 20rem;
  box-shadow: inset 2rem 0 0 #1d1d1d;
}
.collapse {
  height: 0;
  transition: height 0.4s ease-in-out;
  overflow: hidden;
}
.collapse_expanded {
  height: 170rem;
}
.collapse__content {
  min-height: 170rem;
  margin-right: 1rem;
  padding: 16rem 12rem 31rem;
  border-top: 3rem solid #000;
  box-shadow: inset 0 1rem 1rem rgb(255 255 255 / 0.1), inset 2rem 0 0 #1d1d1d;
}
.expand {
  height: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.stats {
  min-height: 166rem;
  margin-right: 1rem;
  padding: 16rem 12rem 27rem;
  border-top: 3rem solid #000;
  box-shadow: inset 0 1rem 1rem rgb(255 255 255 / 0.1), inset 2rem -2rem 0 #1d1d1d;
}

@media (max-width: 1320px) {
  .box_wide {
    align-self: unset;
  }
  .title {
    width: auto;
  }
  .box_bottom {
    border-left: 4rem solid #000;
    border-bottom: 4rem solid #000;
  }
}
</style>
