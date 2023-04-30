<script lang="ts">
import type { PropType } from 'vue'

import { CharacterContextMenu } from './ContextMenu'

export default {
  components: { CharacterContextMenu },
  props: {
    characters: { type: Array as PropType<ICharacter[]>, required: true },
    selected: {
      type: String as PropType<string | null>,
      validator: (prop) => typeof prop === 'string' || prop === null,
    },
  },
  emits: {
    select: (characterId: string) => !!characterId,
    trade: (characterId: string) => !!characterId,
  },
  methods: {
    isSelected(characterId: string) {
      return this.selected === characterId
    },
    isMenuDisabled(characterId: string) {
      return !this.selected || this.selected === characterId
    },
    onSelect(characterId: string) {
      this.$emit('select', characterId)
    },
    onTrade(characterId: string) {
      this.$emit('trade', characterId)
    },
  },
}
</script>

<template>
  <div class="characters">
    <CharacterContextMenu
      v-for="c in characters"
      :title="c.name"
      :disabled="isMenuDisabled(c.id)"
      class="characters-button__menu-wrapper"
      @trade="onTrade(c.id)"
      :key="c.id"
    >
      <button
        :value="c.id"
        :class="['characters-button', isSelected(c.id) && 'characters-button_active']"
        @click="onSelect(c.id)"
      >
        <div class="characters-button__text">
          <div class="characters-button__text_centered">{{ c.name }}</div>
        </div>
      </button>
    </CharacterContextMenu>
  </div>
</template>

<style scoped>
.characters {
  position: relative;
  height: 166px;
  padding: 10px 12px 20px;
  /**
   * @todo
   * character buttons must be square with size within the range of 65 to 125 px
   * buttons must shrink to fit in current row or be wrapped to the next row
   * buttons must be of same size on all rows (which is not possible with flexboxes)
   */
  /* here is grid-based attempt */
  /* display: grid;
  grid-template-columns: repeat(auto-fill, minmax(65px, 125px));
  grid-template-rows: repeat(2, auto); */
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
  background-color: #1d1d1d;
  border: 4px solid #000;
  border-bottom: none;
  box-shadow: inset 0 0 1px #000, inset 0 0 2px #fff;
  overflow: hidden;
}
.characters:before {
  /* hide the box shadow at the bottom */
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #1d1d1d;
  box-shadow: inset 2px 0 2px -2px #fff, inset -2px 0 2px -2px #fff;
}
.characters-button {
  display: block;
  width: 100%;
  height: 100%;
  background-color: #313131;
  cursor: pointer;
}
.characters-button:before {
  /* overlap the text if it's near the edge */
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border: 3px solid #000;
  z-index: 1;
}
.characters-button_active:before {
  border-width: 1px;
  box-shadow: inset 0 0 0 2px #ababab;
}
/* https://vue-loader.vuejs.org/guide/scoped-css.html#deep-selectors */
.characters >>> .characters-button__menu-wrapper {
  position: relative;
  flex: 1 1 0;
  max-width: 125px;
  min-width: 65px;
  overflow: hidden;
}
.characters-button__text {
  position: absolute;
  left: 50%;
  bottom: 2px;
  color: #fff;
  font-family: Exo2, sans-serif;
  font-size: 87%;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.02em;
  white-space: nowrap;
}
.characters-button__text_centered {
  position: relative;
  left: -50%;
}
</style>
