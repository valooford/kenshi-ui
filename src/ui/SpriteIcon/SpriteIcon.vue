<script lang="ts">
import type { PropType } from 'vue'
import iconSprite from '@/assets/img/Kenshi_UI.png'

import { ICONS } from './constants'
import type { IIconVariant } from './interface'

export default {
  props: {
    variant: { type: String as PropType<IIconVariant>, required: true },
    selected: { type: Boolean },
    className: { type: String },
  },
  data() {
    return { iconSprite }
  },
  computed: {
    icon() {
      return ICONS[this.variant]
    },
  },
  inheritAttrs: false, // enforce consumers to use SpriteIconButton to handle events instead of the icon itself (A11y)
}
</script>

<template>
  <div
    :class="['icon', selected && 'icon_selected', className]"
    :style="{ backgroundImage: `url(${iconSprite})` }"
  />
</template>

<style scoped>
.icon {
  display: block;
  background-position: v-bind('`${-icon.x}px`') v-bind('`${-icon.y}px`');
  width: v-bind('`${icon.w}px`');
  height: v-bind('`${icon.h}px`');
}
.icon:hover {
  background-position: v-bind('`${-(icon.hover || icon).x}px`')
    v-bind('`${-(icon.hover || icon).y}px`');
}
.icon:active {
  background-position: v-bind('`${-(icon.active || icon).x}px`')
    v-bind('`${-(icon.active || icon).y}px`');
}
.icon_selected {
  background-position: v-bind('`${-(icon.selected || icon).x}px`')
    v-bind('`${-(icon.selected || icon).y}px`');
}
</style>
