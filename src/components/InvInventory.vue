<script lang="ts">
import InvWindow from './InvWindow.vue'
import InvRegion from './InvRegion.vue'
import type { IBackpack, IItem, ItemObj } from './interface'
import { InventoryRegion, ItemType } from './interface'

export default {
  components: { InvWindow, InvRegion },
  data() {
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
  },
}
</script>

<template>
  <InvWindow v-if="isBackpackOpened" title="BACKPACK" @close="toggleBackpack">
    <InvRegion v-bind="backpack.region" @change="onBackpackItemsChange" ref="backpack" />
    <div class="backpack_buttons">
      <button @click="onBackpackArrange">ARRANGE</button>
    </div>
  </InvWindow>
  <InvWindow title="CHARACTER">
    <div class="wrapper">
      <div class="stuff">
        <div class="stuff__row">
          <div class="stuff__buttons">
            <button :disabled="!hasBackpack" @click="toggleBackpack">
              {{ isBackpackOpened ? 'CLOSE' : 'OPEN' }} BAG
            </button>
            <button disabled>LIMBS</button>
          </div>
          <div>
            <div>-BACKPACK-</div>
            <InvRegion
              :type="ItemType.Backpack"
              :w="5"
              :h="4"
              :items="items[InventoryRegion.Backpack]"
              @change="onItemsChange(InventoryRegion.Backpack)($event)"
            />
          </div>
        </div>
        <div>
          <div>WEAPON I</div>
          <InvRegion
            :type="ItemType.Weapon"
            :w="10"
            :h="2"
            :items="items[InventoryRegion.Weapon1]"
            @change="onItemsChange(InventoryRegion.Weapon1)($event)"
          />
        </div>
        <div class="stuff__row">
          <div>
            <div>WEAPON II</div>
            <InvRegion
              :type="ItemType.Weapon"
              :w="7"
              :h="1"
              :items="items[InventoryRegion.Weapon2]"
              @change="onItemsChange(InventoryRegion.Weapon2)($event)"
            />
          </div>
          <div>
            <div>BELT</div>
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
          <div>
            <div>
              <div>SHIRT</div>
              <InvRegion
                :type="ItemType.Shirt"
                :w="4"
                :h="2"
                :items="items[InventoryRegion.Shirt]"
                @change="onItemsChange(InventoryRegion.Shirt)($event)"
              />
            </div>
            <div>
              <div>PANTS</div>
              <InvRegion
                :type="ItemType.Pants"
                :w="4"
                :h="5"
                :items="items[InventoryRegion.Pants]"
                @change="onItemsChange(InventoryRegion.Pants)($event)"
              />
            </div>
            <div>
              <div>BOOTS</div>
              <InvRegion
                :type="ItemType.Boots"
                :w="4"
                :h="2"
                :items="items[InventoryRegion.Boots]"
                @change="onItemsChange(InventoryRegion.Boots)($event)"
              />
            </div>
          </div>
          <div>
            <div>
              <div>HEAD</div>
              <InvRegion
                :type="ItemType.Head"
                :w="4"
                :h="3"
                :items="items[InventoryRegion.Head]"
                @change="onItemsChange(InventoryRegion.Head)($event)"
              />
            </div>
            <div>
              <div>ARMOR</div>
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
      <div class="common">
        <div class="common__info">INFO</div>
        <div class="common_inventory">
          <div>INVENTORY</div>
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
          <button @click="onInventoryArrange">ARRANGE</button>
        </div>
      </div>
    </div>
  </InvWindow>
</template>

<style scoped>
.wrapper {
  display: flex;
  gap: calc(var(--cell-size) / 2);
}
.stuff {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.stuff__row {
  display: flex;
  justify-content: space-between;
}
.stuff__buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.common {
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
  justify-content: flex-end;
}
.backpack_buttons {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
