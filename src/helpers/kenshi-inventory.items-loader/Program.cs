using LMay.Collections;
using OpenConstructionSet;
using OpenConstructionSet.Data;
using OpenConstructionSet.Mods;
using OpenConstructionSet.Mods.Context;
using System.Text.Json;
using System.Text.Json.Serialization;

// constants
var inventoryItemTypes = new List<ItemType>()
{
  ItemType.Item,
  ItemType.Weapon,
  ItemType.Crossbow,
  ItemType.Armour,
  ItemType.Container,
  ItemType.NestItem,
  ItemType.MapItem,
  ItemType.LimbReplacement
};
var inventoryValuesKeys = new List<string>()
{
  "icon",
  "slot",
  "item function",
  "inventory footprint height",
  "inventory footprint width",
  "stackable",
  "inventory sound",
  "material type",
  "description",
  "weight kg",
  "stackable bonus minimum",
  "stackable bonus mult",
  "storage size height",
  "storage size width",
};

// setup
var installations = await new InstallationService()
  .DiscoverAllInstallationsAsync()
  .ToDictionaryAsync(i => i.Identifier);

if (installations.Count == 0)
{
  Console.WriteLine(".NET: Unable to find game");
}
if (installations.Count >= 1)
{
  var installation = installations.Values.First();
  Console.WriteLine($".NET: Found Kenshi folder: \"{installation.Path}\".");

  var baseMods = new List<string>()
  {
    "gamedata.base",
    "Newwworld.mod",
    "Dialogue.mod",
    "rebirth.mod"
  };
  var options = new ModContextOptions(
    name: "rebirth.mod",
    baseMods: baseMods,
    installation: installation,
    throwIfMissing: false
  );
  var context = await new ContextBuilder().BuildAsync(options);

  var gamedataItems = new Dictionary<string, KenshiInventory.Item>();
  var gamedataItemsLists = new Dictionary<int, List<string>>();
  var gamedataItemsImages = new HashSet<string>();

  var icons = Directory.GetFiles(
    $"{installation.Path}/data/icons",
    "*.*",
    SearchOption.TopDirectoryOnly
  );

  foreach (ModItem item in context.Items)
  {
    // save types with inventory footprints and icon paths only
    if (inventoryItemTypes.Contains(item.Type))
    {
      // grab required and non-cyclic field values only
      var subsetItem = new KenshiInventory.Item(
        type: item.Type,
        name: item.Name,
        stringId: item.StringId,
        values: new SortedDictionary<string, object>()
      );

      string iconPath = String.Empty;
      // grab required values keys only
      foreach (var valueKey in inventoryValuesKeys)
      {
        if (item.Values.ContainsKey(valueKey))
        {
          if (valueKey == "icon")
          {
            // take the defined icon path
            var possiblePath = ((FileValue)item.Values[valueKey]).Path;
            if (possiblePath != "")
            {
              possiblePath = Path.Combine(installation.Path, possiblePath);
              if (File.Exists(possiblePath))
                iconPath = possiblePath;
            }
          }
          else
            subsetItem.Values.Add(valueKey, item.Values[valueKey]);
        }
      }

      if (String.IsNullOrEmpty(iconPath))
      {
        // get the icon path by item id
        var matchingIcons = icons.Where((f) => f.Contains(item.StringId));
        if (!matchingIcons.Any())
          continue;
        iconPath = matchingIcons.First();
      }
      subsetItem.Values.Add("icon", Path.GetFileName(iconPath));

      gamedataItems.Add(subsetItem.StringId, subsetItem);
      gamedataItemsImages.Add(iconPath);

      var itemType = (int)subsetItem.Type;
      if (!gamedataItemsLists.ContainsKey(itemType))
        gamedataItemsLists.Add(itemType, new List<string>());
      gamedataItemsLists[itemType].Add(subsetItem.StringId);
    }
  }

  // serialize to JSON and export as a plain JavaScript objects
  var serializerOptions = new JsonSerializerOptions
  {
    WriteIndented = true,
    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
  };

  var fileString =
    @$"/*
This file is auto-generated with kenshi-inventory.items-loader utility.
*/

export const GAMEDATA_ITEMS_LISTS = {JsonSerializer.Serialize(gamedataItemsLists, serializerOptions)};

export const GAMEDATA_ITEMS = {JsonSerializer.Serialize(gamedataItems, serializerOptions)};
";

  // copy all the icons to the /dist directory
  Directory.CreateDirectory("dist");
  File.WriteAllText("dist/items.js", fileString);

  if (Directory.Exists("dist/img"))
    Directory.Delete("dist/img", true);
  Directory.CreateDirectory("dist/img");
  foreach (string f in gamedataItemsImages)
  {
    File.Copy(f, $"dist/img/{Path.GetFileName(f)}", true);
  }

  Console.WriteLine(@".NET: Done. The results were placed in the /dist folder.");
}

namespace KenshiInventory
{
  // helper class to omit ReferenceCategories, Instances and ChangeType from the constructor parameters
  public class Item : IItem, IKeyedItem<string>
  {
    internal ModItemCollection? parent;

    public Item(IItem item)
      : this(item.Type, item.Name, item.StringId, item.Values) { }

    public Item(ItemType type, string name, string stringId, IDictionary<string, object> values)
    {
      Type = type;
      Name = name;
      StringId = stringId;
      this.Values = new(values);
    }

    public string Key { get; }

    public string Name { get; set; }

    public string StringId { get; }

    public ItemType Type { get; set; }

    public SortedDictionary<string, object> Values { get; }

    ItemChangeType IItem.ChangeType
    {
      get => ItemChangeType.New;
      set { }
    }
    int IItem.Id
    {
      get => 0;
    }
    IEnumerable<IInstance> IItem.Instances
    {
      get => new List<IInstance>();
    }
    IEnumerable<IReferenceCategory> IItem.ReferenceCategories
    {
      get => new List<IReferenceCategory>();
    }
    IDictionary<string, object> IItem.Values => Values;
  }
}
