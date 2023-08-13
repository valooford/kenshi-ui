<script lang="ts">
import { BREAKPOINT_SM, CommonSound, GameSpeed, ItemType } from '@/shared/constants'
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
import { SpriteIcon } from '@/ui/SpriteIcon'

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
    SpriteIcon,
  },
  inject: ['store', 'dispatch', 'audio'],
  data() {
    return {
      ItemType,
      GameSpeed,
      isStartExpanded: false,
      isEndExpanded: false,
    }
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
    toggleStartExpand() {
      this.isStartExpanded = !this.isStartExpanded
    },
    toggleEndExpand() {
      this.isEndExpanded = !this.isEndExpanded
    },
    onResize() {
      if (
        (this.isStartExpanded || this.isEndExpanded) &&
        !window.matchMedia(`(max-width: ${BREAKPOINT_SM}px)`).matches
      ) {
        this.isStartExpanded = false
        this.isEndExpanded = false
      }
    },
  },
  mounted() {
    document.addEventListener('dragover', this.emulateDefaultCursorEverywhere)
    document.addEventListener('contextmenu', this.preventBrowserContextMenu)
    document.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('resize', this.onResize)
  },
  unmounted() {
    document.removeEventListener('dragover', this.emulateDefaultCursorEverywhere)
    document.removeEventListener('contextmenu', this.preventBrowserContextMenu)
    document.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('resize', this.onResize)
  },
}
</script>

<template>
  <CssVariablesProvider class="container">
    <KGame />
    <KPaused v-if="s.gameParameters.gameSpeed === GameSpeed.Pause" />
    <KSeam />
    <div class="layout">
      <button class="expand expand_start" @click="toggleStartExpand">
        <SpriteIcon :variant="isStartExpanded ? 'expand-less' : 'expand-more'" />
      </button>
      <div :class="['start', isStartExpanded && 'start_expanded']">
        <BriefInfo />
        <ConditionInfo />
      </div>
      <CharactersBar
        :characters="charactersArr"
        :selected="s.selectedCharacter"
        @select="onSelectCharacter"
        @trade="d.openRelatedSeamInventory"
      />
      <NavMenu />
      <button class="expand expand_end" @click="toggleEndExpand">
        <SpriteIcon :variant="isEndExpanded ? 'expand-less' : 'expand-more'" />
      </button>
      <div :class="['end', isEndExpanded && 'end_expanded']">
        <GameControls>
          <CharacterBehavior />
          <template #outpost>
            <ExtraFunctionality />
            <OutpostInfo />
          </template>
        </GameControls>
      </div>
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
  position: fixed; /* take hiding&showing mobile address bar into account */
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
}
.layout > * {
  pointer-events: all;
}
.layout,
.start {
  display: flex;
  align-items: flex-end;
  gap: 4rem;
}

.expand {
  display: none;
}

@media (max-width: 1320px) {
  .start {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 1060px) {
  .layout {
    justify-content: center;
  }

  .start,
  .end {
    position: fixed;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
  }
  .start {
    left: 0;
  }
  .end {
    right: 0;
  }
}

@media (max-width: 700px) {
  .expand {
    display: unset;
    position: fixed;
    top: 40rem;
    margin: -80rem;
    padding: 80rem;
    border-radius: 80rem;
  }
  .expand_start {
    left: 0;
    transform: rotate(90deg);
  }
  .expand_end {
    right: 0;
    transform: rotate(-90deg);
  }
  .start,
  .end {
    transition: transform 0.4s ease-in-out;
  }
  .start {
    transform: translateX(-100%) translateY(-50%);
  }
  .end {
    transform: translateX(100%) translateY(-50%);
  }
  .start_expanded {
    transform: translateX(0) translateY(-50%);
  }
  .end_expanded {
    transform: translateX(0) translateY(-50%);
  }
}
</style>
