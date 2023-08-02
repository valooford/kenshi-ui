<script lang="ts">
import { isAmountItemId, isBackpackItemId } from '@/shared/utils'
import { GAMEDATA_ITEMS_SECTIONS, GAMEDATA_ITEMS_SECTIONS_LIST } from '@/shared/gamedata'

import { AmountItem, BackpackItem, KItem } from './KItem'
import KWindow from './KWindow.vue'

export default {
  components: { KWindow, KItem, AmountItem, BackpackItem },
  inject: ['store', 'dispatch'],
  data() {
    return {
      GAMEDATA_ITEMS_SECTIONS,
      GAMEDATA_ITEMS_SECTIONS_LIST,
      initialised: false,
    }
  },
  computed: {
    s() {
      return this.store as IStore
    },
    d() {
      return this.dispatch as IDispatch
    },
    data() {
      return this.s.registry
    },
    region() {
      return this.s.regions[this.data.regionId]!
    },
  },
  methods: {
    // type predicates
    isAmountItemId,
    isBackpackItemId,
  },
  mounted() {
    this.initialised = true
  },
}
</script>

<template>
  <KWindow :centered="true" title="Registry" @close="d.toggleRegistry">
    <div class="wrapper">
      <div class="sections">
        <ul class="sections__content">
          <li v-for="section in GAMEDATA_ITEMS_SECTIONS_LIST" :key="section">
            <button
              type="button"
              :class="['sections__item', section === data.section && 'sections__item_selected']"
              @click="d.selectRegistrySection(section)"
            >
              {{ GAMEDATA_ITEMS_SECTIONS[section] }}
            </button>
          </li>
        </ul>
      </div>
      <div class="items">
        <div class="items__content">
          <template v-for="itemId in region.items" :key="itemId">
            <AmountItem v-if="isAmountItemId(itemId)" :id="itemId" />
            <BackpackItem v-else-if="isBackpackItemId(itemId)" :id="itemId" />
            <KItem v-else :id="itemId" />
          </template>
        </div>
      </div>
    </div>
  </KWindow>
</template>

<style scoped>
.wrapper {
  display: flex;
  width: 986px;
  height: 396px;
  gap: 10px;
  padding: 9px 8px;
}
.wrapper > * {
  background-color: #151515;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.2);
  border: 1px solid #000;
  border-radius: 2px;
}
.sections {
  width: 234px;
  padding: 19px 6px 15px 11px;
}
.sections__content {
  height: 100%;
  padding: 0px 6px 0 0;
  overflow: auto;
}
.sections__item {
  display: block;
  width: 100%;
  color: #9c9c9c;
  font-family: Exo2, sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: 0.02em;
  white-space: pre;
  cursor: pointer;
}
.sections__item_selected {
  color: var(--color-goodBright);
}
.items {
  flex: 1;
  padding: 10px;
}
.items__content {
  position: relative;
  height: 100%;
  overflow-y: auto;
}
</style>
