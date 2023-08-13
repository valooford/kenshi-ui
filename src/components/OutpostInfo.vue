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
  gap: 2rem;
  padding: 6rem 3rem 8rem;
}
.title {
  margin: 0 5rem;
  padding: 4rem;
  text-align: center;
  background-color: #151515;
  box-shadow: inset 0 0 0 1rem rgb(255 255 255 / 0.2);
  border: 1rem solid #000;
  border-radius: 2rem;
}
.content {
  display: flex;
  flex-direction: column;
  gap: 7rem;
  padding: 0 6rem;
}
.pair {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8rem;
}
.progress {
  width: 140rem;
  text-align: center;
  background: linear-gradient(to bottom, #004f00 50%, #003806 50%);
}
.progress_empty {
  background: #2c2c2c;
}
</style>
