<script lang="ts">
import type { PropType } from 'vue'
import iconSprite from '@/assets/img/Kenshi_UI.png'

interface IIconParameters {
  w: number
  h: number
  x: number
  y: number
  hover?: { x: number; y: number }
  active?: { x: number; y: number }
  selected?: { x: number; y: number }
}

type IIconVariant =
  | 'close'
  | 'o'
  | 'expand-less'
  | 'expand-more'
  | 'pause'
  | 'normal'
  | 'faster'
  | 'fastest'
  | 'construction'
  | 'checkbox-off'
  | 'checkbox-on'
  | 'arrow-left'
  | 'arrow-right'
  | 'arrow-top'
  | 'arrow-bottom'
  | 'rhombus'
  | 'walk'
  | 'jog'
  | 'run'
  | 'run-together'

const ICONS: Record<IIconVariant, IIconParameters> = {
  close: { w: 25, h: 26, x: 700, y: 544, hover: { x: 736, y: 544 }, active: { x: 772, y: 544 } },
  o: { w: 25, h: 26, x: 642, y: 422, hover: { x: 678, y: 422 }, active: { x: 714, y: 422 } },
  'expand-less': {
    w: 34,
    h: 32,
    x: 838,
    y: 499,
    hover: { x: 838, y: 458 },
    active: { x: 838, y: 416 },
  },
  'expand-more': {
    w: 34,
    h: 32,
    x: 788,
    y: 499,
    hover: { x: 788, y: 458 },
    active: { x: 788, y: 416 },
  },
  pause: {
    w: 46,
    h: 45,
    x: 880,
    y: 713,
    hover: { x: 880, y: 659 },
    active: { x: 880, y: 607 },
    selected: { x: 880, y: 552 },
  },
  normal: {
    w: 46,
    h: 45,
    x: 926,
    y: 713,
    hover: { x: 926, y: 659 },
    active: { x: 926, y: 607 },
    selected: { x: 926, y: 552 },
  },
  faster: {
    w: 46,
    h: 45,
    x: 972,
    y: 713,
    hover: { x: 972, y: 659 },
    active: { x: 972, y: 607 },
    selected: { x: 972, y: 552 },
  },
  fastest: {
    w: 46,
    h: 45,
    x: 1018,
    y: 713,
    hover: { x: 1018, y: 659 },
    active: { x: 1018, y: 607 },
    selected: { x: 1018, y: 552 },
  },
  construction: {
    w: 62,
    h: 45,
    x: 880,
    y: 767,
    hover: { x: 953, y: 767 },
    active: { x: 1027, y: 767 },
  },
  'checkbox-off': { w: 28, h: 28, x: 605, y: 458 },
  'checkbox-on': { w: 28, h: 28, x: 643, y: 458 },
  'arrow-left': {
    w: 26,
    h: 45,
    x: 667,
    y: 710,
    hover: { x: 667, y: 655 },
    active: { x: 667, y: 600 },
  },
  'arrow-right': {
    w: 26,
    h: 45,
    x: 706,
    y: 710,
    hover: { x: 706, y: 655 },
    active: { x: 706, y: 600 },
  },
  'arrow-top': {
    w: 45,
    h: 26,
    x: 753,
    y: 721,
    hover: { x: 753, y: 680 },
    active: { x: 753, y: 638 },
  },
  'arrow-bottom': {
    w: 45,
    h: 26,
    x: 816,
    y: 722,
    hover: { x: 817, y: 681 },
    active: { x: 817, y: 639 },
  },
  rhombus: { w: 97, h: 97, x: 1308, y: 704 },
  walk: { w: 44, h: 44, x: 1103, y: 768 },
  jog: { w: 44, h: 44, x: 1153, y: 768 },
  run: { w: 44, h: 44, x: 1203, y: 768 },
  'run-together': { w: 44, h: 44, x: 1253, y: 768 },
}

export default {
  props: {
    variant: { type: String as PropType<IIconVariant>, required: true },
    selected: { type: Boolean },
  },
  data() {
    return { iconSprite }
  },
  computed: {
    icon() {
      return ICONS[this.variant]
    },
  },
}
</script>

<template>
  <button
    :class="['button', selected && 'button_selected']"
    :style="{ backgroundImage: `url(${iconSprite})` }"
  />
</template>

<style scoped>
.button {
  background-position: v-bind('`${-icon.x}px`') v-bind('`${-icon.y}px`');
  width: v-bind('`${icon.w}px`');
  height: v-bind('`${icon.h}px`');
}
.button:hover {
  background-position: v-bind('`${-(icon.hover || icon).x}px`')
    v-bind('`${-(icon.hover || icon).y}px`');
}
.button:active {
  background-position: v-bind('`${-(icon.active || icon).x}px`')
    v-bind('`${-(icon.active || icon).y}px`');
}
.button_selected {
  background-position: v-bind('`${-(icon.selected || icon).x}px`')
    v-bind('`${-(icon.selected || icon).y}px`');
}
</style>
