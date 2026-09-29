/** Price and value of one rung on the unlock ladder. Every season climbs the same ladder. */
export const CROP_TIERS = [
  { price: 0, value: 5 },
  { price: 25, value: 8 },
  { price: 100, value: 13 },
  { price: 300, value: 21 },
  { price: 800, value: 34 },
  { price: 2000, value: 55 },
  { price: 5000, value: 89 },
  { price: 12000, value: 144 },
] as const

export const CROPS_PER_SEASON = CROP_TIERS.length

interface CropSpec {
  readonly id: string
  readonly name: string
  readonly latin: string
  /** Lowercase nouns used in sentences, e.g. "3 potatoes". */
  readonly one: string
  readonly many: string
}

type SeasonCrops = readonly [CropSpec, CropSpec, CropSpec, CropSpec, CropSpec, CropSpec, CropSpec, CropSpec]

/** Seasons follow each other in this order, then wrap round into a new year. */
const SEASON_SPECS = [
  {
    id: 'spring',
    name: 'Spring',
    crops: [
      { id: 'radish', name: 'Radish', latin: 'Raphanus sativus', one: 'radish', many: 'radishes' },
      { id: 'lettuce', name: 'Lettuce', latin: 'Lactuca sativa', one: 'lettuce', many: 'lettuces' },
      { id: 'springOnion', name: 'Spring onion', latin: 'Allium fistulosum', one: 'spring onion', many: 'spring onions' },
      { id: 'pea', name: 'Pea', latin: 'Pisum sativum', one: 'pod of peas', many: 'pods of peas' },
      { id: 'broadBean', name: 'Broad bean', latin: 'Vicia faba', one: 'broad bean pod', many: 'broad bean pods' },
      { id: 'rhubarb', name: 'Rhubarb', latin: 'Rheum rhabarbarum', one: 'stick of rhubarb', many: 'sticks of rhubarb' },
      { id: 'artichoke', name: 'Artichoke', latin: 'Cynara cardunculus', one: 'artichoke', many: 'artichokes' },
      {
        id: 'asparagus',
        name: 'Asparagus',
        latin: 'Asparagus officinalis',
        one: 'bundle of asparagus',
        many: 'bundles of asparagus',
      },
    ],
  },
  {
    id: 'summer',
    name: 'Summer',
    crops: [
      { id: 'courgette', name: 'Courgette', latin: 'Cucurbita pepo', one: 'courgette', many: 'courgettes' },
      { id: 'greenBean', name: 'Green bean', latin: 'Phaseolus vulgaris', one: 'handful of beans', many: 'handfuls of beans' },
      { id: 'cucumber', name: 'Cucumber', latin: 'Cucumis sativus', one: 'cucumber', many: 'cucumbers' },
      { id: 'tomato', name: 'Tomato', latin: 'Solanum lycopersicum', one: 'tomato', many: 'tomatoes' },
      { id: 'corn', name: 'Sweetcorn', latin: 'Zea mays', one: 'cob', many: 'cobs' },
      { id: 'pepper', name: 'Sweet pepper', latin: 'Capsicum annuum', one: 'pepper', many: 'peppers' },
      {
        id: 'strawberry',
        name: 'Strawberry',
        latin: 'Fragaria × ananassa',
        one: 'punnet of strawberries',
        many: 'punnets of strawberries',
      },
      { id: 'melon', name: 'Melon', latin: 'Cucumis melo', one: 'melon', many: 'melons' },
    ],
  },
  {
    id: 'autumn',
    name: 'Autumn',
    crops: [
      { id: 'beetroot', name: 'Beetroot', latin: 'Beta vulgaris', one: 'beetroot', many: 'beetroots' },
      { id: 'carrot', name: 'Carrot', latin: 'Daucus carota', one: 'carrot', many: 'carrots' },
      { id: 'potato', name: 'Potato', latin: 'Solanum tuberosum', one: 'potato', many: 'potatoes' },
      { id: 'apple', name: 'Apple', latin: 'Malus domestica', one: 'apple', many: 'apples' },
      { id: 'pear', name: 'Pear', latin: 'Pyrus communis', one: 'pear', many: 'pears' },
      { id: 'pumpkin', name: 'Pumpkin', latin: 'Cucurbita maxima', one: 'pumpkin', many: 'pumpkins' },
      { id: 'grape', name: 'Grape', latin: 'Vitis vinifera', one: 'bunch of grapes', many: 'bunches of grapes' },
      { id: 'saffron', name: 'Saffron', latin: 'Crocus sativus', one: 'pinch of saffron', many: 'pinches of saffron' },
    ],
  },
  {
    id: 'winter',
    name: 'Winter',
    crops: [
      { id: 'kale', name: 'Kale', latin: 'Brassica oleracea var. sabellica', one: 'bunch of kale', many: 'bunches of kale' },
      { id: 'leek', name: 'Leek', latin: 'Allium ampeloprasum', one: 'leek', many: 'leeks' },
      { id: 'parsnip', name: 'Parsnip', latin: 'Pastinaca sativa', one: 'parsnip', many: 'parsnips' },
      {
        id: 'sprouts',
        name: 'Brussels sprout',
        latin: 'Brassica oleracea var. gemmifera',
        one: 'stalk of sprouts',
        many: 'stalks of sprouts',
      },
      { id: 'redCabbage', name: 'Red cabbage', latin: 'Brassica oleracea var. capitata', one: 'red cabbage', many: 'red cabbages' },
      { id: 'celeriac', name: 'Celeriac', latin: 'Apium graveolens var. rapaceum', one: 'celeriac', many: 'celeriacs' },
      { id: 'chicory', name: 'Chicory', latin: 'Cichorium intybus', one: 'head of chicory', many: 'heads of chicory' },
      { id: 'truffle', name: 'Black truffle', latin: 'Tuber melanosporum', one: 'truffle', many: 'truffles' },
    ],
  },
] as const satisfies readonly { id: string; name: string; crops: SeasonCrops }[]

