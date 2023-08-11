<script lang="ts">
import { GAMEDATA_ITEMS } from '@/shared/gamedata'
import KText from '@/ui/KText.vue'

export default {
  props: {
    stringId: { type: String, required: true },
  },
  computed: {
    data() {
      return GAMEDATA_ITEMS[this.stringId]!
    },
  },
  components: { KText },
}
</script>

<template>
  <div class="info">
    <KText color="title">{{ data.Name }}</KText>
    <div class="pair" v-if="data.Values['weight kg']">
      <KText color="attendant">-Weight</KText>
      <KText color="attendant">{{ data.Values['weight kg'] }} kg</KText>
    </div>
    <KText color="attendant" v-if="data.Values.description">----------------</KText>
    <KText color="attendant">{{ data.Values.description }}</KText>
  </div>
</template>

<style scoped>
.info {
  width: 315px;
  padding: 16px 7px;
}
.text {
  display: block;
}
.pair {
  display: flex;
  justify-content: space-between;
}
</style>
