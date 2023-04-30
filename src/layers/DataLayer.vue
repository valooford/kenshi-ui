<script lang="ts">
import { InventoryRegion, SeamInventoryTypes } from '@/constants'

const characterFactory = () => {
  let count = 0
  return (name: string): ICharacter => {
    const character: ReturnType<typeof createCharacter> = {
      id: String(count++),
      name,
      items: {
        [InventoryRegion.Inventory]: [],
        [InventoryRegion.Backpack]: [],
        [InventoryRegion.Weapon1]: [],
        [InventoryRegion.Weapon2]: [],
        [InventoryRegion.Belt]: [],
        [InventoryRegion.Shirt]: [],
        [InventoryRegion.Pants]: [],
        [InventoryRegion.Boots]: [],
        [InventoryRegion.Head]: [],
        [InventoryRegion.Armor]: [],
      },
    }
    return character
  }
}

const createCharacter = characterFactory()
const character1 = createCharacter('Character 1')
const character2 = createCharacter('Character 2')
const character3 = createCharacter('Character 3')

const isCharacterSeamInventory = (
  value: SeamInventory | null
): value is ICharacterSeamInventory => {
  if (!value) return false
  return value.type === SeamInventoryTypes.Character
}

export default {
  provide() {
    return {
      store: this.$data,
      dispatch: {
        selectCharacter: this.selectCharacter,
        openMainSeamInventory: this.openMainSeamInventory,
        closeMainSeamInventory: this.closeMainSeamInventory,
        openRelatedSeamInventory: this.openRelatedSeamInventory,
        onSeamInventoryClose: this.onSeamInventoryClose,
        resetSelectedCharacter: this.resetSelectedCharacter,
        onItemsChange: this.onItemsChange,
      } as IDispatch,
    }
  },
  data() {
    return {
      characters: {
        [character1.id]: character1,
        [character2.id]: character2,
        [character3.id]: character3,
      },
      charactersList: [character1.id, character2.id, character3.id],
      selectedCharacter: null,
      seamData: { main: null, related: null },
    } as IStore
  },
  methods: {
    selectCharacter(characterId: string) {
      this.selectedCharacter = characterId
      if (this.seamData.main) {
        this.openMainSeamInventory()
        if (this.seamData.related) {
          this.closeRelatedSeamInventory()
        }
      }
    },
    openMainSeamInventory() {
      this.seamData.main = {
        id: this.selectedCharacter!,
        type: SeamInventoryTypes.Character,
        data: this.characters[this.selectedCharacter!],
      }
    },
    closeMainSeamInventory() {
      this.seamData.main = null
      if (this.seamData.related) {
        this.closeRelatedSeamInventory()
      }
    },
    openRelatedSeamInventory(characterId: string) {
      this.seamData.related = {
        id: characterId,
        type: SeamInventoryTypes.Character,
        data: this.characters[characterId],
      }
      if (!this.seamData.main) {
        this.openMainSeamInventory()
      }
    },
    closeRelatedSeamInventory() {
      this.seamData.related = null
    },
    onSeamInventoryClose(characterId: string) {
      if (characterId === this.seamData.main?.id) {
        this.closeMainSeamInventory()
      } else {
        this.closeRelatedSeamInventory()
      }
    },
    resetSelectedCharacter() {
      this.selectedCharacter = null
      if (this.seamData.main) {
        this.closeMainSeamInventory()
      }
    },
    onItemsChange(characterId: string, items: ICharacterItems) {
      this.characters = {
        ...this.characters,
        [characterId]: { ...this.characters[characterId], items },
      }
      this.syncSeamItems(characterId)
    },
    syncSeamItems(characterId: string) {
      const isMain = this.seamData.main?.id === characterId
      const isRelated = this.seamData.related?.id === characterId
      if (!isMain && !isRelated) return

      const inventoryName = isMain ? 'main' : 'related'
      const inventory = this.seamData[inventoryName]
      if (inventory) {
        this.seamData = {
          ...this.seamData,
          [inventoryName]: {
            ...inventory,
            data: { ...inventory.data, items: this.characters[characterId].items },
          },
        }
      }
    },
  },
}
</script>

<template>
  <slot />
</template>
