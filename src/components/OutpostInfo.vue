<script lang="ts">
import KBox from '@/ui/KBox.vue'
import KText from '@/ui/KText.vue'
import KCheckbox from '@/ui/KCheckbox.vue'

export default { components: { KText, KBox, KCheckbox } }
</script>

<template>
  <KBox>
    <div class="container">
      <div class="title">
        <KText>Outpost</KText>
      </div>
      <div class="content">
        <div class="pair">
          <KText>Open to public:</KText>
          <KCheckbox />
        </div>
        <div class="pair">
          <KText>Research:</KText>
          <div class="progress progress_empty">
            <KText>None</KText>
          </div>
        </div>
        <div class="pair">
          <KText>Power:</KText>
          <div class="progress">
            <KText>150/117</KText>
          </div>
        </div>
        <div class="pair">
          <KText>Battery charge:</KText>
          <div class="progress">
            <KText>720/720</KText>
          </div>
        </div>
      </div>
    </div>
  </KBox>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px 3px 8px;
}
.title {
  margin: 0 5px;
  padding: 4px;
  text-align: center;
  background-color: #151515;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.2);
  border: 1px solid #000;
  border-radius: 2px;
}
.content {
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 0 6px;
}
.pair {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
.progress {
  width: 140px;
  text-align: center;
  background: linear-gradient(to bottom, #004f00 50%, #003806 50%);
}
.progress_empty {
  background: #2c2c2c;
}
</style>
