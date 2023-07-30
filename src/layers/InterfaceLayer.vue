<script lang="ts">
import { ItemType } from '@/shared/constants'
import CharactersBar from '@/components/CharactersBar.vue'
import CssVariablesProvider from '@/components/CssVariablesProvider.vue'
import KSeam from '@/components/KSeam.vue'
import KButton from '@/components/KButton.vue'

export default {
  components: {
    CharactersBar,
    CssVariablesProvider,
    KSeam,
    KButton,
  },
  inject: ['store', 'dispatch'],
  data() {
    return { ItemType }
  },
  computed: {
    s() {
      return this.store as IStore
    },
    d() {
      return this.dispatch as IDispatch
    },
    charactersArr() {
      return this.s.charactersList.map((id) => this.s.characters[id]!)
    },
  },
  methods: {
    emulateDefaultCursorEverywhere(e: DragEvent) {
      e.preventDefault()
    },
    preventBrowserContextMenu(e: Event) {
      e.preventDefault()
    },
    onKeyDown(e: KeyboardEvent) {
      if (e.repeat) return
      switch (e.code) {
        case 'Tab':
          if (!this.s.selectedCharacter) break
          e.preventDefault()
          if (this.s.seam.main) {
            this.d.closeSeamInventory()
          } else {
            this.d.openMainSeamInventory()
          }
          break
        case 'Escape':
          if (this.s.seam.main) {
            this.d.closeSeamInventory()
          } else if (this.s.selectedCharacter) {
            this.d.resetSelectedCharacter()
          }
          if (this.s.seam.registry) {
            this.d.toggleRegistry()
          }
          break
        default:
      }
    },
  },
  mounted() {
    document.addEventListener('dragover', this.emulateDefaultCursorEverywhere)
    // document.addEventListener('contextmenu', this.preventBrowserContextMenu)
    document.addEventListener('keydown', this.onKeyDown)
  },
  unmounted() {
    document.removeEventListener('dragover', this.emulateDefaultCursorEverywhere)
    // document.removeEventListener('contextmenu', this.preventBrowserContextMenu)
    document.removeEventListener('keydown', this.onKeyDown)
  },
}
</script>

<template>
  <CssVariablesProvider class="menu">
    <KSeam />
    <div class="items-container">
      <KButton size="default" @click="d.toggleRegistry">REGISTRY</KButton>
    </div>
    <div class="controls">
      <div class="controls__left"></div>
      <div class="controls__flex">
        <CharactersBar
          :characters="charactersArr"
          :selected="s.selectedCharacter"
          @select="d.selectCharacter"
          @trade="d.openRelatedSeamInventory"
        />
      </div>
      <div class="controls__right"></div>
    </div>
  </CssVariablesProvider>
</template>

<style scoped>
.menu {
  position: relative;
  height: 100%;
}
.items-container {
  position: absolute;
  right: 0;
  bottom: 255px;
  padding: 4px;
}
.controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-end;
  gap: 4px;
  pointer-events: none;
}
.controls > * {
  pointer-events: all;
}
.controls__left {
  position: relative;
  overflow: hidden;

  /* temp: must be content-determined */
  min-width: 556px;
  min-height: 322px;
}
.controls__right {
  position: relative;
  overflow: hidden;

  /* temp: must be content-determined */
  min-width: 564px;
  min-height: 255px;
}
.controls__left:before,
.controls__right:before {
  content: '';
  position: absolute;
  top: min(-50vw, -50vh);
  left: min(-50vw, -50vh);
  width: max(200vw, 200vh);
  height: max(200vw, 200vh);
  background-size: 20px 20px;
  background-image: linear-gradient(to right, #151515 0 25%, #1d1d1d 25% 75%, #151515 75% 100%);
  transform: rotate(50deg);
}
.controls__flex {
  flex: 1 1;
}
</style>

<style></style>
