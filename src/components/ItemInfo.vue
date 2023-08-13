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
  width: 315rem;
  /* might happen: rem being transformed into pixels somehow (vue bug?); fix: */
  /* width: v-bind('`315rem`'); */
  padding: 16rem 7rem;
}
.text {
  display: block;
}
.pair {
  display: flex;
  justify-content: space-between;
}
</style>
