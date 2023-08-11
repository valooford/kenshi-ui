<script lang="ts">
import ContextMenu, { type IContextMenuItem } from '@/ui/ContextMenu'

export enum CharacterContextMenuAction {
  Trade = 'trade',
  Follow = 'follow',
  Bodyguard = 'bodyguard',
  Pick_up = 'pickup',
}

const ITEMS: IContextMenuItem[] = [
  { id: CharacterContextMenuAction.Trade, title: 'Trade' },
  { id: CharacterContextMenuAction.Follow, title: 'Follow' },
  { id: CharacterContextMenuAction.Bodyguard, title: 'Bodyguard' },
  { id: CharacterContextMenuAction.Pick_up, title: 'Pick up' },
]

export default {
  components: { ContextMenu },
  props: {
    title: { type: String, required: true },
    disabled: { type: Boolean },
  },
  emits: ['trade'],
  data() {
    return { items: ITEMS }
  },
  methods: {
    onAction(itemId: string) {
      switch (itemId as CharacterContextMenuAction) {
        case CharacterContextMenuAction.Trade:
          this.$emit('trade')
          break
        default:
      }
    },
  },
}
</script>

<template>
  <ContextMenu :title="title" :items="items" :disabled="disabled" @action="onAction">
    <slot />
  </ContextMenu>
</template>

<style scoped></style>