export type SeasonId = (typeof SEASON_SPECS)[number]['id']
export type CropId = (typeof SEASON_SPECS)[number]['crops'][number]['id']

export interface CropDefinition extends CropSpec {
  readonly id: CropId
  /** Coins required to unlock. The first crop of a season is free. */
  readonly price: number
  /** Coins earned per harvested crop. */
  readonly value: number
  readonly season: SeasonId
}

export interface Season {
  readonly id: SeasonId
  readonly name: string
  /** Crops unlock strictly in this order. */
  readonly crops: readonly CropDefinition[]
}

export const SEASONS: readonly Season[] = SEASON_SPECS.map((season) => ({
  id: season.id,
  name: season.name,
  crops: season.crops.map((crop, tier) => ({ ...crop, ...CROP_TIERS[tier]!, season: season.id })),
}))

export const ALL_CROPS: readonly CropDefinition[] = SEASONS.flatMap((season) => season.crops)

export interface YieldLevel {
  readonly name: string
  /** Crops harvested per completed focus session. */
  readonly yield: number
  readonly cost: number
}

export const YIELD_LEVELS = [
  { name: 'Bare soil', yield: 1, cost: 0 },
  { name: 'Watering can', yield: 2, cost: 40 },
  { name: 'Compost heap', yield: 3, cost: 150 },
  { name: 'Raised beds', yield: 4, cost: 450 },
  { name: 'Drip irrigation', yield: 5, cost: 1200 },
  { name: 'Cold frame', yield: 6, cost: 3000 },
  { name: 'Polytunnel', yield: 7, cost: 7000 },
  { name: 'Greenhouse', yield: 8, cost: 15000 },
] as const satisfies readonly YieldLevel[]

export const MAX_YIELD_LEVEL = YIELD_LEVELS.length - 1

/** Season by position since the start of the game; wraps round every year. */
export function getSeason(seasonsPassed: number): Season {
  // Safe: the index is always in range.
  return SEASONS[seasonsPassed % SEASONS.length]!
}

export function getCrop(id: CropId): CropDefinition {
  // Safe: CropId is derived from the season specs.
  return ALL_CROPS.find((crop) => crop.id === id)!
}

export function isCropId(value: unknown): value is CropId {
  return ALL_CROPS.some((crop) => crop.id === value)
}

export function countCrop(crop: CropDefinition, amount: number): string {
  return `${amount} ${amount === 1 ? crop.one : crop.many}`
}
