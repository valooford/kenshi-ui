<script lang="ts">
import { CommonSound, GameSpeed, ItemType } from '@/shared/constants'
import type { IAudioContext } from '@/shared/interface'
import CharactersBar from '@/components/CharactersBar.vue'
import CssVariablesProvider from '@/components/CssVariablesProvider.vue'
import KSeam from '@/components/KSeam.vue'
import KGame from '@/components/KGame.vue'
import BriefInfo from '@/components/BriefInfo.vue'
import ConditionInfo from '@/components/ConditionInfo.vue'
import OutpostInfo from '@/components/OutpostInfo.vue'
import GameControls from '@/components/GameControls.vue'
import CharacterBehavior from '@/components/CharacterBehavior.vue'
import NavMenu from '@/components/NavMenu.vue'
import ExtraFunctionality from '@/components/ExtraFunctionality.vue'
import CustomCursor from '@/ui/CustomCursor.vue'
import KPaused from '@/ui/KPaused.vue'

export default {
  components: {
    CharactersBar,
    CssVariablesProvider,
    KSeam,
    CustomCursor,
    KGame,
    BriefInfo,
    ConditionInfo,
    OutpostInfo,
    GameControls,
    CharacterBehavior,
    NavMenu,
    KPaused,
    ExtraFunctionality,
  },
  inject: ['store', 'dispatch', 'audio'],
  data() {
    return { ItemType, GameSpeed }
  },
  computed: {
    s() {
      return this.store as IStore
    },
    d() {
      return this.dispatch as IDispatch
    },
    a() {
      return this.audio as IAudioContext
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
        case 'Digit1':
        case 'Digit2':
        case 'Digit3':
        case 'Digit4':
        case 'Digit5':
        case 'Digit6':
        case 'Digit7':
        case 'Digit8':
        case 'Digit9':
        case 'Digit0': {
          const index = (+e.code.charAt(e.code.length - 1) || 10) - 1
          if (index < this.s.charactersList.length) {
            this.onSelectCharacter(this.s.charactersList[index]!)
          }
          break
        }
        case 'Tab':
          e.preventDefault()
          if (!this.s.selectedCharacter) {
            this.d.toggleRegistry()
            break
          }
          if (this.s.seam.main) {
            this.d.closeSeamInventory()
          } else {
            this.d.openMainSeamInventory()
          }
          break
        case 'Escape':
          if (this.s.seam.registry) {
            this.d.toggleRegistry()
          } else if (this.s.seam.main) {
            this.d.closeSeamInventory()
          } else if (this.s.selectedCharacter) {
            this.d.resetSelectedCharacter()
            this.a.playCommonSound(CommonSound.InventoryCloseEsc)
          }
          break
        case 'Space':
          e.preventDefault() // prevent interaction with game speed-related buttons
          if (this.s.gameParameters.gameSpeed === GameSpeed.Pause) {
            this.d.revertGameSpeed()
            this.a.playCommonSound(CommonSound.TimeStart)
          } else {
            this.d.setGameSpeed(GameSpeed.Pause)
            this.a.playCommonSound(CommonSound.TimeStop)
          }
          break
        case 'F2':
          if (this.s.gameParameters.gameSpeed !== GameSpeed.Normal) {
            if (this.s.gameParameters.gameSpeed === GameSpeed.Pause) {
              this.a.playCommonSound(CommonSound.TimeStart)
            } else {
              this.a.playTickSound()
            }
            this.d.setGameSpeed(GameSpeed.Normal)
          }
          break
        case 'F3':
          e.preventDefault()
          if (this.s.gameParameters.gameSpeed !== GameSpeed.Faster) {
            if (this.s.gameParameters.gameSpeed === GameSpeed.Pause) {
              this.a.playCommonSound(CommonSound.TimeStart)
            } else {
              this.a.playTickSound()
            }
            this.d.setGameSpeed(GameSpeed.Faster)
          }
          break
        case 'F4':
          if (this.s.gameParameters.gameSpeed !== GameSpeed.Fastest) {
            if (this.s.gameParameters.gameSpeed === GameSpeed.Pause) {
              this.a.playCommonSound(CommonSound.TimeStart)
            } else {
              this.a.playTickSound()
            }
            this.d.setGameSpeed(GameSpeed.Fastest)
          }
          break
        default:
      }
    },
    onSelectCharacter(id: ICharacterId) {
      this.d.selectCharacter(id)
      this.a.playTickSound()
    },
  },
  mounted() {
    document.addEventListener('dragover', this.emulateDefaultCursorEverywhere)
    document.addEventListener('contextmenu', this.preventBrowserContextMenu)
    document.addEventListener('keydown', this.onKeyDown)
  },
  unmounted() {
    document.removeEventListener('dragover', this.emulateDefaultCursorEverywhere)
    document.removeEventListener('contextmenu', this.preventBrowserContextMenu)
    document.removeEventListener('keydown', this.onKeyDown)
  },
}
</script>

<template>
  <CssVariablesProvider class="container">
    <KGame />
    <KPaused v-if="s.gameParameters.gameSpeed === GameSpeed.Pause" />
    <KSeam />
    <div class="layout">
      <BriefInfo />
      <ConditionInfo />
      <CharactersBar
        :characters="charactersArr"
        :selected="s.selectedCharacter"
        @select="onSelectCharacter"
        @trade="d.openRelatedSeamInventory"
      />
      <NavMenu />
      <GameControls>
        <CharacterBehavior />
        <template #outpost>
          <ExtraFunctionality />
          <OutpostInfo />
        </template>
      </GameControls>
    </div>
    <CustomCursor />
  </CssVariablesProvider>
</template>

<style scoped>
.container {
  position: relative;
  height: 100%;
}
.layout {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-end;
  gap: 4px;
  pointer-events: none;
}
.layout > * {
  pointer-events: all;
}
</style>
