<script lang="ts">
import type { PropType } from 'vue'
import KButton from '@/ui/KButton.vue'
import KText from '@/ui/KText.vue'

export interface IContextMenuItem {
  id: string
  title: string
}

const MENU_WIDTH = 238

export default {
  components: { KButton, KText },
  inject: ['cssVariables'],
  props: {
    title: { type: String, required: true },
    items: { type: Array as PropType<IContextMenuItem[]>, required: true },
    disabled: { type: Boolean },
  },
  emits: {
    action: (itemId: IContextMenuItem['id']) => !!itemId,
  },
  data() {
    return {
      MENU_WIDTH,
      cssVars: this.cssVariables as unknown as string,
      open: false,
      pX: -1000,
      pY: -1000,
    }
  },
  methods: {
    onOpen(e: MouseEvent) {
      if (this.disabled) return
      this.open = true
      setTimeout(() => {
        const menuRef = this.$refs.menu as HTMLDivElement
        this.pX = Math.max(0, Math.min(e.clientX, window.innerWidth - menuRef.clientWidth))
        this.pY = Math.max(0, Math.min(e.clientY, window.innerHeight - menuRef.clientHeight))
      }, 0)
      document.addEventListener('mouseup', this.onClose, { once: true })
    },
    onAction(itemId: IContextMenuItem['id']) {
      this.$emit('action', itemId)
    },
    onClose() {
      this.open = false
      this.pX = -1000
      this.pY = -1000
    },
  },
}
</script>

<template>
  <div :class="$attrs.class" @mousedown.right="onOpen" @contextmenu.prevent>
    <slot />
  </div>
  <teleport v-if="open" to="#root">
    <div class="context-menu" :style="[{ top: `${pY}px`, left: `${pX}px` }, cssVars]" ref="menu">
      <KText>{{ title }}</KText>
      <div class="items">
        <KButton
          v-for="item in items"
          class="items__button"
          @mouseup="onAction(item.id)"
          :key="item.id"
        >
          {{ item.title }}
        </KButton>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.context-menu {
  position: fixed;
  width: v-bind('`${MENU_WIDTH}px`');
  padding: 4px;
  background-color: #1d1d1d;
  border: 4px solid #000;
  box-shadow: inset 0 0 1px #000, inset 0 0 2px #fff;
  z-index: 1300;
}
.text {
  display: block;
  text-align: center;
  line-height: 25px;
}
.items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.items__button {
  padding-top: 2px;
  padding-bottom: 2px;
}
</style>
