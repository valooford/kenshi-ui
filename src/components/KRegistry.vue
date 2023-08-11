<script lang="ts">
import { isAmountItemId, isBackpackItemId } from '@/shared/utils'
import { GAMEDATA_ITEMS_SECTIONS, GAMEDATA_ITEMS_SECTIONS_LIST } from '@/shared/gamedata'
import KText from '@/ui/KText.vue'
import KWindow from '@/ui/KWindow.vue'

import { AmountItem, BackpackItem, KItem } from './KItem'
import ItemInfo from './ItemInfo.vue'

export default {
  components: { KWindow, KItem, AmountItem, BackpackItem, KText, ItemInfo },
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
  <KWindow auto-focus :centered="true" title="Registry" @close="d.toggleRegistry">
    <template v-slot:free-space-aligned="slotProps">
      <ItemInfo :string-id="slotProps.id" />
    </template>
    <div class="wrapper">
      <div class="sections">
        <ul class="sections__content">
          <li v-for="section in GAMEDATA_ITEMS_SECTIONS_LIST" :key="section">
            <button type="button" class="sections__item" @click="d.selectRegistrySection(section)">
              <KText :color="section === data.section ? 'good' : 'default'">{{
                GAMEDATA_ITEMS_SECTIONS[section]
              }}</KText>
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
  width: 100%;
  white-space: pre;
}
.text {
  line-height: 18px;
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
