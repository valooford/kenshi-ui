<script lang="ts">
import InvWindow from './InvWindow.vue'
import InvRegion from './InvRegion.vue'

export default {
  components: { InvWindow, InvRegion },
  methods: {
    onInventoryArrange() {
      const ref = this.$refs.inventory as InstanceType<typeof InvRegion>
      ref.arrange()
    },
  },
}
</script>

<template>
  <InvWindow>
    <div class="wrapper">
      <div class="stuff">
        <div class="stuff__row">
          <div class="stuff__buttons">
            <button>OPEN BAG</button>
            <button>LIMBS</button>
          </div>
          <div>
            <div>-BACKPACK-</div>
            <InvRegion :type="'backpack'" :w="5" :h="4" />
          </div>
        </div>
        <div>
          <div>WEAPON I</div>
          <InvRegion :type="'weapon'" :w="10" :h="2" />
        </div>
        <div class="stuff__row">
          <div>
            <div>WEAPON II</div>
            <InvRegion :type="'weapon'" :w="7" :h="1" />
          </div>
          <div>
            <div>BELT</div>
            <InvRegion :type="'belt'" :w="2" :h="2" />
          </div>
        </div>
        <div class="stuff__row">
          <div>
            <div>
              <div>SHIRT</div>
              <InvRegion :type="'shirt'" :w="4" :h="2" />
            </div>
            <div>
              <div>PANTS</div>
              <InvRegion :type="'pants'" :w="4" :h="5" />
            </div>
            <div>
              <div>BOOTS</div>
              <InvRegion :type="'boots'" :w="4" :h="2" />
            </div>
          </div>
          <div>
            <div>
              <div>HEAD</div>
              <InvRegion :type="'head'" :w="4" :h="3" />
            </div>
            <div>
              <div>ARMOR</div>
              <InvRegion :type="'armor'" :w="4" :h="6" />
            </div>
          </div>
        </div>
      </div>
      <div class="common">
        <div class="common__info">INFO</div>
        <div class="common_inventory">
          <div>INVENTORY</div>
          <InvRegion :w="8" :h="10" :stack="[{ type: 'misc', max: 5 }]" ref="inventory" />
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
</style>
