<script lang="ts">
import type { PropType } from 'vue'
import { isCharacterId } from '@/shared/utils'
import KText from '@/ui/KText.vue'
import KBox from '@/ui/KBox.vue'

import CharacterContextMenu from './CharacterContextMenu.vue'

export default {
  components: { CharacterContextMenu, KText, KBox },
  props: {
    characters: { type: Array as PropType<ICharacter[]>, required: true },
    selected: {
      type: String as PropType<string | null>,
      validator: (prop) => typeof prop === 'string' || prop === null,
    },
  },
  emits: {
    select: (characterId: ICharacterId) => !!characterId,
    trade: (characterId: ICharacterId) => !!characterId,
  },
  data() {
    return { isCharacterId }
  },
  methods: {
    isSelected(characterId: string) {
      return this.selected === characterId
    },
    isMenuDisabled(characterId: string) {
      return !this.selected || this.selected === characterId
    },
    onSelect(characterId: ICharacterId) {
      this.$emit('select', characterId)
    },
    onTrade(characterId: ICharacterId) {
      this.$emit('trade', characterId)
    },
  },
}
</script>

<template>
  <KBox>
    <div class="characters">
      <CharacterContextMenu
        v-for="c in characters"
        :title="c.name"
        :disabled="isMenuDisabled(c.id)"
        class="characters-button__menu-wrapper"
        @trade="isCharacterId(c.id) ? onTrade(c.id) : undefined"
        :key="c.id"
      >
        <button
          :value="c.id"
          :class="['characters-button', isSelected(c.id) && 'characters-button_active']"
          @click="isCharacterId(c.id) ? onSelect(c.id) : undefined"
        >
          <div class="characters-button__text">
            <div class="characters-button__text_centered">
              <KText color="label">{{ c.name }}</KText>
            </div>
          </div>
        </button>
      </CharacterContextMenu>
    </div>
  </KBox>
</template>

<style scoped>
.box {
  position: relative;
  flex: 1 1;
  display: flex;
  flex-direction: column;
  padding: 10rem 12rem 5rem;
  border-bottom: none;
  box-shadow: inset 0 -2rem 0 #1d1d1d;
  overflow: hidden;
}
.box::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 18rem;
  right: 12rem;
  width: 20rem;
  background-image: linear-gradient(to left, #1d1d1d 0, transparent 100%);
  z-index: 1;
}
.characters {
  flex: 1 1;
  position: relative;
  height: 166rem;
  padding-right: 20rem;
  padding-bottom: 12rem;
  /**
   * @todo
   * character buttons must be square with size within the range of 65 to 125 px
   * buttons must shrink to fit in current row or be wrapped to the next row
   * buttons must be of same size on all rows (which is not possible with flexboxes)
   */
  /* here is grid-based attempt */
  /* display: grid;
  grid-template-columns: repeat(auto-fill, minmax(65rem, 125rem));
  grid-template-rows: repeat(2, auto); */
  display: flex;
  gap: 3rem;
  flex-wrap: no-wrap;
  overflow-x: auto;
  overflow-y: hidden;
}
.characters:before {
  /* hide the box shadow at the bottom */
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2rem;
}
.characters-button {
  display: block;
  width: 100%;
  height: 100%;
  background-color: #313131;
}
.characters-button:before {
  /* overlap the text if it's near the edge */
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border: 3rem solid #000;
  z-index: 1;
}
.characters-button_active:before {
  border-width: 1rem;
  box-shadow: inset 0 0 0 2rem #ababab;
}
/* https://vue-loader.vuejs.org/guide/scoped-css.html#deep-selectors */
.characters :deep(.characters-button__menu-wrapper) {
  position: relative;
  min-width: 120rem;
  height: 120rem;
  overflow: hidden;
}
.characters-button__text {
  position: absolute;
  left: 50%;
  bottom: 2rem;
}
.characters-button__text_centered {
  position: relative;
  left: -50%;
}

@media (max-width: 1060px) {
  .box {
    max-width: 80%;
  }
}
</style>
