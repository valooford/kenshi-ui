<script lang="ts">
import type { PropType } from 'vue'
import { CommonSound, InventoryRegion, ItemType } from '@/shared/constants'
import type { IAudioDispatch } from '@/shared/interface'
import KButton from '@/ui/KButton.vue'
import KText from '@/ui/KText.vue'
import KWindow from '@/ui/KWindow.vue'

import KRegion from './KRegion.vue'
import CharacterGear from './CharacterGear.vue'
import ItemInfo from './ItemInfo.vue'

export default {
  components: { KWindow, KRegion, KButton, CharacterGear, KText, ItemInfo },
  inject: ['store', 'dispatch', 'audio'],
  props: {
    id: { type: String as PropType<string> as PropType<ICharacterId>, required: true },
  },
  data() {
    return {
      ItemType,
      InventoryRegion,
      backpackWindowShift: { x: 0, y: 0 } as IPoint,
      isBackpackWindowPosSync: true,
    }
  },
  computed: {
    s() {
      return this.store as IStore
    },
    d() {
      return this.dispatch as IDispatch
    },
    a() {
      return this.audio as IAudioDispatch
    },
    data() {
      return this.s.characters[this.id]!
    },
    backpackId() {
      return this.s.regions[this.data.regions[InventoryRegion.Backpack]]!.items[0]
    },
    backpack() {
      return this.backpackId && this.s.items[this.backpackId]!
    },
    hasBackpack() {
      return !!this.backpack
    },
  },
  methods: {
    toggleBackpack() {
      if (this.hasBackpack) {
        if (this.backpack!.isOpened) {
          this.d.closeBackpack(this.backpackId!)
          this.a.playItemSound(this.backpack!.stringId, 'drop')
        } else {
          this.backpackWindowShift = { x: 0, y: 0 }
          this.isBackpackWindowPosSync = true
          this.d.openBackpack(this.backpackId!)
          this.a.playItemSound(this.backpack!.stringId, 'drag')
        }
      }
    },
    onInventoryArrange() {
      this.d.arrangeRegion(this.data.regions[InventoryRegion.Inventory])
    },
    onBackpackArrange() {
      this.d.arrangeRegion(this.backpack!.innerRegionId)
    },
    onWindowDrag(diff: IPoint) {
      if (this.backpack?.isOpened && this.isBackpackWindowPosSync) {
        this.backpackWindowShift = {
          x: this.backpackWindowShift.x + diff.x,
          y: this.backpackWindowShift.y + diff.y,
        }
      }
    },
    onBackpackWindowMove() {
      this.isBackpackWindowPosSync = false
    },
  },
  created() {
    if (this.backpackId) this.d.openBackpack(this.backpackId)
  },
  mounted() {
    this.a.playInventorySound(CommonSound.InventoryOpen)
  },
  unmounted() {
    this.a.playInventorySound(CommonSound.InventoryClose)
  },
}
</script>

<template>
  <KWindow auto-focus :title="data.name" @drag="onWindowDrag" @close="d.closeSeamInventory">
    <template v-slot:free-space-aligned="slotProps">
      <ItemInfo :string-id="slotProps.id" />
    </template>
    <template #left-aligned v-if="backpack?.isOpened">
      <KWindow
        title="BACKPACK"
        :shift="backpackWindowShift"
        @move="onBackpackWindowMove"
        @close="toggleBackpack"
      >
        <template v-slot:free-space-aligned="slotProps">
          <ItemInfo :string-id="slotProps.id" />
        </template>
        <div class="backpack">
          <KRegion v-if="backpack" :id="backpack.innerRegionId" />
          <div>
            <KButton size="sm" @click="onBackpackArrange">ARRANGE</KButton>
          </div>
        </div>
      </KWindow>
    </template>
    <div class="wrapper">
      <div class="stuff">
        <div class="stuff__row">
          <div class="stuff__buttons">
            <KButton size="lg" :disabled="!hasBackpack" @click="toggleBackpack"> OPEN BAG </KButton>
            <KButton size="lg" disabled>LIMBS</KButton>
          </div>
          <div class="stuff__group stuff__backpack">
            <div class="region-label"><KText variant="alt">-Backpack-</KText></div>
            <KRegion :id="data.regions[InventoryRegion.Backpack]" />
          </div>
        </div>
        <div class="stuff__rows">
          <div class="stuff__group stuff__weapon1">
            <div class="region-label region-label_start"><KText variant="alt">Weapon I</KText></div>
            <KRegion :id="data.regions[InventoryRegion.Weapon1]" />
          </div>
          <div class="stuff__row">
            <div class="stuff__group">
              <div class="region-label region-label_start">
                <KText variant="alt">Weapon II</KText>
              </div>
              <KRegion :id="data.regions[InventoryRegion.Weapon2]" />
            </div>
            <div class="stuff__group">
              <div class="region-label"><KText variant="alt">Belt</KText></div>
              <KRegion :id="data.regions[InventoryRegion.Belt]" />
            </div>
          </div>
          <div class="stuff__row">
            <div class="stuff__group">
              <div class="stuff__group stuff__shirt">
                <div class="region-label"><KText variant="alt">Shirt</KText></div>
                <KRegion :id="data.regions[InventoryRegion.Shirt]" />
              </div>
              <div class="stuff__group">
                <div class="region-label"><KText variant="alt">Pants</KText></div>
                <KRegion :id="data.regions[InventoryRegion.Pants]" />
              </div>
              <div class="stuff__group">
                <div class="region-label"><KText variant="alt">Boots</KText></div>
                <KRegion :id="data.regions[InventoryRegion.Boots]" />
              </div>
            </div>
            <div class="stuff__group">
              <div class="stuff__group">
                <div class="region-label"><KText variant="alt">Head</KText></div>
                <KRegion :id="data.regions[InventoryRegion.Head]" />
              </div>
              <div class="stuff__group">
                <div class="region-label"><KText variant="alt">Armor</KText></div>
                <KRegion :id="data.regions[InventoryRegion.Armor]" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="common">
        <div class="common__gear">
          <CharacterGear />
        </div>
        <div class="common_inventory stuff__group">
          <div class="region-label"><KText variant="alt">Inventory</KText></div>
          <KRegion :id="data.regions[InventoryRegion.Inventory]" />
        </div>
        <div class="common_buttons">
          <KButton @click="onInventoryArrange">ARRANGE</KButton>
        </div>
      </div>
    </div>
  </KWindow>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
  width: 487px;
  gap: 10px;
  padding: 9px 8px;
}
.stuff {
  flex: 1 1 256px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.stuff__rows {
  margin-left: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.stuff__row {
  display: flex;
  justify-content: space-between;
}
.stuff__buttons {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.stuff__group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.stuff__backpack {
  margin-right: 2px;
  gap: 4px;
}
.region-label_start {
  margin-inline-end: auto;
  margin-inline-start: 7px;
}
.stuff__weapon1 .region-label {
  margin-top: -15px;
}
.stuff__shirt .region-label {
  margin-top: -22px;
}
.common {
  flex: 1 1 200px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.common__gear {
  flex: 1;
}
.common_inventory {
  flex: 1;
}
.common_buttons {
  display: flex;
  justify-content: center;
}
.backpack {
  padding: 12px 16px 6px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
</style>
