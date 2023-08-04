export const GAMEDATA_ITEMS_LISTS: Record<OpenConstructionSet.Data.IItem.Type, string[]>
export const GAMEDATA_ITEMS: Record<string, OpenConstructionSet.Mods.ModItem>

declare namespace OpenConstructionSet {
  export namespace Mods {
    export interface ModItem {
      Name: string
      StringId: string
      Type: Data.IItem.Type
      Values: Data.IItem.Values
    }
  }

  export namespace Data {
    export interface FileValue {
      Path: string
    }
    export namespace IItem {
      export type Values = {
        icon?: any
        slot?: any
        'item function'?: any
        'inventory footprint height'?: any
        'inventory footprint width'?: any
        stackable?: any
        'inventory Sound'?: any
        description?: any
        'weight kg'?: any
        'stackable bonus minimum'?: any
        'stackable bonus mult'?: any
        'storage size height'?: any
        'storage size width'?: any
        [string]: any
      }
      export enum Type {
        Building,
        Character,
        Weapon,
        Armour,
        Item,
        AnimalAnimation,
        Attachment,
        Race,
        Location,
        WarSavestate,
        Faction,
        NullItem,
        ZoneMap,
        Town,
        WorldmapCharacter,
        CharacterAppearanceOld,
        LocationalDamage,
        CombatTechnique,
        Dialogue,
        DialogueLine,
        Techtree,
        Research,
        AiTask,
        AiState,
        Animation,
        Stats,
        Personality,
        Constants,
        Biomes,
        BuildingPart,
        InstanceCollection,
        DialogAction,
        TemporaryInfo,
        ModFilename,
        Platoon,
        GamestateBuilding,
        GamestateCharacter,
        GamestateFaction,
        GamestateTownInstanceList,
        State,
        SavedState,
        InventoryState,
        InventoryItemState,
        RepeatableBuildingPartSlot,
        MaterialSpec,
        MaterialSpecsCollection,
        Container,
        MaterialSpecsClothing,
        GamestateBuildingInterior,
        VendorList,
        MaterialSpecsWeapon,
        WeaponManufacturer,
        SquadTemplate,
        Road,
        LocationNode,
        ColorData,
        Camera,
        MedicalState,
        MedicalPartState,
        FoliageLayer,
        FoliageMesh,
        Grass,
        BuildingFunctionality,
        DaySchedule,
        NewGameStartoff,
        GamestateCrafting,
        CharacterAppearance,
        GamestateAi,
        WildlifeBirds,
        MapFeatures,
        DiplomaticAssaults,
        SingleDiplomaticAssault,
        AiPackage,
        DialoguePackage,
        GunData,
        HumanCharacter,
        AnimalCharacter,
        UniqueSquadTemplate,
        FactionTemplate,
        AiSchedule,
        Weather,
        Season,
        Effect,
        ItemPlacementGroup,
        WordSwaps,
        Nest,
        NestItem,
        CharacterPhysicsAttachment,
        Light,
        Head,
        Blueprint,
        ShopTraderClass,
        FoliageBuilding,
        FactionCampaign,
        GamestateTown,
        BiomeGroup,
        EffectFogVolume,
        FarmData,
        FarmPart,
        EnvironmentResources,
        RaceGroup,
        Artifacts,
        MapItem,
        BuildingsSwap,
        ItemsCulture,
        AnimationEvent,
        Tutorial,
        Crossbow,
        TerrainDecals,
        AmbientSound,
        WorldEventState,
        LimbReplacement,
        AnimationFile,
        Boat,
        GamestateBoat,
        BuildGrid,
        BuildingShell,
        ObjectTypeMax,
      }
    }
  }
}
