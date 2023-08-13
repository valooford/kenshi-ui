<script lang="ts">
import type { PropType } from 'vue'
import KButton from '@/ui/KButton.vue'
import KText from '@/ui/KText.vue'

export interface IContextMenuItem {
  id: string
  title: string
}

const MENU_WIDTH = 238
const LONG_TOUCH_MS = 400

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
      pX: -9999,
      pY: -9999,
      touchTimeoutId: null as number | null,
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
      if (!e.defaultPrevented) {
        // close menu if it was an actual mouse
        document.addEventListener('mouseup', this.onClose, { once: true })
      }
    },
    onAction(e: PointerEvent, itemId: IContextMenuItem['id']) {
      e.preventDefault() // prevent selecting other ingame character underneath the menu right after the action performed (on mobile)
      this.$emit('action', itemId)
      this.onClose()
    },
    onClose() {
      this.open = false
      this.pX = -9999
      this.pY = -9999
    },
    onTouchStart(e: TouchEvent) {
      this.touchTimeoutId = setTimeout(() => {
        const mouseEvent = new MouseEvent('mousedown', {
          button: 2,
          clientX: e.touches[0]!.clientX,
          clientY: e.touches[0]!.clientY,
          cancelable: true,
        })
        mouseEvent.preventDefault()
        this.onOpen(mouseEvent)
      }, LONG_TOUCH_MS)
    },
    onTouchEnd() {
      clearTimeout(this.touchTimeoutId!)
    },
  },
}
</script>

<template>
  <div
    :class="$attrs.class"
    @mousedown.right="onOpen"
    @contextmenu.prevent
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <slot />
  </div>
  <teleport v-if="open" to="#root">
    <div class="context-menu" :style="[{ top: `${pY}px`, left: `${pX}px` }, cssVars]" ref="menu">
      <KText>{{ title }}</KText>
      <div class="items">
        <KButton
          v-for="item in items"
          class="items__button"
          @pointerup="onAction($event, item.id)"
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
  width: v-bind('`${MENU_WIDTH}rem`');
  padding: 4rem;
  background-color: #1d1d1d;
  border: 4rem solid #000;
  box-shadow: inset 0 0 1rem #000, inset 0 0 2rem #fff;
  z-index: 1300;
}
.text {
  display: block;
  text-align: center;
  line-height: 25rem;
}
.items {
  display: flex;
  flex-direction: column;
  gap: 8rem;
}
.items__button {
  padding-top: 2rem;
  padding-bottom: 2rem;
}
</style>
