<script lang="ts">
import type { PropType } from 'vue'
import { InventoryRegion, ItemType } from '@/constants'

import KWindow from './KWindow.vue'
import KRegion from './KRegion.vue'
import KButton from './KButton.vue'
import CharacterGear from './CharacterGear.vue'

export default {
  components: { KWindow, KRegion, KButton, CharacterGear },
  props: {
    data: { type: Object as PropType<ICharacterInventoryData>, required: true },
  },
  emits: {
    'items-change': (id: string, items: ICharacterItems) => !!(id && items),
    close: null,
  },
  data() {
    return {
      ItemType,
      InventoryRegion,
      isBackpackOpened: !!this.data.items[InventoryRegion.Backpack][0],
      backpackWindowShift: { x: 0, y: 0 } as IPoint,
      isBackpackWindowPosSync: true,
    }
  },
  computed: {
    backpack() {
      return this.data.items[InventoryRegion.Backpack][0]
    },
    hasBackpack() {
      return !!this.backpack
    },
  },
  methods: {
    onItemsChange(region: IInventoryRegion) {
      return (regionItems: ItemObj[]) => {
        const items = { ...this.data.items }
        items[region] = regionItems as any[]
        this.$emit('items-change', this.data.id, items)
        if (region === InventoryRegion.Backpack && !regionItems.length) {
          this.isBackpackOpened = false
        }
      }
    },
    onBackpackItemsChange(items: ItemObj[]) {
      this.backpack.region.items = items
    },
    toggleBackpack() {
      if (this.hasBackpack) {
        if (!this.isBackpackOpened) {
          this.backpackWindowShift = { x: 0, y: 0 }
          this.isBackpackWindowPosSync = true
        }
        this.isBackpackOpened = !this.isBackpackOpened
      }
    },
    onInventoryArrange() {
      const ref = this.$refs.inventory as InstanceType<typeof KRegion>
      ref.arrange()
    },
    onBackpackArrange() {
      const ref = this.$refs.backpack as InstanceType<typeof KRegion>
      ref.arrange()
    },
    onWindowDrag(diff: IPoint) {
      if (this.isBackpackOpened && this.isBackpackWindowPosSync) {
        this.backpackWindowShift = {
          x: this.backpackWindowShift.x + diff.x,
          y: this.backpackWindowShift.y + diff.y,
        }
      }
    },
    onBackpackWindowMove() {
      this.isBackpackWindowPosSync = false
    },
    onClose() {
      this.$emit('close', this.data.id)
    },
  },
}
</script>

<template>
  <KWindow :title="data.name" @drag="onWindowDrag" @close="onClose">
    <template #left-aligned v-if="isBackpackOpened">
      <KWindow
        title="BACKPACK"
        :shift="backpackWindowShift"
        @move="onBackpackWindowMove"
        @close="toggleBackpack"
      >
        <div class="backpack">
          <KRegion v-bind="backpack.region" @change="onBackpackItemsChange" ref="backpack" />
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
            <div class="region-label">-Backpack-</div>
            <KRegion
              :type="ItemType.Backpack"
              :w="5"
              :h="4"
              :items="data.items[InventoryRegion.Backpack]"
              @change="onItemsChange(InventoryRegion.Backpack)($event)"
            />
          </div>
        </div>
        <div class="stuff__rows">
          <div class="stuff__group stuff__weapon1">
            <div class="region-label region-label_start">Weapon I</div>
            <KRegion
              :type="ItemType.Weapon"
              :w="10"
              :h="2"
              :items="data.items[InventoryRegion.Weapon1]"
              @change="onItemsChange(InventoryRegion.Weapon1)($event)"
            />
          </div>
          <div class="stuff__row">
            <div class="stuff__group">
              <div class="region-label region-label_start">Weapon II</div>
              <KRegion
                :type="ItemType.Weapon"
                :w="7"
                :h="1"
                :items="data.items[InventoryRegion.Weapon2]"
                @change="onItemsChange(InventoryRegion.Weapon2)($event)"
              />
            </div>
            <div class="stuff__group">
              <div class="region-label">Belt</div>
              <KRegion
                :type="ItemType.Belt"
                :w="2"
                :h="2"
                :items="data.items[InventoryRegion.Belt]"
                @change="onItemsChange(InventoryRegion.Belt)($event)"
              />
            </div>
          </div>
          <div class="stuff__row">
            <div class="stuff__group">
              <div class="stuff__group stuff__shirt">
                <div class="region-label">Shirt</div>
                <KRegion
                  :type="ItemType.Shirt"
                  :w="4"
                  :h="2"
                  :items="data.items[InventoryRegion.Shirt]"
                  @change="onItemsChange(InventoryRegion.Shirt)($event)"
                />
              </div>
              <div class="stuff__group">
                <div class="region-label">Pants</div>
                <KRegion
                  :type="ItemType.Pants"
                  :w="4"
                  :h="5"
                  :items="data.items[InventoryRegion.Pants]"
                  @change="onItemsChange(InventoryRegion.Pants)($event)"
                />
              </div>
              <div class="stuff__group">
                <div class="region-label">Boots</div>
                <KRegion
                  :type="ItemType.Boots"
                  :w="4"
                  :h="2"
                  :items="data.items[InventoryRegion.Boots]"
                  @change="onItemsChange(InventoryRegion.Boots)($event)"
                />
              </div>
            </div>
            <div class="stuff__group">
              <div class="stuff__group">
                <div class="region-label">Head</div>
                <KRegion
                  :type="ItemType.Head"
                  :w="4"
                  :h="3"
                  :items="data.items[InventoryRegion.Head]"
                  @change="onItemsChange(InventoryRegion.Head)($event)"
                />
              </div>
              <div class="stuff__group">
                <div class="region-label">Armor</div>
                <KRegion
                  :type="ItemType.Armor"
                  :w="4"
                  :h="6"
                  :items="data.items[InventoryRegion.Armor]"
                  @change="onItemsChange(InventoryRegion.Armor)($event)"
                />
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
          <div class="region-label">Inventory</div>
          <KRegion
            :w="8"
            :h="10"
            :items="data.items[InventoryRegion.Inventory]"
            :stack="[{ type: ItemType.Misc, max: 5 }]"
            @change="onItemsChange(InventoryRegion.Inventory)($event)"
            ref="inventory"
          />
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
.region-label {
  color: #9c9c9c;
  font-family: Sentencia, sans-serif;
  font-size: 17px;
  text-transform: uppercase;
  letter-spacing: 0.02em;
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
