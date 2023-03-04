<script lang="ts">
import InvWindow from './InvWindow.vue'
import InvRegion from './InvRegion.vue'
import InvButton from './InvButton.vue'
import type { IBackpack, IItem, IPoint, ItemObj } from './interface'
import { InventoryRegion, ItemType } from './interface'

export default {
  components: { InvWindow, InvRegion, InvButton },
  data() {
    const windowPosX = Math.round((window.innerWidth - 569) / 2)
    const windowPosY = Math.round((window.innerHeight - 658) / 2)
    return {
      ItemType,
      InventoryRegion,
      items: {
        [InventoryRegion.Inventory]: [] as ItemObj[],
        [InventoryRegion.Backpack]: [] as IBackpack[],
        [InventoryRegion.Weapon1]: [] as IItem[],
        [InventoryRegion.Weapon2]: [] as IItem[],
        [InventoryRegion.Belt]: [] as IItem[],
        [InventoryRegion.Shirt]: [] as IItem[],
        [InventoryRegion.Pants]: [] as IItem[],
        [InventoryRegion.Boots]: [] as IItem[],
        [InventoryRegion.Head]: [] as IItem[],
        [InventoryRegion.Armor]: [] as IItem[],
      },
      isBackpackOpened: false,
      pX: -1000,
      pY: -1000,
      windowPos: { x: windowPosX, y: windowPosY },
      backpackWindowPos: { x: 0, y: 0 },
      isBackpackWindowPosSync: false,
    }
  },
  computed: {
    backpack() {
      return this.items[InventoryRegion.Backpack][0]
    },
    hasBackpack() {
      return !!this.backpack
    },
  },
  methods: {
    onItemsChange(region: InventoryRegion) {
      return (items: ItemObj[]) => {
        this.items[region] = items as any[]
        if (region === InventoryRegion.Backpack && !items.length) {
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
          this.isBackpackWindowPosSync = true
          this.backpackWindowPos = { x: this.windowPos.x - 240, y: this.windowPos.y } // here 240 is a backpack window width
        }
        this.isBackpackOpened = !this.isBackpackOpened
      }
    },
    onInventoryArrange() {
      const ref = this.$refs.inventory as InstanceType<typeof InvRegion>
      ref.arrange()
    },
    onBackpackArrange() {
      const ref = this.$refs.backpack as InstanceType<typeof InvRegion>
      ref.arrange()
    },
    onWindowDragStart(e: DragEvent) {
      if (!this.isBackpackWindowPosSync) return
      this.pX = e.clientX
      this.pY = e.clientY
    },
    onWindowDrag(diff: IPoint) {
      if (this.isBackpackWindowPosSync) {
        this.backpackWindowPos = {
          x: this.backpackWindowPos.x + diff.x,
          y: this.backpackWindowPos.y + diff.y,
        }
      }
    },
    onWindowMove(pos: IPoint) {
      this.windowPos = pos
      if (this.isBackpackWindowPosSync) {
        this.backpackWindowPos = { x: this.windowPos.x - 240, y: this.windowPos.y }
      }
      this.pX = -1000
      this.pY = -1000
    },
    onBackpackWindowMove(pos: IPoint) {
      this.backpackWindowPos = pos
      this.isBackpackWindowPosSync = false
    },
  },
}
</script>

