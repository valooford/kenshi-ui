<script lang="ts">
import InvWindow from './InvWindow.vue'
import InvRegion from './InvRegion.vue'

export default {
  components: { InvWindow, InvRegion },
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
            <InvRegion :w="5" :h="4" />
          </div>
        </div>
        <div>
          <div>WEAPON I</div>
          <InvRegion :w="10" :h="2" />
        </div>
        <div class="stuff__row">
          <div>
            <div>WEAPON II</div>
            <InvRegion :w="7" :h="1" />
          </div>
          <div>
            <div>BELT</div>
            <InvRegion :w="2" :h="2" />
          </div>
        </div>
        <div class="stuff__row">
          <div>
            <div>
              <div>SHIRT</div>
              <InvRegion :w="4" :h="2" />
            </div>
            <div>
              <div>PANTS</div>
              <InvRegion :w="4" :h="5" />
            </div>
            <div>
              <div>BOOTS</div>
              <InvRegion :w="4" :h="2" />
            </div>
          </div>
          <div>
            <div>
              <div>HEAD</div>
              <InvRegion :w="4" :h="3" />
            </div>
            <div>
              <div>ARMOR</div>
              <InvRegion :w="4" :h="6" />
            </div>
          </div>
        </div>
      </div>
      <div class="common">
        <div class="common__info">INFO</div>
        <div class="common_inventory">
          <div>INVENTORY</div>
          <InvRegion :w="8" :h="10" />
        </div>
        <div class="common_buttons">
          <button>ARRANGE</button>
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