<template>
  <InvWindow
    v-if="isBackpackOpened"
    title="BACKPACK"
    :x="backpackWindowPos.x"
    :y="backpackWindowPos.y"
    @close="toggleBackpack"
    @move="onBackpackWindowMove"
  >
    <div class="backpack">
      <InvRegion v-bind="backpack.region" @change="onBackpackItemsChange" ref="backpack" />
      <div>
        <InvButton size="sm" @click="onBackpackArrange">ARRANGE</InvButton>
      </div>
    </div>
  </InvWindow>
  <InvWindow
    title="CHARACTER"
    :x="windowPos.x"
    :y="windowPos.y"
    @drag="onWindowDrag"
    @move="onWindowMove"
  >
    <div class="wrapper">
      <div class="stuff">
        <div class="stuff__row">
          <div class="stuff__buttons">
            <InvButton size="lg" :disabled="!hasBackpack" @click="toggleBackpack">
              OPEN BAG
            </InvButton>
            <InvButton size="lg" disabled>LIMBS</InvButton>
          </div>
          <div class="stuff__group stuff__backpack">
            <div class="region-label">-BACKPACK-</div>
            <InvRegion
              :type="ItemType.Backpack"
              :w="5"
              :h="4"
              :items="items[InventoryRegion.Backpack]"
              @change="onItemsChange(InventoryRegion.Backpack)($event)"
            />
          </div>
        </div>
        <div class="stuff__rows">
          <div class="stuff__group stuff__weapon1">
            <div class="region-label region-label_start">WEAPON I</div>
            <InvRegion
              :type="ItemType.Weapon"
              :w="10"
              :h="2"
              :items="items[InventoryRegion.Weapon1]"
              @change="onItemsChange(InventoryRegion.Weapon1)($event)"
            />
          </div>
          <div class="stuff__row">
            <div class="stuff__group">
              <div class="region-label region-label_start">WEAPON II</div>
              <InvRegion
                :type="ItemType.Weapon"
                :w="7"
                :h="1"
                :items="items[InventoryRegion.Weapon2]"
                @change="onItemsChange(InventoryRegion.Weapon2)($event)"
              />
            </div>
            <div class="stuff__group">
              <div class="region-label">BELT</div>
              <InvRegion
                :type="ItemType.Belt"
                :w="2"
                :h="2"
                :items="items[InventoryRegion.Belt]"
                @change="onItemsChange(InventoryRegion.Belt)($event)"
              />
            </div>
          </div>
          <div class="stuff__row">
            <div class="stuff__group">
              <div class="stuff__group stuff__shirt">
                <div class="region-label">SHIRT</div>
                <InvRegion
                  :type="ItemType.Shirt"
                  :w="4"
                  :h="2"
                  :items="items[InventoryRegion.Shirt]"
                  @change="onItemsChange(InventoryRegion.Shirt)($event)"
                />
              </div>
              <div class="stuff__group">
                <div class="region-label">PANTS</div>
                <InvRegion
                  :type="ItemType.Pants"
                  :w="4"
                  :h="5"
                  :items="items[InventoryRegion.Pants]"
                  @change="onItemsChange(InventoryRegion.Pants)($event)"
                />
              </div>
              <div class="stuff__group">
                <div class="region-label">BOOTS</div>
                <InvRegion
                  :type="ItemType.Boots"
                  :w="4"
                  :h="2"
                  :items="items[InventoryRegion.Boots]"
                  @change="onItemsChange(InventoryRegion.Boots)($event)"
                />
              </div>
            </div>
            <div class="stuff__group">
              <div class="stuff__group">
                <div class="region-label">HEAD</div>
                <InvRegion
                  :type="ItemType.Head"
                  :w="4"
                  :h="3"
                  :items="items[InventoryRegion.Head]"
                  @change="onItemsChange(InventoryRegion.Head)($event)"
                />
              </div>
              <div class="stuff__group">
                <div class="region-label">ARMOR</div>
                <InvRegion
                  :type="ItemType.Armor"
                  :w="4"
                  :h="6"
                  :items="items[InventoryRegion.Armor]"
                  @change="onItemsChange(InventoryRegion.Armor)($event)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="common">
        <div class="common__info">
          <div class="region-label">INFO</div>
        </div>
        <div class="common_inventory stuff__group">
          <div class="region-label">INVENTORY</div>
          <InvRegion
            :w="8"
            :h="10"
            :items="items[InventoryRegion.Inventory]"
            :stack="[{ type: ItemType.Misc, max: 5 }]"
            @change="onItemsChange(InventoryRegion.Inventory)($event)"
            ref="inventory"
          />
        </div>
        <div class="common_buttons">
          <InvButton @click="onInventoryArrange">ARRANGE</InvButton>
        </div>
      </div>
    </div>
  </InvWindow>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
  width: 487px;
  gap: 12px;
  padding: 9px 8px;
}
.region-label {
  color: #9c9c9c;
  font-family: Sentencia, sans-serif;
  font-size: 17px;
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
.common__info {
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
